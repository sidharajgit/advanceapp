advancePubapp.directive('childTable', function ($sce) {
    function link(scope, element, attrs){
    }
    return {
        restrict: "EA",
        //templateUrl:templateURL+"dest/templates/accordionPanel.html",
        templateUrl:function(element,attr){
           return $sce.trustAsResourceUrl(templateURL+attr.templateUrl)
        },
        controller:"accordionController",
        controllerAs: 'acc',
        link:link,
        scope:{
            contentBody:"=",
            contentItems:"=",
			selectedFilterTab:"="
        }
  };
}); 