/**
 * Selection du footer
 * @param {string}	footer	#id du footer
 */
function selectFooter(footer) {
	$('.footerButton').removeClass("active");
	$(footer).addClass("active");
}

/**
 * Teste si la méthode n'a pas besoin de la protection CSRF
 * @param {string}	method	Méthode demandée
 * @return {boolean}
 */
function csrfSafeMethod(method) {
	return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

/**
 * Envoie les nouveaux tags au serveur
 * @param  {object} json     L'objet JSON qui contient les tags, formaté
 * @param  {string} username Le login de l'utilisateur
 */
function sendNewTags(json, username) {
	if (json.length != 0) {
		var formData = {
			'login'		:	username,
			'tags'		:	json
		};
		$.ajax({
			type		:	'POST',
			url			:	serverURL + "cf/addRemoveTags",
			data		:	JSON.stringify(formData),
			dataType	:	'json'
		});
	}
};

/*$.ajax({
	type		:	'GET',
	url			:	serverURL + "cf/simple",
	success		:	function(data) {
						var csrftoken = $.cookie('catchfriendssocialsafestudiocsrftoken');
					}
})
*/

/*var csrftoken = $.cookie('catchfriendssocialsafestudiocsrftoken');

$.ajaxSetup({
	csrfmiddlewaretoken: csrftoken,
	beforeSend: function(xhr, settings) {
		if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
			xhr.setRequestHeader("X-CSRFToken", csrftoken);
		}
	}
});*/


