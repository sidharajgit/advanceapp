advancePubapp.controller('classanalyticsController', ['$scope', 'sfactory', '$log','$uibModal','reportService','$rootScope','$stateParams','$filter','sessionService','encryptionService',function($scope,sfactory,$log ,$uibModal,reportService,$rootScope,$stateParams,$filter,sessionService,encryptionService) {
    var chartProperties,reportDataReq,chartArray;
    /* Method to fetch overall user reports */
    function getReportData() {
        inputreq = JSON.stringify($scope.reportparams);
        sfactory.serviceCallReports(inputreq, 'classreports').then(function(response) {
            if(angular.isDefined(response)){
                $scope.tableData.data =response.data.class_report;
                $scope.class.reports = response.data;
                $rootScope.appLoader = false;
            }
        }, function(error) {
            var localTask = "classreports";
            sfactory.localService(localTask).then(function(response) {
                $scope.tableData.data =response.data.class_report;
                $scope.class.reports = response.data;
            }, function(error) {
            });
        });
    }
    /* Method to fetch analytics data */
    $scope.getAnalyticsData = function(){
        inputreq = JSON.stringify($scope.reportparams);
        $scope.isAnalytics = true;
        if(!angular.isDefined($scope.class.analytics)){
            sfactory.serviceCallReports(inputreq, 'classanalytics').then(function(response) {
                if(angular.isDefined(response.data)){
                   $scope.class.analytics = response.data;
                   loadAnalytics();
                    $rootScope.appLoader = false;
                }
            }, function(error) {
                var localTask = "classreports";
                sfactory.localService(localTask).then(function(response) {
                    $scope.class.analytics = response.data;
                    loadAnalytics();
                }, function(error) {
                });
            });
        }
        else{
            loadAnalytics();
        }
    }
    
     /* Method to load charts */
    function loadAnalytics(){
        //Load Pie Charts
        $scope.classStatus = reportService.loadPiechart($scope.class.analytics.class_status,'Class Status');
    };
    $scope.chartModalClass = function() {        
        $scope.modalMsgClass = !$scope.modalMsgClass;
    };
    
    $scope.chartModalClassnoofcls = function() {        
        $scope.modalnoofclass = !$scope.modalnoofclass;
    };
    $scope.chartModalClassnoofstatus = function() {        
        $scope.noofstatus = !$scope.noofstatus;
    };
    $scope.chartModalClassnoofstu = function() {        
        $scope.noofstudents = !$scope.noofstudents;
    };
    /* Method to show charts according to the date range selected */
    function updateCharts(startDate,endDate){
        var requestData = JSON.stringify({
            'start_date': startDate,
            'end_date': endDate,
            'group_id'  : $scope.reportparams.group_id,
            'user_id': $scope.reportparams.user_id
        });
        
        sfactory.serviceCallReports(requestData, 'classanalytics').then(function(response) {
            if($filter('lowercase')(response.status) == 'success'){
                //Load Line Charts
                $scope.class.analytics.no_of_class.change(response.data.no_of_class);
                $scope.class.analytics.no_of_class.x = response.data.no_of_class.x;
                $scope.class.analytics.no_students_enrolled_with_classes.change(response.data.no_students_enrolled_with_classes);
                $scope.class.analytics.no_students_enrolled_with_classes.x = response.data.no_students_enrolled_with_classes.x;
                //Load Pie Charts
                $scope.classStatus.change(reportService.loadPiechart(response.data.class_status,'Class Status'));
                $scope.classStatus.data = response.data.class_status;
                $rootScope.appLoader = false;
            }            
            }, function(error) {
            var localTask = "updatedreportdata";
            sfactory.localService(localTask).then(function(response) {
                //Load Line Charts
                $scope.class.analytics.no_of_class.change(response.data.no_of_class);
                $scope.class.analytics.no_students_enrolled_with_classes.change(response.data.no_students_enrolled_with_classes);

                //Load Pie Charts
                $scope.classStatus.change(reportService.loadPiechart(response.data.class_status,'Class Status'));
                $scope.classStatus.data = response.data.class_status;
                $rootScope.appLoader = false;
                }, function(error) {
                });
            });
    };
    
    /* Method to download reports as csv */
    $scope.downloadReport = function(task){
        userId = $scope.reportparams.user_id;
        groupId = $scope.reportparams.group_id;
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
    
    /* Method to initialize controller */
    function initializeController(){
        
        var classanalyticsscope = angular.element(jQuery("#adminLanding")).scope();
        
        $scope.reportparams = {
            'group_id'  : encryptionService.decrypt(sessionService.get('grp_id')),            
            'user_id': encryptionService.decrypt(sessionService.get('userId'))
        };
        reportDataReq = JSON.stringify({           
        });
        $scope.class = {};chartArray=[];
        $scope.class.vmDate = Last7Days().split(',')[Last7Days().split(',').length-1]+" To "+Last7Days().split(',')[0];
        getReportData();
        $scope.daterangecustompick = $scope.class.vmDate;
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
            pageName: 'classreport',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            sortType: 'firstname',
            isCheckboxhide: true,
            headers: [{
                    name: 'Class name',
                    bind_val: 'classname',
                    isSortable: true
                },
                {
                    name: 'Class Admin',
                    bind_val: 'class_admin',
                    isSortable: true
                },
                {
                    name: 'class admin type',
                    bind_val: 'roleType',
                    isSortable: true
                },       
                {
                    name: 'Number of Enrolled Users',
                    bind_val: 'enrolled_count',
                    isSortable: true
                },
                    
                {
                    name: 'Status',
                    bind_val: 'status',
                    isSortable: true
                },
                {
                    name: 'Date Created',
                    bind_val: 'date',
                    isSortable: true
                }
            ],
            data: []
        };
        chartProperties=[
            {
                chartTitle:"Number of Classes",
                taskUrl :"classcount",
                key:"no_of_class",
                type:"line"
            },
            {
                chartTitle:"Number of Students",
                taskUrl : "enrolledstudents",
                key:"no_students_enrolled_with_classes",
                type:"line"
            },
            {
                chartTitle:"Class Status",
                taskUrl : "classstatus",
                key:"class_status",
                type:"pie"
            }
        ];
    }
    initializeController();
    
}]);