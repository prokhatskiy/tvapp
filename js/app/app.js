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
    .run(function($rootScope, ROUTES) {
        $rootScope.ROUTES = ROUTES;
    })
    .config(function($routeProvider, ROUTES) {
        var partialsPath = 'partials/';

        $routeProvider
            .when(ROUTES.ADMIN_ROOT, {templateUrl: partialsPath + 'adminSlideList.html', controller: 'adminSlidesCtrl'})
            .when(ROUTES.ADMIN_EDIT + '/:id', {templateUrl: partialsPath + 'adminSlideEdit.html', controller: 'adminEditCtrl'})
            .when(ROUTES.ADMIN_TIMELINES, {templateUrl: partialsPath + 'adminTimelines.html', controller: 'adminTimelinesCtrl'})
            .otherwise({redirectTo: ROUTES.ADMIN_ROOT});
    });