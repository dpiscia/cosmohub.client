

angular.module('catalogs_app').controller('catalogs_list_ctrl', [ '$scope','catalogs','user_auth','$location','$stateParams','compute_data',  function ($scope, catalogs, user_auth, $location, $stateParams,compute_data) {
   		$scope.catalogs = catalogs.catalogs;
   		if ($stateParams.group !== null) {$scope.groups_filter = $stateParams.group.toUpperCase();
   											$scope.status_filter = "!!";
   											$scope.type_filter = "!!";
   											}
   		else if ($stateParams.public !== null) {$scope.status_filter = $stateParams.public;
   						   					$scope.type_filter = "!!";
   											$scope.groups_filter = "!!";}
   		else if ($stateParams.type !== null) {$scope.type_filter = $stateParams.type;
   											$scope.status_filter = "!!";
   											$scope.groups_filter = "!!";   		
   		}
   		else {
											$scope.type_filter = "!!";
   											$scope.status_filter = "!!";
   											$scope.groups_filter = "!!";   				   		
   		}
		$scope.groups = [];
		$scope.public   = [];		
		$scope.type = [];		
 		function public_get_name(value)
 			{if (value === 'true' || value === true) return 'Public'; 
 				else return 'Private'};
 		function type_get_name(value){if (value === 'true' || value === true) return 'Simulated'; else return 'Observed'};
		$scope.public_converter = public_get_name;
		$scope.type_converter = type_get_name;
   		$scope.data = compute_data(catalogs.catalogs,catalogs.groups_access,public_get_name, type_get_name)
   		
		$scope.click_fn = function(filter,value){
			if (filter === "group") $scope.groups_filter = value;
			else if (filter === "public") $scope.status_filter =value;
			else $scope.type_filter = value;
			$scope.$apply()
			}	
		$scope.$watch('filtered_cat', 
		function() {
			if (typeof($scope.filtered_cat) != 'undefined'){
				console.log($scope.filtered_cat.length);
				$scope.data = compute_data($scope.filtered_cat, catalogs.groups_access, public_get_name, type_get_name );}
		}, 
		true);
		
		
 
}]);


angular.module('catalogs_app')
   .factory('compute_data', function($resource){
    // return a catalog with full information
    return function(data,groups_access,public_get_name,type_get_name){
    	var results = {}
    	results.groups = []
    	results.public = []
    	results.type = []
		var dat_raw = _.countBy(data,function(x){return x.group});
		for (var key in dat_raw) {results.groups.push({name:key, nbr: dat_raw[key], access: groups_access[key]});}  
		dat_raw = _.countBy(data,function(x){return x.public})
		for (var key in dat_raw) {results.public.push({name: key, nbr: dat_raw[key], meta : public_get_name(key)});}  
		dat_raw = _.countBy(data,function(x){return x.type})
		for (var key in dat_raw) {results.type.push({name:key, nbr: dat_raw[key],  meta : type_get_name(key)});}

		  return results;
 	}
})

