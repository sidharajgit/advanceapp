advancePubapp.directive('loadedImg', function(){
    return {
        restrict: 'A',
      
        link: function(scope, element) {
          element.on('load', function() {
            // Set visibility: true + remove spinner overlay
              element.removeClass('spinner-hide');
              element.addClass('spinner-show');
              //element.parent().find('.loading').remove();
              element.parent().removeClass('preloaderImg');              
          });
          scope.$watch('ngSrc', function() {
            // Set visibility: false + inject temporary spinner overlay
              element.addClass('spinner-hide');
              // element.parent().append('<span class="spinner"></span>');
          });
        }
    };
});