advancePubapp.controller('socialmediaController', ['$scope', '$http', 'spinnerService', 'sfactory', '$rootScope', '$stateParams','$uibModal', '$log', 'reportService','$filter','$stateParams', 'encryptionService','sessionService',function($scope, $http, spinnerService, sfactory, $rootScope, $stateParams, $uibModal, $log, reportService,$filter,$stateParams,encryptionService,sessionService) {
     var chartProperties=[],reportDataReq,chartArray;
    
      /* Method to fetch overall data from json or service for reports */
    function getReportsData(reportDataReq) {
        inputreq = JSON.stringify(reportDataReq);
        sfactory.serviceCallReports(inputreq, 'socialmediareports').then(function(response) {
           if(angular.isDefined(response)){
                if($filter('lowercase')(response.status) == 'success'){
                    $scope.socialShares.reportData= response.data;
                    loadReport(response.data);
                    $rootScope.appLoader = false;
                }
            }   
        }, function(error) {
            var localTask = "socialmedia";
            sfactory.localService(localTask).then(function(response) {
                $scope.socialShares.reportData= response.data;
                loadReport(response.data);
            }, function(error) {
            });
        });
    }
    
    /* Method to fetch overall data from json or service for anaytics */
   
     $scope.getAnalyticsData = function(){
         inputreq = JSON.stringify(reportDataReq);
         $scope.isAnalytics = true;
        if(!angular.isDefined($scope.socialShares.analyticData)){
            sfactory.serviceCallReports(inputreq, 'socialmediaanalytics').then(function(response) {
                if(angular.isDefined(response)){
                    if($filter('lowercase')(response.status) == 'success'){
                        $scope.socialShares.analyticData = response.data;
                        loadReportAnalytics();
                        $rootScope.appLoader = false;
                    }
                }
            }, function(error) {
                var localTask = "socialmedia";
                sfactory.localService(localTask).then(function(response) {
                   $scope.socialShares.analyticData = response.data;
                    loadReportAnalytics();
                }, function(error) {
                });
            });
        }
        else{
           loadReportAnalytics(); 
        }
    };
    
    
    /*Method to load all analytics charts*/
    function loadReportAnalytics() {
       //load line chart function
        $scope.socialSharesLinechart = $scope.socialShares.analyticData.social_shares;
        // load pie chart function
        $scope.preferredSocialMedia = reportService.loadPiechart($scope.socialShares.analyticData.most_preferred_social_shares,'Most Preferred Social media');
        //load Bar charts function
        $scope.programBasedDataBarChart = $scope.socialShares.analyticData.social_shares_based_on_program;
        $scope.mediaBasedDataBarChart = $scope.socialShares.analyticData.social_shares_based_on_media_type;

    };
    
    
    
    /* Method to download reports as csv */
    $scope.downloadReport = function(task){
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
       
        /*Method to get report data*/
       function loadReport(data) {
          $scope.socialShareData = data.total_social_shares;
          $scope.tableData.data = data.media_type_report;
       };
    
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
    /*open model popup for more filter option*/
   $scope.chartModal = function(size, chartType, data, chartHeader) {
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
                        dateRange:$scope.socialdaterangecustompick,
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
     
    /*Method to update all charts after change in date range*/
     function updateCharts(startDate,endDate) {
        if (startDate && endDate) {
            $scope.startDate = startDate;
            $scope.endDate = endDate;
			
            var requestData = JSON.stringify({
                'start_date': startDate,
                'end_date': endDate,
                'group_id'  : reportDataReq.group_id,
                'user_id': reportDataReq.user_id
            });
            
            sfactory.serviceCallReports(requestData, 'socialmediaanalytics').then(function(response) {
                 if(angular.isDefined(response)){
                     if($filter('lowercase')(response.status) == 'success'){   
                        $scope.socialSharesLinechart.change(response.data.social_shares);
                        $scope.socialSharesLinechart.x = (response.data.social_shares.x);
                        $scope.preferredSocialMedia.change(reportService.loadPiechart(response.data.most_preferred_social_shares,'Most Preferred Social media'));
                         $scope.preferredSocialMedia.data = response.data.most_preferred_social_shares;
                        $scope.programBasedDataBarChart.change(response.data.social_shares_based_on_program);
                        $scope.mediaBasedDataBarChart.change(response.data.social_shares_based_on_media_type);
                     }
                      $rootScope.appLoader = false;
                 }
            }, function(error) {
                var localTask = "updatedreportdata";
                sfactory.localService(localTask).then(function(response) {
                    $scope.socialSharesLinechart.change(response.data.social_shares);
                    $scope.preferredSocialMedia.change(reportService.loadPiechart(response.data.most_preferred_social_shares,'Most Preferred Social media'));
                    $scope.preferredSocialMedia.data = response.data.most_preferred_social_shares;
                    $scope.programBasedDataBarChart.change(response.data.social_shares_based_on_program);
                    $scope.mediaBasedDataBarChart.change(response.data.social_shares_based_on_media_type);
                    $rootScope.appLoader = false;
                }, function(error) {
                });
            });
        }
    };
    
    
    /* Method loads when controller initiats */
    function initiateController() {
         $scope.socialShares={};chartArray=[];
        $scope.socialShares.vmDate = Last7Days().split(',')[Last7Days().split(',').length-1]+" To "+Last7Days().split(',')[0];
        //$scope.socialShares.currDate = new Date();
        $scope.jsonData = [];
        $scope.tableData = {};
        var socialmediascope = angular.element(jQuery("#adminLanding")).scope();
        
        reportDataReq = {
            'group_id'  : encryptionService.decrypt(sessionService.get('grp_id')),            
            'user_id': encryptionService.decrypt(sessionService.get('userId'))
        };
        $scope.socialdaterangecustompick = $scope.socialShares.vmDate;
        $scope.dateoptions={
            "locale": {
              "format": "MM-DD-YYYY",
            },
            showDropdowns:true,
            autoApply:true,
            maxDate : new Date(),
            eventHandlers: {
                'apply.daterangepicker': function(ev, picker) { 
                    $scope.socialdaterangecustompick = ev.model.startDate.format('MM-DD-YYYY')+ ' To '+ev.model.endDate.format('MM-DD-YYYY');
                    updateCharts(ev.model.startDate.format('MM-DD-YYYY'),ev.model.endDate.format('MM-DD-YYYY'));                    
                }
            }
        };
      $scope.tableData = {
            pageName: 'socialreport',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            sortType: '',
            isCheckboxhide: true,
            headers: [{name: 'Media Type', bind_val: 'media_type', isSortable: true},
                      {name: 'Total Shares', bind_val: 'total_shares', isSortable: true},
                      {name: 'Facebook Shares', bind_val: 'facebook_shares', isSortable: true},
                      {name: 'Twitter Shares', bind_val: 'twitter_shares', isSortable: true},
                      {name: 'Google+ Shares', bind_val: 'google_shares', isSortable: true},
                      {name: 'Linkedin Shares', bind_val: 'linkedin_shares', isSortable: true}],
            data: []
        };
                
        /*object for model view Chart*/
         chartProperties=[
            {
                chartTitle:"Social Shares",
                taskUrl : "mostsocialshares",
                key:"social_shares",
                type:"line"
            },
            {
                chartTitle:"Most Preferred Social media",
                taskUrl : "mostpreferredsocialshares",
                key:"most_preferred_social_shares",
                type:"pie"
            },
            {
                chartTitle:"No. of social shares by Program",
                taskUrl : "socialsharesbyprogram",
                key: "social_shares_based_on_program",
                type: "bar"
            },
            {
                chartTitle:"Social share Based on Media Type",
                taskUrl : "socialsharesbymediatype",
                key: "social_shares_based_on_media_type",
                type: "bar"
            },
        ];
        getReportsData(reportDataReq);
    }
    
    initiateController();
    
}]);