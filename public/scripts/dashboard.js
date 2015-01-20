(function() {
  var contentY, firstColumn, fixedMenu, initCharts, menu, menuFixedInterval, menuHeight, scrollCheck, unfixedMenu, windowHeight, windowScrollTop;

  menuHeight = windowHeight = windowScrollTop = contentY = 0;

  menu = null;

  firstColumn = null;

  menuFixedInterval = null;

  fixedMenu = function() {
    if (!$(menu).hasClass('fixed')) {
      $(menu).addClass('fixed');
    }
    return $(menu).css('width', $(firstColumn).width() / 4);
  };

  unfixedMenu = function() {
    return $(menu).removeClass('fixed').css('width', '');
  };

  scrollCheck = function() {
    windowScrollTop = $(window).scrollTop();
    if (windowScrollTop >= contentY && $(window).width() > 642) {
      return fixedMenu();
    } else {
      return unfixedMenu();
    }
  };

  $(window).resize(function() {
    menuHeight = $(menu).height();
    windowHeight = $(window).height();
    contentY = $('section.content').offset().top;
    return $(window).scroll();
  }).scroll(function() {
    return scrollCheck();
  });

  initCharts = function() {
    var categories, data;
    if (typeof $.prototype.highcharts === 'function') {
      if ($('#viewer-area-chart').length > 0) {
        data = [];
        $('#viewer-area-chart').highcharts({
          chart: {
            type: 'areaspline'
          },
          title: false,
          xAxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            title: false,
            tickPixelInterval: 25
          },
          series: [
            {
              name: 'This week',
              data: [0, 450, 23, 99, 123, 59, 400]
            }, {
              name: 'Last week',
              data: [12, 55, 66, 120, 14, 100, 40]
            }
          ]
        });
      }
      if ($('#viewer-pie-chart').length > 0) {
        categories = ['Vietnam', 'American', 'Germany', 'France', 'Laos', 'Japan'];
        data = [
          {
            name: 'Vietnam',
            y: 24
          }, {
            name: 'US',
            y: 13
          }, {
            name: 'Germany',
            y: 19
          }, {
            name: 'France',
            y: 13
          }, {
            name: 'Laos',
            y: 8
          }, {
            name: 'Japan',
            y: 25
          }
        ];
        $('#viewer-pie-chart').highcharts({
          chart: {
            type: 'pie'
          },
          title: false,
          tooltip: {
            formatter: function() {
              return "" + this.point.name + "<br>" + this.y + "%";
            }
          },
          series: [
            {
              innerSize: '50%',
              name: 'Country',
              data: data,
              dataLabels: {
                distance: 10,
                formatter: function() {
                  return "" + this.point.name + "<br>" + this.y + "%";
                }
              }
            }
          ]
        });
      }
      if ($('#world-map').length > 0) {
        return $.getJSON('world-sample-data.json', function(data) {
          return $('#world-map').highcharts('Map', {
            title: {
              text: 'World Ads Viewer Density'
            },
            colorAxis: {
              minColor: Highcharts.Color('#393341').brighten(.4).get(),
              maxColor: '#393341',
              type: 'linear'
            },
            legend: {
              enabled: false
            },
            plotOptions: {
              series: {
                borderColor: 'white',
                states: {
                  hover: {
                    color: Highcharts.Color('#393341').brighten(.5).get()
                  }
                }
              }
            },
            series: [
              {
                name: 'Units',
                joinBy: 'hc-key',
                data: data,
                mapData: Highcharts.maps['custom/world'],
                dataLabels: {
                  enabled: false,
                  format: '{point.name}'
                }
              }
            ]
          });
        });
      }
    }
  };

  $(document).ready(function() {
    menu = $('div.content-menu');
    firstColumn = $('section.content').find('.column')[0];
    if (typeof $.prototype.inputmask === 'function') {
      $('input').inputmask();
    }
    initCharts();
    return $(window).resize().scroll();
  });

}).call(this);
