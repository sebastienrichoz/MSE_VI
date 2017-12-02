const verticalLinePlugin = {
  getLinePosition: function (chart, pointIndex) {
      const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
      const data = meta.data;
      return data[pointIndex]._model.x;
  },
  renderVerticalLine: function (chartInstance, pointIndex) {
      const lineLeftOffset = this.getLinePosition(chartInstance, pointIndex);
      const scale = chartInstance.scales['y-axis-1'];
      const context = chartInstance.chart.ctx;

      // render vertical line
      context.beginPath();
      context.strokeStyle = '#000000';
      context.moveTo(lineLeftOffset, scale.top);
      context.lineTo(lineLeftOffset, scale.bottom);
      context.stroke();

      // write label
      context.fillStyle = "#000000";
      context.textAlign = 'left';
      var d = new Date($.now());
      var str = addZero(d.getHours()) + 'h' + addZero(d.getMinutes());
      context.fillText(str, lineLeftOffset, (scale.bottom - scale.top) / 2 + scale.top);
  },

  afterDatasetsDraw: function (chart, easing) {
      if (chart.config.lineAtIndex) {
          chart.config.lineAtIndex.forEach(pointIndex => this.renderVerticalLine(chart, pointIndex));
      }
  }
  };

  Chart.plugins.register(verticalLinePlugin);

/**
 * Read the temperatures + rainfall of every hour of the specified day
 * Return an object of two array: temperatures and rainfalls
 */
function getChartData(hourlyData) {
    var temperatureData = [];
    var rainfallData = [];
    var hoursData = [];
    var iconData = [];

    var hours = Object.keys(hourlyData).map(key => hourlyData[key])

    $.each(hours, function(i, val){
        hoursData.push(i+'h');
        temperatureData.push(val.TMP2m);
        rainfallData.push(val.APCPsfc);
        iconData.push(val.ICON);
    });

    return {
        'hours':hoursData,
        'temperatures':temperatureData,
        'rainfalls':rainfallData,
        'icons':iconData
    };
}

/**
 * Display detailed information of a specific day.
 * Data is presented in a graph showing temperature and rain
 * along each hour of the day
 */
function displayDetailForecast(htmlId, forecast) {

    // Clear chart if existing
    $("#" + htmlId + "_canvas").remove();

    console.log('click');

    // Get data
    var chartData = getChartData(forecast.hourly_data);
    var minT = Math.min.apply(Math,chartData.temperatures);
    var maxT = Math.max.apply(Math,chartData.temperatures);
    var deltaT = (maxT - minT ) / 2;

    // Display icons each 3 hours
    $('#'+htmlId+'_icons').empty();
    $.each(chartData.icons, function(i, val){
        if (i % 2 == 0)
            $('#'+htmlId+'_icons').append(
                '<img class="weather-icons" src="'+ val +'" />');
    });

    $("#" + htmlId).append('<canvas id="' + htmlId + '_canvas"><canvas>');
    var barChartData = {
            labels: chartData.hours,
            datasets: [
                {
                    type: 'bar',
                    label: "Précipitations",
                    data: chartData.rainfalls,
                    fill: false,
                    backgroundColor: '#1bb6e5',
                    hoverBackgroundColor: '#1b90e5',
                    yAxisID: 'y-axis-2'
                }, {
                    label: "Température",
                    type:'line',
                    data: chartData.temperatures,
                    fill: false,
                    borderColor: '#e51b1b',
                    pointBackgroundColor: '#e51b1b',
                    pointHoverBackgroundColor: '#e5391b',
                    yAxisID: 'y-axis-1'
                },
            ]
        };

    var config = {
        type: 'bar',
        data: barChartData,
        options: {
            responsive: true,
            tooltips: {
                position:'nearest',
                mode: 'index',
                intersect: true
            },
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    display: true,
                    gridLines: {
                        display: false
                    },
                    labels: {
                        show: true,
                    }
                }],
                yAxes: [{
                    type: "linear",
                    display: true,
                    position: "left",
                    id: "y-axis-1", // temperature
                    gridLines:{
                        display: true
                    },
                    ticks: {
                        suggestedMin: minT - deltaT,
                        suggestedMax: maxT + deltaT,
                        fontColor: "#e51b1b", // this here
                    },
                    labels: {
                        show:true,
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Température [ °C ]',
                        fontColor: '#e51b1b'
                    },
                }, {
                    type: "linear",
                    display: true,
                    position: "right",
                    id: "y-axis-2",
                    gridLines:{
                        display: false
                    },
                    ticks: {
                        beginAtZero: true,
                        suggestedMax: ((maxT + deltaT) - (minT - deltaT)) / 2,
                        fontColor: "#1b90e5", // this here
                    },
                    labels: {
                        show:true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Précipitations [ mm / h ]',
                        fontColor: '#1b90e5'
                    },
                }]
            }
        }
    };

    if (htmlId.indexOf("0") !== -1) {
        config.lineAtIndex = [(new Date($.now())).getHours()];
    }

    var ctx = document.getElementById(htmlId + "_canvas");
    ctx.height = 70;
    new Chart(ctx, config);
}

/**
 * Display global forecast in html view for the specified html id
 * Display icon, day of the week, temperature
 */
function displayGlobalForecast(htmlId, forecast) {

    // Update icon
    $("#" + htmlId + " a img").attr('src', forecast.icon);

    // Update day of week and temperature min and max
    $("#" + htmlId + " a p").html(forecast.day_long + "<br>" +
    forecast.tmin + "° / " + forecast.tmax + "°C");

    $('#' + htmlId).off();
    $('#' + htmlId).on('click', function (e) {
      e.preventDefault();
      displayDetailForecast(htmlId + "_detail", forecast);
    })
}

/**
 * Get weather forecast from the prevision-meteo.ch service API
 * And display the html content with it
 */
function loadWeatherForecasts(lat, lng) {

    if(PRODUCTION) {
        $.get(
            "https://www.prevision-meteo.ch/services/json/lat=" + lat + "lng=" + lng,
            function(json, status) {
                if (status == 'success') {

                    // Display global data for each forecast day
                    displayGlobalForecast("forecast_0", json.fcst_day_0);
                    displayDetailForecast("forecast_0_detail", json.fcst_day_0)
                    displayGlobalForecast("forecast_1", json.fcst_day_1);
                    displayGlobalForecast("forecast_2", json.fcst_day_2);
                    displayGlobalForecast("forecast_3", json.fcst_day_3);
                    displayGlobalForecast("forecast_4", json.fcst_day_4);

                } else {
                    $("#weather-failure").html(
                        '<div class="alert alert-danger">' +
                        '<strong>Erreur.</strong> ' + json +
                        '</div>');
                    $("#weather-failure").show();
                }

                $("#weather").show();
                $("#loading-weather").hide();
            }
        );
    } else {

        displayGlobalForecast("forecast_0", json.fcst_day_0);
        displayDetailForecast("forecast_0_detail", json.fcst_day_0)
        displayGlobalForecast("forecast_1", json.fcst_day_1);
        displayGlobalForecast("forecast_2", json.fcst_day_2);
        displayGlobalForecast("forecast_3", json.fcst_day_3);
        displayGlobalForecast("forecast_4", json.fcst_day_4);

        $("#weather").show();
        $("#loading-weather").hide();
    }
}
