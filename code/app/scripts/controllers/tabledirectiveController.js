advancePubapp.controller('tabledirectiveController',['$scope','$filter','PaginationService','sfactory','getParamsDelete','$filter','$mdDialog','$rootScope','cacheService','messagingService','$state',function($scope,$filter,PaginationService,sfactory,getParamsDelete,$filter,$mdDialog,$rootScope,cacheService,messagingService,$state){
	var paginationObj;
    var notToRefresh = false,datatableSearchObj={};
	$scope.$watchCollection('datasource.data',function(newVal,oldVal){
        if(!notToRefresh && angular.isDefined(newVal)){
		  $scope.datasource.data = newVal;
		  $scope.paginateProcess(newVal);
          $scope.items = newVal;
        }
        else{
            notToRefresh = false;
        }
        if(angular.isDefined($scope.datatable) && angular.isDefined($scope.datatable.filterTable)){
            //$scope.datatable.filterTable($scope.tabName);
        }
	});
		
    /*Method to close add single/multi record while edit/delete/view */
	$scope.setParentvalues = function(response){
		$scope.closeregisteration({'response':true});
	};
	
    /* Method to toggle check all check boxes */
    $scope.processAllData = function(){ 
        var sourceData = ($scope.searchFiltereddata ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data));
        if($scope.headerCheck.box){
            toggleCheckbool(sourceData,true);
        }
        else{
            toggleCheckbool(sourceData,false);
        }        
    };
     
    /* Method to delete all records */
    $scope.deleteAllrows = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
              var confirm = $mdDialog.confirm()
              .title('Are you sure you want to delete the '+ ev+'?')
              .textContent('')
              .ariaLabel('Lucky day')
              .targetEvent(ev)
              .ok('Delete')
              .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            var task = $scope.datasource.ismultiDel.task;
            var view = $scope.datasource.ismultiDel.viewname;
            options = {val:[],title : []};
            $scope.sourceData = ($scope.searchFiltereddata ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data));
            if($scope.headerCheck.box){
                _.each($scope.sourceData,function(body){
                    $scope.chkarrayall.push(body.id);
                    $scope.chkarrayalltitle.push(body.name);
                    $scope.selectedItems.push(body);
                });            
            }
            _.each($scope.sourceData,function(body){
                if(body.row_Checkbox){
                    $scope.selectedItems.push(body);
                    $scope.chkarrayall.push(body.id);
                    $scope.chkarrayalltitle.push(body.name);
                }    
                options.val=_.difference($scope.chkarrayall, $scope.chkarray);
                options.val=_.uniq(options.val);
                options.title=_.difference($scope.chkarrayalltitle, $scope.chkarraytitle);
                options.title=_.uniq(options.title);
            });    

            var deleteActionAll = getParamsDelete.args(view,options.val,options.title);
            sfactory.serviceCall(JSON.stringify(deleteActionAll.params),task,deleteActionAll.params.isAdmin).then(function(response){
                options = {val:[],title : []};
                $scope.chkarrayall = [];$scope.chkarrayalltitle = [];
                $scope.headerCheck.box = false;
                toggleCheckbool($scope.datasource.data,false);
                if($filter('lowercase')(response.status) == 'success'){
                    var deletableItems = [];
                        _.each(response.data.deletable,function(items){
							if(items){
								deletableItems.push(_.where($scope.sourceData, {'id':Number(items)}));
							}
                        });
                        if(deletableItems.length > 0){
                            _.each(deletableItems,function(selectedItems){
                                deleteUniq($scope.datasource.data, 'id', selectedItems[0].id); 
                            });
                        }
						if(angular.isDefined($scope.datatable) && angular.isDefined($scope.datatable.filterTable)){
                        	$scope.datatable.filterTable($scope.tabName);      
						}
                    if(typeof(response.data.non_deletable)!= "undefined" && response.data.non_deletable.length > 0){
                        var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-danger'};
                        $scope.$emit('emitFromdeleteBaner',{'alertBaner':banerData});
                    }else{
                        var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-success'};
                        $scope.$emit('emitFromdeleteBaner',{'alertBaner':banerData});
                    }                    
                }
                else{
                    var banerData = {'message':response.message,'showBaner':true,'banerClass':'alert-warning'};
                    $scope.$emit('emitFromdeleteBaner',{'alertBaner':banerData});
                }
				$rootScope.appLoader = false;
            },function(error){
                $scope.headerCheck.box = false;
                toggleCheckbool($scope.datasource.data,false);
            });
        }, function() {
            $scope.headerCheck.box = false;
            toggleCheckbool($scope.datasource.data,false);
        });
    };

    $scope.breadcrumbFnlink = function(str, index){
       $scope.$emit('emitbreadcrumbFnlink', str, index);
    };
    
    $scope.tableDatafnlink=function(event,body,fuctionVal){
        event.preventDefault();
        $scope.classcatid = body;
        $scope.classcatid.fuctionVal =fuctionVal;
        $scope.$emit('emittableDataList',{'catergorydata':$scope.classcatid});
    };
    
    
    /* Method as callback for row click event */
    $scope.assignRow=function(event,body) {
		$(".trow").removeClass('rowselect');
		$(".selectrow"+body.id).addClass('rowselect');
        $scope.assignAdmin = body;
        //$scope.$emit('emitadmin',{'admindata':$scope.assignAdmin});
        var classmgmtscope = angular.element(jQuery("#classmanagementdetails")).scope();
        classmgmtscope.gatherValues($scope.assignAdmin);
    };
    /** Function for sending multi user message */
    $scope.sendMultiMessage = function(){
        messagingService.userIds = $scope.checkedChkBoxArr;
        console.log(messagingService.userIds);
        $state.go('adminLanding.adminmessage',{'msgtype': 1});
    };
    
    /* Method to toggle individual checkboxes */
    $scope.individual_check = function(body,head){
        var sourceData = ($scope.searchFiltereddata ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data));
        if(body.row_Checkbox){
            if($scope.checkboxenable <= sourceData.length) {$scope.checkboxenable++;} 
            $scope.checkedChkBoxArr.push(body.id);
        }
        else{
            if($scope.checkboxenable > 0) {$scope.checkboxenable--;}
            $scope.checkedChkBoxArr = _.without($scope.checkedChkBoxArr, body.id);
            
        }
        var count = 0;
        _.each(sourceData,function(items){
            if(_.contains($scope.checkedChkBoxArr, items.id)){ 
                count++;
            }
        });
        if(count == sourceData.length){
            $scope.headerCheck.box = true;
        }else{
            $scope.headerCheck.box = false;
        }
        //$scope.activeCheckbox = true;
        $scope.activeCheckbox = !$scope.activeCheckbox;
    };

    
    /* Method to call paginationservice for page order */
    $scope.paginateProcess = function(data,page){
		//data = $filter('orderBy')(data, $scope.sortType, $scope.sortReverse);
        //$scope.pager = PaginationService.GetPager(data.length,page);// get pager object from service
        //$scope.items = data.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);// get current page of items
    };
    
    /* set page based on the data */
    $scope.setPage = function(page) {
        if (page < 1 || page > $scope.pager.totalPages) {
            return;
        }
        var data = ($scope.searchFiltereddata && $scope.searchFiltereddata.length > 0) ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data);
        $scope.sortedData = $filter('orderBy')(data, $scope.sortType, $scope.sortReverse);
        $scope.paginateProcess($scope.sortedData,page);
    };

    /* search result using filter */
    $scope.updateSearch = function(searchedText,data){
		var dataTofilter = (data ? data : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data));
        var pluckedData = [],searchedData={},filterObj={},tableRow={};
		$scope.rectifiedData = [];
		_.each(dataTofilter,function(item){
			tableRow = {};
            angular.forEach(datatableSearchObj[$scope.datasource.pageName].values, function(value, key) {
                tableRow[value] = item[value];
            });
            $scope.rectifiedData.push(tableRow);
		});
       searchedData = $filter('filter')($scope.rectifiedData, searchedText);
		_.each(searchedData,function(item){
            filterObj={};
            filterObj[datatableSearchObj[$scope.datasource.pageName].key] = item[datatableSearchObj[$scope.datasource.pageName].key];
			pluckedData.push( _.where(dataTofilter,filterObj)[0]);
		});
		$scope.searchFiltereddata = pluckedData;
		$scope.paginateProcess($scope.searchFiltereddata);
        $scope.isSearched = true;
    };
    
    /* Method to filter based on the button actioons */
   if(typeof($scope.datatable) != "undefined"){
            $scope.datatable.filterTable = function(selectedOption, body, isDelete){
            _.each($scope.datasource.tabList,function(item){                
                item.isActive = false;
            });
            selectedOption.isActive = true;
            if(!angular.isDefined(selectedOption.name)){
				selectedOption.name = angular.copy($scope.tabName.name);
				$scope.tabName.isActive = true;
                notToRefresh = true;
            }
			else{             
				selectedOption.isActive = true;
				$scope.tabName = selectedOption;
                _.each($scope.datasource.tabList,function(item){
                    //method for default all option need to check
					if(item.name == selectedOption.name){
						item.isActive = true;
					}else{
						item.isActive = false;
					}
				});
			} 
            var mapbtnRole = {'group admin':'admin',student:'Student',teacher:'Teacher',parent:'Parent',all:'All'};
            var datatTofilter = $scope.isSearched ? $scope.searchFiltereddata : $scope.datasource.data;
			if($scope.datasource.pageName == 'usermanagement' || $scope.datasource.pageName == 'usermanagementtrash'){
				$scope.roleFiltereddata = ((selectedOption.name.toLowerCase() != 'all' && ($scope.datasource.pageName == 'usermanagement' || $scope.datasource.pageName == 'usermanagementtrash') ) ? $filter('filter')($scope.datasource.data, {roleType:mapbtnRole[selectedOption.name.toLowerCase()]}) : $scope.datasource.data);
				
				//Method non active users
				$scope.roleFiltereddata = (selectedOption.name == "Non-Active") ? $scope.roleFiltereddata = $filter('filter')($scope.roleFiltereddata,{useractivated:false}) : $scope.roleFiltereddata = $filter('filter')($scope.roleFiltereddata,{useractivated:true}); 
			}
            if(!isDelete && $scope.dataSearch.text != null) $scope.updateSearch($scope.dataSearch.text,$scope.roleFiltereddata);
            else {
                var dataTofilter = ($scope.searchFiltereddata ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data));
                $scope.paginateProcess(dataTofilter);
            }
            $scope.updatecheckBox(dataTofilter);
        }
    };
   
   $scope.updatecheckBox = function(data){
	   if(angular.isDefined(data)){
		   var cnt = 0;
		   $scope.headerCheck.box = false;
			_.each(data,function(items){
				if(angular.isArray($scope.checkedChkBoxArr)){
					if(_.contains($scope.checkedChkBoxArr, items.id)){ 
						cnt++;
					}
				}
			});
			if(data.length != 0){
				if(cnt == data.length){
					$scope.headerCheck.box = true;
				}
			}
	   }
    };
    
    /* Method to set sort order */
    $scope.setSortorder = function(head,index){
        $scope.pageChanged($scope.paginationdata.currentPage,null,head.bind_val,"toggle");
        $scope.isSortAsc = !($scope.isSortAsc);
    };
    
    /* Method to change the pagination */
    $scope.pageChanged = function(currentPage,filterby,sortCoulmn,sortOrder,issearchclicked){
        paginationObj = {
			   //filterby  : (typeof filterby == "undefined") ? "": filterby,	
			   filterby  : (typeof filterby != "undefined") ? filterby: (angular.isDefined(paginationObj) && angular.isDefined(paginationObj.filterby) && paginationObj.filterby !="") ? paginationObj.filterby :"",	
               itemsPerpage:($scope.pagination.itemsPerPage.value !== 'All') ? $scope.pagination.itemsPerPage.value : "",
               currentPage:angular.isDefined(currentPage) ? currentPage : $scope.paginationdata.currentPage,
               searchQuery:($scope.dataSearch.text !== null ) ? $scope.dataSearch.text : "",
               searchTable:($scope.dataSearch.text && issearchclicked) ? true : false
        };
        var paginationData = [{filterby:filterby},{sortCoulmn:sortCoulmn},{sortOrder:sortOrder}];
        angular.forEach(paginationData,function(obj){
            var key = Object.keys(obj)[0];
            if(angular.isDefined(obj[key]) && obj[key] !== null)
               paginationObj[key] = obj[key];
        })
        $scope.getSourcedata({response : paginationObj});
    }; 

    /* Method to filter table */
    $scope.filterTable = function(tab){
		//filter table
		$scope.headerCheck.box = false;
		$scope.checkboxenable = 0;
		//filter table
		$scope.selectedFilterTab = tab.name; 
        var userRole = _.find(cacheService.get('userroles'), function(userRole){ return userRole.rolname == tab.name;});
        var roleId = angular.isDefined(userRole) ? userRole.roleid : "";
        $scope.pageChanged(1,roleId,"name","desc");
        angular.forEach($scope.datasource.tabList,function(tabItem){
            tabItem.isActive = (tabItem.name === tab.name)
        });
    };
     
    $scope.searchItems = function(){
		filterby  = (angular.isDefined(paginationObj.filterby && paginationObj.filterby != "")) ? paginationObj.filterby: null;
		$scope.pageChanged($scope.paginationdata.currentPage,filterby,null,null,true);
        //$scope.pageChanged($scope.paginationdata.currentPage,null,null,null,true);
    };
    
    /* Method to capture emitted values from deep child directive */
    $scope.captureBaner = function(value){
        var banerData = {'message':value.message,'showBaner':value.showBaner,'banerClass':value.banerClass};
        var deltedData = value.contentItems ? value.contentItems : null;
        if(deltedData != null){
            var curItemIndex = $scope.items.indexOf(deltedData);
            if(curItemIndex > -1) {
                $scope.items.splice(curItemIndex,1); 
            }    
        }
        $scope.$emit('emitFromDirectiveBaner',{'alertBaner':banerData,'list':value.switchMenu});
    };
    
    /* Method to toggle individual check box bool based on overall checkbox status */
    function toggleCheckbool(sourceData,bool){
        _.each(sourceData,function(items){
            items.row_Checkbox = bool; 
            if(bool) $scope.checkedChkBoxArr.push(items.id);
            else $scope.checkedChkBoxArr = _.without($scope.checkedChkBoxArr, items.id); 
        });
        if(bool) $scope.checkboxenable = sourceData.length;
        else if(!bool) $scope.checkboxenable = 0;
    };
    
    /* Method to initiate properties */
    function initiateController(){
        //properties for sort table
        //$scope.paginationdata = {currentPage:1};
        $scope.chkarrayall = [];
        $scope.pagination ={
            numPages : [{value:10,isSelected:true},{value:20,isSelected:false},{value:50,isSelected:false},{value:100,isSelected:false},{value:'All',isSelected:false}]
        };
        $scope.chkarray=[];
        $scope.isSortAsc = false;
        $scope.chkarrayalltitle = [];
        $scope.chkarraytitle=[];
        $scope.checkboxenable = 0;
        $scope.selectedItems = [];
        $scope.checkedChkBoxArr = [];
        var options = {};
        $scope.assignAdmin={};
        var sourceData = null;
        $scope.dataSearch = {'text':null};
        $scope.sortType     = $scope.datasource.sortType; // set the default sort type
        $scope.sortReverse  =  $scope.datasource.sortReverse ? $scope.datasource.sortReverse : true;  // set the default sort order
        $scope.headerCheck ={box:false};
        $scope.radio = {model : 'All'};
        $scope.tabName = {isActive:true,name:"All"};
        /* pagination properties initialized */
        $scope.paginateRange = _.range(1, $scope.datasource.data.length); // dummy array of items to be paged
        $scope.pager = {};
        $scope.setPage(1);
    	$scope.rectifiedData = []; 
        datatableSearchObj ={
                usermanagement:{
                    key:'username',
                    values:['name','username','roleType','email']
                },
				usermanagementtrash:{
					key:'username',
                    values:['name','username','registerdate','roleType']
				},
                groupmanagement:{
                    key :'groupname',
                    values:['groupname','groupcode','groupadminname','registerdate']
                },
                classmanagement:{
                    key :'name',
                    values:['name','classcode','roleType','class_admin','groupname','registerdate','course_count','user_count']
                },
                classadminmanagement:{
                    key:'name',
                    values:['name','username','usertype']
                },
                classusermanagement:{
                    key:'name',
                    values:['name','username']
                },
                classuserviewmanagement:{
                    key:'name',
                    values:['name','username','usertype','email','phone_no']
                },
                classcoursemanagement:{
                    key:'coursename',
                    values:['coursename','description','category_name']
                },
                content:{
                    key:'name',
                    values:['name','coursecnt','lessoncnt','activitycnt']
                },
                course:{
                    key:'name',
                    values:['name','summary','feetype']
                },
                section:{
                    key:'name',
                    values:['name','summary']
                },
                activity:{
                    key:'name',
                    values:['name','summary']
                },
                userreport:{
                    key:'username',
                    values:['firstname','lastname','usertype','username','groupname','status','created','lastlogin','lastip']
                },
                socialreport:{
                    key:'media_type',
                    values:['media_type','total_shares','facebook_shares','twitter_shares','google_shares','instagram_shares']
                },
                classreport:{
                    key:'classname',
                    values:['classname','class_admin','enrolled_count','status','date']
                },
                numbersuccesstable:{
                    key:'label',
                    values:['label','no_of_enrolled_users','no_of_activities','no_of_students_completed','no_of_visits','no_of_shares','time_spent']
                },
                writingsuccesstable:{
                    key:'label',
                    values:['label','no_of_enrolled_users','no_of_activities','no_of_students_completed','no_of_visits','no_of_shares','time_spent']
                },
                readingsuccesstable:{
                    key:'label',
                    values:['label','no_of_enrolled_users','no_of_activities','no_of_students_completed','no_of_visits','no_of_shares','time_spent']
                },
                phonicsreportstable:{
                    key:'label',
                    values:['label','no_of_enrolled_users','no_of_activities','no_of_students_completed','no_of_visits','no_of_shares','time_spent']
                },
                comparativereportstable:{
                    key:'label',
                    values:['label','no_of_activities','no_of_students_completed','no_of_visits','no_of_shares','time_spent']
                },
        };
    };
    
    initiateController();
    
}]);



