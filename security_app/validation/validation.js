angular.module('validation.controllers', [])
	.controller('validation_ctrl', [ '$scope','$http','$location','$state','user_auth' , function ($scope, $http,  $location, $state, user_auth) {

	console.log('fff');
	user_auth.validation( $state.params.email,  $state.params.token).then(
   				function(data){console.log("ok works");
   				$scope.done = true;
   				$scope.success= data ;
   				$scope.error = "";
   			}, 
   			function(err){
   				console.log(err);
   				$scope.success="" ;
   				$scope.error = err;
   				}
   			);
      		$scope.to_login = function()	{
   			$location.path('/login');
   			}
	//forgot_password
}]);