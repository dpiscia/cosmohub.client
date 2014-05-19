'use strict';



// Declare app level module which depends on filters, and services
angular.module('login', [
  'login.controllers',
  'register.controllers',
  'groups.resources',
  'forgot.controllers',
  'validation.controllers',
  'ui.select2'
  
]).config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {

        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////
		 
        // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
   		var access = routingConfig.accessLevels;
        $urlRouterProvider
             
             .otherwise("/login");
        $stateProvider

          //////////
          // Home //
          //////////

          .state("login", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/login?url",
            templateUrl: "/security/login/login.html", 
            access : access.public,
            controller: "login_ctrl",
            

          })         
          .state("register", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/register",
            templateUrl: "/security/register/register.html", 
            resolve : {        
               groups: function($q, groups_list_public_resources){
               var deferred = $q.defer();
               groups_list_public_resources().query({}, function(data){ deferred.resolve(data);})
               return deferred.promise;
         }},
            access : access.public,
            controller: "register_ctrl",
            

          })         
          .state("forgot_password", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/forgot_password",
            templateUrl: "/security/forgot_password/forgot_password.html", 

            access : access.public,
            controller: "forgot_password_ctrl",
            

          })
                    .state("validation", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/validation?email&token",
            templateUrl: "/security/validation/validation.html", 

            access : access.public,
            controller: "validation_ctrl",
            

          })
                 .state("public_about", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/public_about",
            templateUrl: "/security/public_about/public_about.html", 

            access : access.public,
        
            

          })
          
                 .state("public_contact", {
            
            // Use a url of "/" to set a states as the "index".
            url: "/public_contact",
            templateUrl: "/security/public_contact/public_contact.html", 

            access : access.public,
        
            

          })
         

        
        
 }]); 