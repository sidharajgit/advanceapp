advancePubapp.controller('studentDashboardCtrl', ['$scope', '$rootScope','phonicsajaxFactory', 'taskService','$state','$filter', '$stateParams','cacheService',function($scope, $rootScope, phonicsajaxFactory, taskService,$state,$filter,$stateParams,cacheService) {
    
    $scope.studentAssignment ={};
    $scope.activeScreen = 'assignments';
    var studentAssignment={};
    $scope.Activities = [];
    $scope.selection ={
        selectedTab:'1',
        selectedSub:'pa',
        selectedAct:'All',
        filter:'All',
        selectedAssign:'grpAssign',
        category:'Phonics Adventure'
     };
     $scope.individualAssignments ={};


    $scope.selectTab = function(select){
        $scope.selection.selectedTab = select;
    }

    $scope.selectCat = function(select, index){
         $scope.selection.category = select;
          $scope.Activities =[];
         $scope.courses =  $scope.displayAssignmentData.categories[index].courses;

        $scope.generateActivity($scope.courses);
    }
    $scope.generateActivity= function(courses){

     for(var i =0;i< courses.length;i++){            
            for(var j=0;j< courses[i].sections.length;j++){
                for(var k=0;k<courses[i].sections[j].lessons.length;k++){
                    for(var l=0;l<courses[i].sections[j].lessons[k].activities.length;l++){
                        if(courses[i].sections[j].lessons[k].activities[l].isadded){
                            $scope.Activities.push(courses[i].sections[j].lessons[k].activities[l]);
                        }
                        
                    }
                }
            }
         }
    }
    

    $scope.selectAct = function(select){
        $scope.selection.selectedAct =select; // for view
        $scope.selection.filter = select; // for view all
    }
   
    $scope.selectAssignment = function(select, id){
        $scope.selection.selectedAssign = select;
        //make an API call for all assignments        
        phonicsajaxFactory.serviceCall({"type":select,"id":id}, studentAssignment.getAssignment).then(function(response) {
            if(angular.isDefined(response)){
                   console.log(response)
                    $scope.studentAssignment = response.data;
                    $scope.assignmentCat($scope.selection.selectedAssign);
                }
                $rootScope.appLoader = false;
              }, function(error) {
               phonicsajaxFactory.localService('studentAssignment').then(function(response) {
                 $scope.studentAssignment = response.data;
                  console.log(response)
                }, function(error) {
                    console.log(error);
               });
        });
    }

    $scope.getAssignmentActivity = function(tab){

      phonicsajaxFactory.serviceCall({"type": $scope.selection.selectedAssign,"id":tab.id}, studentAssignment.getAssignment).then(function(response) {
            if(angular.isDefined(response)){
                     $scope.studentAssignment = response.data;
                     if(response.data.categories.length){
                        $scope.courses = response.data.categories[0].courses;
                     }else{
                        $scope.courses =[];
                        $scope.Activities =[];
                     }
                     
                }
                $rootScope.appLoader = false;
              }, function(error) {
               phonicsajaxFactory.localService('studentAssignment').then(function(response) {
                 $scope.studentAssignment = response.data;
                  console.log(response)
                }, function(error) {
                    console.log(error);
               });
        });
    }

    $scope.assignmentCat = function(assign){
          switch(assign) {
                case 'class':
                    phonicsajaxFactory.bufferedData.assignment =  $scope.studentAssignment.classAssignments;
                    phonicsajaxFactory.bufferedData.assignment.type="class"
                    $state.go('viewAll');
                    break;
                case 'group':
                     phonicsajaxFactory.bufferedData.assignment =  $scope.studentAssignment.groupAssignments;
                     phonicsajaxFactory.bufferedData.assignment.type="group"
                     $state.go('viewAll');
                    break;
                case 'individual':
                     phonicsajaxFactory.bufferedData.assignment =  $scope.studentAssignment.individualAssignments;
                     phonicsajaxFactory.bufferedData.assignment.type="individual"
                     $state.go('viewAll');
                    break;
            }
    }

    $scope.selectScreen = function(val,assign){
        $scope.activeScreen = val;
        $scope.selection.selectedAssign = assign;
        if(val === 'viewAll'){
            $scope.assignmentCat(assign)           
        }else if(val === 'bookSection'){  
        phonicsajaxFactory.bufferedData.params = {
                        "type":"romaing",
                        "courseType":assign,
                        "content":"textbook1"
                        } ;  
            $state.go('viewIndividual');
         
        }

    }


    
    /* Method to initialize Controller */
    function initializeController() {

        studentAssignment = taskService.getTasks("studentDashboardCtrl");

        phonicsajaxFactory.serviceCall({"type":"all","id":""}, studentAssignment.getAssignment).then(function(response) {
            if(angular.isDefined(response)){
                   console.log(response)
                    $scope.studentAssignment = response.data;
                }
                $rootScope.appLoader = false;
              }, function(error) {
               phonicsajaxFactory.localService('studentAssignment').then(function(response) {
                 $scope.studentAssignment = response.data.data;
                  console.log(response)
                }, function(error) {
               });
        });

    };



    
    initializeController();
}]);