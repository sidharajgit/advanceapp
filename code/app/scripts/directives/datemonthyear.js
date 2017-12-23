advancePubapp.directive('datemonthyear',['appconstants',function(appconstants){
	return{
		restrict: 'E',
		templateUrl:templateURL+"dest/templates/datemonthyear.html",
		scope:{
			datemonth:'=',
			agecheck :'=',
			disableinput :'=',
            isrequired : '='
		},
		link: function(scope, element, attrs) {
			
			scope.getDobMonth   = function(){
				scope.dobmonth  = _.keys(appconstants.monthdays);
				//(scope.agecheck == 'ageabovethirteen') ? belowAgeCheck() :'';
				belowAgeCheck();
			};
			
			scope.getDobDay     = function(){
				scope.dobmonth  = _.keys(appconstants.monthdays);
				//(scope.agecheck == 'ageabovethirteen') ? belowAgeCheck() :'';
				belowAgeCheck();
			};
			
			scope.getDobYear    = function(){
				var leapyear;
				scope.dobmonth  = _.keys(appconstants.monthdays);
				scope.days      = Number(scope.monthdate["January"]);
				if(scope.datemonth.month == 2){
					leapyearcheck();
				}else{
					belowAgeCheck();
				}
			};
			
			function leapyearcheck(){
				leapyear    = ((scope.datemonth.year % 4 == 0) && (scope.datemonth.year % 100 != 0)) || (scope.datemonth.year % 400 == 0);
				if(!leapyear){
					if(scope.datemonth.day >= 29){
						scope.datemonth.day = '';
					}
					scope.days = 28;
				}else{
					scope.days = 29;
				}
			}
			
			function belowAgeCheck(){
				if(scope.datemonth.year && scope.datemonth.month && scope.datemonth.day){
					if(currentYear-13 == scope.datemonth.year){  
						if((currentmonth  <= (Object.keys(scope.monthdate)).indexOf(scope.datemonth.month)+1) && currentdate < scope.datemonth.day){
							scope.days     = currentdate;
							scope.dobmonth = (Object.keys(scope.monthdate)).slice(0, (Object.keys(scope.monthdate)).indexOf(scope.datemonth.month)+1);
							scope.datemonth.day     = "";
							scope.datemonth.month   = "";
						}
					}else{
						monthCalculation();
					}
				}else if(scope.datemonth.year && scope.datemonth.month){
					if((currentmonth  <= (Object.keys(scope.monthdate)).indexOf(scope.datemonth.month)+1)){
						scope.days     = currentdate;
						scope.dobmonth = (Object.keys(scope.monthdate)).slice(0, (Object.keys(scope.monthdate)).indexOf(scope.datemonth.month)+1);
					}
				}else{
					monthCalculation();
				}				
			};
			
			function monthCalculation(){
				if(scope.datemonth.year && scope.datemonth.month == 2){
					leapyearcheck();
				}else{
					scope.datemonth.month = (angular.isDefined(scope.datemonth.month) && scope.datemonth.month != '') ? scope.datemonth.month : 1;
					monthvalues           = Object.values(scope.monthdate);
					scope.days            = Number(monthvalues[scope.datemonth.month-1]);
				}
			}
			
			function init(){
				currentTime      = new Date();
				currentdate      = currentTime.getDate()
				currentmonth     = currentTime.getMonth() + 1
				currentYear      = currentTime.getFullYear();			
				scope.monthdate  = appconstants.monthdays;
				scope.dobmonth   = _.keys(appconstants.monthdays);
				currentYearCheck = (scope.agecheck == 'ageabovethirteen') ? currentYear-12 :currentYear-2;
				scope.years      = _.range(currentYear-100, currentYearCheck);
				scope.days       = Number(scope.monthdate["January"]);
			};
			
			init();
		}
	};
}])