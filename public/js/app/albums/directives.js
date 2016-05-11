"use strict";

app.directive('pmCoverSelector',function() {
  return {
    restrict: 'C',
    template: '<img rel="{{ photo._id }}" ng-src="{{ photo.filepath }}" class="clickable" />',
    link: function(scope, element, attrs, controller) {
      if(scope.album.cover && scope.album.cover._id === scope.photo._id)
        element.addClass('selected');

      element.on('click',function() {
        // Select element
        element.parent().children().removeClass('selected');
        element.addClass('selected');

        scope.album.cover = scope.photo._id;
      });
    }
  }
});
