advancePubapp.directive('hcPieChart', function () {
                    return {
                        restrict: 'E',
                        template: '<div></div>',
                        scope: {
                            chartdata: '=',
                            chartobj : "&"
                        },
                        link: function (scope, element) {
                            var chart;myArray=[];
                            function drawChart(){
                                chart = Highcharts.chart(element[0], {
                                    credits: {
                                        enabled: false
                                    },
                                    chart: {
                                        type: 'pie'
                                    },
                                    title: {
                                        text: scope.chartdata.title,
                                        align: 'left'
                                    },
                                    plotOptions: {
                                        pie: {
                                            allowPointSelect: true,
                                            cursor: 'pointer',
                                            dataLabels: {
                                                enabled: false,
                                                format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f} %)'
                                            },
                                            showInLegend: true
                                            /*point: {
                                                events: {
                                                    legendItemClick: function (event) {                       
                                                        total = $(".highcharts-legend .highcharts-legend-item").length;
                                                        hiden = $(".highcharts-legend .highcharts-legend-item-hidden").length;                 				
                                                        eventName = event.target.name;
                                                        eventNameIndex = $.inArray(eventName, myArray);
                                                        if((total-1) == hiden){ 
                                                            if(eventNameIndex >-1){
                                                                myArray.splice(eventNameIndex, 1);        
                                                            }else{
                                                                event.preventDefault();
                                                                this.select(); 
                                                            }
                                                        }else{
                                                            if(eventNameIndex >-1){
                                                                myArray.splice(eventNameIndex, 1);
                                                            }else{
                                                                myArray.push(eventName);
                                                            } 
                                                        }
                                                    }
                                                }
                                            }*/
                                        },
                                        /*series: {
                                            point: {
                                                events: {
                                                    legendItemClick: function () {
                                                        return false; // <== returning false will cancel the default action
                                                    }
                                                }
                                            }
                                        }*/
                                    },
                                    exporting: {
                                           enabled: false
                                    },
                                    tooltip: {
                                          pointFormat: "<b>{point.y} ({point.percentage:.2f} %)</b>"
                                    },
                                    lang: {
                                        noData: 'No data found!'
                                    },
                                    series: [{
                                        data: scope.chartdata.data
                                    }]
                                });
                            };
                            
                            scope.chartdata.change = function(chartData){
                                chart.series[0].update({
                                    data: chartData.data
                                });
                                scope.chartobj({response:chart});
                            };
                            
                            function init(){
                                drawChart();
                                if(angular.isDefined(chart)){
                                    chart.options.plotOptions = {pie: {dataLabels: {enabled: true,format: '<b>{point.name}</b>: {point.y} ({point.percentage:.1f} %)'}}};
                                    scope.chartobj({response:chart});
                                } 
                            };
                            init();
                        }
                }
});
