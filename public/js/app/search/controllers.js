"use strict";

app.controller('searchCtrl', [
  '$scope',
  '$rootScope',
  '$stateParams',
  'sSearch',
  function ($scope,$rootScope,$stateParams,sSearch) {
    $scope.results = sSearch.results;
    $rootScope.searchQuery = $stateParams.q;
    $rootScope.currentSet = $scope.results;
  }
]);
