'use strict';

/**
 * Déclaration de l'application CatchFriends
 */
 angular.module('CatchFriends', [
	// Dépendances du "module"
	'ionic',
	'ngRoute',
	'ngCordova',
	'btford.socket-io',
	'catchFriendsControllers'
	])

 .config(['$routeProvider', '$locationProvider',
 	function($routeProvider, $locationProvider) {
		// Système de routage
		$routeProvider
		.when('/home', {
			templateUrl: 'partials/home.html',
			controller: 'HomeController'
		})
		.when('/login', {
			templateUrl: 'partials/login.html',
			controller: 'LoginController'
		})
		.when('/logout', {
			templateUrl: 'partials/login.html',
			controller: 'LogoutController'
		})
		.when('/createAccount', {
			templateUrl: 'partials/createAccount.html',
			controller: 'CreateAccountController'
		})
		.when('/createProfile', {
			templateUrl: 'partials/createProfile.html',
			controller: 'CreateProfileController'
		})
		.when('/checkin', {
			templateUrl: 'partials/checkin.html',
			controller: 'CheckinController'
		})
		.when('/profil', {
			templateUrl: 'partials/profil.html',
			controller: 'ProfilController'
		})
		.when('/friends', {
			templateUrl: 'partials/friends.html',
			controller: 'FriendsController'
		})
		.when('/chat/:toUser', {
			templateUrl: 'partials/chat.html',
			controller: 'ChatController'
		})
		.when('/currentprofile', {
			templateUrl: 'partials/currentprofile.html',
			controller: 'CurrentProfileController'
		})
		.when('/updateprofile', {
			templateUrl: 'partials/updateprofile.html',
			controller: 'UpdateProfileController'
		})
		.when('/themes', {
			templateUrl: 'partials/themes.html',
			controller: 'ThemesController'
		})
		.when('/categories/:theme', {
			templateUrl: 'partials/categories.html',
			controller: 'CategoriesController'
		})
		.when('/tags/:theme/:category', {
			templateUrl: 'partials/tags.html',
			controller: 'TagsController'
		})
		.when('/games', {
			templateUrl: 'partials/games.html',
			controller: 'GamesController'
		})
		.when('/game/:pseudo', {
			templateUrl: 'partials/game.html',
			controller: 'GameController'
		})
		.when('/game/:pseudo/askQuestion', {
			templateUrl: 'partials/askQuestion.html',
			controller: 'AskQuestionController'
		})
		.otherwise({
			redirectTo: '/login'
		});
	}
	])

 .factory('mySocket', function (socketFactory) {
 	var myIoSocket = io.connect(chatServerURL);

 	var mySocket = socketFactory({
 		ioSocket: myIoSocket
 	});

 	return mySocket;
 })

 .run(function($ionicPlatform, $location, $rootScope, $ionicPopup) {
	$rootScope.history = [];				// L'historique des pages de l'application
	$rootScope.newTags = [];				// Les futurs nouveaux tags à ajouter
	$rootScope.backButton = false;			// Affichage du bouton "back"
	$rootScope.possibleChallengers = [];	// Les challengers possibles
	$rootScope.demandesChallenges = [];		// Les demandes de challenge

	/**
	 * Sauvegarde l'hitorique de l'application
	 */
	 $rootScope.$on('$routeChangeSuccess', function() {
	 	$rootScope.history.push($location.$$path);
	 });

	/**
	 * Retourne à la page précédente
	 */
	 $rootScope.back = function () {
	 	if ($rootScope.history.length > 2) {
	 		var prevUrl = $rootScope.history.splice(-2)[0];
	 	} else {
	 		var prevUrl = "/home";
	 		$rootScope.backButton = false;
	 	}
		// var prevUrl =
		$location.path(prevUrl);
	};

	/**
	 * Déconnexion
	 */
	 $rootScope.logout = function() {
	 	var alertPopup = $ionicPopup.confirm({
	 		title: 'Confirmation',
	 		template: 'Voulez-vous vraiment vous déconnecter ?'
	 	}).then(function(res) {
				// Si l'utilisateur valide
				if(res) {
					window.location.replace('#/logout');
				}
			}
			);
	 }

	/**
	 * Lorsque la plateforme est prête, effectuer certaines actions
	 */
	 $ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
	})

 .directive('tooltip', function () {
 	return {
 		restrict: 'C',
 		link: function (scope, element, attrs) {
 			var $element = $(element);
 			$element.attr("title", attrs.title)
 			$element.tooltipster({
 				animation: attrs.animation,
 				trigger: "click",
 				position: "top",
 				positionTracker: true,
 				maxWidth: 500
 			});
 		}
 	};
 });

/**
 * Définition des contrôleurs
 */
 var catchFriendsControllers = angular.module('catchFriendsControllers', []);
