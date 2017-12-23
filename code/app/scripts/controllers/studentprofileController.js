advancePubapp.controller('studentprofileController',['$scope','$rootScope','$state','sfactory','taskService','$stateParams','sessionService','encryptionService',function($scope,$rootScope, $state, sfactory, taskService, $stateParams, sessionService,encryptionService){       
	$scope.assignments ={};
	if(angular.lowercase(sessionService.get('role'))=="parent"){
    $scope.selection ={
		selectedTab:'individual',
		selectedSub:'Phonics Adventure',
		selectedAct:'All'
	 };
    }else{
     $scope.selection ={
		selectedTab:'class',
		selectedSub:'Phonics Adventure',
		selectedAct:'All'
	 };   
    }
	 $scope.template =templateURL+"dest/templates/myProfile.html"
	 $scope.userdetails=[];
	var url ="",userId,coursePlayerData = {};var buffer ="";
	  $scope.activityDataAvalibility = 0;

	$scope.selectTab = function(select){
		$scope.selection.selectedTab = select;
		$scope.selection.selectedSub = 'Phonics Adventure';
		selectURL();
		if(select !== 'profile'){
			$scope.assignmentsList(userId,$scope.selection.selectedSub);
		}else{
			setLocalVariable();
		}
	}
    
	function selectURL(){  
		switch($scope.selection.selectedTab) {
			    case 'class':
				       url = studentProfile.studentClassAssignment;				        
			        break;
			    case 'group':
			    		url = studentProfile.studentGroupAssignment;
			         
			        break;
			    case 'individual':
			    		url =  studentProfile.studentIndividualAssignment;
			        break;
			}
	}
	$scope.selectSub = function(select){
		if($scope.selection.selectedSub === select) return;
		$scope.selection.selectedSub = select;
		$scope.assignmentsList(userId,select);
	}
	
	function geyWritingSuccessKeyValues(key){
		keyvalue = _.where($scope.writingSuccessReport.courses[0].sections,{key:key});
		return keyvalue[0].name;
	}
	
	$scope.selectAct = function(select){
		$scope.selection.selectedAct =select;
		if(select === 'All'){
             $scope.activityDataAvalibility = 0;
             return;
        }
        if($scope.Activities.length){
            $scope.activityDataAvalibility = $scope.Activities.findIndex(x => x.activity_type == select);
        }
	}
    
	function populateData(data){
    	switch($scope.selection.selectedTab) {
		    case 'individual':
		         $scope.Activities =[];
				 $scope.assignments = data.assignments;
				 filterselection();
				 $scope.generateIndividualActivity($scope.assignments)
		        break;
		    default:
		        $scope.assignments =data.assignments.class;
		        coursePlayerData = $scope.assignments;		   
		        filterselection();
				$scope.generateActivity($scope.assignments)
		}
    }

    function filterselection(){
		if($scope.selection.selectedSub === 'Number Success' || $scope.selection.selectedSub === 'Writing Success'){
			$scope.selection.selectedAct =  $scope.filters[0];
		}
		else if($scope.selection.selectedSub === 'Phonics Adventure'){
			$scope.selection.selectedAct =  'All';
		}
    }
    
	$scope.assignmentsList = function(id,category){
        var groupId = encryptionService.decrypt(sessionService.get('grp_id'));
			var parms={
                "user_id":id,
                "category":category,
                "groupid":groupId
				}
			selectURL();
			setLocalVariable();
			sfactory.serviceCall(JSON.stringify(parms), url,"listDetails").then(function(response) {
                 $rootScope.appLoader = false;
				if(angular.isDefined(response)){
					  $scope.filters = response.data.filters;
					if(response.data){
							populateData(response.data);						
					}else{
						console.log('Data not available !');
						 $scope.Activities =[];
						 $scope.activityDataAvalibility = -1;
						 $scope.assignments={};
					}
				    }else{
				    	console.log('Data not available !');
						 $scope.Activities =[];
						 $scope.assignments={};
				    }
			   
			  }, function(error) {
				  sfactory.localService("studentReport").then(function(response) {
				  			$scope.filters = response.data.data.filters;	
				  			if($scope.selection.selectedSub === 'Phonics Adventure'){
				  				// $scope.filters.unshift('Course')
				  			}else{
				  				$scope.selection.selectedAct = $scope.filters[0];  	
				  			}
				  					
							populateData(response.data.data);
                              
                            }, function(error) {
                    });
			});
	}

	
  $scope.selectNSTab = function(select, index){
  		$scope.selection.filter = select;
  		$scope.selection.selectedAct = select;
  		if(select === 'All'){
             $scope.activityDataAvalibility = 0;
             return;
        }
        if($scope.Activities.length){
            $scope.activityDataAvalibility = $scope.Activities.findIndex(x => x.activity_type == select);
        }
  }
  
  $scope.viewActivity = function(event){
      event.preventDefault();
  }
  function initializeController() {
    	$scope.userdetails=[];
        studentProfile = taskService.getTasks("studentprofileController");
        url =  (angular.lowercase(sessionService.get('role'))=="parent") ? studentProfile.studentIndividualAssignment : studentProfile.studentClassAssignment;
   
        if(sfactory.bufferedData.studentProfile){
        	  localStorage.setItem('userdetails',JSON.stringify(sfactory.bufferedData.studentProfile));
        	  userId=sfactory.bufferedData.studentProfile.id;        	
        	  $scope.userdetails = sfactory.bufferedData.studentProfile;
        	  setLocalVariable();
        }else{
        	
        	 $scope.userdetails = JSON.parse(localStorage.getItem('userdetails'));
        	 userId = $scope.userdetails.id; // when buffered data is not available using localstorage to save data
        	 buffer=JSON.parse(localStorage.getItem('params'));
        	 $scope.selection.selectedTab = buffer.type;
        	 $scope.selection.selectedSub = buffer.courseType;
        }         
       if($scope.selection.selectedTab !== 'profile'){
			 $scope.assignmentsList(userId, $scope.selection.selectedSub); 
		}
        $scope.noImageUrlPath = templateURL+'dest/images/no_image.png';
        $scope.userRole = angular.lowercase(sessionService.get('role'));
       // $scope.dashboard.breadCrumbList = ["Student List","Student Profile"];
    };  

    $scope.generateIndividualActivity = function(courses){
		for(var j=0;j< courses.courses.sections.length;j++){
			for(var k=0;k<courses.courses.sections[j].lesson.length;k++){
		    	for(var l=0;l<courses.courses.sections[j].lesson[k].activities.length;l++){
					if($scope.selection.selectedSub == "Writing Success"){
						if(courses.courses.sections[j].lesson[k].activities[l].isactive){
							$scope.Activities.push(courses.courses.sections[j].lesson[k].activities[l]);	
						}
					}else{
						$scope.Activities.push(courses.courses.sections[j].lesson[k].activities[l]);		
					}
		    			 			                      
		   		 }
			}
		}
        if($scope.Activities.length){
            $scope.activityDataAvalibility = 0;
        }else{
        	 $scope.activityDataAvalibility = -1;
        }		
		if($scope.selection.selectedSub == "Writing Success"){		
	   		$scope.Activities = _.groupBy($scope.Activities, "alphabet_type");
	    }
    }

   $scope.generateActivity= function(courses){
     $scope.Activities =[];	   
     for(var i =0;i< courses.length;i++){            
            for(var j=0;j< courses[i].sections.length;j++){
                for(var k=0;k<courses[i].sections[j].lesson.length;k++){
                    for(var l=0;l<courses[i].sections[j].lesson[k].activities.length;l++){
                           if($scope.selection.selectedSub == "Writing Success"){
								if(courses[i].sections[j].lesson[k].activities[l].isactive){
									$scope.Activities.push(courses[i].sections[j].lesson[k].activities[l]);
								}								 
							}else{
								 $scope.Activities.push(courses[i].sections[j].lesson[k].activities[l]);
							}
                    }
                }
            }
         }
        if($scope.Activities.length){
            $scope.activityDataAvalibility = 0;
        }else{
        	 $scope.activityDataAvalibility = -1;
        }
	   if($scope.selection.selectedSub == "Writing Success"){		
	   		$scope.Activities = _.groupBy($scope.Activities, "alphabet_type");
	   }
    }

   $scope.isNoDataFound = function(key){
       return (_.findLastIndex($scope.Activities[key], {activity_type: $scope.selection.selectedAct}) === -1);
   };
   
    function setLocalVariable(){
    	var params ={'type':$scope.selection.selectedTab,'courseType':$scope.selection.selectedSub};
        localStorage.setItem("params",JSON.stringify(params))
    };
    
    initializeController();
}])
