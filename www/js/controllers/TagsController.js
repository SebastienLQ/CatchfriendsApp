/**
 * Le controleur de la page des catégories (#/tags/:theme/:category)
 * @param  {scope}	$scope      	Le $scope Angular du controller
 * @param  {scope}	$routeParams   	Le $routeParams Angular contenant les paramètres de l'URL
 * @param  {scope}	$rootScope		Le $rootScope Angular commun à tous les controleurs
 * @param  {plugin} $ionicPopup     Le plugin ionic pour les popups
 */
catchFriendsControllers.controller('TagsController', ['$scope', '$routeParams', '$rootScope', '$ionicPopup',
	function ($scope, $routeParams, $rootScope, $ionicPopup) {
		selectFooter("#footerProfil");												// On selectionne le bon footer
		$("#headerTitle").text($routeParams.theme + "/" + $routeParams.category);	// On modifie le titre
		$rootScope.backButton = true;												// On affiche le bouton back
		$scope.searchTag = "";														// On initialise la recherche

		/**
		 * Requête ajax vers le serveur pour récupérer les tags de la catégorie du thème
		 */
		$.ajax({
			type		:	'POST',
			url			:	serverURL + "cf/getTags/" + $routeParams.theme + "/" + $routeParams.category,
			data		:	JSON.stringify($rootScope.jsonLoginData),
			dataType	:	'json',
			success		:	function(data) {
								$scope.alltags = data;
								$rootScope.alltags = data;
								if (Object.keys($scope.alltags).length > 50) {
									$("#affTags").html("<h4 class='padding'>Beaucoup trop de tags.... Faites une recherche !</h4>");
								} else {
									$("#affTags").html($scope.showTags($scope.alltags, $routeParams.theme, $routeParams.category));
								}
								$("#sendTagsToServer").toggleClass('button-' + themesStyle[$routeParams.theme].Color);
								$("#sendTagsToServer").click(function(event) {
									sendNewTags($rootScope.newTags, $rootScope.user);
									$rootScope.newTags = [];
									$scope.showSuccess();
								});
								$("input:checkbox").click(function(event) {
									$scope.addOrRemoveTag($(this), $routeParams.theme, $routeParams.category, $(this).parent().parent().text());
								});
								$scope.$digest();
								// $scope.$broadcast('scroll.scrollTop');
							}
		});
		/**
		 * On écoute les touches tapées dans la barre de recherche de tag pour effectuer la recherche
		 */
		$('#searchTag').keyup(function(event) {
			if ($scope.searchTag != undefined && /[a-zA-Z0-9\s':]+/.test($scope.searchTag)) {
				if ($scope.searchTag.length >= 1) {
					$scope.emptySearchTag = false;
					$scope.showTagsBySearch($scope.searchTag);
					$scope.makeSearchBold();
				}
			} else if ($scope.searchTag === "") {
				if (!$scope.emptySearchTag) {
					$scope.emptySearchTag = true;
					$scope.tags = $rootScope.alltags;
					$scope.refreshTags();
				}
			} else {
				$scope.searchTag = $scope.searchTag.substring(0, $scope.searchTag.length - 1);
				// $scope.showBadLetter();
			}
		});

		// ----------------------------------------------------------------------------
		// -----------   FONCTIONS    -------------------------------------------------
		// ----------------------------------------------------------------------------
		/**
		 * Affiche les tags récupérés en fonction de la recherche
		 * @param  {string}	search	La recherche à effectuer
		 */
		$scope.showTagsBySearch = function(search) {
			if (search.length > 200 || search.indexOf("\t") > -1 || search.indexOf("Envoyer les nouveaux tags") > -1) {
				return;
			}
			$scope.tags = {};
			var re = new RegExp(search, 'i');
			var keys = Object.keys($scope.alltags);
			for (var t in keys) {
				if (re.test(keys[t])) {
					$scope.tags[keys[t]] = $scope.alltags[keys[t]];
				}
			}
			
			$scope.refreshTags();
		};

		$scope.refreshTags = function() {
			$("#affTags").html($scope.showTags($scope.tags, $routeParams.theme, $routeParams.category));
			$("input:checkbox").click(function(event) {
				$scope.addOrRemoveTag($(this), $routeParams.theme, $routeParams.category, $(this).parent().prev().text());
			});
			$scope.$digest();
			$scope.$broadcast('scroll.scrollTop');
		}

		$scope.makeSearchBold = function() {
			var re = new RegExp($scope.searchTag, 'gi');
			$("#affTags").find("li.item span.tagname").each(function() {
				var jVal = $(this);
				var oldtext = jVal.text();
				var text = oldtext.replace(re, '<span class="bold">' + $scope.searchTag + '</span>')
				jVal.html(text);
			});
		}

		/**
		 * Affiche les tags et les checkbox, ou une phrase lorsqu'il n'y a rien à afficher
		 * @param  {object} json     Le JSON contenant les tags et le booleén
		 * @param  {string} theme    Le thème des tags
		 * @param  {string} category La catégorie des tags
		 * @return {string}          Le code html à insérer
		 */
		$scope.showTags = function(json, theme, category) {
			if (!$.isEmptyObject(json)) {
				var res = "";
				res += "<ion-scroll direction='y' class='list wide-as-needed'>";
				for (tag in json) {
					res += "<li class='item item-checkbox item-checkbox-right'><span class='tagname'>" + tag + "</span>";
					if (json[tag]) {
						res += "<label class='checkbox'><input type='checkbox' theme='" + theme + "' category='" + category + "' tag='" + tag + "' checked></label>";
					}
					else {
						res += "<label class='checkbox'><input type='checkbox' theme='" + theme + "' category='" + category + "' tag='" + tag + "'></label>";
					}
					res += "</li>";
				}
				res += "</ul>";
				return res;
			}
			return "Pas de tags correspondants..."
		};
		/**
		 * En fonction de la checkbox, ajoute ou enlève un tag
		 * @param {object} obj      La checkbox du tag
		 * @param {string} theme    Le thème du tag
		 * @param {string} category La catégorie du tag
		 * @param {string} tag      Le tag
		 */
		$scope.addOrRemoveTag = function(obj, theme, category, tag) {
			if (obj.prop('checked')) {
				$scope.addTag(theme, category, tag);
			} else {
				$scope.removeTag(theme, category, tag);
			}
		};
		/**
		 * Ajoute un tag au tableau $rootScope.newTags
		 * @param {string} theme    Le thème du tag
		 * @param {string} category La catégorie du tag
		 * @param {string} tag      Le tag
		 */
		$scope.addTag = function(theme, category, tag) {
			var tagJson = {
				"Theme": theme,
				"Category": category,
				"Tag": tag,
				"Added": true
			};
			var index = $scope.isInArray(tagJson, $rootScope.newTags);
			if (index < 0) {
				$rootScope.newTags.push(tagJson);
			}
		};
		/**
		 * Ajoute un tag au tableau $rootScope.newTags pour être enlevé du profil,
		 * ou l'enlève du tableau s'il vient d'être ajouté
		 * @param {string} theme    Le thème du tag
		 * @param {string} category La catégorie du tag
		 * @param {string} tag      Le tag
		 */
		$scope.removeTag = function(theme, category, tag) {
			var tagJson = {
				"Theme": theme,
				"Category": category,
				"Tag": tag,
				"Added": false
			};
			var index = $scope.isInArray(tagJson, $rootScope.newTags);
			if (index >= 0) {
				$rootScope.newTags.splice(index, 1);
			}
			$rootScope.newTags.push(tagJson);
			
		};
		/**
		 * Cherche un nom de tag dans un tableau d'objets
		 * @param  {string}	tagJson	Le tag à chercher
		 * @param  {array}	array	Le tableau dans lequel faire la recherche. Contient des objets de ce type {Theme:..., Category:..., Tag:...}
		 * @return {int}			L'index du tag dans le tableau, ou -1 s'il n'y est pas	
		 */
		$scope.isInArray = function(tagJson, array) {
			for (var i in array) {
				if (array[i].Theme == tagJson.Theme 
					&& array[i].Category == tagJson.Category 
					&& array[i].Tag == tagJson.Tag) {
					return i;
				}
			}
			return -1;
		};
		// ----------------------------------------------------------------------------
		// ----------    POPUPS     ---------------------------------------------------
		// ----------------------------------------------------------------------------
		/**
		 * Popup en cas de succès
		 */
		$scope.showSuccess = function() {
			var alertPopup = $ionicPopup.alert({
				title: 'Succès',
				template: "Vos Tags ont été mis à jour !"
			});
			window.location.replace("#/profil");
		};
		/**
		 * Popup en cas de mauvaise touche
		 */
		$scope.showBadLetter = function() {
			var alertPopup = $ionicPopup.alert({
				title: 'Erreur',
				template: "Veuillez n'entrer que des caractères alphanumériques s'il vous plaît, ce sera plus simple pour nous <i class='icon ion-happy'></i>"
			});
		};
	}
]);