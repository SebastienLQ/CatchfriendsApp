/**
 * Le controleur de la page de création de compte (#/createAccount)
 * @param  {scope}	$scope      	Le $scope Angular du controller
 * @param  {scope}	$rootScope		Le $rootScope Angular commun à tous les controleurs
 * @param  {plugin} $ionicPopup     Le plugin ionic pour les popups
 */
catchFriendsControllers.controller('CreateAccountController', ['$scope', '$rootScope', '$ionicPopup',
	function ($scope, $rootScope, $ionicPopup) {
		$("#headerTitle").text("Création de compte");	// On modifie le titre

		/**
		 * Lors de l'envoi du formulaire
		 */
		$('form').submit(
			function(event) {
				// On teste si les mots de passe sont identiques
				if($scope.checkValidity())
				{
					/**
					 * Formulaire JSON à envoyer en POST
					 * @type {Object}
					 */
					var formData = {
						'login': $scope.login,
						'email': $scope.email,
						'password': $scope.password
					};
					/**
					 * Requête ajax vers le serveur
					 */
					if ($scope.login != "" && $scope.login != undefined) {
						$.ajax({
							type		:	'POST',
							url			:	serverURL + "cf/createUser",
							data		:	JSON.stringify(formData),
							dataType	:	'json',
							complete	:	function(e, xhr, settings)
											{
												// Affichage de la popup correspondante au code de retour
												if(e.status === 200)
													$scope.showSuccess();
												else if (e.status === 409 && e.responseText === "login")
													$scope.showLoginFailure();
												else if (e.status === 409 && e.responseText === "email")
													$scope.showEmailFailure();
												else
													$scope.showFailure();
											}
						});
					}
				} else {
					$scope.showEmptyFailure();
				}
			}
		);

		// ----------------------------------------------------------------------------
		// -----------   FONCTIONS    -------------------------------------------------
		// ----------------------------------------------------------------------------
		/**
		 * Vérifie l'égalité des mots de passe
		 */
		$scope.checkValidity = function() {
			if ($('#login').val() && $('#email').val() && $('#password').val() && $('#confirmPassword').val()) {
				if($("#password").val() != $("#confirmPassword").val())
				{
					$("#password").val("");
					$("#confirmPassword").val("");
					$scope.showPasswordFailure();
					return false;
				}
				return true
			}
			return false;
		};
		/**
		 * Vide les champs du formulaire
		 */
		$scope.clearInputs = function() {
			 $("#login").val("");
			 $("#email").val("");
			 $("#password").val("");
			 $("#confirmPassword").val("");
		};
		/**
		 * Annule la création et retourne à la page de login
		 */
		$scope.cancelCreation = function() {
			$scope.clearInputs();
			window.location.replace('#/login');
		};

		// ----------------------------------------------------------------------------
		// ----------    POPUPS     ---------------------------------------------------
		// ----------------------------------------------------------------------------
		/**
		 * Popup en cas de succès
		 */
		$scope.showSuccess = function() {
			var alertPopup = $ionicPopup.alert({
				title: 'Bienvenue !',
				template: "Votre compte a bien été créé ! <i class='icon ion-happy'></i> Maintenant, il faut définir votre profil !"
			});
			$rootScope.user = $scope.login;
			$rootScope.email = $scope.email;
			window.location.replace("#/createProfile");
		};
		/**
		 * Popup en cas de login déjà utilisé
		 */
		$scope.showLoginFailure = function() {
			var alertPopup = $ionicPopup.alert({
				title: 'Nous sommes désolés...',
				template: "Votre login est déjà utilisé <i class='icon ion-sad'></i>"
			});
			$scope.clearInputs();
		};
		/**
		 * Popup en cas d'email déjà utilisé
		 */
		$scope.showEmailFailure = function() {
			var alertPopup = $ionicPopup.alert({
				title: 'Nous sommes désolés...',
				template: "Votre email est déjà utilisé <i class='icon ion-sad'></i><br />Vous avez peut-être oublié votre compte..."
			});
			$scope.clearInputs();
		};
		/**
		 * Popup en cas de mot de passe différents
		 */
		$scope.showPasswordFailure = function() {
		var alertPopup = $ionicPopup.alert({
				title: 'Erreur de saisie',
				template: 'Les deux mots de passe ne correspondent pas...'
			});
			$scope.clearInputs();
		};
		/**
		 * Popup en cas de champ vide
		 */
		$scope.showEmptyFailure = function() {
		var alertPopup = $ionicPopup.alert({
				title: 'Erreur de saisie',
				template: "Vous n'avez pas rempli tous les champs !"
			});
			$scope.clearInputs();
		};
		/**
		 * Popup en cas de problème autre
		 */
		$scope.showFailure = function() {
			var alertPopup = $ionicPopup.alert({
				title: 'Nous sommes désolés...',
				template: "Votre compte n'a pas pu être créé <i class='icon ion-sad'></i>"
			});
			$scope.clearInputs();
		};
	}

]);