advancePubapp.directive('alertBanner', function () {
    return {
        restrict: 'E',
        templateUrl:'dest/templates/alertBanner.html',
        scope: {
            data: "="
        },
        link:function(scope, elem, attrs) {
            scope.closeBaner = function(){
                scope.data.showBaner = false;
            };
        }
    };
});