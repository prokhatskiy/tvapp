tvapp.directive('uiMessages', function($timeout) {
    return {
        templateUrl: '/templates/global/messages.html',
        link: function(scope) {
            scope.$watch('message', function() {
                if (!Boolean(scope.message)) {
                    return false;
                }

                scope.message.show = true;

                if (angular.isNumber(scope.message.hide) && scope.message.hide > 0) {
                    $timeout(function() {
                        scope.message.show = false;
                    }, scope.message.hide);
                }
            });
        }
    };
});