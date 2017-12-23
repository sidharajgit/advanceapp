advancePubapp.directive('hcPieLoadChart', function () {
                    return {
                        restrict: 'E',
                        template: '<div></div>',
                        scope: {
                            chartdata: '='
                        },
                        link: function (scope, element) {
                            var chart = Highcharts.chart(element[0], {
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
                                            format: '<b>{point.name}</b>: {point.percentage:.2f} %'
                                        },
                                        showInLegend: true
                                    }
                                },
                                tooltip: {
                                      pointFormat: "{point.name}: {point.percentage:.2f} %"
								},
                                lang: {
                                    noData: 'No data found!'
                                },
                                series: [{
                                    data: scope.chartdata.series[0].data
                                }]
                            });
                            scope.chartdata.change = function(chartData){
                                chart.series[0].update({
                                        data: chartData.series[0].data
                                });
                            }
                            
                        }
                }
});
