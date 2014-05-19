var help = angular.module('help', []);

help.config(function($stateProvider, $urlRouterProvider){
		var access = routingConfig.accessLevels;
		
  		$stateProvider
          .state("help", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/help",
            templateUrl: "help/help.html", 
         	access : access.public,            

          })})