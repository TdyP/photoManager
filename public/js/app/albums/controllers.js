"use strict";

app.controller('editAlbumCtrl', [
  '$scope',
  '$stateParams',
  '$location',
  '$state',
  '$filter',
  'sAlbums',
  function ($scope,$stateParams,$location,$state,$filter,sAlbums) {
    if($stateParams.albumId) {
      // Load album data
      $scope.album = sAlbums.album;
      if($scope.album.date) {
        $scope.album.date = new Date($scope.album.date);
      }
    }
    else {
      // Init new album
      $scope.album = {};
      $scope.album.tags = [];
    }

    $scope.save = function() {
      sAlbums.save($scope.album);
    }

    $scope.cancel = function() {
      $location.path('/');
    }

    $scope.datePopup = {
      opened: false
    };

    $scope.openDatePopup = function() {
      $scope.datePopup.opened = true;
    }
  }
]);

app.controller('viewAlbumCtrl', [
  '$scope',
  '$stateParams',
  'sAlbums',
  function ($scope,$stateParams,sAlbums) {
    $scope.album = sAlbums.album;

    $scope.deleteAlbum = function() {
      sAlbums.confirmAndDelete($scope.album._id);
    }
  }
]);
