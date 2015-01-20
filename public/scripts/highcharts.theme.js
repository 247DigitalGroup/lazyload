(function() {
  var defaultFont, defaultFontFamily;

  defaultFont = '13px "Avenir Next", Helvetica Neue, Helvetica, Arial, sans-serif';

  defaultFontFamily = '"Avenir Next", Helvetica Neue, Helvetica, Arial, sans-serif';

  Highcharts.theme = {
    credits: {
      enabled: false
    },
    colors: ['#1ABC9C', '#3498DB', '#9B59B6', '#2ECC71', '#34495E', '#F1C40F', '#E67E22', '#E74C3C', '#ECF0F1', '#95A5A6'],
    chart: {
      backgroundColor: 'transparent'
    },
    title: {
      style: {
        color: '#666',
        fontFamily: defaultFontFamily,
        fontSize: 11,
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: 1
      }
    },
    subtitle: {
      style: {
        color: 'black',
        font: defaultFont
      }
    },
    labels: {
      style: {
        fontFamily: defaultFontFamily
      }
    },
    tooltip: {
      backgroundColor: 'black',
      borderWidth: 0,
      borderRadius: 5,
      shadow: false,
      style: {
        color: 'white',
        font: defaultFont
      }
    },
    plotOptions: {
      series: {
        dataLabels: {
          style: {
            fontFamily: defaultFontFamily,
            fontSize: 13
          }
        },
        lineWidth: 1,
        marker: {
          radius: 0
        },
        states: {
          hover: {
            lineWidth: 1,
            marker: {
              radius: 2
            }
          }
        }
      }
    },
    xAxis: {
      gridLineColor: '#eee',
      gridLineWidth: 1,
      labels: {
        style: {
          fontFamily: defaultFontFamily
        }
      }
    },
    yAxis: {
      gridLineColor: '#eee',
      labels: {
        style: {
          fontFamily: defaultFontFamily
        }
      }
    },
    legend: {
      itemStyle: {
        fontFamily: defaultFontFamily,
        fontSize: 13,
        fontWeight: 400,
        color: 'black'
      },
      symbolRadius: 10,
      symbolHeight: 10,
      symbolWidth: 10,
      itemHoverStyle: {
        color: 'gray'
      }
    }
  };

  Highcharts.setOptions(Highcharts.theme);

}).call(this);
