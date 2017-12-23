advancePubapp.controller('categoryEditController',['$scope','sfactory', function($scope,sfactory){
    $scope.data = angular.copy($scope.contentBody);
    /* Method to submit update/edit values of user */
    $scope.category_update_cancel = function(body){
        $scope.contentBody.showChild = false;
    },
    
    $scope.categoryedit = function(catdata){
        $scope.contentBody.name=catdata.name;
        $scope.contentBody.description=catdata.description;
        $scope.contentBody.showChild = false;
        $scope.$emit("editvalues",{edit:catdata});
        
    }
    
}]);