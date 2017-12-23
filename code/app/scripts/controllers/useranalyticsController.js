advancePubapp.controller('useranalyticsController', ['$scope', '$http', 'sfactory','$log','$uibModal', '$document','$timeout','reportService','$rootScope','$filter','$stateParams','sessionService','encryptionService',function($scope, $http, sfactory, $log,$uibModal, $document,$timeout,reportService,$rootScope,$filter,$stateParams,sessionService,encryptionService) {
    var chartProperties,reportDataReq,chartArray; 
    
    /* Method to fetch overall user reports */
    function getReportsData(reportDataReq) {
        inputreq = JSON.stringify($scope.reportparams);
        sfactory.serviceCallReports(inputreq, 'userreportsdata').then(function(response) {
            if(angular.isDefined(response)){
                if($filter('lowercase')(response.status) == 'success'){
                    $scope.tableData.data =response.data.users_report;
                    _.each($scope.tableData.data, function(item){
                        var createDate = moment.utc(item.created).local();                        
                        item.created = moment(createDate).format("MM/DD/YYYY HH:mm:ss");                        
                        if(item.lastlogin == "00/00/0000 00:00:00"){
                            item.lastlogin = "NA";
                        }else{
                            var lastLogin = moment.utc(item.lastlogin).local();                        
                            item.lastlogin = moment(lastLogin).format("MM/DD/YYYY HH:mm:ss");
                        }
                    });
                    $scope.users.reports =response.data;
                    $rootScope.appLoader = false;
                }
            }
        }, function(error) {
            var localTask = "reportdata";
            sfactory.localService(localTask).then(function(response) {
                $scope.tableData.data =response.data.users_report;
                _.each($scope.tableData.data, function(item){
                    var createDate = moment.utc(item.created).local();                        
                    item.created = moment(createDate).format("MM/DD/YYYY HH:mm:ss");                        
                    if(item.lastlogin == "00/00/0000 00:00:00"){
                        item.lastlogin = "NA";
                    }else{
                        var lastLogin = moment.utc(item.lastlogin).local();                        
                        item.lastlogin = moment(lastLogin).format("MM/DD/YYYY HH:mm:ss");
                    }
                });
                $scope.users.reports =response.data;
            }, function(error) {
            });
        });
    };
     
    $scope.getAnalyticsData = function(){
        $scope.isAnalytics = true;
        inputreq = JSON.stringify($scope.reportparams);
        sfactory.serviceCallReports(inputreq, 'useranalyticsdata').then(function(response) {
            if(angular.isDefined(response)){
                if($filter('lowercase')(response.status) == 'success'){
                    $scope.users.analytics =response.data;
                    loadCharts();
                    $rootScope.appLoader = false;
                }
            }
        }, function(error) {
            var localTask = "reportdata";
            sfactory.localService(localTask).then(function(response) {
                $scope.users.analytics =response.data;
                loadCharts();
            }, function(error) {
            });
        });
        
    };
    
    function loadCharts() {
        //Load Pie Charts
        $scope.registeredUsers = reportService.loadPiechart($scope.users.analytics.count_of_usertypes_in_site,'Registered Users at Sommer Learning');
        $scope.userEnrollment = reportService.loadPiechart($scope.users.analytics.enrollments,'Enrolled and Self Enrolled Students');

        var trafficData = ($scope.traffic.byDevice) ? $scope.users.analytics.source_of_traffic.by_device : $scope.users.analytics.source_of_traffic.by_channel;
        $scope.sourceOfTraffic = reportService.loadPiechart(trafficData,'Source Of Traffic');
//        $scope.conversionRatio=reportService.loadChart($scope.users.analytics.conversion_ratio,$scope.users.analytics.conversion_ratio.title);
        $scope.channelTriggeredData= $scope.users.analytics.channel_triggered_users_visit;
        $scope.usersAnalyticsByGeo.data = $scope.users.analytics.by_geo;
        /*$timeout(function(){
			loadMap($scope.users.analytics.by_geo);
		},2000);*/
    };

    /*function loadMap(geoUsers) {
        google.charts.load('current', {
            'packages': ['geochart']
        });
        google.charts.setOnLoadCallback(drawRegionsMap);
        function drawRegionsMap() {
            var data = google.visualization.arrayToDataTable(geoUsers);
            var options = {
                showTooltip: true,
                showInfoWindow: true,
                colorAxis: {colors: ['#FF0000','#09a709']},
                datalessRegionColor:'lightgrey'
            };
            var chart = new google.visualization.GeoChart(document.getElementById('geography-map'));
            chart.draw(data, options);
        }
    };*/
    
    $scope.changeTrafficData = function(){
        var trafficData = ($scope.traffic.byDevice) ? $scope.users.analytics.source_of_traffic.by_device :$scope.users.analytics.source_of_traffic.by_channel;
        $scope.sourceOfTraffic.change(reportService.loadPiechart(trafficData,'Source of Traffic'));
    };
   
   
     function updateCharts(startDate,endDate) {
        if (startDate && endDate) {
            var dateObj= {};
            dateObj.startDate = startDate;
            dateObj.endDate = endDate;
			var selectedStartmonth = new Date(dateObj.startDate).getMonth()+1;
			var selectedEndmonth = new Date(dateObj.endDate).getMonth()+1;
			var requestData = JSON.stringify({
                'start_date': startDate,
                'end_date': endDate,
                'group_id'  : $scope.reportparams.group_id,
                'user_id': $scope.reportparams.user_id
            });
            
            sfactory.serviceCallReports(requestData, 'useranalyticsdata').then(function(response) {
                if($filter('lowercase')(response.status) == 'success'){
                    $timeout(function(){
					/*loadMap(response.data.by_geo);*/
                    $rootScope.appLoader = false;
				},2000);
                    $scope.usersAnalyticsByGeo.change(response.data.by_geo);
                    $scope.usersAnalyticsByGeo.data = response.data.by_geo;
                    
                    $scope.userEnrollment.change(reportService.loadPiechart(response.data.enrollments,'Enrolled and Self Enrolled Students'));
                    $scope.userEnrollment.data = response.data.enrollments;
                    
                    $scope.registeredUsers.change(reportService.loadPiechart(response.data.count_of_usertypes_in_site,'Registered Users at Sommer Learning'));
                    $scope.registeredUsers.data = response.data.count_of_usertypes_in_site;
                    
                    var sourceData = $scope.traffic.byDevice ? response.data.source_of_traffic.by_device :response.data.source_of_traffic.by_channel;
                    $scope.users.analytics.source_of_traffic.by_device = response.data.source_of_traffic.by_device;
                    $scope.users.analytics.source_of_traffic.by_channel = response.data.source_of_traffic.by_channel;
                    $scope.sourceOfTraffic.change(reportService.loadPiechart(sourceData,'Source of Traffic'));
                    $scope.sourceOfTraffic.data = sourceData;

                    $scope.users.analytics.user_visits.change(response.data.user_visits);
                    $scope.users.analytics.user_visits.x = response.data.user_visits.x;
                    
                    $scope.users.analytics.conversion_ratio.change(response.data.conversion_ratio);
                    $scope.users.analytics.conversion_ratio.x = response.data.conversion_ratio.x; 
//                    $scope.conversionRatio.change(reportService.updateChart(response.data.conversion_ratio,"Conversion Ratio : Guest to registrants",dateObj));
                    $scope.channelTriggeredData.change(reportService.updateChart(response.data.channel_triggered_users_visit,"Channel that triggered the user website visit",dateObj));
                                       
                }
                
            }, function(error) {
                var localTask = "updatedreportdata";
                sfactory.localService(localTask).then(function(response) {
                 /*$timeout(function(){
					loadMap(response.data.by_geo);
				},2000);*/
               
                $scope.userEnrollment.change(reportService.loadPiechart(response.data.enrollments,'Enrolled and Self Enrolled Students'));

                $scope.registeredUsers.change(reportService.loadPiechart(response.data.count_of_usertypes_in_site,'Registered Users at Sommer Learning'));
                $scope.registeredUsers.data = response.data.count_of_usertypes_in_site;
                var sourceData = $scope.traffic.byDevice ? response.data.source_of_traffic.by_device :response.data.source_of_traffic.by_channel;
                    $scope.sourceOfTraffic.change(reportService.loadPiechart(sourceData,'Source of Traffic'));

                $scope.users.analytics.user_visits.change(response.data.user_visits);
//                $scope.conversionRatio.change(reportService.updateChart(response.data.conversion_ratio,"Conversion Ratio : Guest to registrants",dateObj));
                $scope.channelTriggeredData.change(reportService.updateChart(response.data.channel_triggered_users_visit,"Channel that triggered the user website visit",dateObj));
                $scope.usersAnalyticsByGeo.change(response.data.by_geo);
                    $scope.usersAnalyticsByGeo.data = response.data.by_geo;
                }, function(error) {
                });
            });
        }
    };
    
    $scope.chartModal = function(size, chartType, data,traffic) {        
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
    $scope.chartModalUsers = function() {        
        $scope.modalMsgUsers = !$scope.modalMsgUsers;
    };
    $scope.chartModalUserStatus = function() {        
        $scope.modalMsgUserStatus = !$scope.modalMsgUserStatus;
    };
    $scope.chartModalUsersTime = function() {        
        $scope.modalMsgUsersTime = !$scope.modalMsgUsersTime;
    };

    $scope.noofvisitors = function() {        
        $scope.noofvisitorsSec = !$scope.noofvisitorsSec;
    };
    $scope.registeredusers = function() {        
        $scope.registeredusersSec = !$scope.registeredusersSec;
    };
    $scope.sourceoftraffic = function() {        
        $scope.sourceoftrafficSec = !$scope.sourceoftrafficSec;
    };
    $scope.souoftraffic = function() {        
        $scope.souoftrafficSec = !$scope.souoftrafficSec;
    };
    $scope.channeltrigger = function() {        
        $scope.channeltriggerSec = !$scope.channeltriggerSec;
    };
    $scope.enrollusers = function() {        
        $scope.enrollusersSec = !$scope.enrollusersSec;
    };
    $scope.convoradio = function() {        
        $scope.convoradioSec = !$scope.convoradioSec;
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
    
    function initiateController() {
        $scope.users = {};
        $scope.usersAnalyticsByGeo={};
        chartProperties=[];
        chartArray=[];
        $scope.reportparams = {
            'group_id'  : encryptionService.decrypt(sessionService.get('grp_id')),            
            'user_id': encryptionService.decrypt(sessionService.get('userId'))
        };
        $scope.daterangecustompick = Last7Days().split(',')[Last7Days().split(',').length-1]+" To "+Last7Days().split(',')[0];
        //$scope.daterangecustompick = {startDate: null, endDate: null};
        $scope.jsonData = [];
        $scope.tableData = {};
        $scope.traffic = {byDevice: true,byChannel :false};
        $scope.sourceTraficData = {
            byDevice: [],
            byChannel: []
        }
        
        var useranalyticsscope = angular.element(jQuery("#adminLanding")).scope();       
        
        
        
        var i = 0, reportData = {},task = "userreportsdata";
        
        $scope.dateoptions={
            /*singleDatePicker: true,*/
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
                    //updateCharts($scope.daterangecustompick.date.startDate.format('YYYY-MM-DD'),$scope.daterangecustompick.date.endDate.format('YYYY-MM-DD'));                    
                }
            }
        };
        /* Method to open modal window for filtering charts */
        $scope.items = ['item1', 'item2', 'item3'];
        $scope.tableData = {
            pageName: 'userreport',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            sortType: 'firstname',
            isCheckboxhide: true,
            headers: [{
                    name: 'first name',
                    bind_val: 'firstname',
                    isSortable: true
                },
                {
                    name: 'last name',
                    bind_val: 'lastname',
                    isSortable: true
                },
                {
                    name: 'user type',
                    bind_val: 'usertype',
                    isSortable: true
                },
                {
                    name: 'user name',
                    bind_val: 'username',
                    isSortable: true
                }/*,
                {
                    name: 'group',
                    bind_val: 'groupname',
                    isSortable: true
                }*/,
                {
                    name: 'status',
                    bind_val: 'status',
                    isSortable: true
                },
                {
                    name: 'created',
                    bind_val: 'created',
                    isSortable: true
                },
                {
                    name: 'last login',
                    bind_val: 'lastlogin',
                    isSortable: true
                },
                {
                    name: 'last ip',
                    bind_val: 'lastip',
                    isSortable: true
                }
            ],
            data: []
        };
        chartProperties=[
            {
                chartTitle:"Number of visitors",
                taskUrl : "uservisits",
                key:"user_visits",
                type:"line"
            },
            {
                chartTitle:"Registered Users at Sommer Learning",
                taskUrl : "usertypecount",
                key:"count_of_usertypes_in_site",
                type:"pie"
            },
            {
                chartTitle:"Source of Traffic",
                taskUrl : "sourceoftraffic",
                key:"",
                traffic:true,
                type:"pie"
            },
            {
                chartTitle:"Enrolled and Self Enrolled Students",
                taskUrl : "enrolled",
                key:"enrollments",
                type:"pie"
            },
            {
                chartTitle:"Channel that triggered the user website visit",
                taskUrl : "analyticsbychannel",
                key:"channel_triggered_users_visit",
                type:"bar"
            },
            {
                chartTitle:"Conversion Ratio",
                taskUrl : "guesttoregistered",
                key:"conversion_ratio",
                type:"line"
            },
            {
                chartTitle:"Guest Registered after N number of Visits",
                taskUrl : "guestRegisteredAfterNofvisit",
                key:"guest_registered",
                type:"line"
            }
        ];
        getReportsData(reportDataReq);
    };

    initiateController();
}]);