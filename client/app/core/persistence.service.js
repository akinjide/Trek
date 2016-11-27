(function () {
  'use strict';

  angular
    .module('app.core')
    .service('PersistenceService', PersistenceService);

  PersistenceService.$inject = ['$q', '$window'];

  function PersistenceService($q, $window) {
    this.get = function(name) {
      return $window.localStorage.getItem(name);
    }

    this.set = function(name, value) {
      $window.localStorage.setItem(name, value);
    }

    this.remove = function(name) {
      $window.localStorage.removeItem(name);
    }

    this.reset = function() {
      $window.localStorage.clear();
    }
  }
})();