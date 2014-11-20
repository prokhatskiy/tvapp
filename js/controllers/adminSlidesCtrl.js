'use strict';

tvapp.controller('adminSlidesCtrl', function($scope, $http, SERVICES) {
    $scope.gridType = {
        value: 'Table',
        values: ['Table', 'Grid']
    }

    $scope.gridTypes = [
        {
            value: 'table',
            name: 'Table'
        },
        {
            value: 'smallGrid',
            name: 'Small Grid'
        },
        {
            value: 'largeGrid',
            name: 'Large Grid'
        }
    ];

    $scope.slides = [];

    $http.get(SERVICES.ADMIN_SLIDES).
        success(function(data) {
            $scope.slides = data;
        }).
        error(function(data, status, headers, config) {
            console.log('fail');
        });
});
