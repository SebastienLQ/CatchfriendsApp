/*
 * Le controleur de la page de login (#/login)
 * @param  {scope}	$scope      	Le $scope Angular du controller
 * @param  {scope}	$rootScope		Le $rootScope Angular commun à tous les controleurs
 * @param  {plugin} $ionicPopup     Le plugin ionic pour les popups
 */
catchFriendsControllers.controller('LoginController', ['$scope', '$rootScope', '$ionicPopup', '$ionicPlatform', //"$cordovaFileTransfer",
	function ($scope, $rootScope, $ionicPopup, $ionicPlatform) {
		// $ionicPlatform.ready(function() {
		// 	console.log("READY");
		// 	$cordovaFileTransfer.download("https://www.gravatar.com/avatar/50810029edcdaa02043eff094e4d37c6.jpg?d=wavatar", "avatar.png", {}, true)
		// 		.then(function(result) {
		// 				console.log("Success ! ", result);
		// 			},
		// 			function(err) {
		// 				console.log("Error ! ", result);
		// 			},
		// 			function (progress) {
		// 				$timeout(function () {
		// 					$scope.downloadProgress = (progress.loaded / progress.total) * 100;
		// 				});
		// 			}
		// 		);
		// 	console.log("END");
		// });

		/**
		 * Lors de l'envoi du formulaire
		 */
		$('form').submit(
			function (event) {
				/**
				 * Formulaire JSON à envoyer en POST
				 * @type {Object}
				 */
				var formData = {
					'login': $scope.login,
					'password': $scope.password
				};
				/**
				 * Requête ajax vers le serveur pour se connecter
				 */
				$.ajax({
					type		:	'POST',
					url			:	serverURL + "cf/logUser",
					data		:	JSON.stringify(formData),
					dataType	:	'json',
					complete	:	function(e, xhr, settings)
									{
										var data = e.responseJSON;
										if(e.status === 200) {
											$rootScope.user = $scope.login;
											$rootScope.backButton = true;

											$rootScope.description = data["description"];	// On remplit la description
                                            $rootScope.pseudo = data["pseudo"];				// On remplit le pseudo
                                            $rootScope.pourcentage = data["pourcentage"];	// On remplit le pourcentage de compatibilité
                                            $rootScope.avatar = data["avatar"];				// On remplit l'avatar
											$rootScope.jsonLoginData = {
												'login' : $rootScope.user,
											};
                                            
                                            $("#pageFooter").show();			// On affiche les footers
											window.location.replace('#/home');	// On va à la page d'accueil
										}
										else if (e.status === 400) {
											$scope.show400();
										}
										else if (e.status === 401) {
											$scope.show401();
										}
										$scope.login = "";
										$scope.password = "";
									}
				});
			}
		);
	
		// ----------------------------------------------------------------------------
		// ----------    POPUPS     ---------------------------------------------------
		// ----------------------------------------------------------------------------
		/**
		 * Popup en cas d'erreur 400 = combinaison login/passowrd incorrecte
		 */
		$scope.show400 = function() {
			var alertPopup = $ionicPopup.alert({
				title: 'Nous sommes désolés...',
				template: 'Votre combinaison login/password est incorrecte !'
			});
		};
		/**
		 * Popup en cas d'erreur 401
		 */
		$scope.show401 = function() {
			var alertPopup = $ionicPopup.alert({
				title: 'Nous sommes désolés...',
				template: "Quelque chose s'est mal passé !!"
			});
		};
	}
]);