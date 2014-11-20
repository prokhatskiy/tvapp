'use strict';

var admin = angular.module('admin', ['ngRoute'])

admin.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/admin/list', {template: '/partials/adminSlideList.html', controller: 'SliderListCtrl' })
        .otherwise({redirectTo: '/admin/list'});
} ]);

admin.controller('SliderListCtrl', function($scope) {

});
