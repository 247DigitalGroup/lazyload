(function() {
  var scrollTo;

  scrollTo = function(e) {
    return $('html, body').animate({
      scrollTop: $(e).offset().top - 15
    }, 400);
  };

  $(document).ready(function() {
    $('.next-step').click(function(e) {
      return $(e.currentTarget).addClass('in-progress').prop('disabled', true);
    });
    if (typeof $.prototype.fdatepicker === 'function') {
      $('input.date-picker').fdatepicker({
        format: 'dd-mm-yyyy',
        startDate: 'today'
      });
    }
    $('ul.wizard > li:nth-child(1) .next-step').click(function(e) {
      e.preventDefault();
      return setTimeout(function() {
        $('ul.wizard > li:nth-child(1)').attr('class', 'over');
        $('ul.wizard > li:nth-child(2)').attr('class', 'active');
        return scrollTo('ul.wizard > li:nth-child(2)');
      }, 2000);
    });
    return $('ul.wizard > li:nth-child(2) .next-step').click(function(e) {
      e.preventDefault();
      return setTimeout(function() {
        $('ul.wizard > li').attr('class', 'over');
        $('ul.wizard > li:nth-child(3)').attr('class', 'active');
        return scrollTo('ul.wizard > li:nth-child(3)');
      }, 2000);
    });
  });

}).call(this);
