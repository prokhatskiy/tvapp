tvapp.directive('uiPhoto', function() {
    return {
        restrict: 'E',
        scope: {
            src : '=src'
        },
        templateUrl: '/templates/global/photo.html',
        controller: function($scope) {
        }
    }
});