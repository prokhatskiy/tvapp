'use strict';

var tvapp = angular.module('tvapp', ['ngRoute']);

tvapp
    .constant('ROUTES', (function() {
       return {
           ADMIN_ROOT: '/admin',
           ADMIN_EDIT: '/admin/edit',
           ADMIN_TIMELINES: '/admin/timeline'
       }
    }()))
    .constant('SERVICES', (function() {
        return {
            ADMIN_SLIDES: '/fakeData/list.json'
        }
    }()))
    .run(["$rootScope", "ROUTES", function($rootScope, ROUTES) {
        $rootScope.ROUTES = ROUTES;
    }])
    .config(["$routeProvider", "ROUTES", function($routeProvider, ROUTES) {
        var partialsPath = 'partials/';

        $routeProvider
            .when(ROUTES.ADMIN_ROOT, {templateUrl: partialsPath + 'adminSlideList.html', controller: 'adminSlidesCtrl'})
            .when(ROUTES.ADMIN_EDIT + '/:id', {templateUrl: partialsPath + 'adminSlideEdit.html', controller: 'adminEditCtrl'})
            .when(ROUTES.ADMIN_TIMELINES, {templateUrl: partialsPath + 'adminTimelines.html', controller: 'adminTimelinesCtrl'})
            .otherwise({redirectTo: ROUTES.ADMIN_ROOT});
    }]);
'use strict';

tvapp.controller('adminEditCtrl', ["$scope", "$routeParams", function($scope, $routeParams) {
    $scope.id = $routeParams.id
}]);

'use strict';

tvapp.controller('adminSlidesCtrl', ["$scope", "$http", "SERVICES", function($scope, $http, SERVICES) {
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
}]);

'use strict';

tvapp.controller('adminTimelinesCtrl', ["$scope", function($scope) {

}]);