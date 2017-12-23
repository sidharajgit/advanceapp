advancePubapp.controller('classcontentmanagementController', ['$scope', 'sfactory', '$rootScope', 'taskService', '$state', '$stateParams','sharedService','sessionService','$filter','$timeout',function($scope, sfactory, $rootScope, taskService,$state,$stateParams,sharedService,sessionService,$filter,$timeout) { 

    var localTask, tasks, dataRequest,courseType,assignCourse,currentState;

    /*Method to initialize request object */
    function getCurrentStateObj(){
        var requestObj={};
        if($stateParams.userid !== ''){
            requestObj.userid = $stateParams.userid;
            requestObj.type = 'individual';
        }
        else{
            requestObj.type = ($stateParams.group && $stateParams.group != '') ? 'group' : 'class';
            requestObj.classmasterid = ($stateParams.group && $stateParams.group != '') ? $stateParams.group : $stateParams.classid;
        }
        return requestObj;
    };
    
    function changeState(){
        var stateName = $state.current.name;
        $state.transitionTo(stateName, currentState,{
            location: true,
            inherit: true,
            relative: $state.$current,
            notify: false,
            reload: true
        });
    };
    

    
    /* Method to change activity status */
    $scope.changeActivityStatus = function(parentIndex, Index) {
        var activityStatusObject = _.countBy(_.pluck($scope.contents.currentSection.lessons[parentIndex].activities, 'isadded'), function(value) {
            return value === true ? 'true' : 'false';
        });
        dataRequest = getCurrentStateObj();
        dataRequest.course_id = $scope.contents.currentSection.lessons[parentIndex].activities[Index].course_id,
        dataRequest.action = ($scope.contents.currentSection.lessons[parentIndex].activities[Index].isadded) ? 'enrol' : 'unenrol'
        sfactory.serviceCall(JSON.stringify(dataRequest), assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                $scope.contents.course.sections[$scope.contents.activeSection].lessons[parentIndex].activities[Index].isadded = $scope.contents.currentSection.lessons[parentIndex].activities[Index].isadded;
                $scope.contents.currentSection.lessons[parentIndex].isadded = (activityStatusObject.true > 0);
                updateSectionStatus();
                $scope.contents.currentSection = $scope.contents.course.sections[$scope.contents.activeSection];
            }
        $rootScope.appLoader = false;
        }, function(error) {});
    };

    /* Method to change lesson status */
    $scope.changeLessonStatus = function(index) {
        dataRequest = getCurrentStateObj();
        dataRequest.course_id = $scope.contents.currentSection.lessons[index].lesson_courses,
        dataRequest.action =($scope.contents.currentSection.lessons[index].isadded) ? 'unenrol' : 'enrol',
        sfactory.serviceCall(JSON.stringify(dataRequest), assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                _.each($scope.contents.currentSection.lessons[index].activities, function(activity) {
                    activity.isadded = $scope.contents.currentSection.lessons[index].isadded;
                });
                updateSectionStatus();
                $scope.contents.currentSection = $scope.contents.course.sections[$scope.contents.activeSection];
            }
        $rootScope.appLoader = false;
        }, function(error) {});
    };

    /* Method to change section status */
    $scope.changeSectionStatus = function() {
        dataRequest = getCurrentStateObj();
        dataRequest.action = ($scope.contents.currentSection.isadded) ? 'enrol' : 'unenrol';
        dataRequest.course_id = $scope.contents.currentSection.section_courses;
        sfactory.serviceCall(JSON.stringify(dataRequest), assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                _.each($scope.contents.course.sections[$scope.contents.activeSection].lessons, function(lesson) {
                    lesson.isadded = $scope.contents.currentSection.isadded;
                    _.each(lesson.activities, function(activity) {
                        activity.isadded = $scope.contents.currentSection.isadded;
                    });
                });
                $scope.contents.currentSection = $scope.contents.course.sections[$scope.contents.activeSection];
            }
        $rootScope.appLoader = false;
        }, function(error) {});
    };

    $scope.changeUnitStatus = function(){
        dataRequest = getCurrentStateObj();
        dataRequest.action = ($scope.contents.currentSection.isadded) ? 'enrol' : 'unenrol';
        dataRequest.course_id = ($scope.contents.currentSection.section_courses);
         sfactory.serviceCall(JSON.stringify(dataRequest), assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.filters,function(filter){
                    $scope.contents.currentSection['isadded'+filter.toLowerCase()] = $scope.contents.currentSection.isadded;
                    angular.forEach($scope.contents.currentSection[filter],function(activity){
                        activity.isadded = $scope.contents.currentSection.isadded;
                    });
                });
            }
        $rootScope.appLoader = false;
        }, function(error) {
            angular.forEach($scope.contents.filters,function(filter){
                $scope.contents.currentSection['isadded'+filter.toLowerCase()] = $scope.contents.currentSection.isadded;
                angular.forEach($scope.contents.currentSection[filter],function(activity){
                    activity.isadded = $scope.contents.currentSection.isadded;
                });
            });
        });
    };
    
    /* Method to change section tabs */
    $scope.changeSection = function(index,type) {
        $scope.contents.activeSection = index;
        $scope.contents.currentSection = (type === 'Phonics Adventure' ) ? $scope.contents.course.sections[index] : $scope.contents.course.units[index];
        currentState.section = index;
        changeState();
    };

    /* Method to update section section status according to lesson and activity status */
    function updateSectionStatus() {
        var lessonStatusObject = _.countBy( _.pluck($scope.contents.currentSection.lessons, 'isadded'), function(value) {
            return value === true ? 'true' : 'false';
        });
        $scope.contents.currentSection.isadded = (lessonStatusObject.true > 0);
    };

    /* Get data for Phonics Adventure or Number Success */
    function dataFor(data){
         switch($scope.contents.tabs.name) {
            case 'Number Success':
                 $scope.contents.currentSection = data.units[0];
                 $scope.contents.activeSection = 0;
                break;
            case 'Phonics Adventure':
                 $scope.contents.currentSection = data.sections[0];
                 $scope.contents.activeSection = 0;
                 flag = true;
                 _.each(data.sections, function(item,index){                    
                    if(item.isadded && flag){
                        $scope.contents.currentSection = item;
                        $scope.contents.activeSection = index;
                        flag = false;
                    }                                      
                });
                break;
        }
    };

    /* Get data on switching parent tabs */
    $scope.getData = function(index,childIndex,isStateUpdate){
        if(index < 3){
            $scope.contents.tabs = angular.copy($scope.headerdata[index]);
            if(isStateUpdate){
                currentState.childtab = 0;
                currentState.section = 0;
            }
            switch (index) {
                case 0:
                    $scope.contents.activeLevel = [false, false];
                    $scope.getLevelData(index,$scope.contents.tabs.categories[0].levels[0].name,0);
                    break;
                case 1:
                    $scope.getContentData(index);
                    break;
                case 2:
                    getWritingsuccessData();
                    break;
            }
            currentState.tab = index;
            changeState();
        }
    };

   /* Method to get Level-1 or Level-2 contents */
    $scope.getLevelData = function(index,levelname,levelIndex) {
        if(!$scope.contents.activeLevel[levelIndex] || levelname === null){
            currentState.childtab = index;
            $scope.activetab.childIndex = currentState.childtab;
            changeState();
            $scope.contents.activeLevel = [false, false];
            $scope.contents.activeLevel[levelIndex] = true;
            if(levelname === null){
                levelname = ($scope.contents.tabs.categories[index].levels) ? $scope.contents.tabs.categories[index].levels[0].name : $scope.contents.tabs.categories[index].name;
            }
            dataRequest = getCurrentStateObj();
            dataRequest.content = levelname;
            dataRequest.courseType = $scope.contents.tabs.name;
            $scope.contents.currentSection=null;
            localStorage.setItem('params', JSON.stringify(dataRequest));
            sfactory.serviceCall(JSON.stringify(dataRequest), tasks.getContents,'listDetails').then(function(response) {
                if($filter('lowercase')(response.status) == 'success'){
                    $scope.contents.course = response.data.courses;
                    dataFor(response.data.courses);
                    $scope.changeSection(Number(currentState.section),dataRequest.courseType);
                }
            $rootScope.appLoader = false;
            }, function(error) {
                sfactory.localService(localTask).then(function(response) {
                    $scope.contents.course = response.data.courses;
                    dataFor(response.data.courses);
                    $scope.changeSection(Number(currentState.section),dataRequest.courseType);
                    $rootScope.appLoader = false;
                }, function(error) {});
            });
        }
    };

    /* Get data for Number Success*/
    $scope.getContentData = function(index){
       $scope.contents.tabs = angular.copy($scope.headerdata[index]);
       dataRequest = getCurrentStateObj();
       dataRequest.courseType=   $scope.contents.tabs.name;
       dataRequest.content = $scope.contents.tabs.categories[currentState.childtab].name;
       $scope.contents.currentSection=null;
        $scope.activetab.childIndex = currentState.childtab;
        sfactory.serviceCall(JSON.stringify(dataRequest), tasks.getContents,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                $scope.contents.course = response.data.courses;
                $scope.contents.filters = response.data.filters;
                dataFor(response.data.courses);
                $scope.changeSection(Number(currentState.section),dataRequest.courseType);
            }
       $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("number_success").then(function(response) {
                $scope.contents.course = response.data.data.courses;
                $scope.contents.filters = response.data.data.filters;
                $scope.changeSection(Number(currentState.section),dataRequest.courseType);
                $rootScope.appLoader = false;
            }, function(error) {});
        });
    };

    /* Method to change lesson status of Number Success */
    $scope.changeNSActivityStatus = function(index,category) {
        dataRequest = getCurrentStateObj();
        $scope.ns_course.currentSection =category;
        dataRequest.course_id = $scope.contents.currentSection[category][index].course_id;
        dataRequest.action =($scope.contents.currentSection[category][index].isadded) ?  'enrol' : 'unenrol';
        sfactory.serviceCall(JSON.stringify(dataRequest), assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                _.each($scope.contents.currentSection[category][index].activities, function(activity) {
                    activity.isadded = $scope.contents.currentSection[category][index].isadded;
                });
                updateCourseStatus($scope.ns_course.currentSection);
                if($scope.contents.course.sections){
                     $scope.contents.currentSection = $scope.contents.course.sections[$scope.contents.activeSection];
                 }else if($scope.contents.course.units){
                     $scope.contents.currentSection = $scope.contents.course.units[$scope.contents.activeSection];
                 }
            }
        $rootScope.appLoader = false;
        }, function(error) {});
    };

    /* Method to change course status of Number Success */
    $scope.changeNSCourse = function(type,select){  
        dataRequest = getCurrentStateObj();
        dataRequest.course_id = $scope.contents.currentSection[type+"_courses"];
        dataRequest.action = select ?  'enrol' : 'unenrol' ,
        sfactory.serviceCall(JSON.stringify(dataRequest), assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
              for(var i=0;i< $scope.contents.currentSection[type].length;i++){
                    $scope.contents.currentSection[type][i].isadded = select;
                }      
            }
        $rootScope.appLoader = false;
        }, function(error) {
            updateCourseStatus($scope.ns_course);
        });

    };
    
    /* Method to update Course Status */
    function updateCourseStatus(course){
        var courseStatusObject = _.countBy( _.pluck($scope.contents.currentSection[course], 'isadded'), function(value) {
            return value === true ? 'true' : 'false';
        });
        $scope.contents.currentSection['isadded'+course.toLowerCase()]= courseStatusObject.true > 0;
    };
    
    /* Method to get writing success data */
     function getWritingsuccessData(){
        var selectedIndex = 0;
        $scope.contents.currentSection = null;
        dataRequest = getCurrentStateObj();
        dataRequest.courseType = "Writing Success";
        sfactory.serviceCall(dataRequest, tasks.getContents,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                $scope.contents.course = response.data;
                angular.forEach($scope.contents.course.courses[selectedIndex].sections,function(section){
                    $scope.writingSuccess.menu.push({key:section.key,values:_.pluck(section.subsection[selectedIndex].activities, 'name')})
                });
                $scope.activetab.childIndex = Number(currentState.childtab);
                $scope.switchWritingsuccess($scope.activetab.childIndex,Number(currentState.section));
            }
            $rootScope.appLoader = false;
            }, function(error) {
                sfactory.localService("writingSuccess").then(function(response) {
                    $scope.contents.course = response.data;
                    angular.forEach($scope.contents.course.courses[selectedIndex].sections,function(section){
                        $scope.writingSuccess.menu.push({key:section.key,values:_.pluck(section.subsection[selectedIndex].activities, 'name')})
                    });
                    $scope.activetab.childIndex = Number(currentState.childtab);
                    $scope.switchWritingsuccess($scope.activetab.childIndex,Number(currentState.section));
                }, function(error) {});
            });
    };
   
    /* Method to Change Writing Success Menu status */
    $scope.changeWSMenuStatus = function(index){
        dataRequest = getCurrentStateObj();
        dataRequest.course_id = $scope.writingSuccess.menustatus[index].course_id;
        dataRequest.action = ($scope.writingSuccess.menustatus[index].isadded) ?  'enrol' : 'unenrol';
        sfactory.serviceCall(dataRequest, assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                 angular.forEach($scope.contents.currentSection.subsection,function(subsectionObj){
                     if(subsectionObj.activities[index].isactive){
                         subsectionObj.activities[index].isadded = angular.copy($scope.writingSuccess.menustatus[index].isadded);
                     }
                 });
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("writingSuccess").then(function(response) {
                angular.forEach($scope.contents.currentSection.subsection,function(subsectionObj){
                    if(subsectionObj.activities[index].isactive){
                         subsectionObj.activities[index].isadded = angular.copy($scope.writingSuccess.menustatus[index].isadded);
                    }
                });
            });
            }, function(error) {});
    };
    
    /* Method to Writing Success Subtab */
    $scope.switchWritingsuccess = function(parentIndex,index,stateUpdate){
        $scope.writingSuccess.selectedLevel = $scope.contents.tabs.categories[parentIndex].levels[index];
        angular.forEach($scope.contents.tabs.categories[parentIndex].levels,function(tab,tabIndex){
            tab.isActive = (tabIndex === index);
        });
        $scope.writingSuccess.menuList = _.find($scope.writingSuccess.menu,function(menuObj){
            return menuObj.key === $scope.writingSuccess.selectedLevel.key;
        }).values;
        $scope.contents.currentSection = $scope.contents.course.courses[parentIndex].sections[index];
        updateWSMenuStatus();
        if(angular.isDefined(stateUpdate)){
            switch (stateUpdate) {
                case 'childtabUpdate':
                    currentState.childtab = parentIndex;
                    currentState.section = 0;
                    $stateParams.childtab = parentIndex;
                    $stateParams.section = 0;
                    break;
                case 'section':
                    currentState.section = index;
                    $stateParams.section = index;
                    break;
            }
            changeState();
        }
    };
    
    /* Method to update Writing Success menu status */
    function updateWSMenuStatus(){
        $scope.writingSuccess.menustatus=[];
        var activities=[],isAdded=true,isActive = false,courses=[];
        activities = _.pluck($scope.contents.currentSection.subsection, "activities");
        angular.forEach($scope.writingSuccess.menuList,function(menuList,menuIndex){
            isAdded = true;
            isAtleastOneAdded = false;
            isActive = false;
            courses = [];
            angular.forEach(activities,function(activity,index){
                if(angular.isDefined(activity[menuIndex])){
                    if(activity[menuIndex].isactive){
                       isAdded = isAdded && activity[menuIndex].isadded; 
                       courses.push(activity[menuIndex].course_id);
                       isAtleastOneAdded = true;
                    }
                    isActive = isActive || activity[menuIndex].isactive;
                }
            });
            $scope.writingSuccess.menustatus.push({key:menuList,isadded:isAdded && isAtleastOneAdded,course_id:courses,isactive:isActive});
        });
    };
    
    /* Method to change Writing Success activity status */
    $scope.changeWSActivityStatus = function(subsectionIndex,index){
        dataRequest = getCurrentStateObj();
        dataRequest.course_id = $scope.contents.currentSection.subsection[subsectionIndex].activities[index].course_id;
        dataRequest.action = ($scope.contents.currentSection.subsection[subsectionIndex].activities[index].isadded) ?  'enrol' : 'unenrol';
        sfactory.serviceCall(dataRequest, assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                var activityStatusObject = _.countBy(_.pluck($scope.contents.currentSection.subsection[subsectionIndex].activities, 'isadded'), function(value) {
                    return value === true ? 'true' : 'false';
                });
                if($scope.contents.currentSection.subsection[subsectionIndex].isactive){
                    $scope.contents.currentSection.subsection[subsectionIndex].isadded = (activityStatusObject.true > 0);
                }
                updateWSSectionStatus();
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("writingSuccess").then(function(response) {
                var activityStatusObject = _.countBy(_.pluck($scope.contents.currentSection.subsection[subsectionIndex].activities, 'isadded'), function(value) {
                    return value === true ? 'true' : 'false';
                });
                if($scope.contents.currentSection.subsection[subsectionIndex].isactive){
                    $scope.contents.currentSection.subsection[subsectionIndex].isadded = (activityStatusObject.true > 0);
                }
                updateWSSectionStatus();
            }, function(error) {});
        });
    };
    
    /* Method to change Writing Success lesson status */
    $scope.changeWSLessonStatus = function(index){
        dataRequest = getCurrentStateObj();
        dataRequest.course_id = $scope.contents.currentSection.subsection[index].contentid;
        dataRequest.action = ($scope.contents.currentSection.subsection[index].isadded) ?  'enrol' : 'unenrol';
        sfactory.serviceCall(dataRequest, assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.currentSection.subsection[index].activities,function(activity){
                    if(activity.isactive){
                        activity.isadded = $scope.contents.currentSection.subsection[index].isadded;
                    }
                });
                updateWSSectionStatus();
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("writingSuccess").then(function(response) {
                angular.forEach($scope.contents.currentSection.subsection[index].activities,function(activity){
                    if(activity.isactive){
                        activity.isadded = $scope.contents.currentSection.subsection[index].isadded;
                    }
                });
                updateWSSectionStatus();
            }, function(error) {});
        });
    };
    
    /* Method to update Writing Success section status */
    $scope.changeWSSectionStatus = function(){
        dataRequest = getCurrentStateObj();
        dataRequest.course_id = $scope.contents.currentSection.contentid;
        dataRequest.action = ($scope.contents.currentSection.isadded) ?  'enrol' : 'unenrol';
        sfactory.serviceCall(dataRequest, assignCourse,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.currentSection.subsection,function(subsection){
                    if(subsection.isactive){
                        subsection.isadded = $scope.contents.currentSection.isadded;
                    }
                    angular.forEach(subsection.activities,function(activity){
                        if(activity.isactive){
                            activity.isadded = $scope.contents.currentSection.isadded;
                        }
                    });
                });
                updateWSMenuStatus();
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("writingSuccess").then(function(response) {
                angular.forEach($scope.contents.currentSection.subsection,function(subsection){
                    if(subsection.isactive){
                        subsection.isadded = $scope.contents.currentSection.isadded;
                    }
                    angular.forEach(subsection.activities,function(activity){
                        if(activity.isactive){
                            activity.isadded = $scope.contents.currentSection.isadded;
                        }
                    });
                });
                updateWSMenuStatus();
            }, function(error) {});
        });
    };
    
    /* Method to update Writing Success section status */
    function updateWSSectionStatus(){
        var lessonStatusObject = _.countBy(_.pluck($scope.contents.currentSection.subsection, 'isadded'), function(value) {
            return value === true ? 'true' : 'false';
        });
        $scope.contents.currentSection.isadded = (lessonStatusObject.true > 0);
        updateWSMenuStatus();
    };
    
    /* Method to initialize Controller */
    function initializeController() {
        $scope.ns_course={};
        $scope.activetab={};
        $scope.writingSuccess={menu:[]};
        currentState = $stateParams;
        localTask = 'contentmanagement';
        tasks = taskService.getTasks('classcontentmanagementController');
        assignCourse = ($stateParams.userid !== '') ? tasks.assignCourseIndividual : tasks.assignCourse;
        $scope.tabDetails = $stateParams;
        $scope.contents={levels:[],activeLevel:[false,false],currentSection:null};
        $scope.activeparenttab = Number(currentState.tab);
        $scope.activetab.childIndex = Number(currentState.childtab);
        $scope.getData(Number(currentState.tab),Number(currentState.childtab));
    };

    initializeController();
}]);