'use strict';

/* Controllers */

angular.module('catalogs_app').controller('single_catalog_ctrl', [ '$scope','catalog','user_auth','$location','$http','$state', function ($scope, catalog, user_auth, $location, $http, $state) {
   		$scope.catalog = catalog;
		$scope.token = user_auth.api_key;
		$scope.user_id = user_auth.id;
		$scope.download= function(url){
   		$http({method: 'GET', url : url, headers : {user_id: user_auth.id, apikey:user_auth.api_key} }).success(function(){

				console.log('OK');
            }).error(function(err) {console.log(err);} );
            }
        $scope.goto_custom = function(location){
          	$state.go("catalog_details.custom");}
        $scope.goto_prebuilt = function(location){
          	$state.go("catalog_details.prebuilt");}          	
          	
  $scope.alertMe = function() {
    setTimeout(function() {
      alert("You've selected the alert tab!");
    });
  };          
  
  
  $scope.tabs = [
    { title:"Value-Added Data", content:"Dynamic content 1", active: true ,fn : $scope.goto_prebuilt},
    
    { title:"Custom Catalogs", content:"Dynamic content 3", active: false , fn : $scope.goto_custom}
    ];



}]);


angular.module('catalogs_app').controller('prebuilt_ctrl', [  '$scope','$state', function ($scope, $state) {
	//to maintain consistency on the back button action
	/*if  (!$('#prebuilt').hasClass('active'))
		 {$('#custom').removeClass('active')
		 $('#prebuilt').addClass('active')}*/
          console.log('single');
          $scope.$parent.tabs[0].active = true
          $scope.$parent.tabs[1].active = false


}]);
