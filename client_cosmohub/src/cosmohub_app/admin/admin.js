'use strict';

var admin = angular.module('admin', ['ngResource']);

admin.config(function($stateProvider, $urlRouterProvider){
		var access = routingConfig.accessLevels;
		
  		$stateProvider
          .state("admin_page", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/admin/:resources",
            templateUrl: "admin/admin.html", 
            resolve : {        
               resources: function($q, $stateParams, crud_resources, user_auth){
               var deferred = $q.defer();
               
               var instanced = crud_resources($stateParams.resources, user_auth.api_key, user_auth.id);
               instanced.query({}, function(data){ 
               			deferred.resolve(data);}
               		, function(err){ 
               			deferred.reject();}
               		)
               return deferred.promise;
               //the instanced is return into the controller, because it will be used for other get,post or update operation
         }},
         	access : access.user,
            controller: "admin_ctrl"
            

          })})

admin.factory('crud_resources', function($resource){
    // return a catalog with full information
    var resource = {}
    resource = function(collection,api_key,user_id){ return $resource('/api_python/'+collection, {},{ query: {method:'GET',  isArray:true, headers:{  apiKey: api_key, user_id: user_id  } },
    																							save:  {method:'PUT',   headers:{  apiKey: api_key, user_id: user_id  } } ,
    																							delete:  {method:'DELETE', params: {id : "@id"},  headers:{  apiKey: api_key, user_id: user_id  } }
    																							 }); }
	return resource;
});

admin.controller('admin_ctrl', [ '$scope', 'resources','crud_resources', function ($scope, resources, crud_resources) {
   		$scope.resources = resources.map(
   			function(x){ x.send = true; return x;} 
   			);
   		if (typeof String.prototype.startsWith != 'function') {
		  // see below for better implementation!
		  String.prototype.startsWith = function (str){
		    return this.indexOf(str) == 0;
		  };
		}
   		var resources_copy = angular.copy(resources);
		function get_head(array){
		$scope.resources_op_info = {} ;
		var dict = []
		for (var key in array) {if (!key.startsWith('$') && !key.startsWith('_')) dict.push(key);}
		return dict;
		} 
   		$scope.headers = get_head(resources[0]);
   		console.log('ss');
   		$scope.check_type = function(object){return typeof(object)}
   		$scope.currentPage = 1;
  		$scope.maxSize = 10;
   		$scope.save = function(values){
   			values =  $scope.resources.indexOf(_.where($scope.resources,{_id : values})[0])
   			console.log(_.where($scope.resources,{_id : values}));
   			console.log(resources_copy[values]);
   			$scope.resources[values].$save(function(data){ 
               			console.log(data);
               			angular.copy( $scope.resources[values],resources_copy[values]);
               			resources_copy[values] = $scope.resources[values];
               			$scope.resources_op_info = {'error': false, 'success': true};
               			 }
               		, function(err){ 
               			console.log(err);
               			
               			angular.copy(resources_copy[values], $scope.resources[values]);
               			$scope.resources_op_info = {'error': true, 'success': false};
               			})
   			//function save(). success(message and resource_copy[values] = $scope.resources[values] ) .fail(error message; $scope.resources[values]=resources_copy[values])
   			}
   		$scope.delete = function(values){
   			values =  $scope.resources.indexOf(_.where($scope.resources,{_id : values})[0])
   			$scope.resources[values].$delete({'id':$scope.resources[values]._id}, function(data){ 
               			console.log(data);
               			angular.copy( $scope.resources[values],resources_copy[values]);
               			resources_copy.splice(values,1);
               			$scope.resources.splice(values,1);
               			$scope.resources_op_info = {'error': false, 'success': true};
               			 }
               		, function(err){ 
               			console.log(err);
               			$scope.resources_op_info = {'error': true, 'success': false};
               			});
   			}
   		$scope.operations = {'DELETE': $scope.delete,'SAVE':$scope.save}
   		}]);