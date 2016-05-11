"use strict";

app.directive('pmGridPreview',['$location',function($location) {
    return {
        restrict: 'C',
        templateUrl: 'partial/photos/grid-preview',
        link: function(scope, element, attributes) {
            element.on('click',function() {

                $location.path('/view/'+scope.photo._id);

                // Add album id in URL params for prev/next
                if(scope.album && scope.album._id) {
                    $location.search({a: scope.album._id});
                }

                scope.$apply();
            });
        }
    }
}])
.directive('pmUploadThumb', ['$window', function($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function(item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function(file) {
            var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function(scope, element, attributes) {
            if (!helper.support) return;

            var params = scope.$eval(attributes.pmUploadThumb);

            if (!helper.isFile(params.file)) return;
            if (!helper.isImage(params.file)) return;

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                if(params.keep_ratio && params.width && params.height) {
                  let ratio = this.width/this.height;
                  if(this.width > this.height) {
                    // Landscape => fix width
                    var width = params.width;
                    var height = params.height / ratio;
                  }
                  else {
                    // Portrait => fix height
                    var width = params.width * ratio;
                    var height = params.height;
                  }
                }
                else {
                  var width = params.width || this.width / this.height * params.height;
                  var height = params.height || this.height / this.width * params.width;
                }

                canvas.attr({ width: width, height: height });

                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}])
.directive('pmTagEditor',[function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'partial/tag-editor',
        controller: ['$scope','$element','$attrs',function($scope,$element,$attrs) {
            $scope.model = $scope[$attrs.ngModel];

            $scope.addTag = function($event) {
                if($event.keyCode === 13) {
                    if($scope.model.tags.indexOf($event.target.value) === -1) {
                        $scope.model.tags.push($event.target.value);
                    }
                    $event.target.value = '';
                }
            }

            $scope.removeTag = function(tag) {
                var index = $scope.model.tags.indexOf(tag);
                if(index > -1) {
                    $scope.model.tags.splice(index,1);
                }
            };
        }]
    }
}])
.directive('pmTagsList',[function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            tagModel: '=ngModel'
        },
        template: '<div class="tags"><span ng-repeat="tag in tagModel.tags" ng-click="searchTag($event)">{{tag}}</span>',
        controller: ['$scope','$element','$location','sSearch',function($scope,$element,$location,sSearch) {
            $scope.searchTag = function($event) {
                sSearch.startSearch($event.target.innerText);
            }
        }]
    }
}]);
