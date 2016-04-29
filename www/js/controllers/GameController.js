/**
 * Le controleur de la page d'une partie (#/game/:pseudo)
 * @param  {scope}	$scope      	Le $scope Angular du controller
 * @param  {scope}	$routeParams   	Le $routeParams Angular contenant les paramètres de l'URL
 * @param  {scope}	$rootScope		Le $rootScope Angular commun à tous les controleurs
 */
catchFriendsControllers.controller('GameController', ['$scope', '$routeParams', '$rootScope', '$ionicPopup',
	function ($scope, $routeParams, $rootScope, $ionicPopup) {
		selectFooter("#footerGames");						// On selectionne le bon footer
		$scope.pseudoChallenger = $routeParams.pseudo;		// Récupération du pseudo du challenger
		$("#headerTitle").text($scope.pseudoChallenger);	// On modifie le titre
		$rootScope.backButton = true;						// On affiche le bouton back

		/**
		 * Formulaire JSON à envoyer en POST
		 * @type {Object}
		 */
		var formData = {
			'login' : $rootScope.user,
			'pseudo-challenger': $scope.pseudoChallenger
		};
		/**
		 * Requête ajax vers le serveur pour récupérer la partie choisie
		 */
		if ($rootScope.user != "" && $rootScope.user != undefined) {
			$.ajax({
				type		:	'POST',
				url			:	serverURL + "cf/gameQuestions",
				data		:	JSON.stringify(formData),
				dataType	:	'json',
				complete	:	function(xhr, textStatus) {
									if(xhr.status === 200) {
										$scope.game = JSON.parse(xhr.responseText);
										$scope.game.questions = $scope.game.questions.sort($scope.compareDatesLatestFirst);
										$.each($scope.game.questions, function(index, question) {
											var newDate = new Date(question.date);
											newDate.setHours(newDate.getHours() - 2);
											question.date = newDate.toLocaleString();
										});
										$scope.$apply();
										$(".white-text").css('color', '#ffffff');
										$("li p").css('float', 'left');
									}
								}
			});
		}

		// ----------------------------------------------------------------------------
		// -----------   FONCTIONS    -------------------------------------------------
		// ----------------------------------------------------------------------------
		/**
		 * Callback de comparaison entre 2 dates pour le tri des questions
		 * @param  {date} a La première date
		 * @param  {date} b La deuxième date
		 */
		$scope.compareDatesLatestFirst = function (a, b) {
			var date1 = new Date(a["date"]);
			var date2 = new Date(b["date"]);
			if (date1 > date2)
				return -1;
			if (date1 < date2)
				return 1;
			return 0;
		}
		$scope.addFriend = function() {
			var alertPopup = $ionicPopup.confirm({
				title: 'Confirmation',
				template: "Voulez-vous ajouter l'utilisateur " + $scope.pseudoChallenger + " à vos amis ?"
			}).then(function(res) {
				// Si l'utilisateur valide
				if(res) {
					var formData = {
					'login' : $rootScope.user,
					'pseudo-challenger': $scope.pseudoChallenger
					};
					$.ajax({
						type		:	'POST',
						url			:	serverURL + "cf/addFriend",
						data		:	JSON.stringify(formData),
						dataType	:	'json',
						complete	:	function(e, xhr, settings) {
											if(e.status === 200) {
												window.location.replace("#/friends");
											}
										}
					});
				}
			});
		}
		/**
		 * Répertorie les questions déjà posées, pour ne pas les poser à nouveau.
		 * Cette fonction crée un objet JSON au bon format
		 */
		$scope.findAskedTags = function() {
			var tmp = {};
			var themes = $.map($scope.game.questions, function(question) {
				return question["theme"];
			});
			var categories = $.map($scope.game.questions, function(question) { 
				return {
					theme: question["theme"],
					category: question["category"]
				};
			});
			$.each(themes, function(index, value) {
				tmp[value] = {};
			});
			$.each(categories, function(index, value) {
				tmp[value.theme][value.category] = [];
			});
			$.each($scope.game.questions, function(index, value) {
				if (value.profile == $rootScope.pseudo)
					tmp[value.theme][value.category].push(value.tag);
			});
			$rootScope.tagsAlreadyAsked = tmp;
		}
		/**
		 * Va à la page des questions après avoir appelé findAskedTags
		 */
		$scope.askQuestion = function() {
			$scope.findAskedTags();
			window.location.replace("#/game/" + $scope.pseudoChallenger + "/askQuestion");
		}
	}
]);