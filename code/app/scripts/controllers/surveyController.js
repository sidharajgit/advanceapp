advancePubapp.controller('surveyController',['$scope','sfactory','$rootScope','taskService','$state','$stateParams','sessionService','encryptionService','$mdDialog','$filter',function($scope,sfactory,$rootScope,taskService,$state,$stateParams,sessionService,encryptionService,$mdDialog,$filter){ 
    
    var localTask,survey,questionHoverText;
    
    /* Method to add new Survey */
    $scope.addNewSurvey = function(value){
        if(!value){
            $scope.survey.title ='';
            $scope.changeCategory(0);
        }
        var params = (value === true) ? {type:'new'} : {type:''};
        $scope.survey.addNew = value;
        $state.transitionTo('adminLanding.survey',params,{
            location: true,
            inherit: true,
            relative: $state.$current,
            notify: false
        });
    };
    
    /*Method to delete Survey*/
    $scope.deleteSurvey = function(index){
        var confirm = $mdDialog.confirm()
              .title('Are you sure you want to delete the survey?')
              .textContent('')
              .ariaLabel('Lucky day')
              .targetEvent()
              .ok('Ok')
              .cancel('Cancel');
                $mdDialog.show(confirm).then(function() {
                    dataRequest={surveyid : $scope.survey.list[index].id};
                    sfactory.serviceCall(dataRequest,tasks.deleteSurvey,'listDetails').then(function(response) {
                        if($filter('lowercase')(response.status) === 'success'){
                            $scope.survey.list.splice(index, 1);
                            showBanner(response.message,response.status);
                            $rootScope.appLoader = false;
                        }
                    }, function(error) {
                        sfactory.localService(localTask).then(function(response) {
                           $scope.survey.list.splice(index, 1);
                           showBanner(response.message,response.status);
                        }, function(error) {});
                    });
                }, function() {
                   
                });
    };
    
    /* Method to select the category */
    $scope.changeCategory = function(index){
       angular.forEach($scope.survey.categories,function(category,categoryIndex){
           category.isSelected = (index === categoryIndex);
       });
       survey.selectedType = $scope.survey.categories[index];
    };
    
    /* Method to show notification */
    function showBanner(message,status){
        var banerData = {};
        banerData.message = message;
        banerData.banerClass = ($filter('lowercase')(status) === 'success') ? 'alert-success' : 'alert-danger';
        banerData.showBaner=true;
        $scope.alertBaner = angular.copy(banerData);
    };
    
        /* Method to check the availibility of selected category */
    $scope.checkAvalibility = function(index){
       var surveyList = _.filter($scope.survey.list, function(survey){ return survey.categoryName== $scope.survey.list[index].categoryName && $scope.survey.list[index].id !== survey.id;});
        var activityStatusObject = _.countBy(_.pluck(surveyList, 'enable'), function(value) {
            return value === true ? 'true' : 'false';
        });
        if(activityStatusObject.true > 0){
            var confirm = $mdDialog.confirm()
              .title('Already \''+surveyList[0].title+'\' is enabled for category - \''+surveyList[0].categoryName+'\' .Do you want to change it now?')
              .textContent('')
              .ariaLabel('Lucky day')
              .targetEvent()
              .ok('Ok')
              .cancel('Cancel');
                $mdDialog.show(confirm).then(function() {
                    changeSurveyStatus(index,true);
                }, function() {
                   $scope.survey.list[index].enable = false; 
                });
        }
        else{
            changeSurveyStatus(index,false);
        }
    };
    
    /* Method to enable or disable survey*/
    function changeSurveyStatus(index,isOverwrite){
        var selectedSurvey = $scope.survey.list[index];
        dataRequest={
            surveyid : selectedSurvey.id,
            enable : selectedSurvey.enable
        };
        sfactory.serviceCall(dataRequest,tasks.enableSurvey,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) === 'success' && isOverwrite){
                angular.forEach($scope.survey.list,function(survey,surveyIndex){
                    if(surveyIndex !== index && survey.categoryName === selectedSurvey.categoryName){
                        survey.enable = false;
                    }
                });
            }
            showBanner(response.message,response.status);
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService(localTask).then(function(response) {
                if(isOverwrite){
                    angular.forEach($scope.survey.list,function(survey,surveyIndex){
                        if(surveyIndex !== index && survey.categoryName === selectedSurvey.categoryName){
                            survey.enable = false;
                        }
                    });
                }
            }, function(error) {});
        });
    };
    
    /* Method to view or edit Survey */
    $scope.viewEditSurvey = function(index,param){ 
        var categoryIndex = _.findLastIndex($scope.survey.categories, {id: $scope.survey.list[index].categoryId});
        $scope.changeCategory(categoryIndex);
        sessionService.set('surveyDetails',encryptionService.encrypt(JSON.stringify($scope.survey.categories)));
        $state.go('adminLanding.surveyDetails',{type:param,id:$scope.survey.list[index].id});
    };
    
    /* Method to add new Survey */
    $scope.addSurvey = function(){                                          sessionService.set('surveyDetails',encryptionService.encrypt(JSON.stringify({title:$scope.survey.title,type:survey.selectedType})));
        $state.go('adminLanding.surveyDetails',{type:'add'});
    };
    
    /* Method to show hover text */
    $scope.hoverIn = function(index){
        angular.forEach($scope.survey.question.showDescription,function(description,descriptionIndex){
            $scope.survey.question.showDescription[descriptionIndex] = (descriptionIndex === index);
        });
        $scope.survey.question.description[index] = (index === 0) ? questionHoverText.thumbs : questionHoverText.rating;
    };
    
    /* Method to hide hover text */
    $scope.hoverOut = function(index){
        $scope.survey.question.showDescription[index] = false;
    };

    /* Method to get Survey list */
    function getSurveyList(){
        var categorySectionIndex = 0;
        sfactory.serviceCall(dataRequest,tasks.getSurveyList,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) === 'success'){
                $scope.survey.list = response.data.surveys;
                $scope.survey.categories = response.data.categories;
                survey.selectedType = $scope.survey.categories[0];
                $scope.survey.addNew = ($stateParams.type === 'new');
                if(sessionService.get('surveyDetails') !== null && $stateParams.type === 'new'){
                    var surveyDetails = angular.fromJson(encryptionService.decrypt(sessionService.get('surveyDetails')));
                    $scope.survey.title = surveyDetails.title;
                    categorySectionIndex = _.findIndex($scope.survey.categories, {id:surveyDetails.type.id});
                }
                $scope.survey.categories[categorySectionIndex].isSelected = true;
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService(localTask).then(function(response) {
                $scope.survey.list = response.data.surveys;
                $scope.survey.categories = response.data.categories;
                survey.selectedType = $scope.survey.categories[0];
                $scope.survey.addNew = ($stateParams.type === 'new');
                if(sessionService.get('surveyDetails') !== null && $stateParams.type === 'new'){
                    var surveyDetails = angular.fromJson(encryptionService.decrypt(sessionService.get('surveyDetails')));
                    $scope.survey.title = surveyDetails.title;
                    categorySectionIndex = _.findIndex($scope.survey.categories, {id:surveyDetails.type.id});
                }
                $scope.survey.categories[categorySectionIndex].isSelected = true;
            }, function(error) {});
        });
    };
    
    /* Method to initialize the controller*/
    function initializeController(){
        localTask = 'survey';
        dataRequest={};
        questionHoverText={thumbs:'Default First Question answers will be thumbs up and down',rating:'Default answers will be the rating choice'};
        tasks = taskService.getTasks('surveyController');
        $scope.survey={addNew: $stateParams.index === 'new',viewAll:true,question:{}};
        survey={};
        getSurveyList();
    };
    
    initializeController();
}]);