"use strict";

app.controller('viewCtrl', [
  '$scope',
  '$rootScope',
  '$stateParams',
  '$http',
  '$location',
  'sPhotos',
  function ($scope,$rootScope,$stateParams,$http,$location,sPhotos) {
    var prevId, nextId;
    $scope.photo = sPhotos.photo;

    // console.log($rootScope.currentSet);

    // Retrive prev/next photo in album
    // TODO: use service getOne
    if($stateParams.a) {
      var albumData = $http.get('/api/albums/'+$stateParams.a).success(function(data) {
        for(var i in data.photos) {
          if(data.photos[i]._id == $scope.photo._id) {
            if(data.photos[parseInt(i)-1] !== undefined) {
              prevId = data.photos[parseInt(i)-1]._id;
            }

            if(data.photos[parseInt(i)+1] !== undefined) {
              nextId = data.photos[parseInt(i)+1]._id;
            }

            break;
          }
        }

        //TODO cleaner way to build URL
        var viewUrl = '#/view/';
        if(prevId) {
          $scope.photo.prevUrl = viewUrl+prevId+"?a="+$stateParams.a;
        }

        if(nextId) {
          $scope.photo.nextUrl = viewUrl+nextId+"?a="+$stateParams.a;
        }
      })
    }

    $scope.deletePhoto = function(photoId) {
      sPhotos.confirmAndDelete(photoId);
    }
  }
]);

app.controller('editCtrl', [
  '$scope',
  '$stateParams',
  'sPhotos',
  function ($scope,$stateParams,sPhotos) {
    $scope.photo = sPhotos.photo;

    $scope.update = function() {
      sPhotos.update($scope.photo);
    }
  }
]);

app.controller('uploadCtrl', [
  '$scope',
  '$stateParams',
  'FileUploader',
  'sAlbums',
  function ($scope,$stateParams,FileUploader,sAlbums) {
    $scope.albums = sAlbums.albums;

    var uploader = $scope.uploader = new FileUploader({
      url: '/api/photos',
      alias: 'photos'
    });

    uploader.onAfterAddingFile = function(item) {
        item.name = item.file.name;
    };

    uploader.onBeforeUploadItem = function(item) {
        //TODO : add name, description, album, tags....

        item.formData.push({
          name: item.name,
          description: item.description !== undefined ? item.description : "",
          album: $scope.selectedAlbum
        });
    };
  }
]);
