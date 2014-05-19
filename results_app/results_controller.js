'use strict';

/* Controllers */

angular.module('results',['ui.bootstrap','d3Scatter', 'paudm.filters','ngCsv','n3-charts.linechart'])
	.controller('results_ctrl', [ '$scope','user_auth', function ($scope,  user_auth) {
   	console.log("results");
   	$scope.type = 'table';
   	$scope.showResult = true;
	$scope.header = $scope.$parent.results[0]
   	
	$scope.var1 = $scope.header[0];
	$scope.var2 = $scope.header[1];	
	$scope.var_bin = $scope.header[0];	
	$scope.bins_nbr = 10;
	$scope.$parent.results.splice(0,1);
	
	var scatter_data;
	scatter_data = function (){ return $scope.results.map(
		function(x)
		{return [ x[ $scope.header.indexOf($scope.var1)], x[$scope.header.indexOf($scope.var2)] ] });}
	$scope.data = scatter_data();
 	$scope.$on('results_changed', function(event, args){
 		$scope.header = $scope.$parent.results[0]
        $scope.$parent.results.splice(0,1);
        $scope.data = scatter_data();
    	$scope.data_prova = bins_data();
    });
	$scope.$watch('var1+var2', function(){$scope.data = scatter_data()})   		
	$scope.currentPage = 1;
  	$scope.maxSize = 10;
  	
  	
  	  	
  	var bins_data = function(){
  		
  		var dati_ini = []
  		dati_ini = $scope.results;
  		if (dati_ini.length === 0) return []
  		var mapper;
  		var dizionario = [ ]
  		// this line prevent to get an error if variable type is a string
  		if (typeof(dati_ini[0][$scope.header.indexOf($scope.var_bin)]) === 'string') return []
		dati_ini.forEach(function(element){dizionario.push({ 'var_bin' : element[$scope.header.indexOf($scope.var_bin)]})})
	  	var max = _.max(dizionario, function(x){return x.var_bin;}).var_bin
		var min = _.min(dizionario, function(x){return x.var_bin;}).var_bin
		var range = _.range(min,max,(max-min)/($scope.bins_nbr-1)) 	
  		mapper = _.countBy(dizionario, function(x){return  find(x.var_bin,range);});
  		return range.map(function(x) {
	var y;
	if (mapper[x] == undefined) y = 0;
	else y = mapper[x];
	return {'x' : x, 'y' : y};} )
  	}
	
	
	function find(x,bins){
		var found; 
		bins.forEach(function(element,index){ 
			
			if (index==0) {if (x <= element) found =  element;}  
			if (index==bins.length-1) {if (x >= element) found = element;} 
			if ((x > bins[index]) && (x < bins[index+1])) found = element;
		})
	return found;
	}
	
	
	$scope.data_prova = bins_data()
	$scope.$watch('var_bin+bins_nbr', function(){$scope.data_prova = bins_data()}) 
	
	$scope.options_prova = {
	  series: [
	    {y: "y", color: "#2ca02c", type: "column"},
	
	  ],
	  axes: {
	    x: {type: "linear", key: "x"},
	    y: {type: "linear"}
	  },
	  lineMode: "linear",
	  tooltipMode: "default"
	};
	$scope.format_data = function(){
		return [$scope.header].concat($scope.results);}
}])