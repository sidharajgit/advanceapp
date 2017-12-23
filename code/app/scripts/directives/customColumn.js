advancePubapp.directive('customColumn', function ($sce) {
    function link(scope, element, attrs){
    }
    return {
        restrict: "EA",
        //templateUrl:templateURL+"dest/templates/accordionPanel.html",
        templateUrl:function(element,attr){
           return $sce.trustAsResourceUrl(templateURL+attr.templateUrl)
        },
        controller: "@",
        name:"controllerName",
        link:link,
        scope:{
            contentBody:"=",
            contentHead:"=",
            contentItems:"=",
            emitbaner: '&',
			setback: "&",
			totalRecords:"=",
			updateparentpage: "&",
            assigncontentToTable:"&",
			isHeader:"@",
            removeuserfromtable:"&"
        }
  };
});