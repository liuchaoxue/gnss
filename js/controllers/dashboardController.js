angular.module('MetronicApp').controller('dashboardController', function ($interval, $rootScope, $scope, $http, $q) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });


    var socket = io.connect('http://192.168.1.30:3000');
    socket.on('new', function (data) {
        DopChart.initCharts(data);
    });


    $scope.$on('to-child', function (event, data) {
        DopChart.initCharts(data);
    });

    function showTime() {
        var date = new Date();
        var now = "";
        if (date.getHours() < 10) now = "0"
        now = now + date.getHours() + ":";
        if (date.getMinutes() < 10) now = now + "0"
        now = now + date.getMinutes();
        $scope.nowTime = now
    }

    $interval(showTime, 1000)


    var DopChart = function () {

        return {

            initCharts: function (Data) {

                $scope.satelliteData = {
                    compassSatellite: 29,
                    gpsSatellite: 23,
                    glsSatellite: 12
                };

                if (!jQuery.plot) {
                    return;
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

                var data = [];
                var totalPoints = 250;


                function getRandomData() {
                    if (data.length > 0) data = data.slice(1);
                    // do a random walk
                    while (data.length < totalPoints) {
                        var prev = data.length > 0 ? data[data.length - 1] : 50;
                        var y = prev + Math.random() * 10 - 5;
                        if (y < 0) y = 0;
                        if (y > 100) y = 100;
                        data.push(y);
                    }
                    // zip the generated y values with the x values
                    var res = [];
                    for (var i = 0; i < data.length; ++i) res.push([i, data[i]])
                    return res;
                }


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


                if ($('#site_statistics').size() != 0) {

                    $('#site_statistics_loading').hide();
                    $('#site_statistics_content').show();

                    var plot_statistics = $.plot($("#site_statistics"), [{
                            data: visitors,
                            lines: {
                                fill: 0.6,
                                lineWidth: 0
                            },
                            color: ['#f89f9f']
                        }, {
                            data: visitors,
                            points: {
                                show: true,
                                fill: true,
                                radius: 5,
                                fillColor: "#f89f9f",
                                lineWidth: 3
                            },
                            color: '#fff',
                            shadowSize: 0
                        }],

                        {
                            xaxis: {
                                tickLength: 0,
                                tickDecimals: 0,
                                mode: "categories",
                                min: 0,
                                font: {
                                    lineHeight: 14,
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

                    var previousPoint = null;
                    $("#site_statistics").bind("plothover", function (event, pos, item) {
                        $("#x").text(pos.x.toFixed(2));
                        $("#y").text(pos.y.toFixed(2));
                        if (item) {
                            if (previousPoint != item.dataIndex) {
                                previousPoint = item.dataIndex;

                                $("#tooltip").remove();
                                var x = item.datapoint[0].toFixed(2),
                                    y = item.datapoint[1].toFixed(2);

                                showChartTooltip(item.pageX, item.pageY, item.datapoint[0], item.datapoint[1] + ' visits');
                            }
                        } else {
                            $("#tooltip").remove();
                            previousPoint = null;
                        }
                    });
                }


                if ($('#site_activities').size() != 0) {
                    //site activities
                    var previousPoint2 = null;
                    $('#site_activities_loading').hide();
                    $('#site_activities_content').show();

                    var data1 = [
                        ['DEC', Data[0]],
                        ['JAN', Data[1]],
                        ['FEB', Data[2]],
                        ['MAR', Data[3]],
                        ['APR', Data[4]],
                        ['MAY', Data[5]],
                        ['JUN', Data[6]],
                        ['JUL', Data[7]],
                        ['AUG', Data[8]],
                        ['SEP', Data[9]]
                    ];


                    var plot_statistics = $.plot($("#site_activities"),

                        [{
                            data: data1,
                            lines: {
                                fill: 0.2,
                                lineWidth: 0,
                            },
                            color: ['#BAD9F5']
                        }, {
                            data: data1,
                            points: {
                                show: true,
                                fill: true,
                                radius: 4,
                                fillColor: "#9ACAE6",
                                lineWidth: 2
                            },
                            color: '#9ACAE6',
                            shadowSize: 1
                        }, {
                            data: data1,
                            lines: {
                                show: true,
                                fill: false,
                                lineWidth: 3
                            },
                            color: '#9ACAE6',
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

                    $("#site_activities").bind("plothover", function (event, pos, item) {
                        $("#x").text(pos.x.toFixed(2));
                        $("#y").text(pos.y.toFixed(2));
                        if (item) {
                            if (previousPoint2 != item.dataIndex) {
                                previousPoint2 = item.dataIndex;
                                $("#tooltip").remove();
                                var x = item.datapoint[0].toFixed(2),
                                    y = item.datapoint[1].toFixed(2);
                                showChartTooltip(item.pageX, item.pageY, item.datapoint[0], item.datapoint[1] + 'M$');
                            }
                        }
                    });

                    $('#site_activities').bind("mouseleave", function () {
                        $("#tooltip").remove();
                    });
                }
            }
        };

    }();


// set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});