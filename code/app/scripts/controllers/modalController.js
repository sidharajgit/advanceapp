advancePubapp.controller('modalController',['$scope','$uibModalInstance','items', 'sfactory','reportService','$rootScope','$filter','$stateParams','$http', '$document','$timeout','sessionService','encryptionService',function ($scope,$uibModalInstance, items,sfactory,reportService,$rootScope,$filter,$stateParams,$http, $document,$timeout,sessionService,encryptionService) {
  
    var sourceData,dataRange,chartArray; 
    
    $scope.switchDateRange = function (selection) {
        var dateRange;
        switch (selection) {
            case 0:
                    dateRange=getLast7days();
                    break; 
            case 1:
                    dateRange=getThisMonthdays();
                    break;
            case 2:
                    dateRange=getLastMonthdays();
                    break; 
            case 3:
                    dateRange=getThisQuarterdays();
                    break;
            case 4:
                    dateRange=getYearToDateDays();
                    break;
            case 5:
                    dateRange=getYearDays();
                    break;
        }
        $scope.activeMenu = selection;         
        $scope.daterangecustompickmodal = dateRange.startDate+" To "+dateRange.endDate;
        updateChart(dateRange.startDate,dateRange.endDate);
    };
    
    $scope.changeSourceOfTraffic = function(){
        if($scope.dataSource){
            var trafficData = ($scope.chartData.traffic.byDevice) ? $scope.chartData.chartdata.by_device : $scope.chartData.chartdata.by_channel;            
            $scope.chartData.chartdata.change(reportService.loadPiechart(trafficData,"Source of Traffic"));
        }else{
            var trafficData = ($scope.chartData.traffic.byDevice) ? sourceData.chartdata.by_device : sourceData.chartdata.by_channel;
            $scope.chartData.chartdata.change(reportService.loadPiechart(trafficData,"Source of Traffic"));
        }        
    };
  
    $scope.ok = function () {
        $uibModalInstance.close('selectedData');
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
    $scope.saveChartObj = function(response){
        chartArray[0] = response;
    };
    
    $scope.export = function(download){
        reportService.exportCharts(chartArray,{type:download});
    };
    
    function updateChart(start_date,end_date){
        var modalanalyticsscope = angular.element(jQuery("#adminLanding")).scope();
        $scope.resportsessionid = angular.isDefined(modalanalyticsscope.loggedUserDetails.sessionId) ? modalanalyticsscope.loggedUserDetails.sessionId : "";
        
        var chartProperties = _.detect($scope.chartData.chartProperties, function(item){ 
            
        return item.chartTitle === $scope.chartData.chartdata.title;}); 
        dataRangeStr = JSON.stringify({
            start_date: start_date,
            end_date: end_date,
            program_id:($scope.chartData.reportsProgram === undefined) ? "" : $scope.chartData.reportsProgram,
            'group_id'  : encryptionService.decrypt(sessionService.get('grp_id')),            
            'user_id': encryptionService.decrypt(sessionService.get('userId'))
        });
        
        if($scope.chartData.chartType == "world"){ 
            liveTask = 'analyticsbygeography';
        }else{
            liveTask = chartProperties.taskUrl;
        }
        sfactory.serviceCallReports(dataRangeStr,liveTask).then(function(response) { 
             var data;
            if(angular.isDefined(response)){ 
                if($filter('lowercase')(response.status) == 'success'){ 
                    if($scope.chartData.chartType == "world"){                       
                        
                        $scope.chartData.chartdata.change(response.data.by_geo); 
                        $scope.chartData.chartdata.data = response.data.by_geo;
                        
                    }else{
                        if(chartProperties.type === 'pie'){
                            if(angular.isDefined(chartProperties.traffic)){ 
                                $scope.dataSource = true;
                                /*data = $scope.chartData.traffic.byDevice ? $scope.chartData.traffic.byDevice : $scope.chartData.traffic.byChannel;*/
								data = $scope.chartData.traffic.byDevice ? response.data.source_of_traffic.by_device : response.data.source_of_traffic.by_channel;
								$scope.chartData.chartdata.by_channel = response.data.source_of_traffic.by_channel;
                                $scope.chartData.chartdata.by_device = response.data.source_of_traffic.by_device;                                
                            }else{
                               data = response.data[chartProperties.key];
                            }                            
                            
                            /*data = angular.isDefined(chartProperties.traffic) ? ($scope.chartData.traffic.byDevice ? response.data.source_of_traffic.by_device : response.data.source_of_traffic.by_channel) : response.data[chartProperties.key];*/
                            $scope.chartData.chartdata.change(reportService.loadPiechart(data,chartProperties.chartTitle));
                        }
                        else{ 
                            if(chartProperties.key == 'user_visits' || chartProperties.key == 'conversion_ratio' || chartProperties.key == 'no_of_class' || chartProperties.key == 'no_students_enrolled_with_classes' || chartProperties.key == 'activityanalyse' || chartProperties.key == 'forums_discussions' || chartProperties.key == 'participants_forums_discussions' || chartProperties.key == 'social_shares' || chartProperties.key == 'social_shares_based_on_program' || chartProperties.key == 'social_shares_based_on_media_type' || chartProperties.key == 'most_visited'|| chartProperties.key == 'visitors_at_program_level'|| chartProperties.key == 'social_shares_based_on_program'|| chartProperties.key == 'badges_associated_witheach_program'|| chartProperties.key == 'average_timespent_on_each_program'|| chartProperties.key == 'most_consumed_program'||chartProperties.key == 'channel_triggered_users_visit' ||chartProperties.key == 'enrollment_at_program'||chartProperties.key == 'classes_at_program'||chartProperties.key == 'enrollement_based_on_textbook'){
                                $scope.chartData.chartdata.change(response.data[chartProperties.key]);
                            }
                            else{                       $scope.chartData.chartdata.change(reportService.updateChart(response.data[chartProperties.key],chartProperties.chartTitle,dateRange));
                            }
                       }
                    }           
                    
                    
                }
            }
           $rootScope.appLoader = false;		
          
        }, function(error) {
            var localTask = "updatedreportdata";
            sfactory.localService(localTask).then(function(response) {
                var data;
                if($scope.chartData.chartType == "world"){               
                        
                        $scope.chartData.chartdata.change(response.data.by_geo); 
                        $scope.chartData.chartdata.data = response.data.by_geo;
                        
                    }else{
                        if(chartProperties.type === 'pie'){  
                            data = angular.isDefined(chartProperties.traffic) ? ($scope.chartData.traffic.byDevice ? response.data.by_device : response.data.by_channel) : response.data[chartProperties.key];
                            $scope.chartData.chartdata.change(reportService.loadPiechart(data,chartProperties.chartTitle));
                        }
                        else{ 
                                if(chartProperties.key == 'user_visits' || chartProperties.key == 'conversion_ratio' || chartProperties.key == 'no_of_class' || chartProperties.key == 'no_students_enrolled_with_classes' || chartProperties.key == 'activityanalyse' || chartProperties.key == 'forums_discussions' || chartProperties.key == 'participants_forums_discussions' || chartProperties.key == 'social_shares' || chartProperties.key == 'social_shares_based_on_program' || chartProperties.key == 'social_shares_based_on_media_type'){
                                    $scope.chartData.chartdata.change(response.data[chartProperties.key]);
                                }
                                else{            
                                    $scope.chartData.chartdata.change(reportService.updateChart(response.data[chartProperties.key],chartProperties.chartTitle,dateRange));
                                }
                               }
                    }
                  
            }, function(error) {
            });
        }); 
    };
    
    function initiateController(){
        $scope.dataSource = false;
        $scope.chartData = angular.copy(items);
        chartArray=[];
        
        if(angular.isDefined(items.chartdata.by_channel)){
            sourceData = angular.copy(items);
            var trafficData = items.traffic.byDevice ? items.chartdata.by_device : items.chartdata.by_channel;
            $scope.chartData.chartdata = reportService.loadPiechart(trafficData,"Source of Traffic");
        }
        
        
        $scope.rangeSelection =['Last 7 Days','This Month','Last Month','This Quarter','This Year'];
        $scope.activeMenu = 0;
        $scope.daterangecustompickmodal = $scope.chartData.dateRange;
        $scope.dateoptions={
            "locale": {
              "format": "MM-DD-YYYY",
            },
            showDropdowns:true,
            autoApply:true,
            maxDate : new Date(),
            eventHandlers: {
                'apply.daterangepicker': function(ev, picker) { 
                    updateChart(ev.model.startDate.format('MM-DD-YYYY'),ev.model.endDate.format('MM-DD-YYYY'));                    
                }
            }
        };
        $scope.customView = true;
        var worlds = $scope.chartData.chartType;
               
    };
    $scope.downloadbtn = function(){
        $scope.isActive = !$scope.isActive;
    }
    $scope.closedownload = function(){
        $scope.isActive = false;
    };
    initiateController();
}]);