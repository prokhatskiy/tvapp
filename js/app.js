'use strict';

var tvapp = angular.module('tvapp', ['ngRoute']);

tvapp
    .constant('APP_CONST', (function() {
        return {
            SLIDESHOW_URL: '/slideshow'
        }
    }()))
    .constant('ROUTES', (function() {
       return {
           ADMIN_ROOT: '/',
           ADMIN_EDIT: '/edit',
           ADMIN_ADD: '/add',
           ADMIN_TIMELINES: '/timeline'
       }
    }()))
    .constant('SERVICES', (function() {
        return {
            ADMIN_SLIDES: '/fakeData/list.json',
            TIMELINE: '/fakeData/timeline.json',
            SLIDE: '/fakeData/slide.json'
        }
    }()))
    .run(["$rootScope", "APP_CONST", "ROUTES", function($rootScope, APP_CONST, ROUTES) {
        $rootScope.ROUTES = ROUTES;
        $rootScope.APP_CONST = APP_CONST;
    }])
    .config(["$routeProvider", "ROUTES", function($routeProvider, ROUTES) {
        var partialsPath = 'partials/';

        $routeProvider
            .when(ROUTES.ADMIN_ROOT, {templateUrl: partialsPath + 'adminSlideList.html', controller: 'adminSlidesCtrl'})
            .when(ROUTES.ADMIN_EDIT + '/:id', {templateUrl: partialsPath + 'adminSlideEdit.html', controller: 'adminEditCtrl'})
            .when(ROUTES.ADMIN_ADD, {templateUrl: partialsPath + 'adminSlideEdit.html', controller: 'adminEditCtrl'})
            .when(ROUTES.ADMIN_TIMELINES, {templateUrl: partialsPath + 'adminTimeline.html', controller: 'adminTimelineCtrl'})
            .otherwise({redirectTo: ROUTES.ADMIN_ROOT});
    }]);
'use strict';

tvapp.controller('adminEditCtrl', ["$rootScope", "$scope", "$routeParams", "$http", "SERVICES", function($rootScope, $scope, $routeParams, $http, SERVICES) {
    var slideData = {
        slideType: 'Welcome',
        slideTypes: ['Welcome', 'Success', 'Video'],
        videoService: 'YouTube',
        videoServices: ['YouTube', 'Vimeo', 'facebook.com', 'vk.com']
    };

    $scope.revert = revert;
    $scope.isChanged = false;

    if($routeParams.id) {
        $http.get(SERVICES.SLIDE).
            success(function(data) {
                slideData = angular.extend(slideData, data);
                $scope.currentData = slideData;
                $scope.$watch('currentData', watch);
            }).
            error(function() {
                console.log('fail');
            });
    }
    else {
        $scope.isNewItem = true;
        $scope.currentData = slideData;
    }

    var revert = function revert() {

    };
}]);

'use strict';

tvapp.controller('adminSlidesCtrl', ["$rootScope", "$scope", "$http", "SERVICES", function($rootScope, $scope, $http, SERVICES) {
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

tvapp.controller('adminTimelineCtrl', ["$rootScope", "$scope", function($rootScope, $scope) {

}]);