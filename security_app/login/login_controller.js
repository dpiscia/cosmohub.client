'use strict';

/* Controllers */

angular.module('login.controllers', ['paudm.user_auth','ui.bootstrap'])
	.controller('login_ctrl', [ '$scope','$http','user_auth','$location', function ($scope, $http, user_auth, $location) {
		$scope.rememberme = true;
   		$scope.myFunc =  function(form_submitted){
   			console.log("pressed");
   			//hack for autofill bugs
   			if ($scope.name === undefined && $('#name').val() !== undefined) $scope.name = $('#name').val()
   			if ($scope.password === undefined && $('#password').val() !== undefined) $scope.password = $('#password').val()
   			if ($scope.rememberme === undefined && $('#rememberme').val() !== undefined) $scope.rememberme = Boolean($('#rememberme').val())
   			
   			user_auth.login($scope.name, $scope.password, $scope.rememberme).then(
   			function(data){console.log("ok works");
   			var url;
   			if ($location.search().url !== undefined) url = $location.search().url;
   			else url = '/home';
   			 //url = '/home';
   			 console.log(url);
   			$location.path(url)}, 
   			function(err){
   				console.log(err);
   				$scope.error = err;
   				}
   			);
   			
   		}
   		$scope.to_register = function()
   		{
   		$location.path('/register');
   		}
   		
}]);


