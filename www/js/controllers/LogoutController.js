/*
 * Le controleur de la page de logout (#/logout)
 * @param  {scope}	$scope      	Le $scope Angular du controller
 * @param  {scope}	$rootScope		Le $rootScope Angular commun à tous les controleurs
 */
catchFriendsControllers.controller('LogoutController', ['$scope', '$rootScope',
	function ($scope, $rootScope) {
		$rootScope.user = undefined;			// On selectionne le bon footer
		$rootScope.backButton = false;			// On cache le bouton back
		$rootScope.history.length = 0;			// On réinitialise l'historique
		$("#pageFooter").hide();				// On cache les footers
		$("#headerTitle").text('CatchFriends');	// On modifie le text header
		window.location.replace('#/');			// On retourne à la page de garde
	}
]);


// ----------------------------------------------------------------------------
// ----------   FACEBOOK    ---------------------------------------------------
// ----------------------------------------------------------------------------
/*
function fblogout() {
	FB.logout(function () {
		window.location.reload();
	});
}

window.fbAsyncInit = function() {
	FB.init({
		appId	: '<?php echo $facebook->getAppId(); ?>',
		session	: '<?php echo json_encode($session); ?>',
		status	: true,
		cookie  : true,
		xfbml   : true
	});
	FB.Event.subscribe('auth.login', function() {
		window.location.reload();
	});
};

(function() {
	var e = document.createElement('script');
	e.src = document.location.protocol + '//connect.facebook.net/fr_FR/all.js';
	e.async = true;
	document.getElementById('fb-root').appendChild(e);
}());

//your fb login function
function fblogin() {
	FB.login(function(response) {
		//...
	}, {perms:'read_stream,publish_stream,offline_access'});
	redir();
}
*/
