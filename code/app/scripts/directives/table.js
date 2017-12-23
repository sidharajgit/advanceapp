advancePubapp.directive('tableDiv', function () {
    function link(scope, element, attrs){
        /*scope.$watchcollection(scope.datasource.data,function (newVal,oldVal) {
            scope.datasource.data = newVal;
        })*/
    }
    return {
        restrict: "EA",
        templateUrl:templateURL+"dest/templates/tabledirective.html",
        controller:"tabledirectiveController",
        link:link,
        scope:{
            datasource:"=",
            crossicon:"=",
            getSourcedata:"&",
			closeregisteration: "&",
            datatable: "=",
            paginationdata:"="
        }
  };
}).directive('serverTableDiv', function () {
    function link(scope, element, attrs){
        /*scope.$watchcollection(scope.datasource.data,function (newVal,oldVal) {
            scope.datasource.data = newVal;
        })*/
    }
    return {
        restrict: "EA",
        templateUrl:templateURL+"dest/templates/servertabledirective.html",
        controller:"servertabledirectiveController",
        link:link,
        scope:{
            datasource:"=",
            crossicon:"=",
            getSourcedata:"&",
			closeregisteration: "&",
            datatable: "=",
			buttonupdate: "&",
			assigncc:"&"
        }
  };
}) 

 