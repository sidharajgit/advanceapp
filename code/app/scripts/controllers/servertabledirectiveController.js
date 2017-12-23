advancePubapp.controller('servertabledirectiveController',['$scope','$filter','PaginationService','sfactory','getParamsDelete','$filter','$mdDialog','$rootScope','$log','taskService','paginationDatamanagement','$state', function($scope,$filter,PaginationService,sfactory,getParamsDelete,$filter,$mdDialog,$rootScope,$log,taskService,paginationDatamanagement,$state){
    var notToRefresh = false,datatableSearchObj={};
	$scope.$watchCollection('datasource.data',function(newVal,oldVal){
        if(!notToRefresh && angular.isDefined(newVal)){
            $scope.datasource.data = newVal;
            /*if($scope.datasource.paginateParams && newVal.length > $scope.datasource.paginateParams.itemsPerpage){
                $scope.pageChanged();
            }*/
            $scope.paginateProcess(newVal);
        }
        else{
            notToRefresh = false;
        }
        if($scope.roleFiltereddata && $scope.roleFiltereddata.length >= 0){
			$scope.datatable.filterTable($scope.tabName);
		}
	}); 
	
    /*Method to close add single/multi record while edit/delete/view */
	$scope.setParentvalues = function(response){
		$scope.closeregisteration({'response':true});
	}
	
	$scope.buttonToggleupdate = function(response){
        (response.id) ? $scope.cachePagination.push(response.id) : $scope.cachePagination = [];
		$scope.isCheckedall = response.ischeckedall;
		$scope.prevStatus = response.prevStatus;
		if($scope.cachePagination.length){
			if(response.status){
			   $scope.cachePagination = _.uniq($scope.cachePagination);
			}
			else{
				if(response.prevStatus == 'add'){ 
					$scope.cachePagination = _.uniq($scope.cachePagination);
				}else{
					$scope.cachePagination = _.without($scope.cachePagination,response.id);
				}
			}
		}
        $scope.buttonupdate({'response':response});
    }
    
    /* Method to toggle check all check boxes */
    $scope.processAllData = function(){ 
        var sourceData = ($scope.searchFiltereddata ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data));
        //method for in which tab chekbox is enable
        if($scope.headerCheck.box){
            toggleCheckbool(sourceData,true);
        }
        else{
            toggleCheckbool(sourceData,false);
        }        
    }

    $scope.navigateToStudentProfile = function(body){
        /*sfactory.bufferedData.studentProfile = body;
        sfactory.bufferedData.types = "student";
        $state.go('adminLanding.studentprofile');*/
    };
     
    /* Method to delete all records */
    $scope.deleteAllrows = function(ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Are you sure you want to delete the selected students ?')
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
            sfactory.serviceCall(JSON.stringify(deleteActionAll.params),task).then(function(response){
                options = {val:[],title : []};
                $scope.chkarrayall = [];$scope.chkarrayalltitle = [];
                $scope.headerCheck.box = false;
                toggleCheckbool($scope.datasource.data,false);
                if($filter('lowercase')(response.status) == 'success'){
                    var deletableItems = [];
                        _.each(response.data.deletable,function(items){
                           deletableItems.push(_.where($scope.sourceData, {'id':items}));
                        });
                        if(deletableItems.length > 0){
                            _.each(deletableItems,function(selectedItems){
                                deleteUniq($scope.datasource.data, 'id', selectedItems[0].id); 
                            });
                        }
                        $scope.datatable.filterTable($scope.tabName);                    
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
    }
   $scope.tableDatafnlink=function(event,body,fuctionVal)
    {
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
        var classmgmtscope = angular.element(jQuery("#classmanagement")).scope();
        classmgmtscope.gatherValues($scope.assignAdmin);
    };

    /* Method to toggle individual checkboxes */
    $scope.individual_check = function(body,head){
        var sourceData = ($scope.searchFiltereddata ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data));
        if($scope.headerCheck.box){  
            if(_.contains($scope.chkarray, body.id)){ 
                $scope.chkarray= _.without($scope.chkarray, body.id);    
            }
            else{
                $scope.chkarray.push(body.id);				  
            }		  
            if(_.contains($scope.chkarraytitle, body.name)){ 
                $scope.chkarraytitle= _.without($scope.chkarraytitle, body.name);    
            }
            else{ 
                $scope.chkarraytitle.push(body.name);				  
            }
        }
        if(body.row_Checkbox){
            if($scope.checkboxenable <= sourceData.length) $scope.checkboxenable++;
        }
        else{
            if($scope.checkboxenable > 0) $scope.checkboxenable--;
        }
        if($scope.checkboxenable == sourceData.length)
            $scope.headerCheck.box = true;
        else $scope.headerCheck.box = false;
    }
    
    
    /* Method to call paginationservice for page order */
    $scope.paginateProcess = function(data,page){
		data = $filter('orderBy')(data, $scope.sortType, $scope.sortReverse);
        $scope.pager = PaginationService.GetPager(data.length,page);// get pager object from service
        $scope.items = data.slice();// get current page of items
    }
    
    /* set page based on the data */
    $scope.setPage = function(page) {
        if (page < 1 || page > $scope.pager.totalPages) {
            return;
        }
        var data = ($scope.searchFiltereddata && $scope.searchFiltereddata.length > 0) ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data);
        $scope.sortedData = $filter('orderBy')(data, $scope.sortType, $scope.sortReverse);
        $scope.paginateProcess($scope.sortedData,page);
    }
    
    /* Method to filter based on the button actioons */
    if(typeof($scope.datatable) != "undefined"){
            $scope.datatable.filterTable = function(selectedOption,isDelete){
         
            if($scope.tabName.name == selectedOption.name){
                $scope.headerCheck.box = true;
            }else{
                $scope.headerCheck.box = false;
            }    
                
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
            $scope.roleFiltereddata = (selectedOption.name.toLowerCase() != 'all' ? $filter('filter')($scope.datasource.data, {roleType:mapbtnRole[selectedOption.name.toLowerCase()]}) : $scope.datasource.data);
            if(!isDelete && $scope.dataSearch.text != null) $scope.updateSearch($scope.dataSearch.text,$scope.roleFiltereddata);
            else {
                var dataTofilter = ($scope.searchFiltereddata ? $scope.searchFiltereddata : ($scope.roleFiltereddata ? $scope.roleFiltereddata : $scope.datasource.data));
                $scope.paginateProcess(dataTofilter);
            }
            $scope.processAllData();    
           
        }
    }
    
    /* Method to set sort order */
    $scope.setSortorder = function(head){

        if(!$scope.datasource.data.length) return;

        if(head.isSortable){
            /*server side sorting*/
            $scope.sortReverse = !$scope.sortReverse;
            $scope.sorting = {'column':head.bind_val,'order':$scope.sortReverse ? 'asc' : 'desc'};
            $scope.pageChanged();
        }
        else return false;
    }
    
  
    /* Method to set sort up icon order */
    $scope.sortDowndecider = function(head){
        if($scope.sortType && head.bind_val.toLowerCase() == $scope.sortType.toLowerCase() && $scope.sortReverse) return true;
    }
    
    /* Method to set sort up icon order */
    $scope.sortUpdecider = function(head){
        if($scope.sortType && head.bind_val.toLowerCase() == $scope.sortType.toLowerCase() && !$scope.sortReverse) return true;
    }
    
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
        });
        if(bool) $scope.checkboxenable = sourceData.length;
        else if(!bool) $scope.checkboxenable = 0;
    }
    
    $scope.assigncontentToStudent = function(response){
        $scope.assigncc({'response':response});
    }

	//table page search
	$scope.tablePageSearch = function(){
		if($scope.dataSearch.text == ''){
			$scope.pageChanged();
		}
	}
	
    $scope.pageChanged = function(isSearch) {
        singletimeupdate = ((!singletimeupdate && isSearch && $scope.dataSearch.text) ? true : false);
        /*check total record against total matched records for sorting*/
        if(singletimeupdate && !isSearch && $scope.datasource && $scope.datasource.paginateData && ($scope.datasource.paginateData.total_records === $scope.datasource.paginateData.total_matched_records)){
            $scope.dataSearch.text = '';
        }
        inputReq = $scope.datasource.paginateParams;
        inputReq.currentPage = $scope.pagination.currentPage;
        inputReq.sortOrder = $scope.sorting ? $scope.sorting.order : inputReq.sortOrder;
        inputReq.sortCoulmn = $scope.sorting ? $scope.sorting.column :  inputReq.sortCoulmn;
        inputReq.searchQuery = $scope.dataSearch.text;
        inputReq.itemsPerpage = ($scope.pagination.itemsPerPage.value !== 'All') ? $scope.pagination.itemsPerPage.value : "";
        inputReq.searchTable = ($scope.dataSearch.text && isSearch) ? true : false
        sfactory.serviceCall(JSON.stringify(inputReq),$scope.datasource.paginationAPI,'listDetails').then(function(response){
            //user list response comes here...
            if($scope.datasource.isDrilldown){
                if($scope.cachePagination.length){
                    _.each($scope.cachePagination,function(items,index){
                        var matchedVal = _.where(response.data[$scope.datasource.resKey],{'id':items});
                        if(matchedVal.length) {
                            matchedVal[0].studentAdded = true;
                        }
                    });
                    $scope.datasource.data = response.data[$scope.datasource.resKey];
                    $scope.datasource.paginateData = response.data['paginateData'];
                }
                else{
					if($scope.isCheckedall){
						_.each(response.data[$scope.datasource.resKey],function(items,index){
							items.studentAdded = true;
                        });
					}
					$scope.datasource.data = response.data[$scope.datasource.resKey];
                    $scope.datasource.paginateData = response.data['paginateData'];                    
                }
            }
            else{ 
				 if($scope.cachePagination.length){
					/* Method for previous stuatus based works */ 
					if($scope.prevStatus == 'add' || $scope.prevStatus == 'remove'){
						_.each(response.data,function(items,index){
							($scope.prevStatus == 'add') ? items.studentAdded = true : items.studentAdded = false;
						});	
					}	
					 
					_.each($scope.cachePagination,function(items,index){
						var matchedVal = _.where(response.data,{'id':items});
						if(matchedVal.length) {
							(angular.isUndefined($scope.prevStatus)) ? matchedVal[0].studentAdded = true : ($scope.prevStatus == 'add') ? matchedVal[0].studentAdded = false :matchedVal[0].studentAdded = true;
						}
					}); 
                   
                    $scope.datasource.data = response.data;
                    $scope.datasource.paginateData = response.paginateData;
                }
                else{
					if($scope.isCheckedall || (!$scope.isCheckedall && $scope.prevStatus == 'add')){
						_.each(response.data,function(items,index){
							items.studentAdded = true;
                        });
					} 
                    $scope.datasource.data = response.data;
                    $scope.datasource.paginateData = response.paginateData;                    
                }
                // convert UTC time to current timezone time
                if($scope.datasource.pageName=="reportsData" || $scope.datasource.pageName=="teacherStudentsData"){
                       _.each($scope.datasource.data, function(item){
                           if(item.lastvisitDate!="" && item.lastvisitDate!="NA"){
                                var lastloginDate = new Date(item.lastvisitDate+' UTC');                        
                                item.lastvisitDate = moment(lastloginDate).format("MM/DD/YYYY");  
                            }
                      });
                }
            }
            $scope.pagination.totalItems = (!$scope.datasource.paginateData.isDbempty) ? $scope.datasource.paginateData.total_matched_records : 1
            $rootScope.appLoader = false;
        },function(error){
            var localTask = "classUserlist";
            sfactory.localService(localTask).then(function(response){
                $scope.datasource.data = response.data.data;
                $scope.datasource.paginateData = response.data.paginateData;
            },function(error){
            });
        });
    };
    
    initiateController();
    var singletimeupdate;
    /* Method to initiate properties */
    function initiateController(){
        $scope.cachePagination = paginationDatamanagement.selectedItems;
        //Properties for pagination
        $scope.pagination = {
            currentPage: 1,
            totalItems: $scope.datasource.paginateData ? $scope.datasource.paginateData.total_matched_records : 1,
            numPages : [{value:10,isSelected:true},{value:20,isSelected:false},{value:50,isSelected:false},{value:100,isSelected:false},{value:'All',isSelected:false}]
        };
        //properties for sort table
        $scope.chkarrayall = [];
        $scope.chkarray=[];
        $scope.chkarrayalltitle = [];
        $scope.chkarraytitle=[];
        $scope.checkboxenable = 0;
        $scope.selectedItems = [];
        var options = {};
        $scope.assignAdmin={};
        var sourceData = null;
        $scope.dataSearch = {'text':null};
        $scope.sortType     = $scope.datasource.sortType; // set the default sort type
        $scope.sortReverse  = false;  // set the default sort order
        $scope.headerCheck ={box:false};
        $scope.radio = {model : 'All'};
        $scope.tabName = {isActive:true,name:"All"};
        /* pagination properties initialized */
        $scope.paginateRange = _.range(1, $scope.datasource.data.length); // dummy array of items to be paged
        $scope.pager = {};
        $scope.setPage(1);
    	$scope.rectifiedData = []; 
        datatableSearchObj ={  
			classedituser:{
				key:'name',
				values:['name']
			},
			studentsEngagementData:{
				key:'name',
				values:['name']
			},
			classnewstudentlist:{
				key:'name',
				values:['name']
			},
            classExistingstudents:{
                
            },
            reportsData:{
                key:'name',
				values:['name']
            }
        };
    };
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
}



advancePubapp.animation('.animateslider', function($animate) {
 return {
    enter: function(element, done) {
        element.slideDown();
        element.css('display','inline-block');
        element.animate({"max-height":'3000px'},500,function(){
        element.css('overflow','visible');
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

 
advancePubapp.animation('.rm_bx_bor', function($animate) {
  return {
    enter: function(element, done) {
        var selectorElem = $(element).attr('selectorElem');
        var container = $('body');
        element.animate({"max-height":"3000"},1500,function(){
			if(selectorElem){
				var offset_top = $('#'+selectorElem).offset().top;
				container.stop().animate({
					scrollTop: offset_top - 127
				},500);
			}
           
        });
    },
    leave: function(element, done) {
		var selectorElem = $(element).attr('selectorElem');
		var container = $('body');
		element.css('overflow','hidden');
		element.animate({"max-height":"0"},500,function(){
			element.hide();
			var offset_top = $('#'+selectorElem).offset().top;
			container.stop().animate({
				scrollTop: offset_top - 127
			},500);
		});
		
    }
  };
});