/*
 * Le controleur de la page des thèmes (#/themes)
 * @param  {scope}	$scope      	Le $scope Angular du controller
 * @param  {scope}	$rootScope		Le $rootScope Angular commun à tous les controleurs
 * @param  {plugin} $ionicPopup     Le plugin ionic pour les popups
 */
catchFriendsControllers.controller('ThemesController', ['$scope', '$rootScope', '$ionicPopup',
	function ($scope, $rootScope, $ionicPopup) {
		selectFooter("#footerProfil");		// On selectionne le bon footer
		$("#headerTitle").text("Thèmes");	// On modifie le titre
		$rootScope.backButton = true;		// On affiche le bouton back

		/**
		 * Requête ajax vers le serveur pour récupérer tous les thèmes
		 */
		$.ajax({
			type		:	'GET',
			url			:	serverURL + "cf/getAllThemes",
			dataType	:	'json',
			success		:	function(data) {
								$("#affThemes").append($scope.showThemes(data));
								$(".myButton").click(function(event) {
									window.location.replace("#/categories/" + $(this).attr("theme"));
								});
								$("#sendTagsToServer").click(function(event) {
									sendNewTags($rootScope.newTags, $rootScope.user);
									$rootScope.newTags = [];
									$scope.showSuccess();
								});
								// $scope.$broadcast('scroll.scrollTop');
							}
		});

		// ----------------------------------------------------------------------------
		// -----------   FONCTIONS    -------------------------------------------------
		// ----------------------------------------------------------------------------
		/**
		 * AFfiche les thèmes sous forme de boutons
		 * @param  {object} json	Le json contenant les thèmes
		 * @return {string}     	Le code html des thèmes 
		 */
		$scope.showThemes = function (json) {
			var res = "";
			$.each(json, function(index, theme) {
				res += "<button class='button button-full icon-right button-" + themesStyle[theme].Color + " " + themesStyle[theme].Icon + " myButton' theme='" + theme + "'>" + theme + "</button>";
			});
			return res;
		}

		// ----------------------------------------------------------------------------
		// ----------    POPUPS     ---------------------------------------------------
		// ----------------------------------------------------------------------------
		/**
		 * Popup en cas de succès
		 */
		$scope.showSuccess = function() {
			var alertPopup = $ionicPopup.alert({
				title: 'Succès',
				template: "Vos Tags ont été mis à jour !"
			});
			window.location.replace("#/profil");
		};
	}
]);

