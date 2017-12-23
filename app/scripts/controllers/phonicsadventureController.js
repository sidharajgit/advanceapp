advancePubapp.controller('phonicsadventureController',['$scope', 'sfactory','$uibModal','$rootScope','$filter','$log','$stateParams','reportService','sessionService','encryptionService', function($scope,sfactory,$uibModal,$rootScope,$filter,$log,$stateParams,reportService,sessionService,encryptionService) {
    var reportDataReq,chartArray; 
    
    //Method  for phonic adventure report
    function phonicadventurereport(reportDataReq){
        var task = 'programreportsind';
        inputreq = JSON.stringify(reportDataReq);
        sfactory.serviceCallReports(inputreq, task).then(function(response) {
        if(angular.isDefined(response)){
            if($filter('lowercase')(response.status) == 'success'){
                $scope.tableData.data =response.data.program_report;
                $scope.phonicadventure.overall = response.data.users_at_program;
                $rootScope.appLoader = false;
            }else{
                $rootScope.appLoader = false;
            }	
        }
        }, function(error) {
            var localTask = "phonicadventurereports";
                sfactory.localService(localTask).then(function(response) {
                $scope.tableData.data =response.data.data.program_report;
                $scope.phonicadventure.overall = response.data.data.users_at_program;
            }, function(error) {
            });
        });
    }
    
    //Method for phonic adventure analytics
    $scope.getphonicAnalyticsData = function(){
        inputreq = JSON.stringify(reportDataReq);
        var task = 'programanalyticsind';
        sfactory.serviceCallReports(inputreq, task).then(function(response) {            
            if(angular.isDefined(response.data)){
                $scope.phonicadventure.phonics= response.data;
                $rootScope.appLoader = false;
            }
        }, function(error) {
        var localTask = "phonicadventurereports";
            sfactory.localService(localTask).then(function(response) {                
                $scope.phonicadventure.phonics= response.data.analyticsdata;
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
                        dateRange:$scope.daterangecustompick,
                        chartProperties:chartProperties,
                        reportsProgram: "Phonics Adventure"
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
    function updateCharts(start_date,end_date){
          var requestData = JSON.stringify({
                'start_date': start_date,
                'end_date': end_date,                
                'program_id': "Phonics Adventure",
                'group_id'  : reportDataReq.group_id,
                'user_id': reportDataReq.user_id
        });
        sfactory.serviceCallReports(requestData, 'programanalyticsind').then(function(response) {
			if(angular.isDefined(response)){
				if($filter('lowercase')(response.status) == 'success'){
					$scope.phonicadventure.phonics.most_visited.change(response.data.most_visited);
                    $scope.phonicadventure.phonics.most_visited.x = (response.data.most_visited.x);
                    $scope.phonicadventure.phonics.classes_at_program.change(response.data.classes_at_program); 
                    $scope.phonicadventure.phonics.classes_at_program.x = (response.data.classes_at_program.x);
                    $scope.phonicadventure.phonics.enrollment_at_program.change(response.data.enrollment_at_program); 
                    $scope.phonicadventure.phonics.enrollment_at_program.x = (response.data.enrollment_at_program.x);
                    
                    $scope.phonicadventure.phonics.enrollement_based_on_textbook.change(response.data.enrollement_based_on_textbook); 
					$rootScope.appLoader = false;
				}
			 }	
        }, function(error) {
        var localTask = "phonicadventurereports";
        sfactory.localService(localTask).then(function(response) {
            $scope.phonicadventure.phonics.most_visited.change(response.data.analyticsdata.most_visited);
            $scope.phonicadventure.phonics.classes_at_program.change(response.data.analyticsdata.classes_at_program);                                   
            $scope.phonicadventure.phonics.enrollment_at_program.change(response.data.analyticsdata.enrollment_at_program);            
            $scope.phonicadventure.phonics.enrollement_based_on_textbook.change(response.data.analyticsdata.enrollement_based_on_textbook);  
            }, function(error) {
            });
        });
    }

    //Method for activities download
    $scope.phonicadventuredownload = function(task){
        userId  = reportDataReq.user_id;
        groupId = reportDataReq.group_id; //encryptionService.decrypt(reportDataReq.group_id);
         if($scope.startDate && $scope.endDate){
            var start = new Date($scope.startDate).getFullYear()+"-"+(Number(new Date($scope.startDate).getMonth())+1)+"-"+new Date($scope.startDate).getDate();
            var end = new Date($scope.endDate).getFullYear()+"-"+(Number(new Date($scope.endDate).getMonth())+1)+"-"+new Date($scope.endDate).getDate();
            window.location = appUrl+task+"?start_date="+start+"&end_date="+end+"&program_id=Phonics Adventure"+"&user_id="+userId+"&group_id="+groupId+"&csv=1";
        }
        else{
            window.location = appUrl+task+"?program_id=Phonics Adventure"+"&user_id="+userId+"&group_id="+groupId+"&csv=1";
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
    
	 //Method for initilize controller
    function initilizephonicsadventure(){
        var phonicsreportscope = angular.element(jQuery("#adminLanding")).scope();
        
        reportDataReq = {
            'program_id': "Phonics Adventure",
            'group_id'  : encryptionService.decrypt(sessionService.get('grp_id')),
            'user_id': encryptionService.decrypt(sessionService.get('userId'))           
        };
        phonicadventurereport(reportDataReq);
        $scope.phonicadventure = {};chartArray=[];
        $scope.phonicadventure.vmDate = Last7Days().split(',')[Last7Days().split(',').length-1]+" To "+Last7Days().split(',')[0];
        $scope.tableData = {
            pageName: 'phonicsreportstable',
            isFilterbtns: false,
            isSearch: true,
            isPagination: true,
            sortType: '',
            isCheckboxhide: true,
            headers: [{name: 'Course',bind_val: 'label',isSortable: true},
                {name: 'No of enrolled users',bind_val: 'no_of_enrolled_users',isSortable: true},
                {name: 'no of Activity',bind_val: 'no_of_activities',isSortable: true},
                {name: 'no of Student Completed Course',bind_val: 'no_of_students_completed',isSortable: true},
                {name: 'no of visit',bind_val: 'no_of_visits',isSortable: true},
                {name: 'no of shares',bind_val: 'no_of_shares',isSortable: true},
                {name: 'Time spent',bind_val: 'time_spent',isSortable: true},                
            ],
            data: []
        };
        
        $scope.daterangecustompick = $scope.phonicadventure.vmDate;
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
		
		    chartProperties=[
            {
                chartTitle:"Phonics Adventure- User visits",
                taskUrl :"uservisitbyprogram",
                key:"most_visited",
                type:"line"
            },
            {
                chartTitle:"Classes at Phonics Adventure",
                taskUrl :"classesatprogram",
                key:"classes_at_program",
                type:"line"
            },
            {
                chartTitle:"Enrollment at Phonics Adventure",
                taskUrl :"enrolledatprogram",
                key:"enrollment_at_program",
                type:"line"
            }, 
            {
                chartTitle:"Enrollement Based On Textbook",
                taskUrl :"enrollementbasedontextbook",
                key:"enrollement_based_on_textbook",
                type:"bar"
            }
        ];
    }
    initilizephonicsadventure();
}]);