advancePubapp.controller('surveyresultsController', ['$scope', 'sfactory', '$rootScope', 'taskService','$state','$filter','sessionService','encryptionService', function($scope, sfactory, $rootScope, taskService,$state,$filter,sessionService,encryptionService) {

    /* method to redirect to content management page */
    $scope.goToContentPage = function() {
        $state.go('adminLanding.contentmanagement',{location: false});
    }
    
    /* Method to get Survey contents */
    function getData() {
        var surveyid = encryptionService.decrypt(sessionService.get('courseSurveyID'));
        localTask = 'surveyresult';
        dataRequest  = {surveyId: surveyid};
        sfactory.serviceCall(JSON.stringify(dataRequest), tasks.getSurveyResult, 'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
            $scope.surveyResult = response.data;
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService(localTask).then(function(response) {
                $scope.surveyResult = response.data;
                $rootScope.appLoader = false;
            }, function(error) {});
        });
    };
    
    
    /* Method to initialize Controller */
    function initializeController() {
       tasks = taskService.getTasks('surveyresultsController');
       getData();
    };

    initializeController();
}]);