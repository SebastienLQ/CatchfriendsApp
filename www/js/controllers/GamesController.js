/**
 * Le controleur de la page des parties (#/games)
 * @param  {scope}	$scope      	Le $scope Angular du controller
 * @param  {scope}	$rootScope		Le $rootScope Angular commun à tous les controleurs
 */
catchFriendsControllers.controller('GamesController', ['$scope', '$rootScope',
	function ($scope, $rootScope) {
		selectFooter("#footerGames");				// On selectionne le bon footer
		$("#headerTitle").text("Parties en cours");	// On modifie le titre
		$rootScope.backButton = true;				// On affiche le bouton back

		/**
		 * Requête ajax vers le serveur pour récupérer les parties en cours
		 */
		$.ajax({
			type		:	'POST',
			url			:	serverURL + "cf/currentGames",
			data		:	JSON.stringify($rootScope.jsonLoginData),
			dataType	:	'json',
			complete	:	function(xhr, textStatus) {
								if(xhr.status === 200) {
									$rootScope.games = JSON.parse(xhr.responseText);
									$rootScope.$apply();
								}
							}
		});

		// ----------------------------------------------------------------------------
		// -----------   FONCTIONS    -------------------------------------------------
		// ----------------------------------------------------------------------------
		$scope.goToGame = function(pseudo) {
			window.location.replace("#/game/" + pseudo);
		}
	}
]);