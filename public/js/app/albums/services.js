app.factory('sAlbums', ['$http','$location',function($http,$location) {
  function goToAlbumPage(albumId) {
    return $location.path('/album/view/'+albumId);
  }

  var serv = {
    albums: [],
    album: {},
    getAll: function() {
      return $http.get('/api/albums').success(function(data) {
        angular.copy(data, serv.albums);
      });
    },
    getOne: function(albumId) {
      if(albumId)
        return $http.get('/api/albums/'+albumId).success(function(data) {
          angular.copy(data, serv.album);
        });
      else
        return false;
    },
    save: function(album) {
      if(album._id) {
        return $http.put('/api/albums/'+album._id,album).success(function(data) {
          goToAlbumPage(data._id);
        });
      }
      else {
        return $http.post('/api/albums/',album).success(function(data) {
          goToAlbumPage(data._id);
        });
      }
    },
    confirmAndDelete : function(albumId) {
      if(window.confirm('Are you sure?')){
        return $http.delete('/api/albums/'+albumId).success(function(data) {
          $location.path('/');
        });
      }
      else {
        return false;
      }
    },
  };

  return serv;
}]);
