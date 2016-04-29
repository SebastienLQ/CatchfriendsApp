/**
 * Le controleur de la page de création de profil (#/createProfile)
 * @param  {scope}	$scope      	Le $scope Angular du controller
 * @param  {scope}	$rootScope		Le $rootScope Angular commun à tous les controleurs
 * @param  {plugin} $ionicPopup     Le plugin ionic pour les popups
 */
catchFriendsControllers.controller('CreateProfileController', ['$scope', '$rootScope', '$ionicPopup',
	function ($scope, $rootScope, $ionicPopup) {
		$("#headerTitle").text("Création du profil");	// On modifie le titre
		$scope.description = "";						// On initialise la description
		$scope.pseudo = "";								// On initialise le pseudo
		$scope.pourcentage = 60;						// On initialise le pourcentage

		/**
		 * Lors de l'envoi du formulaire
		 */
		$('form').submit(
			function (event) {
				$rootScope.pseudo = $scope.pseudo;				// On stocke le pseudo dans le $rootScope
				$rootScope.description = $scope.description;	// On stocke la description dans le $rootScope
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
				 * Requête ajax vers le serveur
				 */
				$.ajax({
					type		:	'POST',
					url			:	serverURL + "cf/createProfile",
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
		/**
		 * Popup en cas de succès
		 */
		$scope.showSuccess = function() {
			var alertPopup = $ionicPopup.alert({
				title: 'Succès !',
				template: "Votre profil a bien été créé !"
			});
			window.location.replace('#/logout');
		};
	}
]);