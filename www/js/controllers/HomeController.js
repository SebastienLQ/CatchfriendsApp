/**
 * Le controleur de la page d'accueil (#/home)
 * 	- Affichage des parties possibles à lancer
 * 	- Affichage des demandes de parties
 * @param  {scope}	$scope      			Le $scope Angular du controller
 * @param  {scope}	$rootScope				Le $rootScope Angular commun à tous les controleurs
 * @param  {plugin} $timeout				Le plugin Angular pour les timeouts
 * @param  {plugin} $ionicPlatform			Le plugin IONIC pour les informations sur la plateforme
 * @param  {plugin} $cordovaFile			Le plugin Cordova pour le CRUD de fichiers
 * @param  {plugin} $cordovaFileTransfer	Le plugin Cordova pour les transferts de fichiers
 */
catchFriendsControllers.controller("HomeController", ["$scope", "$rootScope", "$timeout", //"$ionicPlatform", "$cordovaFile", "$cordovaFileTransfer",
	function ($scope, $rootScope, $timeout, $ionicPlatform) {
		selectFooter("#footerHome");		// On selectionne le bon footer
		$("#headerTitle").text("Accueil");	// On modifie le titre
		if ($rootScope.history.length <= 3 || ($rootScope.history[0] == "/login" && $rootScope.history[1] == "/login")) {
			$rootScope.backButton = false;	// On cache le bouton back si on vient d'arriver dans l'application
		}

		// ----------------------------------------------------------------------------
		// -----------   FONCTIONS    -------------------------------------------------
		// ----------------------------------------------------------------------------
		/**
		 * Créé le badge qui indique le nombre de demandes/challengers
		 * @param  {string} badgeName Soit #numberPossibleChallengers, soit #numberDemandesChallenges
		 * @param  {int} 	number    Le nombre de chaque
		 */
		$scope.makeBadge = function(badgeName, number) {
			var badge = $(badgeName);
			if (number > 0) {
				badge.toggleClass("badge-dark", false).toggleClass("badge-assertive", true);
			} else {
				badge.toggleClass("badge-dark", true).toggleClass("badge-assertive", false);
			}
			badge.html(number);
		};
		/**
		 * Affiche les challengers possibles
		 * @param  {array}	array	Le tableau contenant les challengers
		 */
		$scope.affPossibleChallengers = function(array) {
			$("#possibleChallengersList").append("<div id='cardPossibleChallengers' class='item list card'></div>");
			$.each(array, function(index, challenger) {
				var res = "<div class='item item-thumbnail-left item-icon-right'><img src='" + challenger.avatar + "'/>";
				res += "<h2>" + challenger.pseudo + "</h2>";
				res += "<p>" + challenger.description + "</p>";
				if (challenger.pourcentage) {
					res += "<p>" + challenger.pourcentage + "% de compatibilité</p>";
				}
				res += "<p><span class='date'>" + challenger.date + "</span> : <strong><span id='" + challenger.pseudo + "'></span></strong></p>";
				res += "<button pseudo='" + challenger.pseudo + "' class='icon ion-chatbox padding startGameButton'></button>";
				res += "</div>";
				$("#cardPossibleChallengers").append(res);
				$scope.showAdressFromLatLong(challenger.latitude, challenger.longitude, challenger.pseudo);
			});
			$(".startGameButton").click(function(event) {
				window.location.replace("#/game/" + $(this).attr("pseudo"));
			});
			// Quelques modifications css, déplacées ici pour être utilisées par dessus les css ionic
			$(".startGameButton").css('height', '50%');
			$(".startGameButton").css('right', '0px');
			$(".startGameButton").css('top', '25%');
			$(".startGameButton").css('bottom', '25%');
		};
		/**
		 * Affiche l'adresse en fonction de la latitude et de la longitude, avec le service google maps api
		 * @param  {int} 	latitude 	La latitude du checkin
		 * @param  {int} 	longitude	La Longitude du checkil
		 * @param  {string} idChall		L'id de l'élément à afficher
		 */
		$scope.showAdressFromLatLong = function(latitude, longitude, idChall) {
			var urlMap = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&sensor=true";
			$.ajax({
				type		:	'GET',
				url			:	urlMap,
				dataType	:	'json',
				complete	:	function(xhr, textStatus) {
									if(xhr.status === 200) {
										var dataMap = JSON.parse(xhr.responseText);
										$("#" + idChall).append(dataMap["results"][0]["formatted_address"]);
									}
								}
			});
		};
		/**
		 * Affiche les demandes de challenge
		 * @param  {array} array	Le tableau des demandes
		 */
		$scope.affDemandesChallenge = function(array) {
			$("#demandesChallengeList").append("<div id='cardDemandesChallenge' class='item list card'></div>");
			for (var challenger in array) {
				var res = "<div class='item item-thumbnail-left'><img src='" + array[challenger].avatar + "'/>";
				res += "<h2>" + array[challenger].pseudo + "</h2>";
				res += "<p>" + array[challenger].description + "</p>";
				res += "<p>" + array[challenger].pourcentage + "% de compatibilité</p></div>";
				$("#cardDemandesChallenge").append(res);
			}
		};

		/**
		 * Requête ajax vers le serveur pour récupérer les challengers possibles
		 */
		$(document).ready(function() {
			$.ajax({
				type		:	'POST',
				url			:	serverURL + "cf/possibleChallengers",
				data		:	JSON.stringify($rootScope.jsonLoginData),
				dataType	:	'json',
				complete	:	function(xhr, textStatus) {
									if(xhr.status === 200) {
										$rootScope.possibleChallengers = JSON.parse(xhr.responseText);
										$scope.numPossChal = $rootScope.possibleChallengers.length;
										if ($scope.numPossChal > 0) {
											$scope.affPossibleChallengers($rootScope.possibleChallengers);
										}
										$scope.makeBadge("#numberPossibleChallengers", $scope.numPossChal);
									}
								}
			});
			/**
			 * Requête ajax vers le serveur pour récupérer les demandes de challenge
			 */
			$.ajax({
				type		:	'POST',
				url			:	serverURL + "cf/demandesChallenges",
				data		:	JSON.stringify($rootScope.jsonLoginData),
				dataType	:	'json',
				complete	:	function(xhr, textStatus) {
									if(xhr.status === 200) {
										$rootScope.demandesChallenges = JSON.parse(xhr.responseText);
										$scope.numDemChal = $rootScope.demandesChallenges.length;
										if ($scope.numDemChal > 0) {
											$scope.affDemandesChallenge($rootScope.demandesChallenges);
										}
										$scope.makeBadge("#numberDemandesChallenges", $scope.numDemChal);
									}
								}
			});
		});
	}
]);