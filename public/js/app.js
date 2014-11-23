'use strict';

var tvapp = angular.module('tvapp', ['ngRoute', 'ui.date']);

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
            GET_TIMELINE: '/fakeData/timeline.json',
            POST_TIMELINE: '/fakeData/timeline.json',
            GET_SLIDE: '/fakeData/slide.json',
            POST_SLIDE: '/fakeData/slide.json',
            UPLOAD_IMG: '/fakeData/src.json'
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

tvapp.controller('adminEditCtrl', ["$scope", "$routeParams", "$http", "SERVICES", "$timeout", function($scope, $routeParams, $http, SERVICES, $timeout) {
    //config
    var defaults = {
        slideType: 'Welcome',
        slideTypes: ['Welcome', 'Success', 'Birthdays', 'Video'],
        employeeNames: [{'name' : '', date: ''}]
    };

    var slideData = angular.copy(defaults);
    $scope.currentData = angular.copy(defaults);
    $scope.isNewItem = true;
    $scope.isChanged = false;
    $scope.imageSrc = '';
    $scope.showMessage = false;
    $scope.showError = false;

    $scope.$watchCollection('currentData', function() {
        if(angular.equals($scope.currentData, slideData)) {
            $scope.isChanged = false;
        }
        else {
            $scope.isChanged = true;
        }
    });

    //extend model
    if($routeParams.id) {
        $http.get(SERVICES.GET_SLIDE).
            success(function(data) {
                slideData = angular.extend(slideData, data);
                $scope.currentData = angular.copy(slideData);
                $scope.isNewItem = false;
            })
            .error(function() {
                showError('Fail!!!');
            });
    }

    $scope.uploadPhoto = function uploadPhoto() {
        console.log($scope.imageSrc);
    };

    $scope.save = function save() {
        $http.post(SERVICES.POST_SLIDE, prepareData($scope.currentData))
            .success(function() {
                showMessage('Saved!!!');
            })
            .error(function() {
                showError('Fail!!!');
            });
    };

    $scope.revert = function revert() {
        $scope.currentData = angular.copy(slideData);
        $scope.isChanged = false;
    };

    $scope.addEmployee = function addEmployee() {
        $scope.currentData.employeeNames.push({'name' : '', date: ''});
    };

    var prepareData = function prepareData(data) {
        return data;
    };

    var showMessage = function showMessage(message) {
        $scope.showMessage = message;
        setTimeout(function() {
            $scope.showMessage = false;
        }, 5000);
    };

    var showError = function showMessage(error) {
        $scope.showError = error;
        $timeout(function() {
            $scope.showError = false;
        }, 5000);
    };
}]);

'use strict';

tvapp.controller('adminSlidesCtrl', ["$rootScope", "$scope", "$http", "SERVICES", function($rootScope, $scope, $http, SERVICES) {
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
}]);

'use strict';

tvapp.controller('adminTimelineCtrl', ["$rootScope", "$scope", function($rootScope, $scope) {

}]);