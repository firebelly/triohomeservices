var Main = (function($) {

  var screen_width = 0,
      breakpoint_small = false,
      breakpoint_medium = false,
      breakpoint_large = false,
      $document,
      loadingTimer;

  function _init() {
    // touch-friendly fast clicks
    FastClick.attach(document.body);

    // Cache some common DOM queries
    $document = $(document);
    $('body').addClass('loaded');

    // Set screen size vars
    _resize();

    // Init Mobile Nav
    _initMobileNav();

    // Inject svgs with js for sanity sake
    _injectSvg()

    // Esc handlers
    $(document).keyup(function(e) {
      if (e.keyCode === 27) {
        _closeMobileNav();
      }
    });

    // Smoothscroll links
    $('a.smoothscroll').click(function(e) {
      e.preventDefault();
      var href = $(this).attr('href');
      _scrollBody($(href));
    });

    $('a.to-top').click(function(e){
      e.preventDefault();
      _scrollBody($('body'));
    });

    // Scroll down to hash afer page load
    $(window).load(function() {
      if (window.location.hash) {
        _scrollBody($(window.location.hash)); 
      }
    });

  } // end init()

  function _scrollBody(element, duration, delay) {
    if (breakpoint_medium) {
      mobileNavOffset = 0;
    } else {
      mobileNavOffset = $('.site-header').outerHeight();
    } 
    element.velocity("scroll", {
      duration: duration,
      delay: delay,
      offset: -mobileNavOffset
    }, "easeOutSine");
  }

  // Track ajax pages in Analytics
  function _trackPage() {
    if (typeof ga !== 'undefined') { ga('send', 'pageview', document.location.href); }
  }

  // Track events in Analytics
  function _trackEvent(category, action) {
    if (typeof ga !== 'undefined') { ga('send', 'event', category, action); }
  }

  function _initMobileNav() {
    // Clone desktop nav and give birth to mobile nav
    var $desktopNav = $('.site-nav');  // Proud Mama
    var $mobileNav = $desktopNav.clone().appendTo('.site-header');  // WAAAAAAAAA!!!  Congratulations, Mr. and Mrs. Desktop.  It's a nav.
    $mobileNav.addClass('-mobile').removeClass('-desktop'); // I don't wanna be like you!  I wanna be a MOBILE.
    // I have no son.

    // Add markup to mobile nav
    $mobileNav.prepend(
      '<a href="#" class="to-top"><img src="assets/images/logo.svg" alt="Trio Home Services logo" class="logo"></a>' +
      '<button class="close-mobile-nav nav-close-button"><img src="assets/images/x.svg" alt="Close mobile nav" class="icon-x"></button>'
    );

    // Wrapper for content that will fade in/out
    $mobileNav.wrapInner('<div class="fade"></div>');

    // Open and close buttons
    $(document).on('click','.open-mobile-nav', function() {
      _openMobileNav();
    });

    $(document).on('click','.close-mobile-nav', function() {
      _closeMobileNav();
    });

    // Click out should close nav
    $('body').on('click', function(e) {
      if ($('.site-nav.-mobile').is('.-open') && !$(e.target).closest('.site-nav.-mobile').length) {
        _closeMobileNav();
      }
    });

    // All links should close nav
    $('.site-nav.-mobile a').addClass('close-mobile-nav');
    
  }
  function _openMobileNav() {
    $('.site-nav.-mobile').addClass('-open');
  }
  function _closeMobileNav() {
    $('.site-nav.-mobile').removeClass('-open');
  }

  function _injectSvg() {
    var svgLogo = '<svg class="logo" viewBox="0 0 114.04 120"><title>Trio Home Services logo</title><path d="M27.9 55v7h4.62v6.07H27.9v12.85a3.28 3.28 0 0 0 .57 2.2 3.06 3.06 0 0 0 2.26.62 12.9 12.9 0 0 0 2.18-.15v6.25a16.11 16.11 0 0 1-4.93.75q-4.51 0-6.66-2.13T19.16 82V68.08h-3.58V62h3.58v-7zm25.02 14.92L50 69.71q-4.12 0-5.29 2.59v17.77H36V62h8.19l.28 3.6q2.21-4.12 6.15-4.12a8.54 8.54 0 0 1 2.44.31zm12.37 20.15h-8.76V62h8.77zM56 54.75a3.94 3.94 0 0 1 1.35-3.08 5.71 5.71 0 0 1 7 0 4.19 4.19 0 0 1 0 6.16 5.71 5.71 0 0 1-7 0A3.94 3.94 0 0 1 56 54.75m21.24 21.58q0 3.89 1.22 5.71a4.06 4.06 0 0 0 3.6 1.82q4.67 0 4.77-7.18v-.88q0-7.55-4.82-7.55-4.38 0-4.74 6.51zm-8.74-.54a16.55 16.55 0 0 1 1.63-7.48 11.68 11.68 0 0 1 4.69-5A14.13 14.13 0 0 1 82 61.49q6.3 0 9.93 3.9T95.58 76v.31q0 6.56-3.64 10.41t-9.87 3.85A13.08 13.08 0 0 1 72.45 87a14 14 0 0 1-3.92-9.74zM55.81 0L23.55 32.25l11.27 11.27 20.99-20.99L76.8 43.52l11.26-11.27L55.81 0zM7.65 107.24v5.1H2.59v-5.1H0v12.59h2.59v-5.4h5.06v5.4h2.59v-12.59H7.65zm6.27 8a3.5 3.5 0 0 0 .5 2 1.8 1.8 0 0 0 2.85 0 3.83 3.83 0 0 0 .51-2.23 3.46 3.46 0 0 0-.51-2 1.66 1.66 0 0 0-1.43-.72 1.63 1.63 0 0 0-1.42.71 3.91 3.91 0 0 0-.5 2.21m-2.5-.18a5.56 5.56 0 0 1 .54-2.48 3.91 3.91 0 0 1 1.54-1.68 4.5 4.5 0 0 1 2.34-.6 4.25 4.25 0 0 1 3.09 1.16 4.65 4.65 0 0 1 1.34 3.15v.64a4.88 4.88 0 0 1-1.2 3.45 4.18 4.18 0 0 1-3.22 1.3 4.19 4.19 0 0 1-3.23-1.3 5 5 0 0 1-1.21-3.53zm12.39-4.56l.08 1a3.29 3.29 0 0 1 2.69-1.22 2.5 2.5 0 0 1 2.48 1.43 3.21 3.21 0 0 1 2.81-1.43 2.79 2.79 0 0 1 2.26.89 4.07 4.07 0 0 1 .74 2.67v6h-2.5v-6a1.79 1.79 0 0 0-.31-1.17 1.38 1.38 0 0 0-1.1-.37 1.56 1.56 0 0 0-1.56 1.07v6.44h-2.5v-6a1.77 1.77 0 0 0-.32-1.18 1.39 1.39 0 0 0-1.09-.36 1.62 1.62 0 0 0-1.54.88v6.63h-2.5v-9.35zm16.47 1.85a1.56 1.56 0 0 0-1.2.5 2.6 2.6 0 0 0-.59 1.44H42v-.2a1.85 1.85 0 0 0-.45-1.29 1.61 1.61 0 0 0-1.23-.46m.29 7.68a4.59 4.59 0 0 1-3.35-1.26 4.49 4.49 0 0 1-1.29-3.36v-.24a5.65 5.65 0 0 1 .55-2.52A4 4 0 0 1 38 110.9a4.33 4.33 0 0 1 2.28-.6 3.88 3.88 0 0 1 3 1.21 4.92 4.92 0 0 1 1.1 3.43v1h-6a2.32 2.32 0 0 0 .73 1.47 2.22 2.22 0 0 0 1.54.55 2.7 2.7 0 0 0 2.26-1l1.23 1.37a3.73 3.73 0 0 1-1.52 1.24 5 5 0 0 1-2.13.45m17.11-3.49a1.33 1.33 0 0 0-.52-1.13 6.73 6.73 0 0 0-1.87-.83 13.3 13.3 0 0 1-2.13-.86 3.49 3.49 0 0 1-2.14-3.12 3 3 0 0 1 .57-1.82 3.76 3.76 0 0 1 1.65-1.25 6.23 6.23 0 0 1 2.42-.45 5.66 5.66 0 0 1 2.4.49 3.84 3.84 0 0 1 1.64 1.38 3.6 3.6 0 0 1 .59 2h-2.6a1.7 1.7 0 0 0-.55-1.35 2.24 2.24 0 0 0-1.53-.48 2.39 2.39 0 0 0-1.48.4 1.27 1.27 0 0 0-.53 1.06 1.21 1.21 0 0 0 .62 1 7 7 0 0 0 1.82.78 7.85 7.85 0 0 1 3.22 1.65 3.29 3.29 0 0 1 1 2.45 3 3 0 0 1-1.18 2.62 5.4 5.4 0 0 1-3.33.93 6.38 6.38 0 0 1-2.65-.53 4.16 4.16 0 0 1-1.84-1.47 3.74 3.74 0 0 1-.63-2.14h2.6q0 2.08 2.49 2.08a2.43 2.43 0 0 0 1.44-.37 1.23 1.23 0 0 0 .52-1.05m7.68-4.2a1.55 1.55 0 0 0-1.21.5 2.6 2.6 0 0 0-.59 1.44H67v-.2a1.86 1.86 0 0 0-.45-1.29 1.61 1.61 0 0 0-1.23-.46m.29 7.68a4.59 4.59 0 0 1-3.35-1.26 4.49 4.49 0 0 1-1.29-3.36v-.24a5.65 5.65 0 0 1 .55-2.52A4 4 0 0 1 63 110.9a4.33 4.33 0 0 1 2.28-.6 3.88 3.88 0 0 1 3 1.21 4.92 4.92 0 0 1 1.1 3.43v1h-6a2.32 2.32 0 0 0 .73 1.47 2.22 2.22 0 0 0 1.54.55 2.7 2.7 0 0 0 2.26-1l1.23 1.37a3.73 3.73 0 0 1-1.52 1.24 5 5 0 0 1-2.13.45m10.07-7.2a6.63 6.63 0 0 0-.9-.07 1.83 1.83 0 0 0-1.86 1v6.12h-2.5v-9.35h2.36l.07 1.12a2.31 2.31 0 0 1 2.08-1.29 2.64 2.64 0 0 1 .78.11z"/><path d="M81.47 110.47l-1.74 6.31-1.74-6.31h-2.61l3.16 9.36h2.38l3.16-9.36h-2.61zm5.81 9.36h-2.51v-9.35h2.51zm-2.65-11.77a1.23 1.23 0 0 1 .38-.92 1.62 1.62 0 0 1 2 0A1.32 1.32 0 0 1 87 109a1.6 1.6 0 0 1-2 0 1.23 1.23 0 0 1-.38-.93M92.7 118a1.64 1.64 0 0 0 1.12-.38 1.34 1.34 0 0 0 .45-1h2.34a3.2 3.2 0 0 1-.52 1.74 3.44 3.44 0 0 1-1.39 1.23 4.36 4.36 0 0 1-2 .44 4.06 4.06 0 0 1-3.16-1.28 5 5 0 0 1-1.16-3.52V115a5 5 0 0 1 1.15-3.45 4 4 0 0 1 3.15-1.29 3.93 3.93 0 0 1 2.82 1 3.53 3.53 0 0 1 1.11 2.74h-2.34a1.72 1.72 0 0 0-.45-1.19 1.67 1.67 0 0 0-2.46.18 3.69 3.69 0 0 0-.44 2.06v.26a3.74 3.74 0 0 0 .44 2.08 1.53 1.53 0 0 0 1.34.63m8.83-5.7a1.56 1.56 0 0 0-1.21.5 2.6 2.6 0 0 0-.59 1.44h3.47v-.2a1.85 1.85 0 0 0-.45-1.29 1.61 1.61 0 0 0-1.23-.46m.29 7.68a4.59 4.59 0 0 1-3.35-1.26 4.49 4.49 0 0 1-1.29-3.36v-.24a5.65 5.65 0 0 1 .55-2.52 4 4 0 0 1 1.54-1.71 4.33 4.33 0 0 1 2.28-.6 3.88 3.88 0 0 1 3 1.21 4.92 4.92 0 0 1 1.1 3.43v1h-6a2.32 2.32 0 0 0 .73 1.47 2.22 2.22 0 0 0 1.63.59 2.7 2.7 0 0 0 2.26-1l1.23 1.37a3.73 3.73 0 0 1-1.52 1.24 5 5 0 0 1-2.13.45m9.77-2.82a.8.8 0 0 0-.45-.72 5.18 5.18 0 0 0-1.46-.47q-3.34-.7-3.34-2.84a2.57 2.57 0 0 1 1-2.08 4.18 4.18 0 0 1 2.7-.83 4.49 4.49 0 0 1 2.85.84 2.64 2.64 0 0 1 1.07 2.18h-2.5a1.21 1.21 0 0 0-.35-.89 1.46 1.46 0 0 0-1.08-.35 1.49 1.49 0 0 0-1 .28.9.9 0 0 0-.35.73.77.77 0 0 0 .39.67 4 4 0 0 0 1.33.44 10.49 10.49 0 0 1 1.57.42 2.58 2.58 0 0 1 2 2.52 2.44 2.44 0 0 1-1.1 2.07 4.73 4.73 0 0 1-2.83.79 5 5 0 0 1-2.09-.42 3.52 3.52 0 0 1-1.43-1.15 2.67 2.67 0 0 1-.52-1.58h2.37a1.31 1.31 0 0 0 .49 1 2 2 0 0 0 1.23.35 1.83 1.83 0 0 0 1.09-.27.85.85 0 0 0 .37-.71"/></svg>';
    $('.replace-with-svg-logo').replaceWith(svgLogo);
  }

  // Called in quick succession as window is resized
  function _resize() {
    screenWidth = document.documentElement.clientWidth;

    // Check breakpoint indicator in DOM ( :after { content } is controlled by CSS media queries )
    var breakpointIndicatorString = window.getComputedStyle(
      document.querySelector('#breakpoint-indicator'), ':after'
    ).getPropertyValue('content')
    .replace(/['"]+/g, '');

    breakpoint_large = breakpointIndicatorString === 'large';
    breakpoint_medium = breakpointIndicatorString === 'medium' || breakpoint_large;
    breakpoint_small = breakpointIndicatorString === 'small' || breakpoint_medium;
  }

  // Public functions
  return {
    init: _init,
    resize: _resize,
    scrollBody: function(section, duration, delay) {
      _scrollBody(section, duration, delay);
    }
  };

})(jQuery);

// Fire up the mothership
jQuery(document).ready(Main.init);

// Zig-zag the mothership
jQuery(window).resize(Main.resize);
