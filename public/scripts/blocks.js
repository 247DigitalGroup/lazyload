(function() {
  $(document).ready(function() {
    return null;
  });

  $(window).scroll(function() {
    var oVal;
    oVal = $(document).scrollTop() / 200;
    return $('img.blur').css('opacity', oVal);
  });

}).call(this);
