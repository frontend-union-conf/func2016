(function() {
  $(function() {
    var currentSlide, slide, welcomeSectionWidth;
    currentSlide = 0;
    welcomeSectionWidth = $('#welcomeSection').innerWidth();
    slide = function(button, currentSlide) {
      $('#topicsWrapper').css('transform', 'translateX(-' + welcomeSectionWidth * currentSlide + 'px)');
      $('#circlesWrapper div').removeClass('current');
      return $(button).addClass('current');
    };
    $(window).resize(function() {
      welcomeSectionWidth = $('#welcomeSection').innerWidth();
      return $('#topicsWrapper').css('transform', 'translateX(-' + welcomeSectionWidth * currentSlide + 'px)');
    });
    $('#slide1').on('click', function() {
      return slide(this, 0);
    });
    $('#slide2').on('click', function() {
      return slide(this, 1);
    });
    $('#slide3').on('click', function() {
      return slide(this, 2);
    });
    $('#slide4').on('click', function() {
      return slide(this, 3);
    });
    $('#slide5').on('click', function() {
      return slide(this, 4);
    });
    $('#slide6').on('click', function() {
      return slide(this, 5);
    });
    $('#slide7').on('click', function() {
      return slide(this, 6);
    });
    $('.scrollTo').each(function() {
      return $(this).on('click', function(e) {
        var scrollTo;
        e.preventDefault();
        scrollTo = $(this).attr('href');
        return $('html,body').animate({
          scrollTop: $(scrollTo).offset().top
        }, 1000);
      });
    });
    return slide($('#circlesWrapper div')[currentSlide], currentSlide);
  });

}).call(this);
