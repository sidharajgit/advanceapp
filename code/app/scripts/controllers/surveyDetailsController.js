advancePubapp.controller('surveyDetailsController',['$scope','sfactory','$rootScope','taskService','$state','$stateParams','sessionService','encryptionService','$filter',function($scope,sfactory,$rootScope,taskService,$state,$stateParams,sessionService,encryptionService,$filter){ 
    
    var localTask,dataRequest,tasks,questionHoverText;

    /* Method to add more questions to the Survey*/
    $scope.addMoreQuestions = function(){
        if($scope.survey.questions.length < 6){
            $scope.survey.questions.push({title:''});
            $scope.survey.showDescription.push(false);
            $scope.survey.description.push('');
        }
        else{
            $scope.alertBaner = {message:'Already maximum count 6 reached',banerClass:'alert-danger',showBaner:true};
        }
    };
    
    /* Method to show hover text */
    $scope.hoverIn = function(index){
        angular.forEach($scope.survey.showDescription,function(description,descriptionIndex){
            $scope.survey.showDescription[descriptionIndex] = (descriptionIndex === index);
        });
        $scope.survey.description[index] = (index === 0) ? questionHoverText.thumbs : questionHoverText.rating;
    };
    
    /* Method to hide hover text */
    $scope.hoverOut = function(index){
        $scope.survey.showDescription[index] = false;
    };
    
    /* Method to go back to Add new Survey page*/
    $scope.goBack = function(isClear,param){
        if(isClear){
           sessionService.empty('surveyDetails'); 
        }
        $scope.breadcrumbList.splice(-1,1);
        $state.go('adminLanding.survey',{type:param});
    };
    
     /* Method to select the category */
    $scope.changeCategory = function(index){
       angular.forEach($scope.survey.categories,function(category,categoryIndex){
           category.isSelected = (index === categoryIndex)
       });
    };
    
    /* Method to save the newly created or edited Survey*/
    $scope.saveSurvey = function(){
        var isNewSurvey = ($scope.surveyType == 'add');
        var task = (isNewSurvey) ? tasks.createSurvey : tasks.editSurvey;
        selectedCategory = (isNewSurvey) ? ($scope.survey.type.id) : (_.find($scope.survey.categories, function(category){ return category.isSelected === true; }).id) ;
        dataRequest={
                title : $scope.survey.title,
                category : selectedCategory,
                questions : $scope.survey.questions
        }
        if(!isNewSurvey){
            dataRequest.id = $scope.survey.id;
        }
        sfactory.serviceCall(dataRequest,task,'listDetails').then(function(response) {
                if($filter('lowercase')(response.status) === 'success'){
                    $scope.goBack(true,'');
                    $rootScope.appLoader = false;
                }
            }, function(error) {
                sfactory.localService(localTask).then(function(response) {
                    $scope.goBack(true,'');
                }, function(error) {});
        });
    };
    
    /* Method to get survey details*/
    function getContents(){
        if($stateParams.type === 'add'){
            $scope.survey = angular.fromJson(encryptionService.decrypt(sessionService.get('surveyDetails')));
            $scope.survey.questions = [{title:''}];
            $scope.survey.showDescription=[];
            $scope.survey.description=[];
            $scope.breadcrumbList.push($scope.survey.title);
        }
        else{
            dataRequest = {surveyId:$stateParams.id};
            sfactory.serviceCall(dataRequest,tasks.getSurvey,'listDetails').then(function(response) {
                if($filter('lowercase')(response.status) === 'success'){
                    $scope.survey = response.data;
                    $scope.survey.categories = angular.fromJson(encryptionService.decrypt(sessionService.get('surveyDetails')));
                    $scope.survey.showDescription=[];
                    $scope.survey.description=[];
                    angular.forEach(response.data.questions,function(question,index){
                        $scope.survey.showDescription[index] = false;
                        $scope.survey.description[index] = '';
                    });
                    $scope.breadcrumbList.push($scope.survey.title);
                }
                $rootScope.appLoader = false;
                }, function(error) {
                    sfactory.localService(localTask).then(function(response) {
                        $scope.survey = response.data.surveydetails;
                        $scope.survey.categories = angular.fromJson(encryptionService.decrypt(sessionService.get('surveyDetails')));
                        $scope.survey.showDescription=[];
                        $scope.survey.description=[];
                        angular.forEach(response.data.questions,function(question,index){
                            $scope.survey.showDescription[index] = false;
                            $scope.survey.description[index] = '';
                        });
                        $scope.breadcrumbList.push($scope.survey.title);
                    }, function(error) {});
                });
        }
        
    };
    
    /* Method to initialize the controller*/
    function initializeController(){
        localTask = 'survey';
        tasks = taskService.getTasks('surveyController');
        $scope.surveyType = $stateParams.type;
        $scope.survey={};
        $scope.surveyForm={};
        getContents();
        questionHoverText={thumbs:'Default First Question answers will be thumbs up and down',rating:'Default answers will be the rating choice'};
    };
    
    initializeController();
}]);