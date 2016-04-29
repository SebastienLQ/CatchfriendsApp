/**
 * Le controleur de la page de mise à jour du profil (#/updateprofile)
 * @param  {scope}	$scope      	Le $scope Angular du controller
 * @param  {scope}	$rootScope		Le $rootScope Angular commun à tous les controleurs
 * @param  {plugin} $ionicPopup     Le plugin ionic pour les popups
 */
 catchFriendsControllers.controller('UpdateProfileController', ['$scope', '$rootScope', '$ionicPopup',
 	function ($scope, $rootScope, $ionicPopup) {
		selectFooter("#footerProfil");					// On selectionne le bon footer
		$("#headerTitle").text("Votre profil");			// On modifie le titre
		$rootScope.backButton = true;					// On affiche le bouton back
		$scope.description = $rootScope.description;	// On initialise la description à partir du $rootScope
		$scope.pseudo = $rootScope.pseudo;				// On initialise le pseudo à partir du $rootScope
		$scope.pourcentage = $rootScope.pourcentage;	// On initialise le pourcentage à partir du $rootScope

		/**
		 * Lors de l'envoi du formulaire
		 */
		 $('form').submit(function (event) {
				$rootScope.description = $scope.description;	// On stocke la description dans le $rootScope
				$rootScope.pseudo = $scope.pseudo;				// On stocke le pseudo dans le $rootScope
				$rootScope.pourcentage = $scope.pourcentage;	// On stocke le pourcentage dans le $rootScope

				/**
				 * Formulaire JSON à envoyer en POST
				 * @type {Object}
				 */
				 var formData = {
				 	'login' : $rootScope.user,
				 	'description': $rootScope.description,
				 	'pseudo': $rootScope.pseudo,
				 	'pourcentage': $rootScope.pourcentage
				 };
				/**
				 * Requête ajax vers le serveur pour mettre le profil de l'utilisateur à jour
				 */
				 $.ajax({
				 	type		:	'POST',
				 	url			:	serverURL + "cf/updateProfile",
				 	data		:	JSON.stringify(formData),
				 	dataType	:	'json',
				 	complete	:	function(e, xhr, settings) {
				 		if(e.status === 200) {
				 			$scope.showSuccess();
				 		}
				 	}
				 });
			}
			);

		// ----------------------------------------------------------------------------
		// ----------    POPUPS     ---------------------------------------------------
		// ----------------------------------------------------------------------------
		$scope.checkValidity = function() {
			console.log("salut", $scope.pourcentage);
			if ($scope.pourcentage < 25 || $scope.pourcentage > 100) {
				var alertPopup = $ionicPopup.alert({
					title: 'Mauvaises informations',
					template: "Le pourcentage doit être compris entre 25 et 100 !"
				});
			}
		}
		/**
		 * Popup en cas de succès
		 */
		 $scope.showSuccess = function() {
		 	var alertPopup = $ionicPopup.alert({
		 		title: 'Succès',
		 		template: "Vos informations ont été mises à jour !"
		 	});
		 	window.location.replace("#/profil");
		 };
	}
]);