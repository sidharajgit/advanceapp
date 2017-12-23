advancePubapp.controller('activityanalyticsController', ['$scope', 'sfactory','$uibModal','$rootScope','$filter','$log','$stateParams','reportService','encryptionService', 'sessionService',function($scope,sfactory,$uibModal,$rootScope,$filter,$log,$stateParams,reportService,encryptionService,sessionService) {
    
    var reportDataReq,chartArray;
    //Method for activityanalytics controller
    function analyticscontroller(reportDataReq){
       var task = 'activityreports';
        inputreq = JSON.stringify(reportDataReq);
       sfactory.serviceCallReports(inputreq, task).then(function(response) {
            if(angular.isDefined(response)){
				if($filter('lowercase')(response.status) == 'success'){
					$scope.tableData.data =response.data.data;
					$rootScope.appLoader = false;
				}else{
					$rootScope.appLoader = false;
				}	
            }
			
        }, function(error) {
            var localTask = "activityreports";
            sfactory.localService(localTask).then(function(response) {
                $scope.tableData.data =response.data.data;
            }, function(error) {
            });
        });
    }
    
    //Method for acivity analytics controller
    $scope.getactivityAnalyticsData = function(){
        inputreq = JSON.stringify(reportDataReq);
        $scope.isAnalytics = true;$scope.userTypeCount = 0;
        if(!angular.isDefined($scope.activityanalytic.activity)){
            var task = 'activityanalytics';        
            sfactory.serviceCallReports(inputreq, 'activityanalytics').then(function(response) {                
                if(angular.isDefined(response.data)){
                    $scope.activityanalytic.activity= response.data;
                    loadCharts();                    
                    $rootScope.appLoader = false;
                }
            }, function(error) {
                var localTask = "activityanalytics";
                sfactory.localService(localTask).then(function(response) {
                    $scope.activityanalytic.activity= response.data;
                    loadCharts();                   
                }, function(error) {
                });
            });
        }else{
            loadCharts();
            
        }
            
    }
    function loadCharts(){
        $scope.activityAnalyse = $scope.activityanalytic.activity.activityanalyse;
        $scope.forumsDiscussions = $scope.activityanalytic.activity.forums_discussions;
        $scope.participantsForumsDiscussions = $scope.activityanalytic.activity.participants_forums_discussions;
    };
    /* Method to show filter modal  */
    $scope.chartModal = function(size, chartType, data, chartHeader,traffic) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'dest/templates/chartsModal.html',
            controller: 'modalController',
            size: size,
            resolve: {
                items: function() {
                    return {
                        chartType: chartType,
                        chartdata: data,
                        header: chartHeader, 
                        traffic:traffic,
                        dateRange:$scope.analyticsdaterangecustompick,
                        chartProperties:chartProperties
                    };
                }
            }
        });
        modalInstance.result.then(function(selectedItem) {
            $scope.selected = selectedItem;
        }, function() {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    
    /*Method for update data based on calender*/
    function updateCharts(startDate,endDate){
          var requestData = {
                'start_date': startDate,
                'end_date': endDate,
              'group_id'  : reportDataReq.group_id,
                'user_id': reportDataReq.user_id
        };
        
        $scope.activeUserType = 'all';
        sfactory.serviceCallReports(requestData, 'activityanalytics').then(function(response) {
			if(angular.isDefined(response)){
				if($filter('lowercase')(response.status) == 'success'){
					$scope.activityAnalyse.change(response.data.activityanalyse);
                    $scope.activityAnalyse.x = response.data.activityanalyse.x;
                    $scope.activityAnalyse.series = response.data.activityanalyse.series;
					$scope.forumsDiscussions.change(response.data.forums_discussions); 
                    $scope.forumsDiscussions.x = (response.data.forums_discussions.x); 
					$scope.participantsForumsDiscussions.change(response.data.participants_forums_discussions); 
                    $scope.participantsForumsDiscussions.x = (response.data.participants_forums_discussions.x); 
					$rootScope.appLoader = false;
				}
			 }	
        }, function(error) {
        var localTask = "activityanalyticsupdate";
        sfactory.localService(localTask).then(function(response) {
            $scope.activityAnalyse.change(response.data.activityanalyse);
            $scope.activityAnalyse.x = response.data.activityanalyse.x;
            $scope.activityAnalyse.series = response.data.activityanalyse.series;
            $scope.forumsDiscussions.change(response.data.forums_discussions);            
            $scope.participantsForumsDiscussions.change(response.data.participants_forums_discussions);   
            $rootScope.appLoader = false;
            }, function(error) {
            });
        });
    }
        
    //Method for activities download
    $scope.activityanalyticdownload = function(task){
        userId  = reportDataReq.user_id;
        groupId = reportDataReq.group_id;
         if($scope.startDate && $scope.endDate){
            var start = new Date($scope.startDate).getFullYear()+"-"+(Number(new Date($scope.startDate).getMonth())+1)+"-"+new Date($scope.startDate).getDate();
            var end = new Date($scope.endDate).getFullYear()+"-"+(Number(new Date($scope.endDate).getMonth())+1)+"-"+new Date($scope.endDate).getDate();
            window.location = appUrl+task+"?start_date="+start+"&end_date="+end+"&user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
        else{
            window.location = appUrl+task+"?user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
    }
    $scope.downloadbtn = function(){
        $scope.isActive_down = !$scope.isActive_down;
    }
    $scope.closedownload = function(){
        $scope.isActive_down = false;
    };
    $scope.reportdownloadbtn = function(){
        $scope.isActive_downreport = !$scope.isActive_downreport;
    }
    $scope.reportclosedownload = function(){
        $scope.isActive_downreport = false;
    };
    
    $scope.saveChartObj = function(response){
        var chartObject =_.find(chartArray, function(obj){ return obj.title.textStr  == response.title.textStr;});
        if(angular.isDefined(chartObject)){
            chartArray[chartArray.findIndex(x => x.title.textStr === response.title.textStr)] = response;
        }
        else{
            chartArray.push(response);
        }
    };
    
    $scope.export = function(download){
        reportService.exportCharts(chartArray,{type:download});
    };
    $scope.usertypefilterNew = function(usertype){ 
        if($scope.userTypeCount == 0){
            if(usertype == "Guest"){
                $scope.usertypefilter("Registered");
                $scope.usertypefilter(usertype);
            }else if(usertype == "Registered"){
                $scope.usertypefilter("Guest");
                $scope.usertypefilter(usertype);
            }
        }else{
            $scope.usertypefilter(usertype);
        }
    };
    $scope.usertypefilter = function(usertype){ 
        var copyChart = {};copyChart2 = {};copyChart3 = {};
        angular.copy($scope.activityAnalyse,copyChart3);
        copyChart2 = $scope.activityAnalyse.series;       
        
        //filteredGoal = _.where($scope.activityAnalyse.series, {"usertype" : usertype});
        if(usertype != "all"){
            for(i=0;i<copyChart2.length;i++){            
                if(copyChart2[i].usertype == usertype){ 
                   for(j=0;j<copyChart2[i].data.length;j++){
                       copyChart2[i].data[j] = 0;
                   }
                }            
            }   
            filteredGoal = copyChart2;
        }else{
            filteredGoal = $scope.activityAnalyse.series;
        }
        
        copyChart.series = filteredGoal;         
        copyChart.x=$scope.activityAnalyse.x;
        copyChart.title=$scope.activityAnalyse.title; 
        $scope.activeUserType = usertype;
        updateStackBarCharts(copyChart,copyChart3);        
    };
    function updateStackBarCharts(response1,response2){
        $scope.activityAnalyse.change(response1);
        $scope.activityAnalyse = response2;
        $scope.userTypeCount++;
    }
    //Method for initilize controller 
    function initializeactivityController(){
        var activityanalyticsscope = angular.element(jQuery("#adminLanding")).scope();
        
        reportDataReq = {
            'group_id'  : encryptionService.decrypt(sessionService.get('grp_id')),            
            'user_id': encryptionService.decrypt(sessionService.get('userId'))
        };
        analyticscontroller(reportDataReq);
        $scope.activityanalytic = {};chartArray=[];
        $scope.activityanalytic.vmDate = Last7Days().split(',')[Last7Days().split(',').length-1]+" To "+Last7Days().split(',')[0];
        $scope.activeUserType = 'all';
        $scope.analyticsdaterangecustompick = $scope.activityanalytic.vmDate;
        $scope.dateoptions={
            "locale": {
              "format": "MM-DD-YYYY",
            },
            showDropdowns:true,
            autoApply:true,
            maxDate : new Date(),
            eventHandlers: {
                'apply.daterangepicker': function(ev, picker) {
                    $scope.analyticsdaterangecustompick = ev.model.startDate.format('MM-DD-YYYY')+ ' To '+ev.model.endDate.format('MM-DD-YYYY');
                    updateCharts(ev.model.startDate.format('MM-DD-YYYY'),ev.model.endDate.format('MM-DD-YYYY'));                    
                }
            }
        };
        $scope.tableData = {
            pageName: 'activityreports',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            sortType: 'firstname',
            isCheckboxhide: true,
            headers: [{name: 'Media Type',bind_val: 'media_type',isSortable: true},
                {name: 'No. of enrolled users',bind_val: 'enrolled_count',isSortable: true},
                {name: 'No. of visits',bind_val: 'no_of_visit',isSortable: true},
                {name: 'No. of shares',bind_val: 'no_of_shares',isSortable: true},
                {name: 'Time Spent',bind_val: 'time_spent',isSortable: true}
            ],
            data: []
        };
        chartProperties=[
            {
                chartTitle:"Content Consumption Based On MediaType",
                taskUrl :"activitycontentconsumption",
                key:"activityanalyse",
                type:"stackbar"
            },
            {
                chartTitle:"No. of discussions in all Forums",
                taskUrl :"forumdiscussion",
                key:"forums_discussions",
                type:"line"
            },
            {
                chartTitle:"No. of participants in all Forums",
                taskUrl :"nofparticipationforumdiscussion",
                key:"participants_forums_discussions",
                type:"line"
            }
        ];
    }
    //Method for initilize controller
    initializeactivityController();
    
}]);