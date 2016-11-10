angular.module('MetronicApp').controller('DashboardController', function ($interval, $rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
        App.initAjax();
    });

    function randNum() {
        return (Math.floor(Math.random() * (1 + 40 - 20)))+5;
    }

    function testData() {
        return [
            [1, randNum()],
            [2, randNum()],
            [3, randNum()],
            [4, randNum()],
            [5, randNum()],
            [6, randNum()],
            [7, randNum()],
            [8, randNum()],
            [9, randNum()],
            [10,  randNum()],
            [11,  randNum()],
            [12,  randNum()],
        ];
    }

    function chart(data, chartId, name) {
        if ($('#' + chartId).size() != 1) {
            return;
        }

        var plot = $.plot($("#" + chartId), [{
            data: data,
            label: name,
            lines: {
                lineWidth: 1,
            },
            shadowSize: 0

        }], {
            series: {
                lines: {
                    show: true,
                    lineWidth: 2,
                    fill: true,
                    fillColor: {
                        colors: [{
                            opacity: 0.3
                        }, {
                            opacity: 0.3
                        }]
                    }
                },
                points: {
                    show: true,
                    radius: 2,
                    lineWidth: 1
                },
                shadowSize: 2
            },
            grid: {
                hoverable: true,
                clickable: true,
                tickColor: "#eee",
                borderColor: "#eee",
                borderWidth: 1
            },
            colors: ["#37b7f3", "#37b7f3", "#52e136"],
            xaxis: {
                ticks: 11,
                tickDecimals: 0,
                tickColor: "#eee",
            },
            yaxis: {
                ticks: 11,
                tickDecimals: 0,
                tickColor: "#eee",
            }
        });

        var previousPoint = null;
        $("#" + chartId).bind("plothover", function (event, pos, item) {
            $("#x").text(pos.x.toFixed(2));
            $("#y").text(pos.y.toFixed(2));

            if (item) {
                if (previousPoint != item.dataIndex) {
                    previousPoint = item.dataIndex;

                    $("#tooltip").remove();
                    var x = item.datapoint[0].toFixed(2),
                        y = item.datapoint[1].toFixed(2);

                    showTooltip(item.pageX, item.pageY, item.series.label + " of " + x + " = " + y);
                }
            } else {
                $("#tooltip").remove();
                previousPoint = null;
            }
        });
    }


    function showTooltip(x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css({
            position: 'absolute',
            display: 'none',
            top: y + 5,
            left: x + 15,
            border: '1px solid #333',
            padding: '4px',
            color: '#fff',
            'border-radius': '3px',
            'background-color': '#333',
            opacity: 0.80
        }).appendTo("body").fadeIn(200);
    }


    function mockup_data() {
        return {
            compassSatellite: 29 + randNum(),
            gpsSatellite: 23 + randNum(),
            glsSatellite: 12 + randNum()
        }

    }

    function dataHook(data) {
        $scope.satelliteData = data;
        chart(testData(), "chartSatelliteNum", "卫星数量")
        chart(testData(), "chartPod", "pod")
        chart(testData(), "chartPositionPrecision", "精确度")
    }

    function showTime() {
        var date = new Date();
        var now = "";
        if (date.getHours() < 10) now = "0"
        now = now + date.getHours() + ":";
        if (date.getMinutes() < 10) now = now + "0"
        now = now + date.getMinutes();
        $scope.nowTime = now
    }

    setInterval(function () {
        dataHook(mockup_data());
    }, 1000)

    showTime()
    $interval(showTime, 60000)
    dataHook(mockup_data());
// set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
});
