advancePubapp.directive('hcBarStackChart', function () { 
     return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                 chartdata: '=',
                 chartobj : "&"
            },
            link: function (scope, element) {
                var chart;
                function drawChart(){
                  chart = Highcharts.chart(element[0], {
                      credits: {
                            enabled: false
                        },
                        chart: {
                            type: 'column'
                        },
                        title: {
                            text: scope.chartdata.title,
                            align: 'left'
                        },
                        xAxis: {
                            categories:scope.chartdata.x,
                            crosshair: true,
                            title: {
                                text: null
                            }
                        },
                        yAxis: {
                            min: 0,
                            title: {
                                text:scope.chartdata.y_axis_label
                            }
                        },
                         tooltip: {
                            formatter: function() {
                                return 'Total Number of '+this.series.name+': '+ this.point.stackTotal+'<br/>'+
                                    this.series.name +': '+ this.y +'<br/>'+'Type : '+this.series.userOptions.usertype ;
                            }
                        },
                        plotOptions: {
                            column: {
                                stacking: 'normal'
                            }
                        },
                      lang: {
                            noData: 'No data found!'
                        },
                      exporting: {
                            enabled: false
                        },
                      series: scope.chartdata.series
                    });
                    return chart;
                };
               scope.chartdata.change = function(newData){
                   scope.chartdata.x = angular.copy(newData.x);
                   chart.xAxis[0].update({
                        categories: newData.x
                    });
                   //chart.series = chart.series.slice(0,newData.series.length);
                    for(var i=0;i<newData.series.length;i++){
                        chart.series[i].update({
                            data: newData.series[i].data
                        });
                    }
//                   for(var i=0;i<chart.series.length;i++){
//                        chart.series[i].remove();
//                    }
//                   for(var i=0;i<newData.series.length;i++){
//                        chart.addSeries(newData.series[i]);
//                    }
//                   chart.redraw();
                   scope.chartobj({response:chart});
                };
                function isShowLegend(obj) {
                    var emptyArrayMembers = _.filter(obj, function(member) { 
                            return _.isArray(member.data) && _.isEmpty(member.data)
                    });
                    return (obj.length > 1 ) && (emptyArrayMembers.length === 0);
                };
                        
                function init(){
                    scope.isEnableLegend = isShowLegend(scope.chartdata.series);
                    drawChart();
                    if(angular.isDefined(chart)){
                        scope.chartobj({response:chart});
                    }
                };

                init();
            }
    };
});    
    