(function () {
    'use strict';

    angular.module('app', [
        'app.core',
        'app.user'
    ])
    // .run(function ($rootScope, $window, $state, $location, logger) {
    //     $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    //         event.preventDefault();
    //         $location.path('/');
    //     });
    // })
    // .config(function () {
    // });
})();