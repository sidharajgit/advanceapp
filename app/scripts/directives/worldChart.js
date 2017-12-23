advancePubapp.directive('hcWorldChart', function () { 
                    return {
                        restrict: 'E',
                        template: '<div></div>',
                        scope: {
                             chartdata: '=',
                            chartobj : "&"
                        },
                        link: function (scope, element) {
                            
                            function drawChart(){
                                chart = Highcharts.mapChart(element[0], {
                                    chart: {
                                        map: 'custom/world'
                                    },
                                    credits: {
                                        enabled: false
                                    },

                                    title: {
                                        text: "SOURCE OF TRAFFIC : BY GEOGRAPHY",
                                        align: 'left'
                                    },
                                    exporting: {
                                        enabled: false
                                    },
                                    mapNavigation: {
                                        enabled: false
                                    },
                                    colorAxis: {
                                        min: 1,
                                        type: 'logarithmic',
                                        minColor: '#347789',
                                        maxColor: '#06b7e8'
                                    },

                                    series: [{
                                        data: scope.chartdata.data,                                         
                                        name: 'Users',                                         
                                        states: {
                                            hover: {
                                            color: '#BADA55'
                                            }
                                        },

                                        dataLabels: {
                                            enabled: true,
                                            formatter: function () {                
                                                if(this.point.value > 0){
                                                    return this.point.name+" - "+this.point.value;
                                                }
                                            }                                          

                                        }
                                    }],

                                          //series: scope.chartdata.series
                                        });
                            };
                            
                            scope.chartdata.change = function(chartData){
                                chart.series[0].update({
                                    data: chartData
                                });
                                scope.chartobj({response:chart});
                            };
                            function init(){                        
                                drawChart();
                                if(angular.isDefined(chart)){                                    
                                    scope.chartobj({response:chart});
                                }
                            };
                    
                            init();
                        
                            

                            
                        }
                };
});
