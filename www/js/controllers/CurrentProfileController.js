/*
 * Le controleur de la page du profil actuel de l'utilisateur (#/currentprofile)
 * @param  {scope}	$scope      	Le $scope Angular du controller
 * @param  {scope}	$rootScope		Le $rootScope Angular commun à tous les controleurs
 */
catchFriendsControllers.controller('CurrentProfileController', ['$scope', '$rootScope',
	function ($scope, $rootScope) {
		selectFooter("#footerProfil");		// On selectionne le bon footer
		$("#headerTitle").text("Vos tags");	// On modifie le titre
		$rootScope.backButton = true;		// On affiche le bouton back

		/**
		 * Requête ajax vers le serveur pour récupérer les tags de l'utilisateur
		 */
		$.ajax({
			type		:	'POST',
			url			:	serverURL + "cf/getCurrentTags",
			data		:	JSON.stringify($rootScope.jsonLoginData),
			dataType	:	'json',
			success		:	function(data) {
								$("#listtags").append($scope.showMyTags(data));
							}
		});

		// ----------------------------------------------------------------------------
		// -----------   FONCTIONS    -------------------------------------------------
		// ----------------------------------------------------------------------------
		/**
		 * Affiche les tags de l'utilisateur
		 * @param  {object}	json	Le json à afficher contenant les tags de l'utilisateur
		 * @return {string} 		La chaine à insérer dans le code html
		 */
		$scope.showMyTags = function(json) {
			var res = ""
			for (theme in json) {
				res += "<div id='" + theme + "' class='padding'>";
				res += "<h3 class='white-text " + themesStyle[theme].Color + " padding'>" + theme + "</h3>";
				res += "<div class='list list-inset'>";
				for (category in json[theme]) {
					res += "<h4 id='" + theme + category + "' class='item item-divider'><strong>" + category + "</strong></h4>";
					$.each(json[theme][category], function(index, tag) {
						res += "<h5 id='" + theme + "_" + category + "_" + tag + "' class='item'>" + tag + "</h5>";
					})
				}
				res += "</div></div>";
			}
			return res;
		}
	}
]);