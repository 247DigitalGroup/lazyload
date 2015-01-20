(function() {
  if (typeof WOW === 'function') {
    new WOW().init();
  }

  $(document).ready(function() {
    return $(document).foundation();
  });

}).call(this);
