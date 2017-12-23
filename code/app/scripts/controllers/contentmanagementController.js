advancePubapp.controller('contentmanagementController', ['$scope', 'sfactory', '$rootScope', 'taskService','$state','sessionService','encryptionService','$filter','sessionService','$mdDialog', '$timeout','$q',function($scope, sfactory, $rootScope, taskService,$state,sessionService,encryptionService,$filter,sessionService,$mdDialog,$timeout,$q) {

    var localTask, tasks, dataRequest,courseType,currentState;

    
    /*Method to assign or unassign survey to activity */
    $scope.assignUnassignSurvey = function(parentIndex,Index,activity,isAssign){
        dataRequest = (isAssign) ? {assign :[]} :{unassign :[]};
        var data = {
            mediaType: activity.type,
            courseId: activity.course_id,
            activityId: activity.id
        };
        (isAssign) ? dataRequest.assign.push(data) : dataRequest.unassign.push(data);
        sfactory.serviceCall(dataRequest, tasks.assignSurvey, 'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                $scope.contents.course.sections[$scope.contents.activeSection].lessons[parentIndex].activities[Index].survey_assigned_status = isAssign;
                $scope.contents.currentSection = $scope.contents.course.sections[$scope.contents.activeSection];
            }
            else{
                showBanner(response.message,response.status);
            }
            $rootScope.appLoader = false;
        }, function(error) {});
    };
    
    /* Method to show notification */
    function showBanner(message,status){
        var banerData = {};
        banerData.message = message;
        banerData.banerClass = ($filter('lowercase')(status) === 'success') ? 'alert-success' : 'alert-danger';
        banerData.showBaner=true;
        $scope.alertBaner = angular.copy(banerData);
    };
    
    /* Method to view survey results */
    $scope.viewSurveyResults = function(activity){
        sessionService.set('courseSurveyID',encryptionService.encrypt(String(activity.survey_id)));
        $state.go('adminLanding.surveyresults',{location: false});
    };
    
    /* Method to change Number Success units status */
    $scope.changeNSUnitStatus = function(){
        dataRequest = {
            action: ($scope.contents.currentSection.block) ? 'act' : 'deact',
            section_courses: $scope.contents.currentSection.units_courses,
            section_activities: $scope.contents.currentSection.units_activities
        };
         sfactory.serviceCall(dataRequest, tasks.sectionAssign, 'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.filters,function(filter){
                    if(angular.isDefined($scope.contents.currentSection['block'+angular.lowercase(filter)])){
                        $scope.contents.currentSection['block'+angular.lowercase(filter)] = $scope.contents.currentSection.block;
                    }
                    angular.forEach($scope.contents.currentSection[filter],function(lesson){
                        if(angular.isDefined(lesson.block)) lesson.block = $scope.contents.currentSection.block;
                    });
                });
            }
            $rootScope.appLoader = false;
        }, function(error) {});
    };
    
    /* Method to change Phonics Adventure section status */
    $scope.changePASectionStatus = function() {
        dataRequest = {
            action: ($scope.contents.currentSection.block) ? 'act' : 'deact',
            section_courses: $scope.contents.currentSection.section_courses,
            section_activities: $scope.contents.currentSection.section_activities
        };
        sfactory.serviceCall(dataRequest, tasks.sectionAssign, 'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.course.sections[$scope.contents.activeSection].lessons, function(lesson) {
                    if(angular.isDefined(lesson.block)){
                        lesson.block = response.data.block;
                        angular.forEach(lesson.activities, function(activity) {
                            if(angular.isDefined(activity.block)) activity.block = response.data.block;
                        });
                     }
                });
                $scope.contents.currentSection = $scope.contents.course.sections[$scope.contents.activeSection];
            }
            $rootScope.appLoader = false;
        }, function(error) {});
    };
    
    /* Method to change Phonics Adventure lesson status */
    $scope.changePALessonStatus = function(index) {
        dataRequest = {
            action: ($scope.contents.currentSection.lessons[index].block) ? 'deact' : 'act',
            lesson_courses: $scope.contents.currentSection.lessons[index].lesson_courses,
            lesson_activities: $scope.contents.currentSection.lessons[index].lesson_activities
        };
        sfactory.serviceCall(dataRequest, tasks.lessonAssign, 'listDetails').then(function(response) {
           if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.currentSection.lessons[index].activities, function(activity) {
                    if(angular.isDefined(activity.block)) activity.block = response.data.block;
                });
                updateSectionStatus();
                $scope.contents.currentSection = $scope.contents.course.sections[$scope.contents.activeSection];
           }
           $rootScope.appLoader = false;
        }, function(error) {});
    };

    /* Method to change Number Success lesson status */
    $scope.changeNSLessonStatus = function(category){  
        dataRequest={
            action : ($scope.contents.currentSection['block'+angular.lowercase(category)]) ? 'act' : 'deact',
            lesson_courses:$scope.contents.currentSection[category+'_courses'],
            lesson_activities:$scope.contents.currentSection[category+'_activities']
        };
        sfactory.serviceCall(JSON.stringify(dataRequest),tasks.lessonAssign,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.currentSection[category],function(categoryType,index){
                    if(angular.isDefined(categoryType.block)) categoryType.block = $scope.contents.currentSection['block'+ angular.lowercase(category)];
                });
                updateNSUnits();
                $scope.contents.course.units[$scope.contents.activeSection] = $scope.contents.currentSection;
            }
            $rootScope.appLoader = false;
        }, function(error) {});
    };
    
    /* Method to change Phonics Adventure activity status */
    $scope.changePAActivityStatus = function(parentIndex, Index) {
        var activityStatusObject = _.countBy(_.pluck($scope.contents.currentSection.lessons[parentIndex].activities, 'block'), function(value) {
            return value === true ? 'true' : 'false';
        });
        dataRequest = {
            id: $scope.contents.currentSection.lessons[parentIndex].activities[Index].id,
            course_id: $scope.contents.currentSection.lessons[parentIndex].activities[Index].course_id,
            action: ($scope.contents.currentSection.lessons[parentIndex].activities[Index].block) ? 'act' : 'deact'
        };
        sfactory.serviceCall(dataRequest, tasks.activityAssign, 'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                $scope.contents.course.sections[$scope.contents.activeSection].lessons[parentIndex].activities[Index].block = response.data.block;
                $scope.contents.currentSection.lessons[parentIndex].block = (activityStatusObject.true > 0);
                updateSectionStatus();
                $scope.contents.currentSection = $scope.contents.course.sections[$scope.contents.activeSection];
            }
            $rootScope.appLoader = false;
        }, function(error) {});
    };
    
    /* Method to change Number Success activity status */
    $scope.changeNSActivityStatus = function(index,category) {
        dataRequest = {
            action: ($scope.contents.currentSection[category][index].block) ? 'act' : 'deact',
            id:$scope.contents.currentSection[category][index].id,
            course_id:$scope.contents.currentSection[category][index].course_id
        };
        sfactory.serviceCall(JSON.stringify(dataRequest),tasks.activityAssign,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                var lessonStatusObject = _.countBy( _.pluck($scope.contents.currentSection[category], 'block'), function(value) {
                    return value === true ? 'true' : 'false';
                });
                $scope.contents.currentSection['block'+ angular.lowercase(category)] = (lessonStatusObject.true > 0);
                updateNSUnits();
                $scope.contents.course.units[$scope.contents.activeSection] = $scope.contents.currentSection;
            }
            $rootScope.appLoader = false;
        }, function(error) {});
    };
 
    /* Method to change section tabs */
    $scope.changeTab = function(index,tabname) {
        var currentState;
        $scope.contents.activeSection = index;
        $scope.contents.currentSection = (tabname === 'Phonics Adventure') ? $scope.contents.course.sections[index] : $scope.contents.course.units[index];
        currentState = angular.fromJson(sessionService.getData('currentstate'));
        currentState.sectionIndex = index;
        sessionService.setData('currentstate',currentState);
    };
    
    /* Method to update section status for Phonics Adventure */
    function updateSectionStatus() {
        var lessonStatusObject = _.countBy( _.pluck($scope.contents.currentSection.lessons, 'block'), function(value) {
            return value === true ? 'true' : 'false';
        });
        $scope.contents.currentSection.block = (lessonStatusObject.true > 0);
    };

    $scope.selection={};
    $scope.selection.filter='all';
    $scope.selectAct= function(act){
         $scope.selection.filter= act;
    }

    /* Method to update section status for Number Success */
    function updateNSUnits(){
        var status=[];
        angular.forEach($scope.contents.filters,function(filter){
            status.push($scope.contents.currentSection['block'+angular.lowercase(filter)]);
        });
        $scope.contents.currentSection.block = ((_.filter(status, function(val){ return val == true;})).length > 0);
    };
    
    /* Method to get tab contents */
    $scope.getTabData = function(index,tabName){
        $scope.activetab.childIndex = 0;
		var currentTab = $scope.contents.tabs[index];
        dataRequest ={
            type: currentTab.name
        };
        currentState = {type:dataRequest.type,parentIndex:index,childIndex:0,sectionIndex:0};
        switch (tabName) {
            case 'Phonics Adventure':
                $scope.contents.selectedTab = currentTab.name;
                dataRequest.content = currentTab.categories[index].levels[index].name;
                currentState.content = dataRequest.content;
                getData(index);
                break;
            case 'Number Success':
                $scope.contents.selectedTab = currentTab.name;
                dataRequest.content = currentTab.categories[0].name;
                currentState.content = dataRequest.content;
                getData(index);
                break;
            case 'Media Library':                                
                getMediaLib();
                break;
            case 'Writing Success':
                $scope.contents.selectedTab = currentTab;
                getWritingsuccessData(tabName);
                break;
        }
        sessionService.setData('currentstate',currentState);
    };
    
    /* Method to get writing success data */
     function getWritingsuccessData(tabname){
        var selectedIndex = 0;
        $scope.contents.currentSection = null;
        sfactory.serviceCall(dataRequest, tasks.getContents,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                $scope.contents.course = response.data;
                if(angular.isDefined(response.data.header)){
                    $scope.contents.tabs = response.data.header;
                    $scope.contents.selectedTab =  $filter('filter')($scope.contents.tabs, {name:tabname})[0];
                    angular.forEach($scope.contents.selectedTab.categories[0].levels,function(tab,tabIndex){
                        tab.isActive = false;
                    });
                }
                $scope.contents.currentSection = _.find($scope.contents.course.courses[selectedIndex].sections,function(section){
                    return section.key = $scope.contents.selectedTab.categories[selectedIndex].levels[selectedIndex].key;
                });
                $scope.contents.selectedTab.categories[selectedIndex].levels[selectedIndex].isActive = true;
                $scope.writingSuccess.selectedLevel = $scope.contents.selectedTab.categories[selectedIndex].levels[selectedIndex];
                angular.forEach($scope.contents.course.courses[selectedIndex].sections,function(section){
                    $scope.writingSuccess.menu.push({key:section.key,values:_.pluck(section.subsection[selectedIndex].activities, 'name')})
                });
                $scope.activetab.childIndex = angular.copy(currentState.childIndex);
                $scope.switchWritingsuccess($scope.activetab.childIndex,currentState.sectionIndex);
            }
            $rootScope.appLoader = false;
            }, function(error) {
                sfactory.localService("writingSuccess").then(function(response) {
                    $scope.contents.course = response.data;
                    if(angular.isDefined(response.data.header)){
                        $scope.contents.tabs = response.data.header;
                        $scope.contents.selectedTab =  $filter('filter')($scope.contents.tabs, {name:tabname})[0];
                    }
                    $scope.contents.currentSection = _.find($scope.contents.course.courses[selectedIndex].sections,function(section){
                        return section.key = $scope.contents.selectedTab.categories[selectedIndex].levels[selectedIndex].key;
                    });
                    $scope.contents.selectedTab.categories[selectedIndex].levels[selectedIndex].isActive = true;
                    $scope.writingSuccess.selectedLevel = $scope.contents.selectedTab.categories[selectedIndex].levels[selectedIndex];
                    angular.forEach($scope.contents.course.courses[selectedIndex].sections,function(section){
                        $scope.writingSuccess.menu.push({key:section.key,values:_.pluck(section.subsection[selectedIndex].activities, 'name')})
                    });
                    $scope.activetab.childIndex = angular.copy(currentState.childIndex);
                    $scope.switchWritingsuccess($scope.activetab.childIndex,currentState.sectionIndex);
                }, function(error) {});
            });
    };
    
    $scope.switchWritingsuccess = function(parentIndex,index){
        currentState.childIndex = parentIndex;
        currentState.sectionIndex = index;
        sessionService.setData('currentstate',currentState);
        $scope.writingSuccess.selectedLevel = $scope.contents.selectedTab.categories[parentIndex].levels[index];
        angular.forEach($scope.contents.selectedTab.categories[parentIndex].levels,function(tab,tabIndex){
            tab.isActive = (tabIndex === index);
        });
        $scope.writingSuccess.menuList = _.find($scope.writingSuccess.menu,function(menuObj){
            return menuObj.key === $scope.writingSuccess.selectedLevel.key;
        }).values;
        $scope.contents.currentSection = $scope.contents.course.courses[parentIndex].sections[index];
        updateWSMenuStatus();
    };

    /* Method to update Writing Success menu status */
    function updateWSMenuStatus(){
        $scope.writingSuccess.menustatus=[];
        var block=true,courses=[],activities=[],isAtleastOneAdded;
        activities = _.pluck($scope.contents.currentSection.subsection, "activities");
        angular.forEach($scope.writingSuccess.menuList,function(menuList,menuIndex){
            block = true;
            courses=[];
            activityIds=[];
            isAtleastOneAdded = false;
            angular.forEach(activities,function(activity,index){
                if(angular.isDefined(activity[menuIndex])){
                    block = block && activity[menuIndex].block;
                    courses.push(activity[menuIndex].course_id);
                    activityIds.push(activity[menuIndex].id);
                    if(activity[menuIndex].isenabled) isAtleastOneAdded = true;
                }
            });
            $scope.writingSuccess.menustatus.push({key:menuList,course_id:courses,isenabled:isAtleastOneAdded,activity_id:activityIds,block:block});
        });
    };
    
    /* Method to Change Writing Success Menu status */
    $scope.changeWSMenuStatus = function(index){
        dataRequest ={
            action : $scope.writingSuccess.menustatus[index].block ? 'act' : 'deact',
            lesson_courses : $scope.writingSuccess.menustatus[index].course_id.join(),
            lesson_activities:$scope.writingSuccess.menustatus[index].activity_id.join()
        }
        sfactory.serviceCall(dataRequest,tasks.lessonAssign,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                 angular.forEach($scope.contents.currentSection.subsection,function(subsectionObj){
                    if(subsectionObj.activities[index].isenabled)
                        subsectionObj.activities[index].block = angular.copy($scope.writingSuccess.menustatus[index].block);
                 });
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("writingSuccess").then(function(response) {
                angular.forEach($scope.contents.currentSection.subsection,function(subsectionObj){
                    if(subsectionObj.activities[index].isenabled)
                        subsectionObj.activities[index].block = angular.copy($scope.writingSuccess.menustatus[index].block);
                 });
            });
            }, function(error) {});
    };
    
   /* Method to change Writing Success activity status */
    $scope.changeWSActivityStatus = function(subsectionIndex,index){
        dataRequest = {
            action: ($scope.contents.currentSection.subsection[subsectionIndex].activities[index].block) ?  'act' : 'deact',
            id:$scope.contents.currentSection.subsection[subsectionIndex].activities[index].id,
            course_id:$scope.contents.currentSection.subsection[subsectionIndex].activities[index].course_id
        };
        sfactory.serviceCall(dataRequest,tasks.activityAssign,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                var activityStatusObject = _.countBy(_.pluck($scope.contents.currentSection.subsection[subsectionIndex].activities, 'block'), function(value) {
                    return value === true ? 'true' : 'false';
                });
                $scope.contents.currentSection.subsection[subsectionIndex].block = (activityStatusObject.true > 0);
                updateWSSectionStatus();
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("writingSuccess").then(function(response) {
                var activityStatusObject = _.countBy(_.pluck($scope.contents.currentSection.subsection[subsectionIndex].activities, 'block'), function(value) {
                    return value === true ? 'true' : 'false';
                });
                $scope.contents.currentSection.subsection[subsectionIndex].block = (activityStatusObject.true > 0);
                updateWSSectionStatus();
            }, function(error) {});
        });
    };
    
    /* Method to update Writing Success section status */
    function updateWSSectionStatus(){
        var lessonStatusObject = _.countBy(_.pluck($scope.contents.currentSection.subsection, 'block'), function(value) {
            return value === true ? 'true' : 'false';
        });
        $scope.contents.currentSection.block = (lessonStatusObject.true > 0);
        updateWSMenuStatus();
    };
    
    /* Method to change Writing Success lesson status */
    $scope.changeWSLessonStatus = function(index){
        dataRequest={
            action : ($scope.contents.currentSection.subsection[index].block) ? 'act' : 'deact',
            lesson_courses:$scope.contents.currentSection.subsection[index].contentid,
            lesson_activities:$scope.contents.currentSection.subsection[index].contentactivityid
        };
        sfactory.serviceCall(dataRequest, tasks.lessonAssign,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.currentSection.subsection[index].activities,function(activity){
                    if(activity.isenabled) activity.block = $scope.contents.currentSection.subsection[index].block;
                });
                updateWSSectionStatus();
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("writingSuccess").then(function(response) {
                angular.forEach($scope.contents.currentSection.subsection[index].activities,function(activity){
                    if(activity.isenabled) activity.block = $scope.contents.currentSection.subsection[index].block;
                });
                updateWSSectionStatus();
            }, function(error) {});
        });
    };
    
    /* Method to update Writing Success section status */
    $scope.changeWSSectionStatus = function(){
        dataRequest = {
            action: ($scope.contents.currentSection.block) ? 'act' : 'deact',
            section_courses: $scope.contents.currentSection.contentid,
            section_activities: $scope.contents.currentSection.contentactivityid
        };
        sfactory.serviceCall(dataRequest,tasks.sectionAssign,'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                angular.forEach($scope.contents.currentSection.subsection,function(subsection){
                    if(subsection.isenabled) subsection.block = $scope.contents.currentSection.block;
                    angular.forEach(subsection.activities,function(activity){
                        if(activity.isenabled)  activity.block = $scope.contents.currentSection.block;
                    });
                });
                updateWSMenuStatus();
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService("writingSuccess").then(function(response) {
                angular.forEach($scope.contents.currentSection.subsection,function(subsection){
                    if(subsection.isenabled) subsection.block = $scope.contents.currentSection.block;
                    angular.forEach(subsection.activities,function(activity){
                        if(activity.isenabled)  activity.block = $scope.contents.currentSection.block;
                    });
                });
                updateWSMenuStatus();
            }, function(error) {});
        });
    };

    $scope.selection={
        filters:{"customFilters":[]},        
        itemperpage : "25",
        itemperpageOptions : ["25","45","65","85","100","all"],
        all:'All'
    }
    $scope.switchDisplyMode = function(type){
        $scope.switchMode = type;
    }
    $scope.changeMediaLibTab = function(tabName,tabID){
        $scope.activities.course = [];
        $scope.selectedMediaLibTab = tabName;
        $scope.selectedMediaLibID = tabID;
        $scope.callFromFilters = false;
        addAll = {"id": $scope.selectedMediaLibID, "name": "All", "class": "parent" }; //To add the 'All' category for all main tabs        
        afterTabChanges();
        _.each($scope.mediaLibrary.content.section,function(item){
            if(item.name == tabName){
                $scope.selectOptions = item;
                /*$scope.selectOptions.section.push(addAll);
                if(item.section === undefined){
                    $scope.selectedMediaLibTabID = item.id;
                    $scope.mediaLibMainCategory = false;
                    $scope.mediaLibSubCategory = false;
                }else{
                    $scope.mediaLibMainCategory = true;
                    $scope.selected =item.section[0].name;
                    if(item.section[0].section === undefined  ){
                        $scope.mediaLibSubCategory = false;
                        $scope.selectedMediaLibTabID = item.section[0].id;
                    }else{
                      $scope.mediaLibSubCategory = true;
                      $scope.sub_selectOptions = item.section[0];
                      $scope.sub_selected = item.section[0].section[0].name;
                      $scope.selectedMediaLibTabID = item.section[0].section[0].id;
                    }
                }*/
                $scope.selectOptions.section.unshift(addAll);
                $scope.selected = $scope.selectOptions.section[0].name;
                $scope.selectedMediaLibTabID = tabID;
                $scope.mediaLibMainCategory = true;
                $scope.mediaLibSubCategory = false;
                
            }
        });
        //Avoid multiple times adding 'All' category for the tabs
        newArr = _.uniq($scope.selectOptions.section,_.property('id'));
        $scope.selectOptions.section = newArr;
        //Set the search box with empty value
        $scope.medialib.search = "";
        mediaLibContent();
    };
    function afterTabChanges(){
        $scope.printableFormat = false;
        $scope.productWeek = false;
        $scope.bookOfWeek = false;
        $scope.videoOfWeek = false;
        $scope.openContentLink = "none";
        if($scope.selectedMediaLibTab == "Ebooks"){
            $scope.productWeek = true;
            $scope.bookOfWeek = true;
        }else if($scope.selectedMediaLibTab == "Videos"){
            $scope.productWeek = true;
            $scope.videoOfWeek = true;
            $scope.openContentLink = "video";
        }else if($scope.selectedMediaLibTab == "Worksheets"){
            $scope.printableFormat = true;                
        }else if($scope.selectedMediaLibTab == "Songs"){
            $scope.openContentLink = "song";                
        }
    }
    $scope.actionChanges = function(type,id){                 
        selectedCourse = _.where($scope.activities.course, {courseid: id});
        feature_title = "";
        if(type == "product"){            
            if(selectedCourse[0].product_of_the_week){
                dataparams = {"is_active": selectedCourse[0].is_active, "printable": selectedCourse[0].is_printable, "featured": selectedCourse[0].is_featured, "premium": selectedCourse[0].is_premium, "product_of_the_week": "", "product_id":selectedCourse[0].courseid};
                feature_title = "Are you sure you want to remove from product of the week?";
            }else{
                productAction = ($scope.bookOfWeek) ? "Book" : (($scope.videoOfWeek) ? "Video" : "");
                dataparams = {"is_active": true, "printable": selectedCourse[0].is_printable, "featured": false, "premium": false, "product_of_the_week": productAction, "product_id":selectedCourse[0].courseid};
                if(selectedCourse[0].is_featured || selectedCourse[0].is_premium){
					if(!selectedCourse[0].is_active){
						feature_title = "Are you sure you want to show this product in website? Do you want to make this product to 'Product of the week'?";
					}else{
						feature_title = "Already this product is as featured/premium? Do you want to make this product to 'Product of the week'?";
					}                    
                }else{
					if(!selectedCourse[0].is_active){
						feature_title = "Are you sure you want to show this product in website? Do you want to make this product to 'Product of the week'?";
					}else{
						feature_title = "Do you want to make this product to 'Product of the week'?";
					}
				}              
            }            
        }else if(type == "print"){
            if(selectedCourse[0].is_printable){
                feature_title = "Are you sure you want to remove this product from printable?";
            }else{
                feature_title = "Are you sure you want to make this product to printable?";
            }
            dataparams = {"is_active": selectedCourse[0].is_active, "printable": !selectedCourse[0].is_printable, "featured": selectedCourse[0].is_featured, "premium": selectedCourse[0].is_premium, "product_of_the_week": "", "product_id":selectedCourse[0].courseid};            
        }else if(type == "premium"){
            if(selectedCourse[0].is_premium){
                feature_title = "Are you sure you want to remove this product from premium?";
                dataparams = {"is_active": selectedCourse[0].is_active, "printable": selectedCourse[0].is_printable, "featured": selectedCourse[0].is_featured, "premium": !selectedCourse[0].is_premium, "product_of_the_week": "", "product_id":selectedCourse[0].courseid};
            }else{
                feature_title = "Are you sure you want to make this product to premium and feature?";
                dataparams = {"is_active": selectedCourse[0].is_active, "printable": selectedCourse[0].is_printable, "featured": true, "premium": true, "product_of_the_week": "", "product_id":selectedCourse[0].courseid};
            }           
        }else if(type == "feature"){
            if(selectedCourse[0].is_featured){                
                if(selectedCourse[0].is_premium){
                    feature_title = "This product is premium. Are you sure you want to remove this product from featured and premium?";
                }else{
                    feature_title = "Are you sure you want to remove this product from featured?";
                }
                dataparams = {"is_active": selectedCourse[0].is_active, "printable": selectedCourse[0].is_printable, "featured": false, "premium": false, "product_of_the_week": "", "product_id":selectedCourse[0].courseid};
           }else{
               feature_title = "Are you sure you want to make this product to featured?";
               dataparams = {"is_active": selectedCourse[0].is_active, "printable": selectedCourse[0].is_printable, "featured": !selectedCourse[0].is_featured, "premium": selectedCourse[0].is_premium, "product_of_the_week": "", "product_id":selectedCourse[0].courseid};
           }
            
        }else if(type == "active"){
            if(selectedCourse[0].is_active){
                feature_title = "Are you sure you want to hide this product in website?";
            }else{
                feature_title = "Are you sure you want to show this product in website?";
            }
            dataparams = {"is_active": !selectedCourse[0].is_active, "printable": selectedCourse[0].is_printable, "featured": selectedCourse[0].is_featured, "premium": selectedCourse[0].is_premium, "product_of_the_week": "", "product_id":selectedCourse[0].courseid};            
        }
        if(feature_title != ""){
            var confirm = $mdDialog.confirm()
          .title(feature_title)
          .textContent()
          .ariaLabel()
          .ok('Ok')
          .cancel('Cancel');
            $mdDialog.show(confirm).then(function(result) {
                featureActionChanges(dataparams,type);
            }, function() {             

            });
        }else{
            featureActionChanges(dataparams,type);
        }        
        
    }
    function featureActionChanges(dataparams,type){
        /** To call the mediaLibrary content actions */
        sfactory.serviceCall(dataparams, tasks.getMediaLibraryActions,'listDetails').then(function(response) {          
            if(($filter('lowercase')(response.status) == 'success')){
               // mediaLibContent();
                _.each($scope.activities.course,function(item){
                    // Assign the filters dynamically to get model name dynamically
                    if(item.courseid == response.data.product_id){  
                        if(type == 'product'){
                            resetParams();
                        }
                        item.product_of_the_week = (response.data.product_of_the_week != "") ? true : false;
                        item.is_featured = response.data.featured;
                        item.is_premium = response.data.premium;
                        item.is_printable = response.data.printable;
                        item.is_active = response.data.is_active;
                    }
                    // To avoid two books/videos are active for product of week
                    /*if($scope.getCurrentProductWeek > 0 && $scope.getCurrentProductWeek != response.data.product_id && item.courseid == $scope.getCurrentProductWeek){                        
                         $timeout(function(){item.product_of_the_week = false;}, 500); 
                    }*/
                });
                $rootScope.appLoader = false;
            }else{               
                $rootScope.appLoader = false;
            }     

        }, function(error) {   
             
        });
    }
    /** Service call initiated for search */
    $scope.searchCall = function(){        
        mediaLibContent();        
    };
    function mediaLibContent(){        
        if(!$scope.callFromFilters){
              $scope.selection.filters.customFilters=[];
              _.each($scope.selection.filters,function(value,key){
                    $scope.selection.filters[key] = [];// Assign the filters dynamically to get model name dynamically

                });
          }
        if($scope.medialib.search != ""){
            dataRequest ={"filters":$scope.selection.filters,"pagination":{"itemsPerpage":$scope.selection.itemperpage,"currentPage":$scope.mdlibpagination.currentPage},"cat_id":[$scope.selectedMediaLibTabID],"parentId": $scope.selectedMediaLibID,"is_admin":true,"searchText":$scope.medialib.search};
        }else{
            dataRequest ={"filters":$scope.selection.filters,"pagination":{"itemsPerpage":$scope.selection.itemperpage,"currentPage":$scope.mdlibpagination.currentPage},"cat_id":[$scope.selectedMediaLibTabID],"parentId": $scope.selectedMediaLibID,"is_admin":true};
        }
        
          
        $scope.getCurrentProductWeek = 0;getCurrentProductWeek = [];
        sfactory.serviceCall(dataRequest, tasks.getMediaLibraryContent,'listDetails').then(function(response) {
            if(($filter('lowercase')(response.status) == 'success')){
                $scope.activities = response.data;                
                $scope.customFilters = false;
                if($scope.activities.customFilters.length > 0 ){               
                    $scope.customFilters = true;
                }
                getCurrentProductWeek = _.where($scope.activities.course, {'product_of_the_week':true});
                if(getCurrentProductWeek.length > 0){
                    $scope.getCurrentProductWeek = getCurrentProductWeek[0].courseid;                    
                }
                
                $scope.mdlibpagination.pagination = response.paginateData;
                $scope.mdlibpagination.pagination.pages=[];
                for(i=0;i<($scope.mdlibpagination.pagination.total_matched_records/$scope.selection.itemperpage);i++){
                    $scope.mdlibpagination.pagination.pages.push({index:i+1})
                }
                $scope.numPages = $scope.mdlibpagination.pagination.pages.length;
                //getAllImagesDonePromise();
                console.log('live media library content',response.data);
            }
            
            $rootScope.appLoader = false; //- this is commented to control image preload this is enable in function getAllImagesDonePromise()

        }, function(error) {

          sfactory.localService('ebook_subcategory').then(function(response) {            
            $rootScope.appLoader = false;
            $scope.activities = response.data.data;
            $scope.customFilters = false;
            if($scope.activities.customFilters.length > 0 ){               
                $scope.customFilters = true;
            }
            getCurrentProductWeek = _.where($scope.activities.course, {'product_of_the_week':true});
            if(getCurrentProductWeek){
                $scope.getCurrentProductWeek = getCurrentProductWeek[0].courseid;
            }
            $scope.mdlibpagination.pagination = response.data.paginateData;
              $scope.mdlibpagination.pagination.pages=[];
            for(i=0;i<($scope.mdlibpagination.pagination.total_matched_records/$scope.selection.itemperpage);i++){
                $scope.mdlibpagination.pagination.pages.push({index:i+1})
            }
              $scope.numPages = $scope.mdlibpagination.pagination.pages.length; 
              //getAllImagesDonePromise();
              console.log("local media library content",response.data.data)
            }, function(error) {});
        });
    }
    $scope.getPageData = function(index){        
        mediaLibContent();
    };
    /**fancy modal for video embedding*/
    /*$(".videopopup").fancybox({
        maxWidth	: 800,
        maxHeight	: 600,
        fitToView	: false,
        width		: '70%',
        height		: '70%',
        autoSize	: false,
        closeClick	: false,
        openEffect	: 'none',
        closeEffect	: 'none',
        helpers   : { title : { type : 'inside' } }
    });*/
    /* Material Modal for video /audio */
	$scope.assetPopup = function(index) {		
        dataToPassObj = {'index':index,'type':$scope.openContentLink,'data': $scope.activities.course};
        $mdDialog.show({
          controller: 'assetPopupController',
          templateUrl: 'dest/templates/assetPopupModal.html',
          parent: angular.element(document.body),
          locals: {dataToPass: dataToPassObj},          
          clickOutsideToClose:true 
        }).then(function(response){
            
        },function(){

        });
		
    };
    /** Function to get the menu details with filters for media library */
    function getMediaLib(){
        dataRequest ={};$scope.customFilters = false;
        $scope.medialib= {"search" : ""};
        $scope.switchMode='grid';
        $scope.noassetimage = 'dest/images/no_asset.png';
        $scope.callFromFilters = true;
        console.log('Media Lib');        
        $scope.mdlibpagination = {currentPage:1,paginationList:5,pagination:{}};
        sfactory.serviceCall(dataRequest, tasks.getMediaLibraryMenuContent,'listDetails').then(function(response) {
            if(($filter('lowercase')(response.status) == 'success')){
                $scope.mediaLibMainCategory = true;
                $scope.mediaLibrary =  response.data;
                $scope.filters = $scope.mediaLibrary.filters; //filters
                _.each($scope.filters,function(item){
                    $scope.selection.filters[item.name] = [];// Assign the filters dynamically to get model name dynamically

                });
                  $scope.selectedMediaLibTab = $scope.mediaLibrary.content.section[0].name;
                  $scope.selectedMediaLibID = $scope.mediaLibrary.content.section[0].id;
                  
                addAll = {"id": $scope.selectedMediaLibID, "name": "All", "class": "parent" }; //To add the 'All' category for all main tabs
                $scope.selectOptions = $scope.mediaLibrary.content.section[0];
                /*$scope.selectOptions.section.push(addAll);
                  $scope.selected =$scope.mediaLibrary.content.section[0].section[0].name;
                  if($scope.mediaLibrary.content.section[0].section[0].section === undefined  ){
                      $scope.selectedMediaLibTabID = $scope.mediaLibrary.content.section[0].section[0].id;
                      $scope.mediaLibSubCategory = false;
                  }else{
                      $scope.mediaLibSubCategory = true;
                      $scope.sub_selectOptions = $scope.mediaLibrary.content.section[0].section[0];
                      $scope.sub_selected = $scope.mediaLibrary.content.section[0].section[0].section[0].name;
                      $scope.selectedMediaLibTabID = $scope.mediaLibrary.content.section[0].section[0].section[0].id;
                  }*/
                $scope.selectOptions.section.unshift(addAll);
                $scope.selected = $scope.mediaLibrary.content.section[0].section[0].name;
                $scope.selectedMediaLibTabID = $scope.selectedMediaLibID;
                $scope.mediaLibSubCategory = false;
                afterTabChanges();
                mediaLibContent();
            }else{
                $rootScope.apploader = false;                
            }
        }, function(error) {

          sfactory.localService('mediaLib').then(function(response) {            
            $rootScope.appLoader = false;
            $scope.mediaLibMainCategory = true;
            $scope.mediaLibrary =  response.data.data;
            $scope.filters = $scope.mediaLibrary.filters; //filters
            _.each($scope.filters,function(item){
                $scope.selection.filters[item.name] = [];// Assign the filters dynamically to get model name dynamically
                
            });
              $scope.selectedMediaLibTab = $scope.mediaLibrary.content.section[0].name;
              $scope.selectedMediaLibID = $scope.mediaLibrary.content.section[0].id; 
              addAll = {"id": $scope.selectedMediaLibID, "name": "All", "class": "parent" }; //To add the 'All' category for all main tabs
              $scope.selectOptions = $scope.mediaLibrary.content.section[0];
             /* $scope.selectOptions.section.push(addAll);
              $scope.selected =$scope.mediaLibrary.content.section[0].section[0].name;
              if($scope.mediaLibrary.content.section[0].section[0].section === undefined  ){
                  $scope.selectedMediaLibTabID = $scope.mediaLibrary.content.section[0].section[0].id;
                  $scope.mediaLibSubCategory = false;
              }else{
                  $scope.mediaLibSubCategory = true;
                  $scope.sub_selectOptions = $scope.mediaLibrary.content.section[0].section[0];
                  $scope.sub_selected = $scope.mediaLibrary.content.section[0].section[0].section[0].name;
                  $scope.selectedMediaLibTabID = $scope.mediaLibrary.content.section[0].section[0].section[0].id;
              }*/
              $scope.selectOptions.section.unshift(addAll);
              $scope.selected = $scope.mediaLibrary.content.section[0].section[0].name;
              $scope.selectedMediaLibTabID = $scope.selectedMediaLibID;
              $scope.mediaLibSubCategory = false;
              afterTabChanges();
              mediaLibContent();
              console.log("local media library",response.data);
            }, function(error) {});
        });

    }
    /* Triggers after the filters from directive in mediaLibrary */
    $scope.changeFilter = function(res){ 
        $scope.activities.course = [];
        $scope.selection.filters[res.type] = res.value;
        $scope.callFromFilters = true;        
        mediaLibContent();
    }
    
    /*For the itemperpage in mediaLibrary */
   $scope.changePageItemCount = function(){
       $scope.activities.course = [];
       mediaLibContent();
   };
    /** Triggers after choosing category in mediaLibrary **/
    $scope.getSubjectAct = function(option){
        $scope.callFromFilters = false;
        _.each($scope.mediaLibrary.content.section,function(item){
            if(item.name == $scope.selectedMediaLibTab){
                _.each(item.section,function(value){
                    if(value.id == option.id){                                              
                        $scope.selected = option.name;
                        if(value.section === undefined  ){
                          $scope.mediaLibSubCategory = false;
                            $scope.selectedMediaLibTabID = value.id;
                        }else{
                          $scope.mediaLibSubCategory = true;
                          $scope.sub_selectOptions = value;
                          $scope.sub_selected = value.section[0].name;
                          $scope.selectedMediaLibTabID = value.section[0].id;
                        } 
                    }
                });
                
            }
        });
        mediaLibContent();
    }
    /** Triggers after choosing sub category in mediaLibrary **/
    $scope.getActivity = function(data){
        $scope.callFromFilters = false;
        $scope.selectedMediaLibTabID = data.id;
        $scope.sub_selected = data.name;
        mediaLibContent();        
    }
    /* Method to get child tab contents */
    $scope.getChildTabData = function(parentIndex,index,selectedLevel){
        if(parentIndex === 0){
          if(!$scope.contents.activeLevel[index]){
                $scope.contents.activeLevel = [false,false];
                $scope.contents.activeLevel[index] = true;
                dataRequest = {
                    content:selectedLevel.name,
                    type:courseType
                };
            }  
        }
        else{
            dataRequest = {
                content:$scope.contents.tabs[parentIndex].categories[index].name,
                type:$scope.contents.tabs[parentIndex].name
            };
        }
        currentState.content = dataRequest.content;
        currentState.type = dataRequest.type;
        currentState.parentIndex = parentIndex;
        currentState.childIndex = index;
        getData(parentIndex);
    };
    
    /* Method to get contents */
    function getData(index) {
        localTask = (index === 0) ? 'contentmanagement' : 'number_success';
        $scope.contents.currentSection = null;
        var myDef = $q.defer();
        sfactory.serviceCall(dataRequest, tasks.getContents, 'listDetails').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                $scope.contents.course = response.data.courses;
                courseType = response.data.name;
                if(angular.isDefined(response.data.header)){
                   $scope.contents.tabs = response.data.header;
                   $scope.contents.selectedTab = response.data.header[0].name;
                    myDef.resolve();
                }
                if(angular.isDefined(response.data.filters)){
                    $scope.contents.filters = response.data.filters;
                }
                $scope.contents.activeSection = currentState.sectionIndex;
                if(angular.isDefined(response.data.courses.sections) || angular.isDefined(response.data.courses.units)){
                    $scope.contents.currentSection = (index === 0) ? response.data.courses.sections[$scope.contents.activeSection] : response.data.courses.units[$scope.contents.activeSection];
                }
                sessionService.setData('currentstate',currentState);
            }
            else{
                myDef.reject();
            }
            $rootScope.appLoader = false;
        }, function(error) {
            sfactory.localService(localTask).then(function(response) {
                $scope.contents.course = response.data.courses;
                courseType = response.data.name;
                if(angular.isDefined(response.data.header)){
                   $scope.contents.tabs = response.data.header;
                   $scope.contents.selectedTab = response.data.header[0].name;
                    myDef.resolve();
                }
                if(angular.isDefined(response.data.filters)){
                    $scope.contents.filters = response.data.filters;
                }
                $scope.selection.filter='all';
                $scope.contents.activeSection = currentState.sectionIndex;
                $scope.contents.currentSection = (index === 0) ? response.data.courses.sections[$scope.contents.activeSection] : response.data.courses.units[$scope.contents.activeSection];
                sessionService.setData('currentstate',currentState);
            }, function(error) {});
        });
        return myDef.promise;
    };

    /* Method to reset params for products */
    function resetParams(){
        _.each($scope.activities.course,function(item){
            // Reset the product of the week prop...
            item.product_of_the_week = false;
        });
    }
    
    function getAllImagesDonePromise() {       
       var deferred;
        var dArr = [];
        var imgpaths = [];
        _.each($scope.activities.course,function(item,index){
            deferred = $q.defer();
            imgpaths.push({
                path: item.thumburl,
                callback: deferred.resolve
            });
            dArr.push(deferred.promise);
        });
        $scope.imgpaths = imgpaths;
        $q.all(dArr).then(function(){
            $rootScope.appLoader = false;
            //console.log('all loaded');
        });
    }
    
    /* Method to initialize Controller */
    function initializeController() {
        $scope.angular = angular;
        $scope.activetab={};
        dataRequest={};
        $scope.writingSuccess={menu:[]};
        $scope.contents={levels:[],activeLevel:[true,false],currentSection:null};
        tasks = taskService.getTasks('contentmanagementController');
        currentState = angular.fromJson(sessionService.getData('currentstate'));
        if(currentState === null){
            currentState = {type:'Phonics Adventure',content:'Textbook1',parentIndex:0,childIndex:0,sectionIndex:0};
        }
        dataRequest.header = true;
        dataRequest.type = currentState.type;
        dataRequest.content = currentState.content;
        $scope.activeparenttab = currentState.parentIndex;
        $scope.activetab.childIndex = currentState.childIndex;
        $scope.sectionIndex = currentState.sectionIndex;
        if(dataRequest.type === 'Writing Success'){
            getWritingsuccessData(dataRequest.type);
        }
        else if(dataRequest.type == 'Media Library'){ 
            getData($scope.activeparenttab).then(function(response){
                $scope.getTabData($scope.activeparenttab,dataRequest.type); 
            },function(errorResponse){
                
            });                       
        }
        else{
            getData($scope.activeparenttab);
        }
    };

    initializeController();
    
}]);