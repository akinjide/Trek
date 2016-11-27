(function () {
  'use strict';

  angular
    .module('app.core')
    .service('CoreService', CoreService);

  CoreService.$inject = ['$q', '$window', 'PersistenceService'];

  function CoreService($q, $window, PersistenceService) {
    this.directionsDisplay;
    this.directionsService = new google.maps.DirectionsService();
    this.size = 0;
    this.map;
    this.currentPosition;

    this.routeResults;

    this.init = function(current, end) {
      this.directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true,
        suppressInfoWindows: true,
        suppressMarkers: true
      });
      this.currentPosition = new google.maps.LatLng(current.lat, current.lng);

      var mapOpts = {
        zoom: 13,
        center: this.currentPosition
      };

      this.map = new google.maps.Map(document.getElementById('map'), mapOpts);
      this.directionsDisplay.setMap(this.map);
      this.addMarker(current, '../../images/1.png', 'Origin');
      this.addMarker(end, '../../images/2.png', 'Destination');
      return this.map
    }

    this.possibleRoutes = function(end, options) {
      var d = $q.defer();

      var request = {
        origin: this.currentPosition,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        optimizeWaypoints: true
      };

      this.directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          d.resolve(response);
        }
        else d.reject(status);
      });

      return d.promise;
    }

    this.storeResponse = function(data) {
      this.routeResults = data;
      PersistenceService.set('GGResponse', JSON.stringify(data.routes));
    }

    this.getallPossibleRoutes = function() {
      return this.parse(PersistenceService.get('GGResponse'))
        .map(function(v, i) {
          return v.legs[0];
        });
    }

    this.findShortestRoute = function(data, map) {
      this.storeResponse(data);

      var i = this.routeResults.routes.length;
      var shortestIndex = 0;
      var shortestLength = this.routeResults.routes[0].legs[0].distance.value;

      while(i--) {
        if (this.routeResults.routes[i].legs[0].distance.value < shortestLength) {
          shortestIndex = i;
          shortestLength = this.routeResults.routes[i].legs[0].distance.value;
        }
      }

      var shortestRoute = this.routeResults.routes[shortestIndex];
      this.routeResults.routes = [];
      this.routeResults.routes.push(shortestRoute);
      this.directionsDisplay.setDirections(this.routeResults);

      return this.routeResults.routes[0].legs[0];
    }

    this.addMarker = function(position, image, title) {
      this.marker = new google.maps.Marker({
        map: this.map,
        position: new google.maps.LatLng(position.lat, position.lng),
        title: title,
        animation: google.maps.Animation.DROP,
        icon: image
      });
    }

    this.parse = function(object) {
      return JSON.parse(object);
    }
  }
})();