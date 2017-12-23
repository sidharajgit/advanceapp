advancePubapp.directive('hcBarChart', function () { 
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
                                    exporting: {
                                         enabled: false
                                    },
                                    legend: {
                                        enabled: scope.isEnableLegend
                                    },
                                    tooltip: {
                                        shared: true,
                                    },
                                    plotOptions: {
                                        column: {
                                            pointPadding: 0.2,
                                            borderWidth: 0
                                        }
                                    },
                                    lang: {
                                        noData: 'No data found!'
                                    },
                                  series: scope.chartdata.series
                                });
                                return chart;
                            };

                           scope.chartdata.change = function(newData){
                               chart.legend.update({
                                    enabled: isShowLegend(newData.series)
                               });
                               scope.chartdata.x = angular.copy(newData.x);
                               chart.xAxis[0].update({
                                    categories: newData.x
                                });
                                for(var i=0;i<newData.series.length;i++){
                                    chart.series[i].update({
                                        data: newData.series[i].data
                                    });
                                }
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
