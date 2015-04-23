'use strict';

tvapp.controller('loginCtrl', function($rootScope, $scope, $http, $cookies, $location, SERVICES, ROUTES) {
    $cookies.token = undefined;
    $scope.formIsHidden = true;
    $rootScope.isLoginPage = true;

    $http.post(SERVICES.LOGOUT)
        .success(function() {
            $scope.formIsHidden = false;
        })
        .error(function() {
            $location.path(ROUTES.ADMIN_ROOT);
        });

    $scope.login = function login() {
        $http.post(SERVICES.LOGIN, {
                username: $scope.username,
                password: $scope.password
            })
            .success(function(data) {
                $cookies.token = data;
                $rootScope.isLoginPage = false;
                $location.path(ROUTES.ADMIN_ROOT);
            })
            .error(function(data) {
                $scope.error = data;
            });
    }
});