app.factory('sPhotos', ['$http','$location',function($http,$location) {
  var serv = {
    list: [],
    photo: {},
    getAll : function() {
      return $http.get('/api/photos').success(function(data) {
        angular.copy(data, serv.list);
      });
    },
    getOne : function(photoId) {
      return $http.get('/api/photos/'+photoId).success(function(data) {
        angular.copy(data, serv.photo);
      });
    },
    confirmAndDelete : function(photoId) {
      if(window.confirm('Are you sure?')){
        return $http.delete('/api/photos/'+photoId).success(function(data) {
          $location.path('/');
        });
      }
      else {
        return false;
      }
    },
    update: function(photo) {
      return $http.put('/api/photos/'+photo._id,photo).success(function(data) {
        $location.path('/view/'+photo._id);
      });
    }
  };

  return serv;
}]);
