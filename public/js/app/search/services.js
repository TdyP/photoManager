"use strict";
app.factory('sSearch',['$http','$location','$rootScope',function($http,$location,$rootScope) {
  var serv = {
    results: [],

    /**
     * Retrieve search results
     * @param  {object} params Should be {q: "query string"}
     * @return {Promise}
     */
    getResults: function(params) {
      return $http.get('/api/photos',{params: params}).success(function(data) {
        angular.copy(data, serv.results);
      });
    },

    /**
     * Redirect to search page with query params
     * @param  {string} query  The search terms
     * @param  {string} target Album, photos or both if unspecified
     */
    startSearch: function(query, target) {
      $location.path('/search');
      $location.search('q',query);

      if(target) {
        $location.search('t',target);
      }
    }
  };

  return serv;
}]);
