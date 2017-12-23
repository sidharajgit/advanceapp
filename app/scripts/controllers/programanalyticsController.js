advancePubapp.controller('programanalyticsController',['$scope', 'sfactory','$uibModal','$rootScope','$filter','$log', function($scope,sfactory,$uibModal,$rootScope,$filter,$log) {
    var reportDataReq; 
    
    //Method  for program adventure report
    function programanalyticsreport(){
    var task = 'programanalyticsreports';
        sfactory.serviceCallReports(reportDataReq, task).then(function(response) {
        if(angular.isDefined(response)){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.tableData.data =response.data.data;
                $rootScope.appLoader = false;
            }else{
                $rootScope.appLoader = false;
            }	
        }
        }, function(error) {
            var localTask = "programanalyticsreports";
                sfactory.localService(localTask).then(function(response) {
                $scope.tableData.data =response.data.data;
            }, function(error) {
            });
        });
    }
    
    //Method for program analytics
    $scope.getprogramAnalyticsData = function(){
        var task = 'programanalyticsreports';
        sfactory.serviceCallReports(reportDataReq, 'activityanalytics').then(function(response) {
            console.log(response);
            if(angular.isDefined(response.data)){
                $scope.programanalytics.program= response.data;
                $rootScope.appLoader = false;
            }
        }, function(error) {
        var localTask = "programanalyticsreports";
            sfactory.localService(localTask).then(function(response) {
                $scope.programanalytics.program= response.data;
            }, function(error) {
            });
        });
    }
    
     /* Method to show filter modal */
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
                        dateRange:$scope.programanalytics.vmDate,
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
    $scope.updateCharts = function(dateRange){
          var requestData = JSON.stringify({
                'start_date': new Date(dateRange.startDate).getFullYear()+"-"+(new Date(dateRange.startDate).getMonth()+1)+"-"+new Date(dateRange.startDate).getDate(),
                'end_date': new Date(dateRange.endDate).getFullYear()+"-"+(new Date(dateRange.endDate).getMonth()+1)+"-"+new Date(dateRange.endDate).getDate(),
                'groupid'  :(window.loggedGroup === undefined) ? "" : window.loggedGroup.group_id, 'sessionId': $scope.resportsessionid
        });
        sfactory.serviceCallReports(requestData, 'programanalytics').then(function(response) {
			if(angular.isDefined(response)){
				if($filter('lowercase')(response.status) == 'success'){
					$scope.programanalytics.activity.activityanalyse.change(response.data.activityanalyse);
					$scope.programanalytics.activity.forums_discussions.change(response.data.forums_discussions);            
					$scope.programanalytics.activity.participants_forums_discussions.change(response.data.participants_forums_discussions); 
					$rootScope.appLoader = false;
				}
			 }	
        }, function(error) {
        var localTask = "programanalyticsreports";
        sfactory.localService(localTask).then(function(response) {
            $scope.programanalytics.program.average_timespent.change(response.data.average_timespent);
            $scope.programanalytics.program.badges_associated_witheach_program.change(response.data.badges_associated_witheach_program);            
            $scope.programanalytics.program.most_consumed_program.change(response.data.most_consumed_program);            
            $scope.programanalytics.program.mostvisited_program.change(response.data.mostvisited_program);            
            $scope.programanalytics.program.social_share_based_program.change(response.data.social_share_based_program);            
            $scope.programanalytics.program.visitors_of_program.change(response.data.visitors_of_program);            
            }, function(error) {
            });
        });
    }
        
    //Method for activities download
   /* $scope.programanalyticsdownload = function(task){
         if($scope.startDate && $scope.endDate){
            var start = new Date($scope.startDate).getFullYear()+"-"+(Number(new Date($scope.startDate).getMonth())+1)+"-"+new Date($scope.startDate).getDate();
            var end = new Date($scope.endDate).getFullYear()+"-"+(Number(new Date($scope.endDate).getMonth())+1)+"-"+new Date($scope.endDate).getDate();
            window.location = appUrl+task+"?start_date="+start+"&end_date="+end+"&groupid="+window.loggedGroup.group_id+"&sessionId="+$scope.resportsessionid;
        }
        else{
            window.location = appUrl+task+"?sessionId="+$scope.resportsessionid+"&groupid="+window.loggedGroup.group_id;
        }
    }*/
    
	 //Method for initilize controller
    function initilizeprogramanalytics(){
        programanalyticsreport();
        $scope.programanalytics = {};
        $scope.programanalytics.vmDate = Last7Days().split(',')[Last7Days().split(',').length-1]+" To "+Last7Days().split(',')[0];
            $scope.tableData = {
            pageName: 'programanalytics',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            sortType: '',
            isCheckboxhide: true,
            headers: [{name: 'Course',bind_val: 'course',isSortable: true},
                {name: 'No of enrolled users',bind_val: 'numberofenrolleduser',isSortable: true},
                {name: 'no of Activity',bind_val: 'no_of_activity',isSortable: true},
                {name: 'no of Student Completed Course',bind_val: 'no_of_student_course',isSortable: true},
                {name: 'no of visit',bind_val: 'no_of_visit',isSortable: true},
                {name: 'no of shares',bind_val: 'no_of_share',isSortable: true},
                {name: 'Time spent',bind_val: 'time_spent',isSortable: true},
                {name: 'Date Created',bind_val: 'date',isSortable: true}
            ],
            data: []
        };
        
            chartProperties=[
            {
                chartTitle:"Most visited Program",
                taskUrl :"phonicsmostvistedprogram",
                key:"mostvisited_program",
                type:"line"
            },
            {
                chartTitle:"Visitors at program level",
                taskUrl :"phonicsvistedprogramlevel",
                key:"visitors_of_program",
                type:"bar"
            },
            {
                chartTitle:"Social Share Based On Program",
                taskUrl :"phonicssocialprogram",
                key:"social_share_based_program",
                type:"bar"
            }, 
            {
                chartTitle:"Badges Associated with each program",
                taskUrl :"phonicsbadgesassociatedwithprogram",
                key:"badges_associated_witheach_program",
                type:"bar"
            },
            {
                chartTitle:"Average time spent on each program",
                taskUrl :"phonicsaveragetimespent",
                key:"average_timespent",
                type:"bar"
            },
            {
                chartTitle:"Most Consumed Program",
                taskUrl :"phonicsmostconsumedprogram",
                key:"most_consumed_program",
                type:"pieload"
            }    
        ];
    }
    initilizeprogramanalytics();
}]);