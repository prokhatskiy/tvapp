'use strict';

tvapp.controller('adminEditCtrl', function($rootScope, $scope, $routeParams, $http, SERVICES) {
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
});
