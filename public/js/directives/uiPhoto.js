tvapp.directive('uiPhoto', function(SERVICES, $http) {
    return {
        restrict: 'E',
        scope: {
            src : '=src'
        },
        templateUrl: '/templates/global/photo.html',
        controller: function($scope, $element) {
            var inputValue = '';
            var $input = $element.find('input[type=file]');
            $scope.loading = 0;

            var uploadImage = function uploadImage(files) {
                var fd = new FormData();
                fd.append('file', files[0]);

                $scope.loading += 1;

                $http.post(SERVICES.DELETE_IMG, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                    .success(function(fileName) {
                        $scope.src = fileName;
                        $scope.$broadcast('uiPhoto:uploaded');
                        $scope.loading -= 1;
                    })
                    .error(function(data, status) {
                        $scope.loading -= 1;

                        switch (status) {
                            case 401:
                                $location.path(ROUTES.LOGIN_ROOT);
                                break;
                            default:
                                console.log('uiPhoto directive - cannot upload an image - status: ' + status + ' response: ' + data);
                        }
                    });
            };

            $input.on('change', function(event) {
                var $el = $(this);
                var val = $el.val();

                if(val === inputValue && val !== '') {
                    return false;
                }

                inputValue = val;
                uploadImage(event.target.files);
            });

            $scope.deleteImage = function deleteImage(src) {
                $scope.loading += 1;
                $http.delete(SERVICES.DELETE_IMG + '?src=' + src)
                    .success(function() {
                        console.log($scope.src);
                        $scope.loading -= 1;
                        $scope.src = '';
                        $input.val('');
                        $scope.$broadcast('uiPhoto:deleted');
                    })
                    .error(function(data, status) {
                        $scope.loading -= 1;

                        switch (status) {
                            case 401:
                                $location.path(ROUTES.LOGIN_ROOT);
                                break;
                            default:
                                console.log('uiPhoto directive - cannot delete an image - status: ' + status + ' response: ' + data);
                        }
                    });
            };
        }
    }
});