/**
 * Le controleur de la page de chat (#/chat)
 * @param  {scope}	$scope      Le $scope Angular du controller
 * @param  {scope}	$routeParams   	Le $routeParams Angular contenant les paramètres de l'URL
 * @param  {scope}	$rootScope	Le $rootScope Angular commun à tous les controleurs
 * @param  {scope}	$ionicScrollDelegate	Le $ionicScrollDelegate ionic module pour scroll : utilisé pour scrollBottom
 */
catchFriendsControllers.controller('ChatController', ['$scope', '$routeParams','$rootScope','$ionicScrollDelegate','mySocket',
	function ($scope, $routeParams, $rootScope, $ionicScrollDelegate, mySocket) {

		selectFooter("#footerFriends");
		$scope.friend = $routeParams.toUser;
		$("#headerTitle").html('<i class="ion-chatbubble chat-header-icon" style=""></i>'+$scope.friend);
		$rootScope.backButton = true;
		// var monObj = new Object();
		// monObj.toProfile = $rootScope.pseudo;
		// monObj.fromProfile = $scope.friend;
		// monObj.messageSend = "salut çava ?";
		// monObj.date = new Date();
		// $scope.messages.push(monObj);
		var form = {
			'from': $rootScope.pseudo,
			'to': $scope.friend
		};
		$.ajax({
			type		:	'POST',
			url			:	serverURL + "cf/getMessage",
			data		:	JSON.stringify(form),
			dataType	:	'json',
		})
		.success(function(data, status, headers, config) {
		  $scope.messages = data;
		  $scope.$apply();
		});

		mySocket.emit('new_client', $rootScope.pseudo);

		mySocket.on('message', function(user_from, message){
			// alert("MESSAGE de :"+user_from);
			var monObj = new Object();
			monObj.toProfile = $rootScope.pseudo;
			monObj.fromProfile = user_from;
			monObj.messageSend = message;
			monObj.date = new Date();
			if(user_from == $scope.friend)
				$scope.messages.push(monObj);
			else
				alert("un nouveau message de "+user_from);
		});

		$scope.sendMessage = function(form) {
			var monObj = new Object();
			monObj.fromProfile = $rootScope.pseudo;
			monObj.toProfile = $scope.friend;
			monObj.messageSend = $("#msg").val();
			monObj.date = new Date();
			$scope.messages.push(monObj);
			$ionicScrollDelegate.scrollBottom();
			mySocket.emit("message", monObj.toProfile, monObj.messageSend);
			$("#msg").val("");

			var form = {
						'message': monObj.messageSend,
						'from': monObj.fromProfile,
						'to': monObj.toProfile,
						'date': monObj.date
					};

			$.ajax({
				type		:	'POST',
				url			:	serverURL + "cf/sendMessage",
				data		:	JSON.stringify(form),
				dataType	:	'json',
				complete	:	function(e, xhr, settings)
								{
									// Affichage de la popup correspondante au code de retour
									if(e.status === 200)
										console.log("message envoye");
									else
										console.log("Le message n'a pas été transmis");
								}
			});
		}

	}

]);
