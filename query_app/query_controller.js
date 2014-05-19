'use strict';

/* Controllers */

angular.module('query',['ui.ace','ui.bootstrap']).controller('query_ctrl', [ '$scope','user_auth','$state','run_query_resources','columns','table','$modal','$interval', function ($scope, user_auth,$state,run_query_resources,columns, table, $modal,$interval) {
  if (typeof($scope.catalog) == 'undefined') {$scope.columns = columns; $scope.table = table }
  else {	$scope.table = $scope.catalog.catalog.table;
  			if ($scope.catalog.comments.length > 0)
  			{  		$scope.columns = $scope.catalog.comments.map(function(x){return Object.keys(x)[0]})
  					$scope.col_comments =  $scope.catalog.comments.map(function(x){return x[Object.keys(x)]})}
  				else {$scope.columns = $scope.catalog.columns;}
  		}
  
  	
  			

	$scope.value1 = true;
	 function bytesToSize(bytes) {
	   var k = 1000;
	   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	   if (bytes === 0) return '0 Bytes';
	   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)),10);
	   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
	}
	
   		if (typeof String.prototype.endsWith != 'function') {
		  // see below for better implementation!
			String.prototype.endsWith = function(suffix) {
			    return this.indexOf(suffix, this.length - suffix.length) !== -1;
			};
		}
	//configuration	
  $scope.aceModel = '';
  $scope.mode = 'SQL';
  $scope.readOnly = true;
  $scope.results = [];
  $scope.fields_btn = $scope.columns.map(function(x,i){ return {'name' :x ,'clicked' : false}});
  $scope.conditions = [];
  $scope.showQuery = true;
  $scope.showFields = true;
  $scope.showConditions = true;
          //fix bug in tab+router
          $scope.$parent.tabs[0].active = false
          $scope.$parent.tabs[1].active = true
  
  //operations
  $scope.add_condition = function(){
  									if ($scope.readOnly){
  									var logical;
  									logical = ""
  									if ($scope.conditions.length > 0) logical="AND"
  									$scope.conditions.push({field : "", op: "", value :"" , logical : logical}); 
  									}
  								}		
  $scope.remove_condition = function(index){if ($scope.readOnly)$scope.conditions.splice(index,1); }
  $scope.comparison_op = [{name : 'less than', op : '<'},
								{name : 'greater than', op : '>'},
								{name : 'less than or equal to', op : '<='},
								{name : 'greater than or equal to', op : '>='},
								{name : 'equal than', op : '='},
								{name : 'not equal', op : '!='}
								]
  $scope.logical_op = ['AND','OR','NOT']
  
  //query changed algorithm
  $scope.query_changed = function(btn_index) {
    if ($scope.readOnly){
	  	$scope.fields = [];
	  	//$scope.fields_btn[btn_index] = !$scope.fields_btn[btn_index];
		$scope.fields_btn.forEach(function(x){if(x.clicked == true && x.clicked!='undefined') $scope.fields.push(x.name)})
	  	$scope.aceModel = " SELECT "+ $scope.fields.join()+' \n';
	  	$scope.aceModel = $scope.aceModel+" FROM "+$scope.table+' \n';
	 	var check;
	  	check= true;
	  	if ($scope.conditions.length > 0 ) {

	  	$scope.aceModel = $scope.aceModel+" WHERE "+ $scope.conditions.map(function(x,i ){
	  			if ((x.op == "") || (x.value == "")) check = false; 
	  			var logical;
	  			if ( 0 === i) logical = "";
	  			else logical = "AND";
	  			return logical+" "+x.field+" "+x.op+" "+x.value+" "}).join().replace(/,/g,''); }
	  	if (check && ($scope.fields.length !== 0))
	  		$scope.check_query()
	  	else { 
	  			if ($scope.fields.length === 0) $scope.error = "Please select at least one field";
	  			else $scope.error = "Please Fill up all filter(s) field";
	  			$scope.success = "";
				}  	
	  	}
  }
  
  //check and uncheck operations
  $scope.check_all = function(fields){
			fields.forEach(
				function(x)
					{x.clicked = true;
					}
			)};
  $scope.uncheck_all = function(fields){
			fields.forEach(
				function(x)
					{x.clicked = false;
					}
			)};  
  
  // The ui-ace option
  
  
  $scope.aceOption = {
    mode: $scope.mode.toLowerCase(),
    onLoad: function (_ace) {
    	_ace.setReadOnly(true);
		_ace.session.setUseWrapMode(true);
		_ace.renderer.setShowGutter(false);
		_ace.renderer.setShowPrintMargin(false)
      // HACK to have the ace instance in the scope...
      $scope.modeChanged = function () {
        _ace.getSession().setMode("ace/mode/" + $scope.mode.toLowerCase());
        _ace.setReadOnly($scope.readOnly);
        if ($scope.readOnly)
        	_ace.setTheme("ace/theme/textmate");
        	
        else {
        	_ace.setTheme("ace/theme/twilight");
        	_ace.renderer.setShowGutter(true);
        	
        	
        	}
      };

    }
  };
  

  	
  $scope.check_query = function() {
  			var query_to_checked;
  			query_to_checked = $scope.aceModel;
  			run_query_resources.check(query_to_checked, user_auth.api_key, user_auth.id).then(
   			function(data){ 
   							if(query_to_checked===$scope.aceModel){
		   							var data_json = angular.fromJson(data)
		   							$scope.success = "QUERY has been succesfully checked.";
		   							$scope.success_rows =    parseFloat((data_json[0].Plan["Plan Rows"]).toExponential().split('e')[0]).toFixed(2)+"e"+(data_json[0].Plan["Plan Rows"]).toExponential().split('e')[1];
		   							$scope.success_size =   bytesToSize(data_json[0].Plan["Plan Rows"]*data_json[0].Plan["Plan Width"]);
		   							$scope.error = ""
	   							}
   							}, 
   			function(err){
   				if(query_to_checked===$scope.aceModel){
	   				console.log(err);
	   				$scope.error = err;
	   				$scope.success = "";
	   				}
	   			}
   			);}
   		
   			

  // Initial code content...
  $scope.realtime_query = function () {
 			 	
 			 	
				var modalInstance = $modal.open({
					templateUrl: 'RealTime_Query.html',
		      		controller: function ($scope, $modalInstance,query,user_auth,run_query_resources,readOnly) {
		      				
									
									$scope.formats = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
									$scope.selected = {'rows_nbr' : $scope.formats[0] };								
									$scope.cancel = function () {
									$modalInstance.dismiss('');		
									};
									
									$scope.run_query = function() {
										run_query_resources.check(query, user_auth.api_key, user_auth.id).then(
											function(data){
												$scope.isViewLoading = true;
												if (readOnly){
												query = query +" limit "+$scope.selected.rows_nbr;
												console.log(query);
												}
												run_query_resources.run(query, user_auth.api_key, user_auth.id, $scope.selected.rows_nbr).then(
									   			function(data){ 
									   							
									    						$modalInstance.close([data,$scope.selected.rows_nbr]);
									   							}, 
									   			function(err){
													$scope.isViewLoading = false;
									   				console.log(err);
									   				
									   				
									   				$modalInstance.dismiss(err);
									   				}
									   			);}, 
   			function(err){
   				console.log(err);
   				$scope.isViewLoading = false;
   				$modalInstance.dismiss( err);
   				}
   			);
									   			
									  }	
						   			
						   		
							},
							resolve: {
						query: function () {
							return $scope.aceModel;
						},
						readOnly: function () {
							return $scope.readOnly;
						}
					}
				});
			    modalInstance.result.then(function (success) {
			    					$scope.results = success[0][0];
			    					if ($scope.readOnly){
			    						if (success[0][0].length === success[1]+1) $scope.limited = true;
			    						else $scope.limited = false;}
			    					else $scope.limited = success[0][1];
		   							$scope.$broadcast('results_changed',{});
		   							$scope.success = "Real-time QUERY has been succesfully run";
		   							var state_url;
		   							state_url = $state.current.name;
		   							if (!state_url.endsWith('.results')) {state_url+='.results'; }
		   							$state.go(state_url,{},{reload : false});
		   							$scope.error = ""
			    }, function (error) {
			      $scope.error = error;
			      $scope.success = "";
			    });
		}
  
  	

            
  $scope.run_batch_query = function () {
 			 	
 			 	
				var modalInstance = $modal.open({
					templateUrl: 'myModalContent.html',
		      		controller: function ($scope, $modalInstance,query,user_auth,run_query_resources) {
		      				
									$scope.formats = ['csv', 'ssv', 'tsv'];
									$scope.selected = {'file_format' : $scope.formats[0] };
									$scope.cancel = function () {
									$modalInstance.close('');		
									};
									
									$scope.batch_query = function() {
										run_query_resources.check(query, user_auth.api_key, user_auth.id).then(
											function(data){
												run_query_resources.batch_query(query, user_auth.api_key, user_auth.id, $scope.selected.file_format).then(
									   			function(data){ 
									   							
									    						$modalInstance.close(data);
									   							}, 
									   			function(err){
									   				console.log(err);
									   				
									   				
									   				$modalInstance.dismiss(err);
									   				}
									   			);}, 
   			function(err){
   				console.log(err);
   				
   				$modalInstance.dismiss( err);
   				}
   			);
									   			
									  }	
						   			
						   		
							},
							resolve: {
						query: function () {
							return $scope.aceModel;
						}
					}
				});
			    modalInstance.result.then(function (success) {
			      $scope.success = success;
			      
			      $scope.error = "";
			    }, function (error) {
			      $scope.error = error;
			      $scope.success = "";
			    });
		}
  $scope.edit_query = function () {
 			 	
 			 	if ($scope.readOnly){
				var modalInstance_2 = $modal.open({
					templateUrl: 'EnableQuery.html',
		      		controller: function ($scope,$modalInstance) {
									$scope.cancel = function () {
									$modalInstance.dismiss('cancel');		
									};
									$scope.edit = function () {
									$modalInstance.close();		
									};
							}
				});
			    modalInstance_2.result.then(function () {
			    	$scope.readOnly = false;
			      $scope.modeChanged()
			      $scope.error = ""
			      $scope.success = ""
			      
			    });
		}
	}
	//$('#prebuilt').tab('hide');
	//$('#custom').tab('hide');
	/*if  (!$('#custom').hasClass('active'))
		 {$('#prebuilt').removeClass('active')
		 $('#custom').addClass('active')}*/
}]);
