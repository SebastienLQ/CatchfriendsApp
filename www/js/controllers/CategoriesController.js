/**
 * Le controleur de la page des catégories (#/categories/:theme)
 * @param  {scope}	$scope      	Le $scope Angular du controller
 * @param  {scope}	$routeParams   	Le $routeParams Angular contenant les paramètres de l'URL
 * @param  {scope}	$rootScope		Le $rootScope Angular commun à tous les controleurs
 * @param  {plugin} $ionicPopup     Le plugin ionic pour les popups
 */
catchFriendsControllers.controller('CategoriesController', ['$scope', '$routeParams', '$rootScope', '$ionicPopup',
	function ($scope, $routeParams, $rootScope, $ionicPopup) {
		selectFooter("#footerProfil");				// On selectionne le bon footer
		$("#headerTitle").text($routeParams.theme);	// On modifie le titre
		$rootScope.backButton = true;				// On affiche le bouton back

		/**
		 * Requête ajax vers le serveur pour récupérer toutes les catégories du thème
		 */
		$.ajax({
			type		:	'GET',
			url			:	serverURL + "cf/getCategories/" + $routeParams.theme,
			dataType	:	'json',
			success		:	function(data) {
								$scope.categories = data;
								$scope.$broadcast('scroll.scrollTop');
								$scope.$apply();
							}
		});

		// ----------------------------------------------------------------------------
		// -----------   FONCTIONS    -------------------------------------------------
		// ----------------------------------------------------------------------------
		$scope.sendTagsToServer = function() {
			sendNewTags($rootScope.newTags, $rootScope.user);
			$rootScope.newTags = [];
			$scope.showSuccess();
		}
		$scope.goToCategory = function(theme, category) {
			window.location.replace("#/tags/" + theme + "/" + category);
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