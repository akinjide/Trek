(function () {
  'use strict';

  angular
    .module('app.user')
    .factory('userService', userService);

  userService.$inject = ['$http'];

  function userService($http) {
    return {

    };
  }
})();