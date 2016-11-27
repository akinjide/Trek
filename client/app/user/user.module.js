(function () {
  'use strict';

  angular
    .module('app.user', [
      'app.core'
    ])
    .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
      $urlRouterProvider.otherwise("/");
      $locationProvider.html5Mode(true);

      $stateProvider
        .state('home', {
          url: "/",
          controller: 'UserController',
          controllerAs: 'vm',
          templateUrl: "app/user/user.html"
        })
    });
})();