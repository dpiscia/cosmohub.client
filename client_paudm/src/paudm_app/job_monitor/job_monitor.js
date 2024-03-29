'use strict';



// Declare app level module which depends on filters, and services
angular.module('paudm_jobs', [
  'd3Bars',
  'd3Pie',
  'd3Lines',
  'd3Zoom',
  'd3Forcetree',
  'd3Qctree',
  'ngSanitize',
  'ngResource'
  
]).config(
	['$stateProvider', '$urlRouterProvider',function ($stateProvider,   $urlRouterProvider) {

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////
		 
        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
		var access = routingConfig.accessLevels;
		
		$stateProvider

          //////////
          // Home //
          //////////
			
		.state("jobs_list", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/Top_level_jobs",
			templateUrl: "job_monitor/jobs_list.html", 
			resolve : {        
				jobs: function($q, jobs_list,productions_list, user_auth){
					 var deferred = $q.defer();
					 var data_server = {};
					 jobs_list(user_auth.api_key, user_auth.id).query({}, 
					 	function(job_data){ 
					 		data_server.jobs = job_data;
					 		productions_list(user_auth.api_key, user_auth.id).query({}, 
					 			function(data){ data_server.productions = data;
					 							deferred.resolve(data_server);})})
				 //deferred.resolve([]);
				 return deferred.promise;
	        	 }
        	 },
        	access : access.user,
            controller: "jobs_controller",
            
		})
				.state("job_single", {
            
            // Use a url of "/" to set a states as the "index".
			url: "/Top_level_jobs/{path:.*}Job_details/:job_id",
			templateUrl: "job_monitor/job_single.html", 
            resolve : {        
				job: function($q, jobs_list, $location, $stateParams, user_auth){
				     var deferred = $q.defer();
				     jobs_list(user_auth.api_key, user_auth.id).query({id :$stateParams.job_id, all: 0}, function(data){ deferred.resolve(data);})
				     //deferred.resolve([]);
				     return deferred.promise;
					},
				QC: function($q, QC_list, $location, $stateParams, user_auth){
				     var deferred = $q.defer();
				     QC_list(user_auth.api_key, user_auth.id).query({id :$stateParams.job_id}, function(data){ deferred.resolve(data);})
				     //deferred.resolve([]);
				     return deferred.promise;
					},
       		 },
       		 access : access.user,
            controller: "job_single",
		})
		.state("jobs_detail", {
            
            // Use a url of "/" to set a states as the "index".
			url: "/Top_level_jobs/{path:.*}/:job_id/:level",
			templateUrl: "job_monitor/jobs_list.html", 
            resolve : {        
				jobs: function($q, jobs_list, $location, $stateParams,user_auth){
				     var deferred = $q.defer();
				     jobs_list(user_auth.api_key, user_auth.id).query({id :$stateParams.job_id, all: $stateParams.level}, function(data){ deferred.resolve({'jobs' : data});})
				     //deferred.resolve([]);
				     return deferred.promise;
					},
				productions: function() {return [];}
       		 },
       		 access : access.user,
            controller: "jobs_controller",
		})

 }]);     
      
      