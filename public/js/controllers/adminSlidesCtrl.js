'use strict';

tvapp.controller('adminSlidesCtrl', function($rootScope, $scope, $http, SERVICES) {
    $scope.gridType = {
        value: 'Table',
        values: ['Table', 'Grid']
    };

    $scope.slides = [];

    $http.get(SERVICES.ADMIN_SLIDES).
        success(function(data) {
            $scope.slides = data;
        }).
        error(function(data, status, headers, config) {
            console.log('fail');
        });
});
