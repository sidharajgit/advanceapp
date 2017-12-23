advancePubapp.controller('surveymanagementControllerbk',['$scope','sfactory','$mdDialog','$rootScope','$filter',function($scope,sfactory,$mdDialog,$rootScope,$filter){ 

    var banerData,questionTypeOptions,surveyServices,localTask,newQuestions; 
    /* Method called when click on new survey */
    $scope.addNewSurvey= function(){
        $scope.survey.completed = false;
        $scope.survey.newSurvey.addNew = true;
        $scope.survey.newSurvey.isEditable = false;
        $scope.survey.newSurvey.title="";
        $scope.survey.view =false;
        $scope.editIndex = null;
        $scope.toggle = {};
    }; 
    
    /* Method called on cancel click */
    $scope.cancel = function(){
        $scope.survey.newSurvey.isEditable  =false;
        $scope.survey.completed = true;
        $scope.survey.newSurvey.addNew = false;
        $scope.toggle = {};
        $scope.survey.addQuestionToSurvey = false;
    };
    
    /* Method to verify the new survey name*/
    $scope.verifySurveyName = function(){
        var serviceDataReq ={title:$scope.survey.newSurvey.title};
        sfactory.serviceCall(serviceDataReq, surveyServices.surveyExist,surveyServices.type).then(function(response) {
            if(angular.isDefined(response)){
                if($filter('lowercase')(response.status) === 'success'){
                   selectQuestionType();
                }
                else{
                    showBanner(response.message,response.status);
                    $scope.survey.newSurvey.title ="";
                }
            }
            $rootScope.appLoader = false;
        }, function(error) {
                sfactory.localService(localTask).then(function(response) {
                    selectQuestionType();
                }, function(error) {
                });
            }); 
    };
    
    /* Method to open list when click on edit button */
    $scope.editQuestion = function(index){
        $scope.toggle['list'+(index+1)] = angular.copy(!$scope.toggle['list'+(index+1)]);
        $scope.form.survey.save.$setPristine();
        $scope.form.survey.save.$setUntouched();
        
    };
    
    /* Method to start adding new questions to the survey */
     function selectQuestionType(){
        $scope.editSurveyData={title:angular.copy($scope.survey.newSurvey.title),questions:[]};
        $scope.survey.newSurvey.isEditable = true;
        $scope.survey.newSurvey.addNew = false;
    };
    
    /* Method to open edit survey screen*/
    $scope.editSurvey= function(index){
        if($scope.surveyData.surveys[index].users_count !== 0) { return false;};
        $scope.editIndex=index;
        $scope.survey.newSurvey.isEditable = true;
        $scope.survey.addQuestionToSurvey = false;
        $scope.editSurveyData = angular.copy($scope.surveyData.surveys[index]);
        
        $scope.isActive = false;
        $scope.isActive = !$scope.isActive;
    };
  
    /* Method to show view survey screen*/
    $scope.viewSurvey = function(index){
        $scope.survey.completed = false;
        $scope.survey.view = true;
        $scope.viewIndex = index;
    };
    
    /* Method to exit view survey screen*/
    $scope.exitViewSurvey = function(){
        $scope.survey.completed = true;
        $scope.survey.view = false;
    };
    
    /* Method to close notification banner*/
    $scope.closeBaner = function(){
        $scope.alertBaner.showBaner = false;
    };
    
    /* Method to show notification */
    function showBanner(message,status){
        banerData.message = message;
        banerData.banerClass = ($filter('lowercase')(status) === 'success') ? 'alert-success' : 'alert-danger';
        banerData.showBaner=true;
        $scope.alertBaner = angular.copy(banerData);
    }
    
    /* Method to add new questions to the display area */
    function addToDisplay(newQuestion){
        var questionObj ={},item ={};
        newQuestion.quest_options=[];
        _.each(newQuestion.options,function(obj,index){
            item.id=index;
            item.title=obj;
            newQuestion.quest_options.push(item);
            item={};
        });
        questionObj.type_id = newQuestion.quest_type ;
        questionObj.title = newQuestion.quest_title;
        questionObj.options =newQuestion.quest_options;
        $scope.editSurveyData.questions.push(questionObj);
    };
    
     /* Method to add new survey*/
    $scope.addNewQuestion = function(){
        var newQuestion={};
        $scope.survey.addQuestionToSurvey = true;
        $scope.survey.addQuestionToSurvey = false;
        newQuestion.quest_title = $scope.survey.newSurvey.newquestion.question;
        newQuestion.quest_type =  _.find($scope.surveyData.questionstypes, function(obj){ return obj.type == $scope.survey.newSurvey.newquestion.questionType;}).id;
        newQuestion.options=_.pluck($scope.survey.newSurvey.newquestion.optnsCount,'value');
        addToDisplay(newQuestion);
        $scope.survey.newSurvey.newquestion ={};
    };
    
    /* Method to save new survey*/
    $scope.saveSurvey = function(){
        if(_.isNull($scope.editIndex)){
            saveNewSurvey();
        }
        else{
            saveEditedSurvey();
        }
    };
    
    function saveEditedSurvey(){
        $scope.survey.addQuestionToSurvey = false;
        var item={},data;
        var updatedData = angular.copy($scope.editSurveyData);
        var serviceDataReq = {
            id:updatedData.id,
            title:updatedData.title,
            questions:[]
        }
        _.each($scope.surveyData.surveys[$scope.editIndex].questions,function(obj,index){
            if(!_.isEqual(obj, $scope.editSurveyData.questions[index])){
                data =angular.copy($scope.editSurveyData.questions[index]);
                item.id = data.id;
                item.type_id = data.type_id;
                item.title = data.title;
                item.options = data.options;
                serviceDataReq.questions.push(item);
                item={};
            }
        });
        for(var i=$scope.surveyData.surveys[$scope.editIndex].questions.length;i<$scope.editSurveyData.questions.length;i++){
            var question = angular.copy($scope.editSurveyData.questions[i]);
            item.id = 0;
            item.type_id = question.type_id;
            item.title=question.title;
            item.options = _.pluck(question.options,'title');
            serviceDataReq.questions.push(item);
            item={};
        }
        sfactory.serviceCall(serviceDataReq , surveyServices.editSurvey,surveyServices.type).then(function(response) {
            if(angular.isDefined(response)){
                showBanner(response.message,response.status);
                if($filter('lowercase')(response.status) === 'success'){
                    $scope.surveyData.surveys[$scope.editIndex] = angular.copy(response.data);
                    $scope.cancel();
                }
            }
            $rootScope.appLoader = false;
        }, function(error) {
                $scope.surveyData.surveys[$scope.editIndex] = $scope.editSurveyData;
                $scope.cancel();
            });
    };
    
    /* Method to save new survey*/
    function saveNewSurvey(){
        var serviceDataReq = angular.copy($scope.editSurveyData);
        _.each(serviceDataReq.questions,function(obj){
            obj.options = _.pluck(obj.options,'title');
        })
        sfactory.serviceCall(serviceDataReq , surveyServices.addSurvey,surveyServices.type).then(function(response) {
            if(angular.isDefined(response)){
                showBanner(response.message,response.status);
                if($filter('lowercase')(response.status) === 'success'){
                    $scope.surveyData.surveys.push(response.data);
                    $scope.cancel();
                }
            }
            $rootScope.appLoader = false;
        }, function(error) {
                $scope.surveyData.surveys.push($scope.editSurveyData);
                $scope.cancel();
            });
    };

    $scope.showNewQuestionForm = function(){
        $scope.survey.newSurvey.newquestion={};
        $scope.survey.addQuestionToSurvey=true;
    };
    
    $scope.cancelAddQuestion= function(){
        $scope.survey.addQuestionToSurvey=false;
    };
    
    /* Method to delete survey or delete question from a survey*/
    $scope.delete = function(index, type) {
        if($scope.surveyData.surveys[index].users_count !== 0) { return false;};
        var confirm = $mdDialog.confirm()
            .title('Are you sure want to delete the ' + type + '?')
            .textContent('')
            .ariaLabel('Lucky day')
            .ok('Delete')
            .cancel('Cancel');
            $mdDialog.show(confirm).then(function() {
                if(_.isNull($scope.editIndex) || angular.isDefined($scope.surveyData.surveys[$scope.editIndex].questions[index])){
                    deleteItem(index,type);
                }
                else{
                    $scope.editSurveyData.questions.splice(index, 1);
                }
            }, function() {
            });
    };
    
    function deleteItem(index,type){
            var serviceName = (type === 'Survey') ? surveyServices.deleteSurvey : surveyServices.deleteQuestion;
            var data = (type === 'Survey') ? {
                surveyid: $scope.surveyData.surveys[index].id
            } : {
                surveyid: $scope.surveyData.surveys[$scope.editIndex].id,
                questionid: $scope.surveyData.surveys[$scope.editIndex].questions[index].id
            };
            sfactory.serviceCall(data, serviceName, surveyServices.type).then(function(response) {
                if (angular.isDefined(response)) {
                    showBanner(response.message, response.status);
                    if ($filter('lowercase')(response.status) === 'success') {
                        if (type === 'Survey') {
                            $scope.survey.newSurvey.isEditable = false;
                            $scope.surveyData.surveys.splice(index, 1);
                        } else {
                            $scope.surveyData.surveys[$scope.editIndex].questions.splice(index, 1);
                            $scope.editSurveyData.questions.splice(index, 1);
                            if($scope.editSurveyData.questions.length === 0){
                                $scope.survey.newSurvey.isEditable = false;
                                $scope.survey.completed = true;
                                $scope.surveyData.surveys.splice($scope.editIndex, 1);
                            }
                        }
                    }
                }
                $rootScope.appLoader = false;
            }, function(error) {
                if (type === 'Survey') {
                    $scope.survey.newSurvey.isEditable = false;
                    $scope.surveyData.surveys.splice(index, 1);
                } else {
                    $scope.surveyData.surveys[$scope.editIndex].questions.splice(index, 1);
                    $scope.editSurveyData.questions.splice(index, 1);
                    if($scope.editSurveyData.questions.length === 0){
                        $scope.survey.newSurvey.isEditable = false;
                        $scope.survey.completed = true;
                        $scope.surveyData.surveys.splice($scope.editIndex, 1);
                    }
                }
            });
    };
    /* Method to display choice options according to the option count*/
    $scope.getOptionCount = function(){
        $scope.form.survey.save.$setPristine();
        $scope.form.survey.save.$setUntouched();
        $scope.survey.newSurvey.newquestion.optnsCount =[];
        var item={};
         var optnCount=_.find(questionTypeOptions, function(obj){ return obj.type === $scope.survey.newSurvey.newquestion.questionType;}).options;
        _.each(new Array(optnCount).fill(0),function(obj,index){
            item.name = index;
            item.value="";
            $scope.survey.newSurvey.newquestion.optnsCount.push(item);
            item={};
        });
    };
    
    /* Method to fetch survey details and question types on initial load*/
    function getSurveyList(){
         sfactory.serviceCall({}, surveyServices.surveyList,surveyServices.type).then(function(response) {
                if(angular.isDefined(response)){
                   $scope.surveyData = response.data;
                   $scope.questionType =_.pluck(response.data.questionstypes, "type");
                }
            $rootScope.appLoader = false;
        }, function(error) {
                sfactory.localService(localTask).then(function(response) {
                    $scope.surveyData = response.data;
                    $scope.questionType =_.pluck(response.data.questionstypes, "type");
                }, function(error) {
                });
        });
    };
    
    /* Method to initialize the controller*/
    function initilizeController(){
        $scope.form = {};
        $scope.survey={completed:true,new:false,addQuestionToSurvey:false,newSurvey:{isEditable:false}};
        $scope.isArray = angular.isArray;
        banerData = {message:'',showBaner:false,banerClass:''};
        
        //Variable to match the question type and option count
         questionTypeOptions = [
            {type : "Multi-Choice",options:4},
            {type : "Fill-In",options:0},
            {type : "Either-Option",options:2}
        ];
        
        //Varible to match webservices
        surveyServices ={
            surveyList      :'survey.survey_list',
            deleteSurvey    :'survey.delete_survey',
            deleteQuestion  :'survey.survey_remove_question',
            addSurvey       :'survey.add_survey',
            surveyExist     :'survey.survey_exist',
            editSurvey      :'survey.edit_survey',
            type            :'listDetails'
        };
        $scope.editIndex = null;
        $scope.toggle = {};
        //Local task initialization
        localTask = "survey";
        
        getSurveyList();
    };
    
    initilizeController();
}]);