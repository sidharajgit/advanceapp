advancePubapp.directive('hcLineChart', function () {  
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
                        chart = Highcharts.chart(element[0],{
                        credits: {
                            enabled: false
                        },
                        title: {
                                text: scope.chartdata.title,
                                align: 'left'
                        },
                        xAxis: {
                            categories: scope.chartdata.x,
                            title: {
                                enabled: false
                            }     
                        },
                        yAxis: {
                                title: {
                                    text :scope.chartdata.y_axis_label
                                }
                        },
                        exporting: {
                                 enabled: false
                        },
                        legend: {
                                enabled: scope.isEnableLegend
                            },
                        tooltip:{
                            formatter:function(){
                                var symbol;

                                
                                var displayStr = '<b>' + this.x + '</b>';
                                    $.each(this.points,function(){                                        
                                        switch ( this.point.graphic.symbolName ) {
                                            case 'circle':
                                                symbol = '●';
                                                break;
                                            case 'diamond':
                                                symbol = '♦';
                                                break;
                                            case 'square':
                                                symbol = '■';
                                                break;
                                            case 'triangle':
                                                symbol = '▲';
                                                break;
                                            case 'triangle-down':
                                                symbol = '▼';
                                                break;
                                        }
                                        displayStr += ' <br><span style="color:'+ this.series.color + '">' + symbol+ '</span>'+ this.series.name + ' : ' + this.y;
                                    });
                                return (scope.chartdata.title === 'Conversion Ratio') ? displayStr+"%" : displayStr;
                            },
                            shared: true
                        },
                        lang: {
                                noData: 'No data found!'
                        },
                        series: scope.chartdata.series
                    });
                    };
                        
                    scope.chartdata.change = function(newData){
                        chart.legend.update({
                            enabled: isShowLegend(newData.series)
                        });
                        chart.xAxis[0].update({
                            categories: newData.x
                        });
                        /*chart.xAxis[0].update({
                            categories: newData.x
                        });*/
                        
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
                            chart.options.plotOptions = {line: {dataLabels: {enabled: true}}};
                            scope.chartobj({response:chart});
                        }
                    };
                    
                    init();
                }
        };
});
