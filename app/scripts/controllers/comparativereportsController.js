advancePubapp.controller('comparativereportsController',['$scope', 'sfactory','$uibModal','$rootScope','reportService','$filter','$log','$stateParams','sessionService','encryptionService', function($scope,sfactory,$uibModal,$rootScope,reportService,$filter,$log,$stateParams,sessionService,encryptionService) {
    var chartProperties=[],reportDataReq,chartArray; 
    
    //Method  for program adventure report
    function comparativereports(reportDataReq){
        var task = 'programreports';
        inputreq = JSON.stringify(reportDataReq);
        sfactory.serviceCallReports(inputreq, task).then(function(response) {
            if(angular.isDefined(response)){
                if($filter('lowercase')(response.status) == 'success'){ 
                    $scope.tableData.data =response.data.program_report;
                    $scope.comparativereports.overall = response.data.users_at_each_program;
                    $rootScope.appLoader = false;
                }else{
                    $rootScope.appLoader = false;
                }	
            }
        }, function(error) {
            var localTask = "comparativereports";            
            sfactory.localService(localTask).then(function(response) {
                $scope.tableData.data =response.data.data.program_report;
                $scope.comparativereports.overall = response.data.data.users_at_each_program;              
            }, function(error) {
            });
        });
    }
    
    //Method for program analytics
    $scope.getComparativeReportsAnalysticData = function(){
        $scope.isAnalytics = true;$scope.userTypeCount = 0;
        if(!angular.isDefined($scope.comparativereports.program)){
            var task = 'programanalytics';        
            inputreq = JSON.stringify(reportDataReq);
            sfactory.serviceCallReports(inputreq, task).then(function(response) {            
                if(angular.isDefined(response.data)){
                    $scope.comparativereports.program = response.data;
                    loadCharts();
                    $rootScope.appLoader = false;
                }
            }, function(error) {
            var localTask = "comparativereports";
                sfactory.localService(localTask).then(function(response) {
                    $scope.comparativereports.program = response.data.analysticsdata;
                    loadCharts();
                }, function(error) {
                });
            });
        }else{
        loadCharts();        
        }
       
    }
    function loadCharts(){
        $scope.mostVisited = $scope.comparativereports.program.most_visited;
        $scope.visitorsAtProgramLevel = $scope.comparativereports.program.visitors_at_program_level;
        $scope.socialSharesBasedOnProgram = $scope.comparativereports.program.social_shares_based_on_program;
        $scope.badgesAssociatedWithEachProgram = $scope.comparativereports.program.badges_associated_witheach_program;
        $scope.averageTimespentOnEachProgram = $scope.comparativereports.program.average_timespent_on_each_program;        
        $scope.mostConsumedProgram = reportService.loadPiechart($scope.comparativereports.program.most_consumed_program,'Most Consumed Program');
    }
    /* Method to load charts 
    function loadPieCharts(data){
        //Load Pie Charts
        $scope.comparativereports.program.most_consumed_program = reportService.loadPiechart(data.most_consumed_program,'Most Consumed Program');
    };*/
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
                        dateRange:$scope.daterangecustompick,
                        chartProperties:chartProperties,
                        reportsProgram: "cr"
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
        
    //Method for activities download
   $scope.comparativereportsdownload = function(task){
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
        angular.copy($scope.averageTimespentOnEachProgram,copyChart3);
        copyChart2 = $scope.averageTimespentOnEachProgram.series;       
        
        //filteredGoal = _.where($scope.averageTimespentOnEachProgram.series, {"usertype" : usertype});
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
            filteredGoal = $scope.averageTimespentOnEachProgram.series;
        }
        
        copyChart.series = filteredGoal;         
        copyChart.x=$scope.averageTimespentOnEachProgram.x;
        copyChart.title=$scope.averageTimespentOnEachProgram.title; 
        $scope.activeUserType = usertype;
        updateStackBarCharts(copyChart,copyChart3);        
    };
    function updateStackBarCharts(response1,response2){
        $scope.averageTimespentOnEachProgram.change(response1);
        $scope.averageTimespentOnEachProgram = response2;
        $scope.userTypeCount++;
    }
    function updateCharts(start_date,end_date){
        
          var requestData = JSON.stringify({
                'start_date': start_date,
                'end_date': end_date,
                'program_id': "cr",
                'group_id'  : reportDataReq.group_id,
                'user_id': reportDataReq.user_id
        });
        
        sfactory.serviceCallReports(requestData, 'programanalytics').then(function(response) {
			if(angular.isDefined(response)){
				if($filter('lowercase')(response.status) == 'success'){
                    $scope.mostVisited.change(response.data.most_visited); 
                    $scope.mostVisited.x = (response.data.most_visited.x); 
                    $scope.visitorsAtProgramLevel.change(response.data.visitors_at_program_level);
                    $scope.socialSharesBasedOnProgram.change(response.data.social_shares_based_on_program);
                    $scope.badgesAssociatedWithEachProgram.change(response.data.badges_associated_witheach_program);                    
					$scope.averageTimespentOnEachProgram.change(response.data.average_timespent_on_each_program);
                    $scope.averageTimespentOnEachProgram.x = response.data.average_timespent_on_each_program.x;
                    $scope.averageTimespentOnEachProgram.series = response.data.average_timespent_on_each_program.series;
                    $scope.mostConsumedProgram.change(reportService.loadPiechart(response.data.most_consumed_program,'Most Consumed Program'));
                    $scope.mostConsumedProgram.data = response.data.most_consumed_program;
					$rootScope.appLoader = false;
				}
			 }	
        }, function(error) {
        var localTask = "comparativereports";
        sfactory.localService(localTask).then(function(response) {
            $scope.mostVisited.change(response.data.analysticsdata.most_visited);
            $scope.visitorsAtProgramLevel.change(response.data.analysticsdata.visitors_at_program_level);
            $scope.socialSharesBasedOnProgram.change(response.data.analysticsdata.social_shares_based_on_program);
            $scope.badgesAssociatedWithEachProgram.change(response.data.analysticsdata.badges_associated_witheach_program);            
            $scope.averageTimespentOnEachProgram.change(response.data.analysticsdata.average_timespent_on_each_program);
            $scope.averageTimespentOnEachProgram.x = response.data.analysticsdata.average_timespent_on_each_program.x;
            $scope.averageTimespentOnEachProgram.series = response.data.analysticsdata.average_timespent_on_each_program.series;            
            $scope.mostConsumedProgram.change(reportService.loadPiechart(response.data.analysticsdata.most_consumed_program,'Most Consumed Program'));
            $scope.mostConsumedProgram.data = response.data.most_consumed_program;
            }, function(error) {
            });
        });
    }
	 //Method for initilize controller
    function initilizecomparativereports(){       
        var comparativereportscope = angular.element(jQuery("#adminLanding")).scope();
        
        reportDataReq = {            
            'program_id': "cr",
            'group_id'  : encryptionService.decrypt(sessionService.get('grp_id')),            
            'user_id': encryptionService.decrypt(sessionService.get('userId'))
            
        };
        comparativereports(reportDataReq);
        $scope.comparativereports = {};chartArray=[];
        $scope.comparativereports.vmDate = Last7Days().split(',')[Last7Days().split(',').length-1]+" To "+Last7Days().split(',')[0];
        $scope.daterangecustompick = $scope.comparativereports.vmDate;
        $scope.dateoptions={
            "locale": {
              "format": "MM-DD-YYYY",
            },
            showDropdowns:true,
            autoApply:true,
            maxDate : new Date(),
            eventHandlers: {
                'apply.daterangepicker': function(ev, picker) { 
                    $scope.daterangecustompick = ev.model.startDate.format('MM-DD-YYYY')+ ' To '+ev.model.endDate.format('MM-DD-YYYY');
                    updateCharts(ev.model.startDate.format('MM-DD-YYYY'),ev.model.endDate.format('MM-DD-YYYY'));                    
                }
            }
        };
            $scope.tableData = {
            pageName: 'comparativereportstable',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            sortType: '',
            isCheckboxhide: true,
            headers: [{name: 'Program',bind_val: 'label',isSortable: true},                
                {name: 'No. of Activities',bind_val: 'no_of_activities',isSortable: true},
                {name: '# Student Course Completions',bind_val: 'no_of_students_completed',isSortable: true},
                {name: 'No. of Visits',bind_val: 'no_of_visits',isSortable: true},
                {name: 'No. of shares',bind_val: 'no_of_shares',isSortable: true},
                {name: 'Average time spent',bind_val: 'time_spent',isSortable: true}                
            ],
            data: []
        };
        
            chartProperties=[
            {
                chartTitle:"Most visited program",
                taskUrl :"mostvisitedprogram",
                key:"most_visited",
                type:"line"
            },
            {
                chartTitle:"No. of visitors by Program",
                taskUrl :"visitorsatprogramlevel",
                key:"visitors_at_program_level",
                type:"bar"
            },
            {
                chartTitle:"Social share Based on Program Type",
                taskUrl :"programsocialshares",
                key:"social_shares_based_on_program",
                type:"bar"
            }, 
            {
                chartTitle:"Badges",
                taskUrl :"programbadges",
                key:"badges_associated_witheach_program",
                type:"bar"
            },
            {
                chartTitle:"Average Time Spent on Each Program",
                taskUrl :"avgtimespentoneachprogram",
                key:"average_timespent_on_each_program",
                type:"bar"
            },
            {
                chartTitle:"Most Consumed Program",
                taskUrl :"mostconsumedprogram",
                key:"most_consumed_program",
                type:"pie"
            }    
        ];
    }
    initilizecomparativereports();
}]);