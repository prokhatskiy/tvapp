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
    .run(function($rootScope, APP_CONST, ROUTES) {
        $rootScope.ROUTES = ROUTES;
        $rootScope.APP_CONST = APP_CONST;
    })
    .config(function($routeProvider, ROUTES) {
        var partialsPath = 'partials/';

        $routeProvider
            .when(ROUTES.ADMIN_ROOT, {templateUrl: partialsPath + 'adminSlideList.html', controller: 'adminSlidesCtrl'})
            .when(ROUTES.ADMIN_EDIT + '/:id', {templateUrl: partialsPath + 'adminSlideEdit.html', controller: 'adminEditCtrl'})
            .when(ROUTES.ADMIN_ADD, {templateUrl: partialsPath + 'adminSlideEdit.html', controller: 'adminEditCtrl'})
            .when(ROUTES.ADMIN_TIMELINES, {templateUrl: partialsPath + 'adminTimeline.html', controller: 'adminTimelineCtrl'})
            .otherwise({redirectTo: ROUTES.ADMIN_ROOT});
    });