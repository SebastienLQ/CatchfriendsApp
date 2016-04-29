/**
 * Le controleur de la page des amis (#/friends)
 * @param  {scope}	$scope      Le $scope Angular du controller
 * @param  {scope}	$rootScope	Le $rootScope Angular commun à tous les controleurs
 */
catchFriendsControllers.controller('FriendsController', ['$scope', '$rootScope',
	function ($scope, $rootScope) {
		selectFooter("#footerFriends");	// On selectionne le bon footer
		$("#headerTitle").text("Amis");	// On modifie le titre
		$rootScope.backButton = true;	// On affiche le bouton back

		$.ajax({
			type		:	'POST',
			url			:	serverURL + "cf/getFriends",
			data		:	JSON.stringify($rootScope.jsonLoginData),
			dataType	:	'json',
			complete	:	function(e, xhr, settings) {
								if (e.status === 200) {
									$scope.friends = e.responseJSON;
									$scope.$apply();
								}
							}
		});

		// ----------------------------------------------------------------------------
		// -----------   FONCTIONS    -------------------------------------------------
		// ----------------------------------------------------------------------------
		$scope.goToChat = function(pseudo) {
			window.location.replace("#/chat/" + pseudo);
		}

	}
]);