advancePubapp.controller('studentsInClassController', ['$scope', 'sfactory', '$rootScope', 'taskService','$state', '$stateParams','cacheService',function($scope, sfactory, $rootScope, taskService,$state,$stateParams,cacheService) {
    
    $scope.assignc = function(response){
        $scope.assigncontentToClassPage({'response':response});
    }
    
    /* Method to initialize Controller */
    function initializeController() {
        //setTableContent();
    };
    
    function setTableContent() {
        $scope.tableData = $scope.studentsList;
    }
    
    
    initializeController(); 
}]);