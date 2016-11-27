(function () {
  'use strict';

  angular
    .module('app.core')
    .service('MapService', MapService);

  MapService.$inject = ['$q', '$window'];

  function MapService($q, $window) {
    this.getCurrentLocation = function(navigator, cb) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
          cb({ lat: position.coords.latitude, lng: position.coords.longitude });
        }, function(error) {
          $window.alert('ERROR (' + 'Can not determine your location' + ')');
          console.log('ERROR(' + error.code + '): ' + error.message);
          cb({ lat: 51.489554, lng: -0.12969 });
        }, {
          enableHighAccuracy: true,
          timeout : 10 * 1000
        });
      } else {
        cb({ lat: 51.489554, lng: -0.12969 });
      }
    }

    this.init = function() {
      // this.getCurrentLocation($window.navigator, function(response) {
      //   console.log(response);
      // });
      var mapOpts = {
        center: new google.maps.LatLng(6.50697248805994, 3.3841278854485184),
        zoom: 13,
        disableDefaultUI: true
      };

      this.map = new google.maps.Map(
        document.getElementById("map"), mapOpts
      );
      this.places = new google.maps.places.PlacesService(this.map);
    }

    this.search = function(str) {
      var d = $q.defer();

      this.places.textSearch({query: str}, function(results, status) {
        if (status == 'OK') {
            d.resolve(results[0]);
        }
        else d.reject(status);
      });
      return d.promise;
    }

    this.addMarker = function(res, image) {
      if (this.marker) this.marker.setMap(null);

      this.marker = new google.maps.Marker({
        map: this.map,
        position: res.geometry.location,
        animation: google.maps.Animation.DROP,
        icon: image
      });

      this.map.setCenter(res.geometry.location);
    }
  }
})();