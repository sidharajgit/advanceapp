advancePubapp.service('reportService', function() {
    
    this.loadPiechart = function (data,title){
       var updatedData= {
            title: title,
            data: []
        }
        var item={};
        if(_.reduce(_.pluck(data, 'count'), function(data, num) { return data + num}, 0) !== 0){
           angular.forEach(data,function(obj){
                item.name = obj.label;
                item.y = obj.count;
                updatedData.data.push(item);
                item={};
            });
        }
        return updatedData;
    };

    function getLabels(data){
        var labelArray=[];
        _.each(data,function(obj){
            labelArray.push(obj.label);
        });
        return labelArray;
    };
    
    function getChartData(data,XAxis,filter,key){
        var dataArray = new Array(XAxis.length).fill(0);
        if(filter === 'year'){
                angular.forEach(data.data,function(obj){
                if(XAxis.indexOf(new Date(obj.date).getFullYear()) !== -1){
                    dataArray[XAxis.indexOf(new Date(obj.date).getFullYear())] = dataArray[XAxis.indexOf(new Date(obj.date).getFullYear())] + obj[key];
                    }
                });
        }
        else if(filter === 'month'){
                angular.forEach(data.data,function(obj){
                    dataArray[XAxis.indexOf(XAxis[new Date(obj.date).getMonth()])] = dataArray[XAxis.indexOf(XAxis[new Date(obj.date).getMonth()])]+obj[key];
                });
        }
        else if(filter === 'week'){
                angular.forEach(data.data,function(obj){
                    dataArray[getWeekNumber(obj.date)-1] = dataArray[getWeekNumber(obj.date)-1]+obj[key];
                });
        }
        else if(filter === 'day'){
                angular.forEach(data.data,function(obj){
                    dataArray[XAxis.indexOf(obj.date)] = dataArray[XAxis.indexOf(obj.date)]+obj[key];
                });
        }
        return dataArray;
    };
    
    this.updateChart = function(data,title,dateRange){
        var labels = getLabels(data);
        var startYear = new Date(dateRange.startDate).getFullYear();
        var lastYear = new Date(dateRange.endDate).getFullYear();
        var years=[],seriesData=[],item={},updatedData={},monthArray=[],weekArray=[],daysArray=[];
        var startMonth = new Date(dateRange.startDate).getMonth();
        var endMonth = new Date(dateRange.endDate).getMonth();
        var startWeekNo = getWeekNumber(dateRange.startDate);
        var endWeekNo = getWeekNumber(dateRange.endDate);
        var diffDays = Math.round(Math.abs((new Date(dateRange.startDate).getTime() - new Date(dateRange.endDate).getTime()) / (24 * 60 * 60 * 1000)));
        var key = (title === 'Conversion Ratio : Guest to registrants') ? 'percentage' : 'count';
        if (startYear !== lastYear){
            //Yearly Data
            seriesData =[];
             for(var i = startYear ; i<=lastYear ; i++){
                 years.push(i);
             }
             updatedData = getSeriesData(data,years,'year',key);
        }
        else if (startYear == lastYear) {
            if (startMonth !== endMonth) {
                //Monthly Data
                seriesData =[];
                monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                updatedData = getSeriesData(data,monthArray,'month',key);
            }
             else if (startMonth == endMonth) {
                if (diffDays < 7 && startWeekNo === endWeekNo) {
                    daysArray = getDailyrange(getweekDuration(new Date(dateRange.startDate)).firstDate,getweekDuration(new Date(dateRange.startDate)).lastDate,startMonth+1,startYear)
                    updatedData = getSeriesData(data,daysArray,'day',key);
                }
                else{
                    //Weekly Data
                     for (var i = 0; i < weekCount(lastYear, endMonth + 1, 0); i++) {
                       weekArray.push("Week " + (i + 1));
                     }
                    updatedData = getSeriesData(data,weekArray,'week',key);
                }
            }
        }
        return updatedData;
    };
    
    function getSeriesData(data,Xaxis,filter,key){
        var updatedData=[],seriesData=[],item={};
        _.each(data,function(obj){
                item.data = getChartData(obj,Xaxis,filter,key);
                seriesData.push(item);
                item ={};
            });
            updatedData.x = Xaxis;
            updatedData.series = getSeries(seriesData);
        return updatedData;
    };
      
    function getSeries(data){
        var totalData=0;
        _.each(data, function(item) {
            totalData = totalData + _.reduce(item.data, function(data, num) { return data + num}, 0);
        });
        if(totalData === 0){
            angular.forEach(data,function(obj){
                obj.data =[];
            });
        }
        return data;
    };
    
    this.loadChart = function (data,title){
        var daysArray = Last7Days().split(',').reverse();
        var seriesData=[],item={},chartData={};
        var key = (title === 'Conversion Ratio : Guest to registrants') ? 'percentage' : 'count';
        var percentage = new Array(daysArray.length).fill(0);
        _.each(data, function(obj) {
            item.name = obj.label;
            item.data = getData(obj.data,daysArray,key);
            item.selected= true;
            seriesData.push(item);
            item={};
        });
        chartData.title = title;
        chartData.x = daysArray;
        chartData.series = getSeries(seriesData);
        return chartData;
    }

    function getData(data,daysArray,key){
        var lineData= new Array(daysArray.length).fill(0);
        angular.forEach(data,function(obj){
            if(daysArray.indexOf(obj.date) !== -1){
                lineData[daysArray.indexOf(obj.date)] = lineData[daysArray.indexOf(obj.date)]+obj[key];
            }
        });
        return lineData;
    };
  
    function getSVG(charts) {
        var svgArr = [],
            top = 0,
            width = 0;
        Highcharts.each(charts, function (chart) {
            var svg = chart.getSVG(),
                svgWidth = +svg.match(
                    /^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/
                )[1],
                svgHeight = +svg.match(
                    /^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/
                )[1];

            svg = svg.replace(
                '<svg',
                '<g transform="translate(0,' + top + ')" '
            );
            svg = svg.replace('</svg>', '</g>');

            top += svgHeight;
            width = Math.max(width, svgWidth);

            svgArr.push(svg);
        });

        return '<svg height="' + top + '" width="' + width +
            '" version="1.1" xmlns="http://www.w3.org/2000/svg">' +
            svgArr.join('') + '</svg>';
    };
    
    this.exportCharts = function (charts, options) {
        options = Highcharts.merge(Highcharts.getOptions().exporting, options);
        Highcharts.post(options.url, {
            filename: options.filename || 'chart',
            type: options.type,
            width: options.width,
            svg: getSVG(charts)
        });
    };

});
