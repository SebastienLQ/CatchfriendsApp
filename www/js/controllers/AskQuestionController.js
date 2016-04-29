/**
 * Le controleur de la page pour choisir une question à poser (#/game/:pseudo/askQuestion)
 * @param  {scope}	$scope      	Le $scope Angular du controller
 * @param  {scope}	$routeParams   	Le $routeParams Angular contenant les paramètres de l'URL
 * @param  {scope}	$rootScope		Le $rootScope Angular commun à tous les controleurs
 * @param  {plugin} $ionicPopup     Le plugin ionic pour les popups
 */
catchFriendsControllers.controller('AskQuestionController', ['$scope', '$routeParams', '$rootScope', '$ionicPopup',
	function ($scope, $routeParams, $rootScope, $ionicPopup) {
		selectFooter("#footerGames");		// On selectionne le bon footer
		$("#headerTitle").text("Question");	// On modifie le titre
		$rootScope.backButton = true;		// On affiche le bouton back

		/**
		 * Formulaire JSON à envoyer en POST
		 * @type {Object}
		 */
		var formData = {
			'login' : $rootScope.user,
			'asked': $rootScope.tagsAlreadyAsked
		};
		$.ajax({
			type		:	'POST',
			url			:	serverURL + "cf/getAskableCurrentTags",
			data		:	JSON.stringify(formData),
			dataType	:	'json',
			success		:	function(data) {
								if ($.isEmptyObject(data)) {
									$scope.showAddFriend();
								} else {
									$("#listtags").append($scope.showMyTags(data));
									$(".askButton").click(function(event) {
										$scope.showConfirm($(this).attr("theme"), $(this).attr("category"), $(this).attr("tag"));
									});
								}
							}
		});

		// ----------------------------------------------------------------------------
		// ----------    POPUPS     ---------------------------------------------------
		// ----------------------------------------------------------------------------
		/**
		 * Affiche une popup pour demander la confirmation avant de poser la question
		 * @param  {string} theme    Le thème du tag de la question
		 * @param  {string} category La catégorie du tag de la question
		 * @param  {string} tag      Le tag de la question
		 */
		$scope.showConfirm = function(theme, category, tag) {
			$scope.newQuestion = $scope.createQuestion(theme, category, tag);
			var alertPopup = $ionicPopup.confirm({
				title: 'Confirmation',
				template: $scope.newQuestion
			}).then(function(res) {
				// Si l'utilisateur valide
				if(res) {
					/**
					 * Formulaire JSON à envoyer en POST
					 * @type {Object}
					 */
					var formData = {
						'login' : $rootScope.user,
						'question': $scope.newQuestion,
						'theme': theme,
						'category': category,
						'tag': tag,
						'pseudo-challenger': $routeParams.pseudo
					};
					/**
					 * Requête ajax vers le serveur pour récupérer la partie choisie
					 */
					$.ajax({
						type		:	'POST',
						url			:	serverURL + "cf/addQuestion",
						data		:	JSON.stringify(formData),
						dataType	:	'json',
						complete	:	function(xhr, textStatus) {
											if(xhr.status === 200) {
												window.location.replace("#/game/" + $routeParams.pseudo);
											}
										}
					});
				}
			});
		};
		/**
		 * Affiche une popup pour demander l'ajout d'un ami
		 */
		 $scope.showAddFriend = function() {
			var alertPopup = $ionicPopup.confirm({
				title: 'Confirmation',
				template: "Voulez-vous ajouter l'utilisateur " + $routeParams.pseudo + " à vos amis ?"
			}).then(function(res) {
				// Si l'utilisateur valide
				if(res) {
					var formData = {
					'login' : $rootScope.user,
					'pseudo-challenger': $routeParams.pseudo
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
		 };

		// ----------------------------------------------------------------------------
		// -----------   FONCTIONS    -------------------------------------------------
		// ----------------------------------------------------------------------------
		/**
		 * Affichage des tags pour poser une question
		 * @param  {object}	json	Le json à afficher contenant les tags que l'on peut demander
		 * @return {string} 		La chaine à insérer dans le code html
		 */
		$scope.showMyTags = function(json) {
			var res = ""
			for (theme in json) {
				res += "<div id='" + theme + "' class='padding'>";
				res += "<h3 class='" + themesStyle[theme].Color + " padding'>" + theme + "</h3>";
				res += "<div class='list list-inset'>";
				for (category in json[theme]) {
					res += "<h4 id='" + theme + "_" + category + "' class='item item-divider'><strong>" + category + "</strong></h4>";
					$.each(json[theme][category], function(index, tag) {
						res += "<h5 id='" + theme + "_" + category + "_" + tag + "' class='item item-button-right'>" + tag;
						res += "<button theme='" + theme + "' category='" + category + "' tag='" + tag + "' class='button button-" + themesStyle[theme].Color + " askButton'>Demander</button></h5>";
					});
				}
				res += "</div></div>";
			}
			return res;
		};
		/**
		 * Personaliser la question que l'on va afficher en fonction de la catégorie.
		 * Cette fonction a perdu de son intérêt depuis que l'on ne l'affiche plus dans le
		 * @param  {string} theme    Le thème du tag
		 * @param  {string} category La catégorie du tag
		 * @param  {string} tag      Le tag
		 * @return {string}          La question associée au tag
		 */
		$scope.createQuestion = function(theme, category, tag) {
			switch(theme) {
				case "Cinéma":
					switch(category) {
						case "Acteur-Actrice":
							return "Lui demander s'il/elle aime l'acteur/actrice " + tag + " ?";
							break;
						case "Film":
							return "Lui demander s'il/elle aime le film " + tag + " ?";
							break;
						case "Genre":
						case "Réalisateur":
						default:
							return "Lui demander s'il/elle aime les films de " + tag + " ?";
							break;
					}
					break;
				case "Jeux-Vidéo":
					if (category == "Jeu") {
						return "Lui demander s'il/elle aime les jeux de " + tag + " ?";
					} else if (category == "Éditeur" || category == "Genre") {
						return "Lui demander s'il/elle aime le jeu " + tag + " ?";
					}
					break;
				case "Musique":
					if (category == "Artiste-Groupe") {
						return "Lui demander s'il/elle aime l'artiste/groupe " + tag + " ?";
					} else if (category == "Genre") {
						return "Lui demander s'il/elle aime la musique " + tag + " ?";
					}
					break;
				case "Nourriture":
					if (category == "Aliment") {
						return "Lui demander s'il/elle aime le/la/les " + tag + " ?";
					} else if (category == "Cuisine" || category == "Origine") {
						return "Lui demander s'il/elle aime la cuisine " + tag + " ?";
					}
					break;
				case "Sport":
					if (category == "Sportif") {
						return "Lui demander s'il/elle aime le sportif " + tag + " ?";
					} else if (category == "Collectif" || category == "Individuel") {
						return "Lui demander s'il/elle aime le/la " + tag + " ?";
					}
					break;
				default:
					return "Lui demander s'il/elle aime " + tag + " ?";
					break;
			}
		}
	}
]);