/* Method to delete values from array */
var deleteUniq = function(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 
           arr.splice(i,1);
       }
    }
    return arr;
};

advancePubapp.animation('.rm_bx_bor', function($animate) {
  return {
    enter: function(element, done) {
        var selectorElem = $(element).attr('selectorElem');
        var container = $('body');
        $(".close_btn_act").css("pointer-events","none");
        element.animate({"max-height":"3000"},1500,function(){
            var offset_top = $('#'+selectorElem).offset().top;
            $(".close_btn_act").css("pointer-events","auto");
            container.stop().animate({
                scrollTop: offset_top - 60
            },500);
        });
    },
    leave: function(element, done) {
        if(document.getElementsByClassName("animate_slider").length === 0){
			var selectorElem = $(element).attr('selectorElem');
			var container = $('body');
			element.css('overflow','hidden');
			element.animate({"max-height":"0"},500,function(){
				element.hide();
				var offset_top = $('#'+selectorElem).offset().top;
				container.stop().animate({
					scrollTop: offset_top - 60
				},500);
			});
		}
        else{
			element.hide();
		}
    }
  };
});


advancePubapp.animation('.animate_slider', function($animate) {
 return {
    enter: function(element, done) {
        window.scrollTo(0,0);
        element.css('display','inline-block');
        element.animate({"max-height":'3000px'},500,function(){
        element.css('overflow','visible');
        element.css('display','table');
        });
        
    },
    leave: function(element, done) {
        element.css('overflow','hidden');
        element.css('display','inline-block');
        element.slideUp();
        element.animate({"max-height":'0'},500);
        window.scrollTo(0,0);
    }
  };
});

advancePubapp.animation('.animate_slider_cont', function() {
 return {
    enter: function(element, done) {
        element.css('display','inline-block');
        element.animate({"max-height":'3000px'},500,function(){
            element.css('overflow','visible');
        });
        
    },
    leave: function(element, done) {
        element.css('overflow','hidden');
        element.slideUp();
        element.animate({"max-height":'0'},500);
    }
  };
});



    
  
    
    
    
    