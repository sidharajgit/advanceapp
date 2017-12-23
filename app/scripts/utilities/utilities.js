function getSum(startVal, endVal) {
    return startVal + endVal;
}

var getDaysInMonth = function(month,year) {
  return new Date(year, month, 0).getDate();
};

function weekCount(year, month_number, startDayOfWeek) {
  // month_number is in the range 1..12

  // Get the first day of week week day (0: Sunday, 1: Monday, ...)
  var firstDayOfWeek = startDayOfWeek || 0;

  var firstOfMonth = new Date(year, month_number-1, 1);
  var lastOfMonth = new Date(year, month_number, 0);
  var numberOfDaysInMonth = lastOfMonth.getDate();
  var firstWeekDay = (firstOfMonth.getDay() - firstDayOfWeek + 7) % 7;

  var used = firstWeekDay + numberOfDaysInMonth;

  return Math.ceil( used / 7);
}

function getWeekNumber(thisDate) {
    var dt = new Date(thisDate);
    var thisDay = dt.getDate();

    var newDate = dt;
    newDate.setDate(1); // first day of month
    var digit = newDate.getDay();

    var Q = (thisDay + digit) / 7;

    var R = (thisDay + digit) % 7;

    if (R !== 0) return Math.ceil(Q);
    else return Q;
}

/* Method to return first and last date of week */
function getweekDuration(curr){
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
	first = first > 0 ? first : (first+1);
    return {firstDate:first,lastDate:last};
}


/* Method to get 7 days date range */
function getDailyrange(startdate,enddate,month,year){
    var datesBetween = [];
    while (startdate <= enddate) {
		var date = year+"-"+month+"-"+(startdate+1);
        datesBetween.push(new Date(date).toISOString().substring(0,10));
        startdate = startdate + 1;
    } 
    return datesBetween;
}

function Last7Days() {
    return '0123456'.split('').map(function(n) {
        var d = new Date();
        d.setDate(d.getDate() - n);
        return (function(day, month, year) {
            return [month < 10 ? '0' + (month + 1) : (month + 1), day < 10 ? '0' + day : day,year].join('-');
        })(d.getDate(), d.getMonth(), d.getFullYear());
    }).join(',');
};

/* Method to get last 7 days range*/
function getLast7days(){
    var dateObj={};
    var dateArray = Last7Days().split(',');
    var lastDate = new Date(dateArray[0]);
    var firstDate = new Date(dateArray[(dateArray.length - 1)]);
    var lastMonth = ((1+lastDate.getMonth()) < 10) ? '0'+ (1+lastDate.getMonth()) : (1+lastDate.getMonth());
    var lastendDate = (lastDate.getDate()) < 10 ? '0' + lastDate.getDate() : lastDate.getDate(); 
    var firstMonth = ((1+firstDate.getMonth()) < 10 ) ? '0'+ (1+firstDate.getMonth()) : (1+firstDate.getMonth());
    var firststartDate = (firstDate.getDate()) < 10 ? '0'+firstDate.getDate() : firstDate.getDate();
    dateObj.endDate = lastMonth + '-'+lastendDate+'-'+lastDate.getFullYear();
    dateObj.startDate = firstMonth+'-'+firststartDate+'-'+firstDate.getFullYear();
    return dateObj;
};

/* Method to get current month dates range*/
function getThisMonthdays(){
     var dateObj={};
     var formatted_date = function(date){
        return ("0"+ (date.getMonth()+1)).slice(-2) +'-'+("0"+ date.getDate()).slice(-2) +'-'+ date.getFullYear(); 
     }
     var curr_date =new Date();
     var first_day = new Date(curr_date.getFullYear(), curr_date.getMonth(), 1); 
     var last_day = new Date(curr_date.getFullYear(), curr_date.getMonth() + 1, 0);
     dateObj.endDate = formatted_date(last_day);
     dateObj.startDate = formatted_date(first_day);
     return dateObj;
};

/* Method to get previous month dates range*/
function getLastMonthdays(){
    var dateObj={};
    var curr_date = new Date();
    var prevMonthLastDate = new Date(curr_date.getFullYear(), curr_date.getMonth(), 0);
    var prevMonthFirstDate = new Date(curr_date.getFullYear(), (curr_date.getMonth() - 1 + 12) % 12, 1);
    var formatDateComponent = function(dateComponent) {
      return (dateComponent < 10 ? '0' : '') + dateComponent;
    };
    var formatDate = function(date) {
      return formatDateComponent(date.getMonth() + 1) + '-' + formatDateComponent(date.getDate()) + '-' + date.getFullYear();
    };
    dateObj.endDate = formatDate(prevMonthLastDate);
    dateObj.startDate =formatDate(prevMonthFirstDate);
    return dateObj;
};

/* Method to get current year dates range*/
function getYearDays(){
    var dateObj={};
    var firstDay = new Date(new Date().getFullYear(), 0, 1);
    var lastday = new Date(new Date().getFullYear(), 11, 31);
    dateObj.startDate = (1+firstDay.getMonth())+'-'+firstDay.getDate() +'-'+ firstDay.getFullYear();
    dateObj.endDate = (1+lastday.getMonth())+'-'+lastday.getDate() +'-'+ lastday.getFullYear();
    return dateObj;
};

/* Method to get year to date dates range*/
function getYearToDateDays(){
    var dateObj={};
    var firstDay = new Date(new Date().getFullYear(), 0, 1);
    var lastDay = new Date();
    var lastMonth = ((1+lastDay.getMonth()) < 10) ? '0'+ (1+lastDay.getMonth()) : (1+lastDay.getMonth());
    var lastendDate = (lastDay.getDate()) < 10 ? '0' + lastDay.getDate() : lastDay.getDate(); 
    var firstMonth = ((1+firstDay.getMonth()) < 10 ) ? '0'+ (1+firstDay.getMonth()) : (1+firstDay.getMonth());
    var firststartDate = (firstDay.getDate()) < 10 ? '0'+firstDay.getDate() : firstDay.getDate();
    
    dateObj.startDate = firstMonth+'-'+firststartDate +'-'+ firstDay.getFullYear();
    dateObj.endDate = lastMonth+'-'+lastendDate +'-'+ lastDay.getFullYear();
    return dateObj;
};

/* Method to get this quarter dates range*/
function getThisQuarterdays(){
    var dateObj={};
    var firstDay = moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).subtract(2, 'months').format('MM-DD-YYYY');
    var lastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    dateObj.endDate = (1+lastDay.getMonth())+'-'+lastDay.getDate() +'-'+ lastDay.getFullYear();
    dateObj.startDate=firstDay;
    return dateObj;
};