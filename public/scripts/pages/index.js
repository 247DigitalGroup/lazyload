(function() {
  var headerHeight, heroHeight, topBarHeight, windowHeight, y;

  y = windowHeight = topBarHeight = headerHeight = heroHeight = 0;

  $(document).ready(function() {
    return null;
  });

  $(window).resize(function() {
    windowHeight = $(window).height();
    topBarHeight = $('div.top-bar').outerHeight();
    headerHeight = $('section.header').height();
    return heroHeight = $('div.hero').height();
  }).resize().scroll(function() {
    y = $(document).scrollTop();
    if (y >= topBarHeight) {
      return $('section.header').addClass('light');
    } else {
      return $('section.header').removeClass('light');
    }
  }).scroll();

}).call(this);
