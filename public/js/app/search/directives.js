"use strict";

app.directive('pmSearchField',['$location',function($location) {
  return {
    restrict: 'E',
    replace: true,
    template: '<form class="search_wrapper glyphicon glyphicon-search"><input class="search" ng-model="searchQuery" placeholder="Search..." /></form>',
    link: function(scope, element, attributes) {
      element.on('submit',function($event) {
        $location.path('/search');
        $location.search('q',scope.searchQuery);
        scope.$apply();
      });
    }
  }
}]);
