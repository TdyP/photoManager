"use strict";

var app = angular.module('photoManager',['ui.router','angularFileUpload','ngAnimate','ngAria','hj.gridify','ui.bootstrap'])
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: '/partial/home',
          controller: 'homeCtrl',
          resolve: {
            // photos: ['sPhotos', function(sPhotos){
            //   return sPhotos.getAll();
            // }],
            albums: ['sAlbums', function(sAlbums){
              return sAlbums.getAll();
            }]
          }
        })
        .state('view', {
          url: '/view/{photoId}?a',
          templateUrl: '/partial/photos/view',
          controller: 'viewCtrl',
          resolve: {
            photos: ['sPhotos','$stateParams', function(sPhotos,$stateParams){
              return sPhotos.getOne($stateParams.photoId);
            }]
          }
        })
        .state('edit', {
          url: '/edit/{photoId}',
          templateUrl: '/partial/photos/edit',
          controller: 'editCtrl',
          resolve: {
            photos: ['sPhotos','$stateParams', function(sPhotos,$stateParams){
              return sPhotos.getOne($stateParams.photoId);
            }]
          }
        })
        .state('upload', {
          url: '/upload',
          templateUrl: '/partial/photos/upload',
          controller: 'uploadCtrl',
          resolve: {
            albums: ['sAlbums','$stateParams', function(sAlbums,$stateParams){
              return sAlbums.getAll();
            }]
          }
        })
        .state('edit_album', {
          url: '/album/edit/:albumId?',
          templateUrl: 'partial/albums/edit',
          controller: 'editAlbumCtrl',
          resolve: {
            albums: ['sAlbums','$stateParams', function(sAlbums,$stateParams){
              return sAlbums.getOne($stateParams.albumId);
            }]
          }
        })
        .state('view_album', {
          url: '/album/view/{albumId}',
          templateUrl: 'partial/albums/view',
          controller: 'viewAlbumCtrl',
          resolve: {
            albums: ['sAlbums','$stateParams', function(sAlbums,$stateParams){
              return sAlbums.getOne($stateParams.albumId);
            }]
          }
        })
        .state('search_result', {
          url: '/search?q',
          templateUrl: 'partial/search/result',
          controller: 'searchCtrl',
          resolve: {
            resultsPhotos: ['sSearch','$stateParams', function(sSearch,$stateParams){
              return sSearch.getResults($stateParams,'photos');
            }],
            resultsAlbums: ['sSearch','$stateParams', function(sSearch,$stateParams){
              return sSearch.getResults($stateParams,'photos');
            }],
          }
        });

      $urlRouterProvider.otherwise('home');
    }
  ])
  .run(['$rootScope','$window',function($rootScope,$window) {
    $rootScope.$on('$stateChangeSuccess', function(event, to, toParams, from, fromParams) {
      $rootScope.$previousState = from; // Save previous state
      $window.scrollTo(0,0); // Scroll to top on state change

      if(to.name !== "search_result") {
        $rootScope.searchQuery = ''; // Empty search field when we leave search result
      }
    });
  }]);

// Home controller
app.controller('homeCtrl', [
  '$scope',
  '$stateParams',
  'sPhotos',
  'sAlbums',
  function ($scope,$stateParams,sPhotos,sAlbums) {
    $scope.photosList = sPhotos.list;
    $scope.albums = sAlbums.albums;
  }
]);
