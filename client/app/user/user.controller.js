(function () {
  'use strict';

  angular
    .module('app.user')
    .controller('UserController', UserController);

  UserController.$inject = ['$q', 'MapService', 'PersistenceService', 'CoreService'];
  /* @ngInject */
  function UserController($q, MapService, PersistenceService, CoreService) {
    var vm = this;
    vm.title = 'Users';
    vm.place = {};
    vm.apiError;
    vm.apiStatus;
    vm.searchPlace;

    vm.search = search;
    vm.send = send;
    vm.fastestRoute = fastestRoute;

    activate();
    MapService.init();

    function activate() {
      vm.to = false;
      vm.from = true;
      vm.all = false;
      vm.confirm = false;
      vm.possibleRoute = CoreService.getallPossibleRoutes();

      var promises = [];

      return $q.all(promises).then(function() {
        console.log('done')
      });
    }


    function search() {
      vm.apiError = false;

      if (vm.origin) {
        MapService.search(vm.origin)
          .then(function(response) {
            MapService.addMarker(response, '../../images/1.png');
            vm.confirm = true;
            vm.place.name = response.name;
            vm.place.lat = response.geometry.location.lat();
            vm.place.lng = response.geometry.location.lng();
          })
          .catch(function(status) {
            vm.apiError = true;
            vm.apiStatus = status;
          });
      } else if (vm.destination) {
        MapService.search(vm.destination)
          .then(function(response) {
            MapService.addMarker(response, '../../images/2.png');
            vm.confirm = true;
            vm.place.name = response.name;
            vm.place.lat = response.geometry.location.lat();
            vm.place.lng = response.geometry.location.lng();
          })
          .catch(function(status) {
            vm.apiError = true;
            vm.apiStatus = status;
          });
      }
    }


    function send() {
      if (vm.origin) {
        PersistenceService.set('currentLocation', JSON.stringify({ name: vm.place.name, lat: vm.place.lat, lng: vm.place.lng }));
        vm.origin = '';
      } else if (vm.destination) {
        PersistenceService.set('destinationLocation', JSON.stringify({ name: vm.place.name, lat: vm.place.lat, lng: vm.place.lng }));
        vm.all = true;
      }

      vm.from = false;
      vm.confirm = false;
      vm.to = true;
      vm.place = {};
    }


    function fastestRoute() {
      var curPos = CoreService.parse(PersistenceService.get('currentLocation'));
      var destPos = CoreService.parse(PersistenceService.get('destinationLocation'));

      var map = CoreService.init(curPos, destPos);

      CoreService.possibleRoutes(destPos)
        .then(function(response) {
          var fastestRoute = CoreService.findShortestRoute(response);

          vm.routeInfo = {
            origin: fastestRoute.start_address,
            destination: fastestRoute.end_address,
            distance: fastestRoute.distance,
            duration: fastestRoute.duration
          }
          vm.from = true;
          vm.to = false;
        })
        .catch(function(status) {
          vm.apiError = true;
          vm.apiStatus = status;
        });
    }
  }
})();
