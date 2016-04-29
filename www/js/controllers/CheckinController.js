/**
 * Le controleur de la page des checkins (#/checkin)
 * 	- Affichage de la carte
 * 	- prise d'un checkin
 * @param  {scope}	$scope      	Le $scope Angular du controller
 * @param  {scope}	$rootScope		Le $rootScope Angular commun à tous les controleurs
 * @param  {plugin} $ionicLoading   Le plugin ionic pour les chargements
 * @param  {plugin} $ionicPopup     Le plugin ionic pour les popups
 */
catchFriendsControllers.controller('CheckinController', ['$scope', '$rootScope', '$ionicLoading', '$ionicPopup',
	function ($scope, $rootScope, $ionicLoading, $ionicPopup) {
		selectFooter("#footerCheck");		// On selectionne le bon footer
		$("#headerTitle").text("Checkin");	// On modifie le titre
		$rootScope.backButton = true;		// On affiche le bouton back

		// ----------------------------------------------------------------------------
		// Source :https://blog.nraboy.com/2014/10/implement-google-maps-using-ionicframework/
		// ----------------------------------------------------------------------------
		/**
		 * Longitude et Latitude par défaut
		 * @type {google}
		 */
		var myLatlng = new google.maps.LatLng(48.858903, 2.294317);
		/**
		 * Options de la googleMap
		 * @type {Object}
		 */
		var mapOptions = {
			scrollwheel: false,
			draggable: false,
			center: myLatlng,
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		/**
		 * La googleMap
		 * @type {google}
		 */
		var map = new google.maps.Map(document.getElementById("map"), mapOptions);
		
		// ----------------------------------------------------------------------------
		// -----------   FONCTIONS    -------------------------------------------------
		// ----------------------------------------------------------------------------
		/**
		 * Récupère la localisation de l'appareil
		 */
		$scope.getMyLocation = function() {
			navigator.geolocation.getCurrentPosition(function(pos) {
				map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
				var myLocation = new google.maps.Marker({
					position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
					map: map,
					title: "My Location"
				});
				$scope.latitude = pos.coords.latitude;
				$scope.longitude = pos.coords.longitude;
			});
		}

		$scope.getMyLocation();	// On récupère la localisation
		$scope.map = map;		// On affiche la googleMap
		
		/**
		 * Envoi du checkin au serveur
		 */
		$scope.sendCheckin = function() {
			/**
			 * Formulaire JSON à envoyer en POST
			 * @type {Object}
			 */
			var formData = {
				'login' : $rootScope.user,
				'latitude' : $scope.latitude,
				'longitude' : $scope.longitude
			};
			
			/**
			 * Requête ajax vers le serveur
			 */
			$.ajax({
				type		:	'POST',
				url			:	serverURL + "cf/checkin",
				data		:	JSON.stringify(formData),
				dataType	:	'json',
				complete	:	function(xhr, textStatus) {
									if(xhr.status === 200) {
										$scope.showSuccess();
									}
								}
			});
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
				template: "Votre checkin a été enregistré !"
			});
			window.location.replace("#/home");
		};
	}
]);