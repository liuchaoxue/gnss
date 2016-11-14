angular.module('MetronicApp').controller('dashboardController', function ($interval, $rootScope, $scope) {

    var data = [24,23,43,23,23,23,23,23,64,57,23,23];
    //var socket = io.connect('http://192.168.1.30:3000');
    //socket.on('new', function (data) {
    //    DopChart.initCharts(data);
    //});

    function showTime() {
        var date = new Date();
        var now = "";
        if (date.getHours() < 10) now = "0"
        now = now + date.getHours() + ":";
        if (date.getMinutes() < 10) now = now + "0"
        now = now + date.getMinutes();
        $scope.nowTime = now
    }

    function showChartTooltip(x, y, xValue, yValue) {
        $('<div id="tooltip" class="chart-tooltip">' + yValue + '<\/div>').css({
            position: 'absolute',
            display: 'none',
            top: y - 40,
            left: x - 40,
            border: '0px solid #ccc',
            padding: '2px 6px',
            'background-color': '#fff'
        }).appendTo("body").fadeIn(200);
    }

    function starMap(data) {
        anychart.onDocumentReady(function () {
            var dataSet = anychart.data.set(data);
            var seriesData_1 = dataSet.mapAs({x: [0], value: [1]});
            chart = anychart.polar();
            chart.container('starMap');
            chart.yScale().minimum(0).maximum(16);
            chart.yScale().ticks().interval(2);
            chart.xScale().maximum(360);
            chart.xScale().ticks().interval(30);
            chart.xAxis().labels().textFormatter(function () {
                return this['value'] + '°'
            });
            var series1 = chart.marker(seriesData_1);
            chart.draw();
        });
    }

    function lineChart(chartId, data, color) {
        if (!jQuery.plot) return;
        if ($('#' + chartId).size() != 0) {
            var previousPoint2 = null;
            $('#' + chartId + '_loading').hide();
            $('#' + chartId + '_content').show();
            $.plot($("#" + chartId),
                [{
                    data: data,
                    lines: {
                        fill: 0.2,
                        lineWidth: 0,
                    },
                    color: [color]
                }, {
                    data: data,
                    points: {
                        show: true,
                        radius: 4,
                        fillColor: color,
                        lineWidth: 2
                    },
                    color: color,
                    shadowSize: 1
                }, {
                    data: data,
                    lines: {
                        show: true,
                        fill: false,
                        lineWidth: 3
                    },
                    color: color,
                    shadowSize: 0
                }],

                {

                    xaxis: {
                        tickLength: 0,
                        tickDecimals: 0,
                        mode: "categories",
                        min: 0,
                        font: {
                            lineHeight: 18,
                            style: "normal",
                            variant: "small-caps",
                            color: "#6F7B8A"
                        }
                    },
                    yaxis: {
                        ticks: 5,
                        tickDecimals: 0,
                        tickColor: "#eee",
                        font: {
                            lineHeight: 14,
                            style: "normal",
                            variant: "small-caps",
                            color: "#6F7B8A"
                        }
                    },
                    grid: {
                        hoverable: true,
                        clickable: true,
                        tickColor: "#eee",
                        borderColor: "#eee",
                        borderWidth: 1
                    }
                });

            $("#" + chartId).bind("plothover", function (event, pos, item) {
                $("#x").text(pos.x.toFixed(2));
                $("#y").text(pos.y.toFixed(2));
                if (item) {
                    if (previousPoint2 != item.dataIndex) {
                        previousPoint2 = item.dataIndex;
                        $("#tooltip").remove();
                        var x = item.datapoint[0].toFixed(2),
                            y = item.datapoint[1].toFixed(2);
                        showChartTooltip(item.pageX, item.pageY, item.datapoint[0], item.datapoint[1]);
                    }
                }
            });
            $('#' + chartId).bind("mouseleave", function () {
                $("#tooltip").remove();
            });
        }
    }

    var DopChart = function () {

        return {

            initCharts: function (Data) {

                $scope.satelliteData = {
                    compassSatellite: 29,
                    gpsSatellite: 23,
                    glsSatellite: 12
                };
                var visitors = [
                    ['02/2013', Data[0]],
                    ['03/2013', Data[9]],
                    ['04/2013', Data[6]],
                    ['05/2013', Data[5]],
                    ['06/2013', Data[4]],
                    ['07/2013', Data[3]],
                    ['08/2013', Data[2]],
                    ['09/2013', Data[7]],
                    ['10/2013', Data[1]]
                ];
                lineChart("site_activities", visitors, "#9ACAE6");
                lineChart("site_statistics", visitors, "#d85d84");
                lineChart("chartPositionPrecision", visitors, "#f4ee42");
                lineChart("absoluteError", visitors, "#68f442");
                lineChart("protectionLevel", visitors, "#68f442");
                lineChart("utcContinuity", visitors, "#8342f4");
                lineChart("chartPositionPrecision", visitors, "#f44292");



            }
        };

    }();

    DopChart.initCharts(data);

    var startData = [
        [180, 6],
        [195, 3],
        [210, 6],
        [225, 6],
        [240, 6],
        [255, 5],
        [270, 4],
        [285, 10],
        [300, 4],
        [315, 8]
    ];

    starMap(startData)

    $interval(showTime, 1000)

    $('#highchart_1').highcharts({
        chart : {
            style: {
                fontFamily: 'Open Sans'
            }
        },
        //title: {
        //    text: 'Monthly Average Temperature',
        //    x: -20 //center
        //},
        //subtitle: {
        //    text: 'Source: WorldClimate.com',
        //    x: -20
        //},
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            name: 'New York',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, {
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
    });

});


