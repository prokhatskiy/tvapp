'use strict';

var tvapp = angular.module('tvapp', ['ui.sortable', 'ngRoute', 'ui.date', 'ngCookies']);

tvapp
    .constant('APP_CONST', (function() {
        return {
            SLIDESHOW_URL: '/slideshow'
        }
    }()))
    .constant('ROUTES', (function() {
       return {
           ADMIN_ROOT: '/',
           LOGIN_ROOT: '/login',
           ADMIN_EDIT: '/edit',
           ADMIN_ADD: '/add',
           ADMIN_TIMELINES: '/timeline',
           ADMIN_IMAGES: '/images'
       }
    }()))
    .constant('SERVICES', (function() {
        return {
            CHECK_ACCESS: '/services/access',
            ADMIN_SLIDES: '/services/slides',
            GET_TIMELINE: '/services/slides',
            POST_TIMELINE: '/services/slides',
            LOGIN: '/services/login',
            LOGOUT: '/services/logout',
            GET_SLIDE: '/services/slide',
            POST_SLIDE: '/services/slide',
            DELETE_SLIDE: '/services/slide',
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
            .when(ROUTES.LOGIN_ROOT, {templateUrl: partialsPath + 'login.html', controller: 'loginCtrl'})
            .when(ROUTES.ADMIN_ROOT, {templateUrl: partialsPath + 'adminSlideList.html', controller: 'adminSlidesCtrl'})
            .when(ROUTES.ADMIN_EDIT + '/:id', {templateUrl: partialsPath + 'adminSlideEdit.html', controller: 'adminEditCtrl'})
            .when(ROUTES.ADMIN_ADD, {templateUrl: partialsPath + 'adminSlideEdit.html', controller: 'adminEditCtrl'})
            .when(ROUTES.ADMIN_TIMELINES, {templateUrl: partialsPath + 'adminTimeline.html', controller: 'adminTimelineCtrl'})
            .when(ROUTES.ADMIN_IMAGES, {templateUrl: partialsPath + 'adminImages.html', controller: 'adminImagesCtrl'})
            .otherwise({redirectTo: ROUTES.ADMIN_ROOT});
    });