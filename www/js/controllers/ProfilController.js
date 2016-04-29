/*
 * Le controleur de la page du profil (#/profil)
 * @param  {scope}	$scope      	Le $scope Angular du controller
 * @param  {scope}	$rootScope		Le $rootScope Angular commun à tous les controleurs
 */
catchFriendsControllers.controller('ProfilController', ['$scope', '$rootScope',
	function ($scope, $rootScope) {
		selectFooter("#footerProfil");					// On selectionne le bon footer
		$("#headerTitle").text("Profil");				// On modifie le titre
		$rootScope.backButton = true;					// On affiche le bouton back
		$scope.description = $rootScope.description;	// On initialise la description à partir du $rootScope
		$scope.pseudo = $rootScope.pseudo;				// On initialise le pseudo à partir du $rootScope
	}
]);