angular.module('forgot.controllers', ['paudm.user_auth','ui.bootstrap'])
	.controller('forgot_password_ctrl', [ '$scope','$http','user_auth','$location', function ($scope, $http, user_auth, $location) {
		$scope.done = false;
   		$scope.myFunc =  function(form_submitted){
   			console.log("pressed");
   			
   			user_auth.forgot_password($scope.name).then(
   				function(data){console.log("ok works");
   				$scope.done = true;
   				$scope.success="An email with the new password has been sent to your email inbox" ;
   				$scope.error = "";
   			}, 
   			function(err){
   				console.log(err);
   				$scope.success="" ;
   				$scope.error = err.error;
   				}
   			);
   			
   		}
   		   		$scope.to_login = function()	{
   			$location.path('/login');
   			}

	//forgot_password
}]);