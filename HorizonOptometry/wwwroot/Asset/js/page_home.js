(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
var page_home_loaded = 1;
global.page_home_loaded = page_home_loaded;

var flexsliderLoad = require('flexslider'),
    flexslider = require('../modules/slider');

page_home = {
	load: function () {
		this.flexslider();
		this.lensAnim();
		this.prodParallax();
		this.servIcons();
	},
	flexslider: function () {
		flexslider.homeMainSlider('#carousel', '#slider');
		slider = $('.homeProdSlider');
		slider.each(function () {
			flexslider.prodsList(slider);
		});
	},
	lensAnim: function () {
		var controller = new smInit.Controller();
		var tl = new tmInit();

		if ($(window).outerWidth(true) > 767) {
			var tween = tl.to("#small_lens", .8, { top: -230, rotationY: -40, rotationX: -50, ease: Linear.easeNone }, "-=2").to("#big_lens", 1, { top: 160, rotationY: 60, rotationX: -35, ease: Linear.easeNone }, "-=2");
		} else {
			var tween = tl.to("#small_lens", .8, { top: -15, rotationY: -20, rotationX: -40, ease: Linear.easeNone }, "-=2").to("#big_lens", 1, { top: -20, rotationY: 50, rotationX: -35, ease: Linear.easeNone }, "-=2");
		}

		var scene = new smInit.Scene({ triggerElement: "#home_main_trigger", duration: $(window).height() }).setTween(tween).addTo(controller);
	},
	prodParallax: function () {
		$('.homeProd').each(function () {
			if ($(window).outerWidth(true) > 767) {
				var prod = $(this),
				    controller = new smInit.Controller(),
				    tl = new tmInit(),
				    galleryBlock = $(this).find('.homeProd__gal'),
				    listBlock = $(this).find('.homeProd__listBlock'),
				    projectTrigger = prod.find('.homeProd__trigger').parent();
				var tween = tl.to(listBlock, 1.2, { top: 190, ease: Linear.easeNone }, "-=3");
				var scene = new smInit.Scene({ triggerElement: $(projectTrigger)[0], duration: $(window).height() }).setTween(tween).addTo(controller);
			}
		});
	},
	servIcons: function () {
		var controller = new smInit.Controller(),
		    tl = new tmInit(),
		    tween = tl.staggerTo('.homeServ__serv', .25, { y: 0, opacity: 1 }, .15);
		scene = new smInit.Scene({ triggerElement: $('#home_serv_trigger')[0] }).setTween(tween).addTo(controller);
	}
};

$(window).on('load', function () {
	page_home.load();
});

$(window).on('orientationchange', function (event) {
	page_home.load();
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../modules/slider":2,"flexslider":3}],2:[function(require,module,exports){
module.exports = {
	init: function () {},
	homeMainSlider: function (carousel, slider) {
		$(carousel).flexslider({
			animation: "slide",
			controlNav: false,
			directionNav: false,
			animationLoop: false,
			animationSpeed: 900,
			touch: false,
			after: function (carousel, slider) {
				siteGlobal.lazyLoad();;
			}
		});
		$(slider).flexslider({
			animation: "slide",
			directionNav: false,
			controlNav: true,
			animationLoop: true,
			pauseOnAction: true,
			pauseOnHover: false,
			animationSpeed: 800,
			slideshowSpeed: 5000,
			touch: true,
			sync: carousel,
			start: function (slider) {
				var slide_color = $('#carousel .flex-active-slide').data('color');
				$('#carousel .homeVisual__bg').css('background-color', slide_color);
			},
			before: function (slider) {
				$('.homeVisual__block').animate({
					opacity: 0
				}, 250);
				setTimeout(function () {
					$('.homeVisual__block').animate({
						opacity: 1
					}, 250);
				}, 500);
			},
			after: function (slider) {
				var slide_color = $('#carousel .flex-active-slide').data('color');
				$('#carousel .homeVisual__bg').css('background-color', slide_color);
				siteGlobal.lazyLoad();
			}
		});
	},
	prodsList: function (item) {
		if ($(item).length === 0) return false;
		$(item).flexslider({
			animation: 'slide',
			direction: 'horizontal',
			directionNav: false,
			controlNav: true,
			animationLoop: true,
			pauseOnAction: true,
			pauseOnHover: false,
			animationSpeed: 800,
			slideshowSpeed: 3500,
			touch: false,
			start: function (item) {
				var slide_color = $(item).find('.flex-active-slide').data('color');
				$(item).find('.homeProdSlider__bg').css('background-color', slide_color);
			},
			after: function (item) {
				var slide_color = $(item).find('.flex-active-slide').data('color');
				$(item).find('.homeProdSlider__bg').css('background-color', slide_color);
				siteGlobal.lazyLoad();
			}
		});
	},
	visualFull: function (item) {
		if ($(item).length === 0) return false;
		$(item).flexslider({
			animation: 'slide',
			direction: 'horizontal',
			directionNav: false,
			controlNav: true,
			animationLoop: true,
			pauseOnAction: true,
			pauseOnHover: false,
			animationSpeed: 450,
			slideshowSpeed: 5000,
			after: function (slider) {
				siteGlobal.lazyLoad();
			}
		});
	}
};

},{}],3:[function(require,module,exports){
(function (setImmediate){
/*
 * jQuery FlexSlider v2.7.2
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */
;
(function ($) {

  var focused = true;

  //FlexSlider: Object Instance
  $.flexslider = function(el, options) {
    var slider = $(el);

    // making variables public

    //if rtl value was not passed and html is in rtl..enable it by default.
    if(typeof options.rtl=='undefined' && $('html').attr('dir')=='rtl'){
      options.rtl=true;
    }
    slider.vars = $.extend({}, $.flexslider.defaults, options);

    var namespace = slider.vars.namespace,
        msGesture = window.navigator && window.navigator.msPointerEnabled && window.MSGesture,
        touch = (( "ontouchstart" in window ) || msGesture || window.DocumentTouch && document instanceof DocumentTouch) && slider.vars.touch,
        // deprecating this idea, as devices are being released with both of these events
        eventType = "click touchend MSPointerUp keyup",
        watchedEvent = "",
        watchedEventClearTimer,
        vertical = slider.vars.direction === "vertical",
        reverse = slider.vars.reverse,
        carousel = (slider.vars.itemWidth > 0),
        fade = slider.vars.animation === "fade",
        asNav = slider.vars.asNavFor !== "",
        methods = {};

    // Store a reference to the slider object
    $.data(el, "flexslider", slider);

    // Private slider methods
    methods = {
      init: function() {
        slider.animating = false;
        // Get current slide and make sure it is a number
        slider.currentSlide = parseInt( ( slider.vars.startAt ? slider.vars.startAt : 0), 10 );
        if ( isNaN( slider.currentSlide ) ) { slider.currentSlide = 0; }
        slider.animatingTo = slider.currentSlide;
        slider.atEnd = (slider.currentSlide === 0 || slider.currentSlide === slider.last);
        slider.containerSelector = slider.vars.selector.substr(0,slider.vars.selector.search(' '));
        slider.slides = $(slider.vars.selector, slider);
        slider.container = $(slider.containerSelector, slider);
        slider.count = slider.slides.length;
        // SYNC:
        slider.syncExists = $(slider.vars.sync).length > 0;
        // SLIDE:
        if (slider.vars.animation === "slide") { slider.vars.animation = "swing"; }
        slider.prop = (vertical) ? "top" : ( slider.vars.rtl ? "marginRight" : "marginLeft" );
        slider.args = {};
        // SLIDESHOW:
        slider.manualPause = false;
        slider.stopped = false;
        //PAUSE WHEN INVISIBLE
        slider.started = false;
        slider.startTimeout = null;
        // TOUCH/USECSS:
        slider.transitions = !slider.vars.video && !fade && slider.vars.useCSS && (function() {
          var obj = document.createElement('div'),
              props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective', 'OPerspective', 'msPerspective'];
          for (var i in props) {
            if ( obj.style[ props[i] ] !== undefined ) {
              slider.pfx = props[i].replace('Perspective','').toLowerCase();
              slider.prop = "-" + slider.pfx + "-transform";
              return true;
            }
          }
          return false;
        }());
        slider.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        slider.ensureAnimationEnd = '';
        // CONTROLSCONTAINER:
        if (slider.vars.controlsContainer !== "") slider.controlsContainer = $(slider.vars.controlsContainer).length > 0 && $(slider.vars.controlsContainer);
        // MANUAL:
        if (slider.vars.manualControls !== "") slider.manualControls = $(slider.vars.manualControls).length > 0 && $(slider.vars.manualControls);

        // CUSTOM DIRECTION NAV:
        if (slider.vars.customDirectionNav !== "") slider.customDirectionNav = $(slider.vars.customDirectionNav).length === 2 && $(slider.vars.customDirectionNav);

        // RANDOMIZE:
        if (slider.vars.randomize) {
          slider.slides.sort(function() { return (Math.round(Math.random())-0.5); });
          slider.container.empty().append(slider.slides);
        }

        slider.doMath();

        // INIT
        slider.setup("init");

        // CONTROLNAV:
        if (slider.vars.controlNav) { methods.controlNav.setup(); }

        // DIRECTIONNAV:
        if (slider.vars.directionNav) { methods.directionNav.setup(); }

        // KEYBOARD:
        if (slider.vars.keyboard && ($(slider.containerSelector).length === 1 || slider.vars.multipleKeyboard)) {
          $(document).bind('keyup', function(event) {
            var keycode = event.keyCode;
            if (!slider.animating && (keycode === 39 || keycode === 37)) {
              var target = (slider.vars.rtl?
                                ((keycode === 37) ? slider.getTarget('next') :
                                (keycode === 39) ? slider.getTarget('prev') : false)
                                :
                                ((keycode === 39) ? slider.getTarget('next') :
                                (keycode === 37) ? slider.getTarget('prev') : false)
                                )
                                ;
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            }
          });
        }
        // MOUSEWHEEL:
        if (slider.vars.mousewheel) {
          slider.bind('mousewheel', function(event, delta, deltaX, deltaY) {
            event.preventDefault();
            var target = (delta < 0) ? slider.getTarget('next') : slider.getTarget('prev');
            slider.flexAnimate(target, slider.vars.pauseOnAction);
          });
        }

        // PAUSEPLAY
        if (slider.vars.pausePlay) { methods.pausePlay.setup(); }

        //PAUSE WHEN INVISIBLE
        if (slider.vars.slideshow && slider.vars.pauseInvisible) { methods.pauseInvisible.init(); }

        // SLIDSESHOW
        if (slider.vars.slideshow) {
          if (slider.vars.pauseOnHover) {
            slider.hover(function() {
              if (!slider.manualPlay && !slider.manualPause) { slider.pause(); }
            }, function() {
              if (!slider.manualPause && !slider.manualPlay && !slider.stopped) { slider.play(); }
            });
          }
          // initialize animation
          //If we're visible, or we don't use PageVisibility API
          if(!slider.vars.pauseInvisible || !methods.pauseInvisible.isHidden()) {
            (slider.vars.initDelay > 0) ? slider.startTimeout = setTimeout(slider.play, slider.vars.initDelay) : slider.play();
          }
        }

        // ASNAV:
        if (asNav) { methods.asNav.setup(); }

        // TOUCH
        if (touch && slider.vars.touch) { methods.touch(); }

        // FADE&&SMOOTHHEIGHT || SLIDE:
        if (!fade || (fade && slider.vars.smoothHeight)) { $(window).bind("resize orientationchange focus", methods.resize); }

        slider.find("img").attr("draggable", "false");

        // API: start() Callback
        setTimeout(function(){
          slider.vars.start(slider);
        }, 200);
      },
      asNav: {
        setup: function() {
          slider.asNav = true;
          slider.animatingTo = Math.floor(slider.currentSlide/slider.move);
          slider.currentItem = slider.currentSlide;
          slider.slides.removeClass(namespace + "active-slide").eq(slider.currentItem).addClass(namespace + "active-slide");
          if(!msGesture){
              slider.slides.on(eventType, function(e){
                e.preventDefault();
                var $slide = $(this),
                    target = $slide.index();
                var posFromX;
                if(slider.vars.rtl){
                  posFromX = -1*($slide.offset().right - $(slider).scrollLeft()); // Find position of slide relative to right of slider container
                }
                else
                {
                  posFromX = $slide.offset().left - $(slider).scrollLeft(); // Find position of slide relative to left of slider container
                }
                if( posFromX <= 0 && $slide.hasClass( namespace + 'active-slide' ) ) {
                  slider.flexAnimate(slider.getTarget("prev"), true);
                } else if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass(namespace + "active-slide")) {
                  slider.direction = (slider.currentItem < target) ? "next" : "prev";
                  slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                }
              });
          }else{
              el._slider = slider;
              slider.slides.each(function (){
                  var that = this;
                  that._gesture = new MSGesture();
                  that._gesture.target = that;
                  that.addEventListener("MSPointerDown", function (e){
                      e.preventDefault();
                      if(e.currentTarget._gesture) {
                        e.currentTarget._gesture.addPointer(e.pointerId);
                      }
                  }, false);
                  that.addEventListener("MSGestureTap", function (e){
                      e.preventDefault();
                      var $slide = $(this),
                          target = $slide.index();
                      if (!$(slider.vars.asNavFor).data('flexslider').animating && !$slide.hasClass('active')) {
                          slider.direction = (slider.currentItem < target) ? "next" : "prev";
                          slider.flexAnimate(target, slider.vars.pauseOnAction, false, true, true);
                      }
                  });
              });
          }
        }
      },
      controlNav: {
        setup: function() {
          if (!slider.manualControls) {
            methods.controlNav.setupPaging();
          } else { // MANUALCONTROLS:
            methods.controlNav.setupManual();
          }
        },
        setupPaging: function() {
          var type = (slider.vars.controlNav === "thumbnails") ? 'control-thumbs' : 'control-paging',
              j = 1,
              item,
              slide;

          slider.controlNavScaffold = $('<ol class="'+ namespace + 'control-nav ' + namespace + type + '"></ol>');

          if (slider.pagingCount > 1) {
            for (var i = 0; i < slider.pagingCount; i++) {
              slide = slider.slides.eq(i);

              if ( undefined === slide.attr( 'data-thumb-alt' ) ) { 
                slide.attr( 'data-thumb-alt', '' ); 
              }
              
              item = $( '<a></a>' ).attr( 'href', '#' ).text( j );
              if ( slider.vars.controlNav === "thumbnails" ) {
                item = $( '<img/>' ).attr( 'src', slide.attr( 'data-thumb' ) );
              }
              
              if ( '' !== slide.attr( 'data-thumb-alt' ) ) {
                item.attr( 'alt', slide.attr( 'data-thumb-alt' ) );
              }

              if ( 'thumbnails' === slider.vars.controlNav && true === slider.vars.thumbCaptions ) {
                var captn = slide.attr( 'data-thumbcaption' );
                if ( '' !== captn && undefined !== captn ) { 
                  var caption = $('<span></span>' ).addClass( namespace + 'caption' ).text( captn );
                  item.append( caption );
                }
              }
              
              var liElement = $( '<li>' );
              item.appendTo( liElement );
              liElement.append( '</li>' );

              slider.controlNavScaffold.append(liElement);
              j++;

            }
          }

          // CONTROLSCONTAINER:
          (slider.controlsContainer) ? $(slider.controlsContainer).append(slider.controlNavScaffold) : slider.append(slider.controlNavScaffold);
          methods.controlNav.set();

          methods.controlNav.active();

          slider.controlNavScaffold.delegate('a, img', eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              var $this = $(this),
                  target = slider.controlNav.index($this);

              if (!$this.hasClass(namespace + 'active')) {
                slider.direction = (target > slider.currentSlide) ? "next" : "prev";
                slider.flexAnimate(target, slider.vars.pauseOnAction);
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();

          });
        },
        setupManual: function() {
          slider.controlNav = slider.manualControls;
          methods.controlNav.active();

          slider.controlNav.bind(eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              var $this = $(this),
                  target = slider.controlNav.index($this);

              if (!$this.hasClass(namespace + 'active')) {
                (target > slider.currentSlide) ? slider.direction = "next" : slider.direction = "prev";
                slider.flexAnimate(target, slider.vars.pauseOnAction);
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        set: function() {
          var selector = (slider.vars.controlNav === "thumbnails") ? 'img' : 'a';
          slider.controlNav = $('.' + namespace + 'control-nav li ' + selector, (slider.controlsContainer) ? slider.controlsContainer : slider);
        },
        active: function() {
          slider.controlNav.removeClass(namespace + "active").eq(slider.animatingTo).addClass(namespace + "active");
        },
        update: function(action, pos) {
          if (slider.pagingCount > 1 && action === "add") {
            slider.controlNavScaffold.append($('<li><a href="#">' + slider.count + '</a></li>'));
          } else if (slider.pagingCount === 1) {
            slider.controlNavScaffold.find('li').remove();
          } else {
            slider.controlNav.eq(pos).closest('li').remove();
          }
          methods.controlNav.set();
          (slider.pagingCount > 1 && slider.pagingCount !== slider.controlNav.length) ? slider.update(pos, action) : methods.controlNav.active();
        }
      },
      directionNav: {
        setup: function() {
          var directionNavScaffold = $('<ul class="' + namespace + 'direction-nav"><li class="' + namespace + 'nav-prev"><a class="' + namespace + 'prev" href="#">' + slider.vars.prevText + '</a></li><li class="' + namespace + 'nav-next"><a class="' + namespace + 'next" href="#">' + slider.vars.nextText + '</a></li></ul>');

          // CUSTOM DIRECTION NAV:
          if (slider.customDirectionNav) {
            slider.directionNav = slider.customDirectionNav;
          // CONTROLSCONTAINER:
          } else if (slider.controlsContainer) {
            $(slider.controlsContainer).append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider.controlsContainer);
          } else {
            slider.append(directionNavScaffold);
            slider.directionNav = $('.' + namespace + 'direction-nav li a', slider);
          }

          methods.directionNav.update();

          slider.directionNav.bind(eventType, function(event) {
            event.preventDefault();
            var target;

            if (watchedEvent === "" || watchedEvent === event.type) {
              target = ($(this).hasClass(namespace + 'next')) ? slider.getTarget('next') : slider.getTarget('prev');
              slider.flexAnimate(target, slider.vars.pauseOnAction);
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        update: function() {
          var disabledClass = namespace + 'disabled';
          if (slider.pagingCount === 1) {
            slider.directionNav.addClass(disabledClass).attr('tabindex', '-1');
          } else if (!slider.vars.animationLoop) {
            if (slider.animatingTo === 0) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "prev").addClass(disabledClass).attr('tabindex', '-1');
            } else if (slider.animatingTo === slider.last) {
              slider.directionNav.removeClass(disabledClass).filter('.' + namespace + "next").addClass(disabledClass).attr('tabindex', '-1');
            } else {
              slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
            }
          } else {
            slider.directionNav.removeClass(disabledClass).removeAttr('tabindex');
          }
        }
      },
      pausePlay: {
        setup: function() {
          var pausePlayScaffold = $('<div class="' + namespace + 'pauseplay"><a href="#"></a></div>');

          // CONTROLSCONTAINER:
          if (slider.controlsContainer) {
            slider.controlsContainer.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider.controlsContainer);
          } else {
            slider.append(pausePlayScaffold);
            slider.pausePlay = $('.' + namespace + 'pauseplay a', slider);
          }

          methods.pausePlay.update((slider.vars.slideshow) ? namespace + 'pause' : namespace + 'play');

          slider.pausePlay.bind(eventType, function(event) {
            event.preventDefault();

            if (watchedEvent === "" || watchedEvent === event.type) {
              if ($(this).hasClass(namespace + 'pause')) {
                slider.manualPause = true;
                slider.manualPlay = false;
                slider.pause();
              } else {
                slider.manualPause = false;
                slider.manualPlay = true;
                slider.play();
              }
            }

            // setup flags to prevent event duplication
            if (watchedEvent === "") {
              watchedEvent = event.type;
            }
            methods.setToClearWatchedEvent();
          });
        },
        update: function(state) {
          (state === "play") ? slider.pausePlay.removeClass(namespace + 'pause').addClass(namespace + 'play').html(slider.vars.playText) : slider.pausePlay.removeClass(namespace + 'play').addClass(namespace + 'pause').html(slider.vars.pauseText);
        }
      },
      touch: function() {
        var startX,
          startY,
          offset,
          cwidth,
          dx,
          startT,
          onTouchStart,
          onTouchMove,
          onTouchEnd,
          scrolling = false,
          localX = 0,
          localY = 0,
          accDx = 0;

        if(!msGesture){
            onTouchStart = function(e) {
              if (slider.animating) {
                e.preventDefault();
              } else if ( ( window.navigator.msPointerEnabled ) || e.touches.length === 1 ) {
                slider.pause();
                // CAROUSEL:
                cwidth = (vertical) ? slider.h : slider. w;
                startT = Number(new Date());
                // CAROUSEL:

                // Local vars for X and Y points.
                localX = e.touches[0].pageX;
                localY = e.touches[0].pageY;

                offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                         (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                         (carousel && slider.currentSlide === slider.last) ? slider.limit :
                         (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
                         (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                startX = (vertical) ? localY : localX;
                startY = (vertical) ? localX : localY;
                el.addEventListener('touchmove', onTouchMove, false);
                el.addEventListener('touchend', onTouchEnd, false);
              }
            };

            onTouchMove = function(e) {
              // Local vars for X and Y points.

              localX = e.touches[0].pageX;
              localY = e.touches[0].pageY;

              dx = (vertical) ? startX - localY : (slider.vars.rtl?-1:1)*(startX - localX);
              scrolling = (vertical) ? (Math.abs(dx) < Math.abs(localX - startY)) : (Math.abs(dx) < Math.abs(localY - startY));
              var fxms = 500;

              if ( ! scrolling || Number( new Date() ) - startT > fxms ) {
                e.preventDefault();
                if (!fade && slider.transitions) {
                  if (!slider.vars.animationLoop) {
                    dx = dx/((slider.currentSlide === 0 && dx < 0 || slider.currentSlide === slider.last && dx > 0) ? (Math.abs(dx)/cwidth+2) : 1);
                  }
                  slider.setProps(offset + dx, "setTouch");
                }
              }
            };

            onTouchEnd = function(e) {
              // finish the touch by undoing the touch session
              el.removeEventListener('touchmove', onTouchMove, false);

              if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                var updateDx = (reverse) ? -dx : dx,
                    target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

                if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
                  slider.flexAnimate(target, slider.vars.pauseOnAction);
                } else {
                  if (!fade) { slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true); }
                }
              }
              el.removeEventListener('touchend', onTouchEnd, false);

              startX = null;
              startY = null;
              dx = null;
              offset = null;
            };

            el.addEventListener('touchstart', onTouchStart, false);
        }else{
            el.style.msTouchAction = "none";
            el._gesture = new MSGesture();
            el._gesture.target = el;
            el.addEventListener("MSPointerDown", onMSPointerDown, false);
            el._slider = slider;
            el.addEventListener("MSGestureChange", onMSGestureChange, false);
            el.addEventListener("MSGestureEnd", onMSGestureEnd, false);

            function onMSPointerDown(e){
                e.stopPropagation();
                if (slider.animating) {
                    e.preventDefault();
                }else{
                    slider.pause();
                    el._gesture.addPointer(e.pointerId);
                    accDx = 0;
                    cwidth = (vertical) ? slider.h : slider. w;
                    startT = Number(new Date());
                    // CAROUSEL:

                    offset = (carousel && reverse && slider.animatingTo === slider.last) ? 0 :
                        (carousel && reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                            (carousel && slider.currentSlide === slider.last) ? slider.limit :
                                (carousel) ? ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.currentSlide :
                                    (reverse) ? (slider.last - slider.currentSlide + slider.cloneOffset) * cwidth : (slider.currentSlide + slider.cloneOffset) * cwidth;
                }
            }

            function onMSGestureChange(e) {
                e.stopPropagation();
                var slider = e.target._slider;
                if(!slider){
                    return;
                }
                var transX = -e.translationX,
                    transY = -e.translationY;

                //Accumulate translations.
                accDx = accDx + ((vertical) ? transY : transX);
                dx = (slider.vars.rtl?-1:1)*accDx;
                scrolling = (vertical) ? (Math.abs(accDx) < Math.abs(-transX)) : (Math.abs(accDx) < Math.abs(-transY));

                if(e.detail === e.MSGESTURE_FLAG_INERTIA){
                    setImmediate(function (){
                        el._gesture.stop();
                    });

                    return;
                }

                if (!scrolling || Number(new Date()) - startT > 500) {
                    e.preventDefault();
                    if (!fade && slider.transitions) {
                        if (!slider.vars.animationLoop) {
                            dx = accDx / ((slider.currentSlide === 0 && accDx < 0 || slider.currentSlide === slider.last && accDx > 0) ? (Math.abs(accDx) / cwidth + 2) : 1);
                        }
                        slider.setProps(offset + dx, "setTouch");
                    }
                }
            }

            function onMSGestureEnd(e) {
                e.stopPropagation();
                var slider = e.target._slider;
                if(!slider){
                    return;
                }
                if (slider.animatingTo === slider.currentSlide && !scrolling && !(dx === null)) {
                    var updateDx = (reverse) ? -dx : dx,
                        target = (updateDx > 0) ? slider.getTarget('next') : slider.getTarget('prev');

                    if (slider.canAdvance(target) && (Number(new Date()) - startT < 550 && Math.abs(updateDx) > 50 || Math.abs(updateDx) > cwidth/2)) {
                        slider.flexAnimate(target, slider.vars.pauseOnAction);
                    } else {
                        if (!fade) { slider.flexAnimate(slider.currentSlide, slider.vars.pauseOnAction, true); }
                    }
                }

                startX = null;
                startY = null;
                dx = null;
                offset = null;
                accDx = 0;
            }
        }
      },
      resize: function() {
        if (!slider.animating && slider.is(':visible')) {
          if (!carousel) { slider.doMath(); }

          if (fade) {
            // SMOOTH HEIGHT:
            methods.smoothHeight();
          } else if (carousel) { //CAROUSEL:
            slider.slides.width(slider.computedW);
            slider.update(slider.pagingCount);
            slider.setProps();
          }
          else if (vertical) { //VERTICAL:
            slider.viewport.height(slider.h);
            slider.setProps(slider.h, "setTotal");
          } else {
            // SMOOTH HEIGHT:
            if (slider.vars.smoothHeight) { methods.smoothHeight(); }
            slider.newSlides.width(slider.computedW);
            slider.setProps(slider.computedW, "setTotal");
          }
        }
      },
      smoothHeight: function(dur) {
        if (!vertical || fade) {
          var $obj = (fade) ? slider : slider.viewport;
          (dur) ? $obj.animate({"height": slider.slides.eq(slider.animatingTo).innerHeight()}, dur) : $obj.innerHeight(slider.slides.eq(slider.animatingTo).innerHeight());
        }
      },
      sync: function(action) {
        var $obj = $(slider.vars.sync).data("flexslider"),
            target = slider.animatingTo;

        switch (action) {
          case "animate": $obj.flexAnimate(target, slider.vars.pauseOnAction, false, true); break;
          case "play": if (!$obj.playing && !$obj.asNav) { $obj.play(); } break;
          case "pause": $obj.pause(); break;
        }
      },
      uniqueID: function($clone) {
        // Append _clone to current level and children elements with id attributes
        $clone.filter( '[id]' ).add($clone.find( '[id]' )).each(function() {
          var $this = $(this);
          $this.attr( 'id', $this.attr( 'id' ) + '_clone' );
        });
        return $clone;
      },
      pauseInvisible: {
        visProp: null,
        init: function() {
          var visProp = methods.pauseInvisible.getHiddenProp();
          if (visProp) {
            var evtname = visProp.replace(/[H|h]idden/,'') + 'visibilitychange';
            document.addEventListener(evtname, function() {
              if (methods.pauseInvisible.isHidden()) {
                if(slider.startTimeout) {
                  clearTimeout(slider.startTimeout); //If clock is ticking, stop timer and prevent from starting while invisible
                } else {
                  slider.pause(); //Or just pause
                }
              }
              else {
                if(slider.started) {
                  slider.play(); //Initiated before, just play
                } else {
                  if (slider.vars.initDelay > 0) {
                    setTimeout(slider.play, slider.vars.initDelay);
                  } else {
                    slider.play(); //Didn't init before: simply init or wait for it
                  }
                }
              }
            });
          }
        },
        isHidden: function() {
          var prop = methods.pauseInvisible.getHiddenProp();
          if (!prop) {
            return false;
          }
          return document[prop];
        },
        getHiddenProp: function() {
          var prefixes = ['webkit','moz','ms','o'];
          // if 'hidden' is natively supported just return it
          if ('hidden' in document) {
            return 'hidden';
          }
          // otherwise loop over all the known prefixes until we find one
          for ( var i = 0; i < prefixes.length; i++ ) {
              if ((prefixes[i] + 'Hidden') in document) {
                return prefixes[i] + 'Hidden';
              }
          }
          // otherwise it's not supported
          return null;
        }
      },
      setToClearWatchedEvent: function() {
        clearTimeout(watchedEventClearTimer);
        watchedEventClearTimer = setTimeout(function() {
          watchedEvent = "";
        }, 3000);
      }
    };

    // public methods
    slider.flexAnimate = function(target, pause, override, withSync, fromNav) {
      if (!slider.vars.animationLoop && target !== slider.currentSlide) {
        slider.direction = (target > slider.currentSlide) ? "next" : "prev";
      }

      if (asNav && slider.pagingCount === 1) slider.direction = (slider.currentItem < target) ? "next" : "prev";

      if (!slider.animating && (slider.canAdvance(target, fromNav) || override) && slider.is(":visible")) {
        if (asNav && withSync) {
          var master = $(slider.vars.asNavFor).data('flexslider');
          slider.atEnd = target === 0 || target === slider.count - 1;
          master.flexAnimate(target, true, false, true, fromNav);
          slider.direction = (slider.currentItem < target) ? "next" : "prev";
          master.direction = slider.direction;

          if (Math.ceil((target + 1)/slider.visible) - 1 !== slider.currentSlide && target !== 0) {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            target = Math.floor(target/slider.visible);
          } else {
            slider.currentItem = target;
            slider.slides.removeClass(namespace + "active-slide").eq(target).addClass(namespace + "active-slide");
            return false;
          }
        }

        slider.animating = true;
        slider.animatingTo = target;

        // SLIDESHOW:
        if (pause) { slider.pause(); }

        // API: before() animation Callback
        slider.vars.before(slider);

        // SYNC:
        if (slider.syncExists && !fromNav) { methods.sync("animate"); }

        // CONTROLNAV
        if (slider.vars.controlNav) { methods.controlNav.active(); }

        // !CAROUSEL:
        // CANDIDATE: slide active class (for add/remove slide)
        if (!carousel) { slider.slides.removeClass(namespace + 'active-slide').eq(target).addClass(namespace + 'active-slide'); }

        // INFINITE LOOP:
        // CANDIDATE: atEnd
        slider.atEnd = target === 0 || target === slider.last;

        // DIRECTIONNAV:
        if (slider.vars.directionNav) { methods.directionNav.update(); }

        if (target === slider.last) {
          // API: end() of cycle Callback
          slider.vars.end(slider);
          // SLIDESHOW && !INFINITE LOOP:
          if (!slider.vars.animationLoop) { slider.pause(); }
        }

        // SLIDE:
        if (!fade) {
          var dimension = (vertical) ? slider.slides.filter(':first').height() : slider.computedW,
              margin, slideString, calcNext;

          // INFINITE LOOP / REVERSE:
          if (carousel) {
            margin = slider.vars.itemMargin;
            calcNext = ((slider.itemW + margin) * slider.move) * slider.animatingTo;
            slideString = (calcNext > slider.limit && slider.visible !== 1) ? slider.limit : calcNext;
          } else if (slider.currentSlide === 0 && target === slider.count - 1 && slider.vars.animationLoop && slider.direction !== "next") {
            slideString = (reverse) ? (slider.count + slider.cloneOffset) * dimension : 0;
          } else if (slider.currentSlide === slider.last && target === 0 && slider.vars.animationLoop && slider.direction !== "prev") {
            slideString = (reverse) ? 0 : (slider.count + 1) * dimension;
          } else {
            slideString = (reverse) ? ((slider.count - 1) - target + slider.cloneOffset) * dimension : (target + slider.cloneOffset) * dimension;
          }
          slider.setProps(slideString, "", slider.vars.animationSpeed);
          if (slider.transitions) {
            if (!slider.vars.animationLoop || !slider.atEnd) {
              slider.animating = false;
              slider.currentSlide = slider.animatingTo;
            }

            // Unbind previous transitionEnd events and re-bind new transitionEnd event
            slider.container.unbind("webkitTransitionEnd transitionend");
            slider.container.bind("webkitTransitionEnd transitionend", function() {
              clearTimeout(slider.ensureAnimationEnd);
              slider.wrapup(dimension);
            });

            // Insurance for the ever-so-fickle transitionEnd event
            clearTimeout(slider.ensureAnimationEnd);
            slider.ensureAnimationEnd = setTimeout(function() {
              slider.wrapup(dimension);
            }, slider.vars.animationSpeed + 100);

          } else {
            slider.container.animate(slider.args, slider.vars.animationSpeed, slider.vars.easing, function(){
              slider.wrapup(dimension);
            });
          }
        } else { // FADE:
          if (!touch) {
            slider.slides.eq(slider.currentSlide).css({"zIndex": 1}).animate({"opacity": 0}, slider.vars.animationSpeed, slider.vars.easing);
            slider.slides.eq(target).css({"zIndex": 2}).animate({"opacity": 1}, slider.vars.animationSpeed, slider.vars.easing, slider.wrapup);
          } else {
            slider.slides.eq(slider.currentSlide).css({ "opacity": 0, "zIndex": 1 });
            slider.slides.eq(target).css({ "opacity": 1, "zIndex": 2 });
            slider.wrapup(dimension);
          }
        }
        // SMOOTH HEIGHT:
        if (slider.vars.smoothHeight) { methods.smoothHeight(slider.vars.animationSpeed); }
      }
    };
    slider.wrapup = function(dimension) {
      // SLIDE:
      if (!fade && !carousel) {
        if (slider.currentSlide === 0 && slider.animatingTo === slider.last && slider.vars.animationLoop) {
          slider.setProps(dimension, "jumpEnd");
        } else if (slider.currentSlide === slider.last && slider.animatingTo === 0 && slider.vars.animationLoop) {
          slider.setProps(dimension, "jumpStart");
        }
      }
      slider.animating = false;
      slider.currentSlide = slider.animatingTo;
      // API: after() animation Callback
      slider.vars.after(slider);
    };

    // SLIDESHOW:
    slider.animateSlides = function() {
      if (!slider.animating && focused ) { slider.flexAnimate(slider.getTarget("next")); }
    };
    // SLIDESHOW:
    slider.pause = function() {
      clearInterval(slider.animatedSlides);
      slider.animatedSlides = null;
      slider.playing = false;
      // PAUSEPLAY:
      if (slider.vars.pausePlay) { methods.pausePlay.update("play"); }
      // SYNC:
      if (slider.syncExists) { methods.sync("pause"); }
    };
    // SLIDESHOW:
    slider.play = function() {
      if (slider.playing) { clearInterval(slider.animatedSlides); }
      slider.animatedSlides = slider.animatedSlides || setInterval(slider.animateSlides, slider.vars.slideshowSpeed);
      slider.started = slider.playing = true;
      // PAUSEPLAY:
      if (slider.vars.pausePlay) { methods.pausePlay.update("pause"); }
      // SYNC:
      if (slider.syncExists) { methods.sync("play"); }
    };
    // STOP:
    slider.stop = function () {
      slider.pause();
      slider.stopped = true;
    };
    slider.canAdvance = function(target, fromNav) {
      // ASNAV:
      var last = (asNav) ? slider.pagingCount - 1 : slider.last;
      return (fromNav) ? true :
             (asNav && slider.currentItem === slider.count - 1 && target === 0 && slider.direction === "prev") ? true :
             (asNav && slider.currentItem === 0 && target === slider.pagingCount - 1 && slider.direction !== "next") ? false :
             (target === slider.currentSlide && !asNav) ? false :
             (slider.vars.animationLoop) ? true :
             (slider.atEnd && slider.currentSlide === 0 && target === last && slider.direction !== "next") ? false :
             (slider.atEnd && slider.currentSlide === last && target === 0 && slider.direction === "next") ? false :
             true;
    };
    slider.getTarget = function(dir) {
      slider.direction = dir;
      if (dir === "next") {
        return (slider.currentSlide === slider.last) ? 0 : slider.currentSlide + 1;
      } else {
        return (slider.currentSlide === 0) ? slider.last : slider.currentSlide - 1;
      }
    };

    // SLIDE:
    slider.setProps = function(pos, special, dur) {
      var target = (function() {
        var posCheck = (pos) ? pos : ((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo,
            posCalc = (function() {
              if (carousel) {
                return (special === "setTouch") ? pos :
                       (reverse && slider.animatingTo === slider.last) ? 0 :
                       (reverse) ? slider.limit - (((slider.itemW + slider.vars.itemMargin) * slider.move) * slider.animatingTo) :
                       (slider.animatingTo === slider.last) ? slider.limit : posCheck;
              } else {
                switch (special) {
                  case "setTotal": return (reverse) ? ((slider.count - 1) - slider.currentSlide + slider.cloneOffset) * pos : (slider.currentSlide + slider.cloneOffset) * pos;
                  case "setTouch": return (reverse) ? pos : pos;
                  case "jumpEnd": return (reverse) ? pos : slider.count * pos;
                  case "jumpStart": return (reverse) ? slider.count * pos : pos;
                  default: return pos;
                }
              }
            }());

            return (posCalc * ((slider.vars.rtl)?1:-1)) + "px";
          }());

      if (slider.transitions) {
        if (slider.isFirefox) {
          target = (vertical) ? "translate3d(0," + target + ",0)" : "translate3d(" + (parseInt(target)+'px') + ",0,0)";
        } else {
          target = (vertical) ? "translate3d(0," + target + ",0)" : "translate3d(" + ((slider.vars.rtl?-1:1)*parseInt(target)+'px') + ",0,0)";
        }
        dur = (dur !== undefined) ? (dur/1000) + "s" : "0s";
        slider.container.css("-" + slider.pfx + "-transition-duration", dur);
         slider.container.css("transition-duration", dur);
      }

      slider.args[slider.prop] = target;
      if (slider.transitions || dur === undefined) { slider.container.css(slider.args); }

      slider.container.css('transform',target);
    };

    slider.setup = function(type) {
      // SLIDE:
      if (!fade) {
        var sliderOffset, arr;

        if (type === "init") {
          slider.viewport = $('<div class="' + namespace + 'viewport"></div>').css({"overflow": "hidden", "position": "relative"}).appendTo(slider).append(slider.container);
          // INFINITE LOOP:
          slider.cloneCount = 0;
          slider.cloneOffset = 0;
          // REVERSE:
          if (reverse) {
            arr = $.makeArray(slider.slides).reverse();
            slider.slides = $(arr);
            slider.container.empty().append(slider.slides);
          }
        }
        // INFINITE LOOP && !CAROUSEL:
        if (slider.vars.animationLoop && !carousel) {
          slider.cloneCount = 2;
          slider.cloneOffset = 1;
          // clear out old clones
          if (type !== "init") { slider.container.find('.clone').remove(); }
          slider.container.append(methods.uniqueID(slider.slides.first().clone().addClass('clone')).attr('aria-hidden', 'true'))
                          .prepend(methods.uniqueID(slider.slides.last().clone().addClass('clone')).attr('aria-hidden', 'true'));
        }
        slider.newSlides = $(slider.vars.selector, slider);

        sliderOffset = (reverse) ? slider.count - 1 - slider.currentSlide + slider.cloneOffset : slider.currentSlide + slider.cloneOffset;
        // VERTICAL:
        if (vertical && !carousel) {
          slider.container.height((slider.count + slider.cloneCount) * 200 + "%").css("position", "absolute").width("100%");
          setTimeout(function(){
            slider.newSlides.css({"display": "block"});
            slider.doMath();
            slider.viewport.height(slider.h);
            slider.setProps(sliderOffset * slider.h, "init");
          }, (type === "init") ? 100 : 0);
        } else {
          slider.container.width((slider.count + slider.cloneCount) * 200 + "%");
          slider.setProps(sliderOffset * slider.computedW, "init");
          setTimeout(function(){
            slider.doMath();
          if(slider.vars.rtl){
            if (slider.isFirefox) {
              slider.newSlides.css({"width": slider.computedW, "marginRight" : slider.computedM, "float": "right", "display": "block"});
            } else {
              slider.newSlides.css({"width": slider.computedW, "marginRight" : slider.computedM, "float": "left", "display": "block"});
            }
              
           }
            else{
              slider.newSlides.css({"width": slider.computedW, "marginRight" : slider.computedM, "float": "left", "display": "block"});
            }
            // SMOOTH HEIGHT:
            if (slider.vars.smoothHeight) { methods.smoothHeight(); }
          }, (type === "init") ? 100 : 0);
        }
      } else { // FADE:
        if(slider.vars.rtl){
          slider.slides.css({"width": "100%", "float": 'right', "marginLeft": "-100%", "position": "relative"});
        }
        else{
          slider.slides.css({"width": "100%", "float": 'left', "marginRight": "-100%", "position": "relative"});
        }
        if (type === "init") {
          if (!touch) {
            //slider.slides.eq(slider.currentSlide).fadeIn(slider.vars.animationSpeed, slider.vars.easing);
            if (slider.vars.fadeFirstSlide == false) {
              slider.slides.css({ "opacity": 0, "display": "block", "zIndex": 1 }).eq(slider.currentSlide).css({"zIndex": 2}).css({"opacity": 1});
            } else {
              slider.slides.css({ "opacity": 0, "display": "block", "zIndex": 1 }).eq(slider.currentSlide).css({"zIndex": 2}).animate({"opacity": 1},slider.vars.animationSpeed,slider.vars.easing);
            }
          } else {
            slider.slides.css({ "opacity": 0, "display": "block", "webkitTransition": "opacity " + slider.vars.animationSpeed / 1000 + "s ease", "zIndex": 1 }).eq(slider.currentSlide).css({ "opacity": 1, "zIndex": 2});
          }
        }
        // SMOOTH HEIGHT:
        if (slider.vars.smoothHeight) { methods.smoothHeight(); }
      }
      // !CAROUSEL:
      // CANDIDATE: active slide
      if (!carousel) { slider.slides.removeClass(namespace + "active-slide").eq(slider.currentSlide).addClass(namespace + "active-slide"); }

      //FlexSlider: init() Callback
      slider.vars.init(slider);
    };

    slider.doMath = function() {
      var slide = slider.slides.first(),
          slideMargin = slider.vars.itemMargin,
          minItems = slider.vars.minItems,
          maxItems = slider.vars.maxItems;

      slider.w = (slider.viewport===undefined) ? slider.width() : slider.viewport.width();
      if (slider.isFirefox) { slider.w = slider.width(); }
      slider.h = slide.height();
      slider.boxPadding = slide.outerWidth() - slide.width();

      // CAROUSEL:
      if (carousel) {
        slider.itemT = slider.vars.itemWidth + slideMargin;
        slider.itemM = slideMargin;
        slider.minW = (minItems) ? minItems * slider.itemT : slider.w;
        slider.maxW = (maxItems) ? (maxItems * slider.itemT) - slideMargin : slider.w;
        slider.itemW = (slider.minW > slider.w) ? (slider.w - (slideMargin * (minItems - 1)))/minItems :
                       (slider.maxW < slider.w) ? (slider.w - (slideMargin * (maxItems - 1)))/maxItems :
                       (slider.vars.itemWidth > slider.w) ? slider.w : slider.vars.itemWidth;

        slider.visible = Math.floor(slider.w/(slider.itemW));
        slider.move = (slider.vars.move > 0 && slider.vars.move < slider.visible ) ? slider.vars.move : slider.visible;
        slider.pagingCount = Math.ceil(((slider.count - slider.visible)/slider.move) + 1);
        slider.last =  slider.pagingCount - 1;
        slider.limit = (slider.pagingCount === 1) ? 0 :
                       (slider.vars.itemWidth > slider.w) ? (slider.itemW * (slider.count - 1)) + (slideMargin * (slider.count - 1)) : ((slider.itemW + slideMargin) * slider.count) - slider.w - slideMargin;
      } else {
        slider.itemW = slider.w;
        slider.itemM = slideMargin;
        slider.pagingCount = slider.count;
        slider.last = slider.count - 1;
      }
      slider.computedW = slider.itemW - slider.boxPadding;
      slider.computedM = slider.itemM;
    };

    slider.update = function(pos, action) {
      slider.doMath();

      // update currentSlide and slider.animatingTo if necessary
      if (!carousel) {
        if (pos < slider.currentSlide) {
          slider.currentSlide += 1;
        } else if (pos <= slider.currentSlide && pos !== 0) {
          slider.currentSlide -= 1;
        }
        slider.animatingTo = slider.currentSlide;
      }

      // update controlNav
      if (slider.vars.controlNav && !slider.manualControls) {
        if ((action === "add" && !carousel) || slider.pagingCount > slider.controlNav.length) {
          methods.controlNav.update("add");
        } else if ((action === "remove" && !carousel) || slider.pagingCount < slider.controlNav.length) {
          if (carousel && slider.currentSlide > slider.last) {
            slider.currentSlide -= 1;
            slider.animatingTo -= 1;
          }
          methods.controlNav.update("remove", slider.last);
        }
      }
      // update directionNav
      if (slider.vars.directionNav) { methods.directionNav.update(); }

    };

    slider.addSlide = function(obj, pos) {
      var $obj = $(obj);

      slider.count += 1;
      slider.last = slider.count - 1;

      // append new slide
      if (vertical && reverse) {
        (pos !== undefined) ? slider.slides.eq(slider.count - pos).after($obj) : slider.container.prepend($obj);
      } else {
        (pos !== undefined) ? slider.slides.eq(pos).before($obj) : slider.container.append($obj);
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.update(pos, "add");

      // update slider.slides
      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      //FlexSlider: added() Callback
      slider.vars.added(slider);
    };
    slider.removeSlide = function(obj) {
      var pos = (isNaN(obj)) ? slider.slides.index($(obj)) : obj;

      // update count
      slider.count -= 1;
      slider.last = slider.count - 1;

      // remove slide
      if (isNaN(obj)) {
        $(obj, slider.slides).remove();
      } else {
        (vertical && reverse) ? slider.slides.eq(slider.last).remove() : slider.slides.eq(obj).remove();
      }

      // update currentSlide, animatingTo, controlNav, and directionNav
      slider.doMath();
      slider.update(pos, "remove");

      // update slider.slides
      slider.slides = $(slider.vars.selector + ':not(.clone)', slider);
      // re-setup the slider to accomdate new slide
      slider.setup();

      // FlexSlider: removed() Callback
      slider.vars.removed(slider);
    };

    //FlexSlider: Initialize
    methods.init();
  };

  // Ensure the slider isn't focussed if the window loses focus.
  $( window ).blur( function ( e ) {
    focused = false;
  }).focus( function ( e ) {
    focused = true;
  });

  //FlexSlider: Default Settings
  $.flexslider.defaults = {
    namespace: "flex-",             //{NEW} String: Prefix string attached to the class of every element generated by the plugin
    selector: ".slides > li",       //{NEW} Selector: Must match a simple pattern. '{container} > {slide}' -- Ignore pattern at your own peril
    animation: "fade",              //String: Select your animation type, "fade" or "slide"
    easing: "swing",                //{NEW} String: Determines the easing method used in jQuery transitions. jQuery easing plugin is supported!
    direction: "horizontal",        //String: Select the sliding direction, "horizontal" or "vertical"
    reverse: false,                 //{NEW} Boolean: Reverse the animation direction
    animationLoop: true,            //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
    smoothHeight: false,            //{NEW} Boolean: Allow height of the slider to animate smoothly in horizontal mode
    startAt: 0,                     //Integer: The slide that the slider should start on. Array notation (0 = first slide)
    slideshow: true,                //Boolean: Animate slider automatically
    slideshowSpeed: 7000,           //Integer: Set the speed of the slideshow cycling, in milliseconds
    animationSpeed: 600,            //Integer: Set the speed of animations, in milliseconds
    initDelay: 0,                   //{NEW} Integer: Set an initialization delay, in milliseconds
    randomize: false,               //Boolean: Randomize slide order
    fadeFirstSlide: true,           //Boolean: Fade in the first slide when animation type is "fade"
    thumbCaptions: false,           //Boolean: Whether or not to put captions on thumbnails when using the "thumbnails" controlNav.

    // Usability features
    pauseOnAction: true,            //Boolean: Pause the slideshow when interacting with control elements, highly recommended.
    pauseOnHover: false,            //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
    pauseInvisible: true,       //{NEW} Boolean: Pause the slideshow when tab is invisible, resume when visible. Provides better UX, lower CPU usage.
    useCSS: true,                   //{NEW} Boolean: Slider will use CSS3 transitions if available
    touch: true,                    //{NEW} Boolean: Allow touch swipe navigation of the slider on touch-enabled devices
    video: false,                   //{NEW} Boolean: If using video in the slider, will prevent CSS3 3D Transforms to avoid graphical glitches

    // Primary Controls
    controlNav: true,               //Boolean: Create navigation for paging control of each slide? Note: Leave true for manualControls usage
    directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
    prevText: "Previous",           //String: Set the text for the "previous" directionNav item
    nextText: "Next",               //String: Set the text for the "next" directionNav item

    // Secondary Navigation
    keyboard: true,                 //Boolean: Allow slider navigating via keyboard left/right keys
    multipleKeyboard: false,        //{NEW} Boolean: Allow keyboard navigation to affect multiple sliders. Default behavior cuts out keyboard navigation with more than one slider present.
    mousewheel: false,              //{UPDATED} Boolean: Requires jquery.mousewheel.js (https://github.com/brandonaaron/jquery-mousewheel) - Allows slider navigating via mousewheel
    pausePlay: false,               //Boolean: Create pause/play dynamic element
    pauseText: "Pause",             //String: Set the text for the "pause" pausePlay item
    playText: "Play",               //String: Set the text for the "play" pausePlay item

    // Special properties
    controlsContainer: "",          //{UPDATED} jQuery Object/Selector: Declare which container the navigation elements should be appended too. Default container is the FlexSlider element. Example use would be $(".flexslider-container"). Property is ignored if given element is not found.
    manualControls: "",             //{UPDATED} jQuery Object/Selector: Declare custom control navigation. Examples would be $(".flex-control-nav li") or "#tabs-nav li img", etc. The number of elements in your controlNav should match the number of slides/tabs.
    customDirectionNav: "",         //{NEW} jQuery Object/Selector: Custom prev / next button. Must be two jQuery elements. In order to make the events work they have to have the classes "prev" and "next" (plus namespace)
    sync: "",                       //{NEW} Selector: Mirror the actions performed on this slider with another slider. Use with care.
    asNavFor: "",                   //{NEW} Selector: Internal property exposed for turning the slider into a thumbnail navigation for another slider

    // Carousel Options
    itemWidth: 0,                   //{NEW} Integer: Box-model width of individual carousel items, including horizontal borders and padding.
    itemMargin: 0,                  //{NEW} Integer: Margin between carousel items.
    minItems: 1,                    //{NEW} Integer: Minimum number of carousel items that should be visible. Items will resize fluidly when below this.
    maxItems: 0,                    //{NEW} Integer: Maxmimum number of carousel items that should be visible. Items will resize fluidly when above this limit.
    move: 0,                        //{NEW} Integer: Number of carousel items that should move on animation. If 0, slider will move all visible items.
    allowOneSlide: true,           //{NEW} Boolean: Whether or not to allow a slider comprised of a single slide

    // Browser Specific
    isFirefox: false,             // {NEW} Boolean: Set to true when Firefox is the browser used.

    // Callback API
    start: function(){},            //Callback: function(slider) - Fires when the slider loads the first slide
    before: function(){},           //Callback: function(slider) - Fires asynchronously with each slider animation
    after: function(){},            //Callback: function(slider) - Fires after each slider animation completes
    end: function(){},              //Callback: function(slider) - Fires when the slider reaches the last slide (asynchronous)
    added: function(){},            //{NEW} Callback: function(slider) - Fires after a slide is added
    removed: function(){},           //{NEW} Callback: function(slider) - Fires after a slide is removed
    init: function() {},             //{NEW} Callback: function(slider) - Fires after the slider is initially setup
  rtl: false             //{NEW} Boolean: Whether or not to enable RTL mode
  };

  //FlexSlider: Plugin Function
  $.fn.flexslider = function(options) {
    if (options === undefined) { options = {}; }

    if (typeof options === "object") {
      return this.each(function() {
        var $this = $(this),
            selector = (options.selector) ? options.selector : ".slides > li",
            $slides = $this.find(selector);

      if ( ( $slides.length === 1 && options.allowOneSlide === false ) || $slides.length === 0 ) {
          $slides.fadeIn(400);
          if (options.start) { options.start($this); }
        } else if ($this.data('flexslider') === undefined) {
          new $.flexslider(this, options);
        }
      });
    } else {
      // Helper strings to quickly perform functions on the slider
      var $slider = $(this).data('flexslider');
      switch (options) {
        case "play": $slider.play(); break;
        case "pause": $slider.pause(); break;
        case "stop": $slider.stop(); break;
        case "next": $slider.flexAnimate($slider.getTarget("next"), true); break;
        case "prev":
        case "previous": $slider.flexAnimate($slider.getTarget("prev"), true); break;
        default: if (typeof options === "number") { $slider.flexAnimate(options, true); }
      }
    }
  };
})(jQuery);

}).call(this,require("timers").setImmediate)

},{"timers":5}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)

},{"process/browser.js":4,"timers":5}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc2NyaXB0cy9mdW5jdGlvbnMvcGFnZV9ob21lLmpzIiwiYXBwL3NjcmlwdHMvbW9kdWxlcy9zbGlkZXIuanMiLCJub2RlX21vZHVsZXMvZmxleHNsaWRlci9qcXVlcnkuZmxleHNsaWRlci5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdGltZXJzLWJyb3dzZXJpZnkvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSxJQUFJLG1CQUFtQixDQUF2QjtBQUNBLE9BQU8sZ0JBQVAsR0FBMEIsZ0JBQTFCOztBQUVBLElBQUksaUJBQWlCLFFBQVEsWUFBUixDQUFyQjtBQUFBLElBQ0MsYUFBYSxRQUFRLG1CQUFSLENBRGQ7O0FBR0EsWUFBWTtBQUNYLE9BQU0sWUFBVTtBQUNmLE9BQUssVUFBTDtBQUNBLE9BQUssUUFBTDtBQUNBLE9BQUssWUFBTDtBQUNBLE9BQUssU0FBTDtBQUNBLEVBTlU7QUFPWCxhQUFZLFlBQVU7QUFDckIsYUFBVyxjQUFYLENBQTBCLFdBQTFCLEVBQXVDLFNBQXZDO0FBQ0EsV0FBUyxFQUFFLGlCQUFGLENBQVQ7QUFDQSxTQUFPLElBQVAsQ0FBWSxZQUFXO0FBQ3RCLGNBQVcsU0FBWCxDQUFxQixNQUFyQjtBQUNBLEdBRkQ7QUFHQSxFQWJVO0FBY1gsV0FBVSxZQUFVO0FBQ25CLE1BQUksYUFBYSxJQUFJLE9BQU8sVUFBWCxFQUFqQjtBQUNBLE1BQUksS0FBSyxJQUFJLE1BQUosRUFBVDs7QUFFQSxNQUFJLEVBQUUsTUFBRixFQUFVLFVBQVYsQ0FBcUIsSUFBckIsSUFBNkIsR0FBakMsRUFBc0M7QUFDckMsT0FBSSxRQUFRLEdBQUcsRUFBSCxDQUFNLGFBQU4sRUFBcUIsRUFBckIsRUFBeUIsRUFBQyxLQUFLLENBQUMsR0FBUCxFQUFZLFdBQVcsQ0FBQyxFQUF4QixFQUE0QixXQUFXLENBQUMsRUFBeEMsRUFBNEMsTUFBTSxPQUFPLFFBQXpELEVBQXpCLEVBQTZGLEtBQTdGLEVBQ1IsRUFEUSxDQUNMLFdBREssRUFDUSxDQURSLEVBQ1csRUFBQyxLQUFLLEdBQU4sRUFBVyxXQUFXLEVBQXRCLEVBQTBCLFdBQVcsQ0FBQyxFQUF0QyxFQUEwQyxNQUFNLE9BQU8sUUFBdkQsRUFEWCxFQUM2RSxLQUQ3RSxDQUFaO0FBRUEsR0FIRCxNQUdPO0FBQ04sT0FBSSxRQUFRLEdBQUcsRUFBSCxDQUFNLGFBQU4sRUFBcUIsRUFBckIsRUFBeUIsRUFBQyxLQUFLLENBQUMsRUFBUCxFQUFXLFdBQVcsQ0FBQyxFQUF2QixFQUEyQixXQUFXLENBQUMsRUFBdkMsRUFBMkMsTUFBTSxPQUFPLFFBQXhELEVBQXpCLEVBQTRGLEtBQTVGLEVBQ1IsRUFEUSxDQUNMLFdBREssRUFDUSxDQURSLEVBQ1csRUFBQyxLQUFLLENBQUMsRUFBUCxFQUFXLFdBQVcsRUFBdEIsRUFBMEIsV0FBVyxDQUFDLEVBQXRDLEVBQTBDLE1BQU0sT0FBTyxRQUF2RCxFQURYLEVBQzZFLEtBRDdFLENBQVo7QUFFQTs7QUFFRCxNQUFJLFFBQVEsSUFBSSxPQUFPLEtBQVgsQ0FBaUIsRUFBQyxnQkFBZ0Isb0JBQWpCLEVBQXVDLFVBQVUsRUFBRSxNQUFGLEVBQVUsTUFBVixFQUFqRCxFQUFqQixFQUF1RixRQUF2RixDQUFnRyxLQUFoRyxFQUF1RyxLQUF2RyxDQUE2RyxVQUE3RyxDQUFaO0FBQ0EsRUEzQlU7QUE0QlgsZUFBYyxZQUFVO0FBQ3ZCLElBQUUsV0FBRixFQUFlLElBQWYsQ0FBb0IsWUFBVTtBQUM3QixPQUFJLEVBQUUsTUFBRixFQUFVLFVBQVYsQ0FBcUIsSUFBckIsSUFBNkIsR0FBakMsRUFBc0M7QUFDckMsUUFBSSxPQUFPLEVBQUUsSUFBRixDQUFYO0FBQUEsUUFDQyxhQUFhLElBQUksT0FBTyxVQUFYLEVBRGQ7QUFBQSxRQUVDLEtBQUssSUFBSSxNQUFKLEVBRk47QUFBQSxRQUdDLGVBQWUsRUFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLGdCQUFiLENBSGhCO0FBQUEsUUFJQyxZQUFZLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxzQkFBYixDQUpiO0FBQUEsUUFLQyxpQkFBaUIsS0FBSyxJQUFMLENBQVUsb0JBQVYsRUFBZ0MsTUFBaEMsRUFMbEI7QUFNQSxRQUFJLFFBQVEsR0FBRyxFQUFILENBQU0sU0FBTixFQUFpQixHQUFqQixFQUFzQixFQUFDLEtBQUssR0FBTixFQUFXLE1BQU0sT0FBTyxRQUF4QixFQUF0QixFQUF5RCxLQUF6RCxDQUFaO0FBQ0EsUUFBSSxRQUFRLElBQUksT0FBTyxLQUFYLENBQWlCLEVBQUMsZ0JBQWdCLEVBQUUsY0FBRixFQUFrQixDQUFsQixDQUFqQixFQUF1QyxVQUFVLEVBQUUsTUFBRixFQUFVLE1BQVYsRUFBakQsRUFBakIsRUFBdUYsUUFBdkYsQ0FBZ0csS0FBaEcsRUFBdUcsS0FBdkcsQ0FBNkcsVUFBN0csQ0FBWjtBQUNBO0FBRUQsR0FaRDtBQWFBLEVBMUNVO0FBMkNYLFlBQVcsWUFBVTtBQUNwQixNQUFJLGFBQWEsSUFBSSxPQUFPLFVBQVgsRUFBakI7QUFBQSxNQUNDLEtBQUssSUFBSSxNQUFKLEVBRE47QUFBQSxNQUVDLFFBQVEsR0FBRyxTQUFILENBQWEsaUJBQWIsRUFBZ0MsR0FBaEMsRUFBcUMsRUFBQyxHQUFFLENBQUgsRUFBTSxTQUFRLENBQWQsRUFBckMsRUFBdUQsR0FBdkQsQ0FGVDtBQUdDLFVBQVEsSUFBSSxPQUFPLEtBQVgsQ0FBaUIsRUFBQyxnQkFBZ0IsRUFBRSxvQkFBRixFQUF3QixDQUF4QixDQUFqQixFQUFqQixFQUErRCxRQUEvRCxDQUF3RSxLQUF4RSxFQUErRSxLQUEvRSxDQUFxRixVQUFyRixDQUFSO0FBQ0Q7QUFoRFUsQ0FBWjs7QUFtREEsRUFBRSxNQUFGLEVBQVUsRUFBVixDQUFhLE1BQWIsRUFBcUIsWUFBVTtBQUM5QixXQUFVLElBQVY7QUFDQSxDQUZEOztBQUlBLEVBQUcsTUFBSCxFQUFZLEVBQVosQ0FBZ0IsbUJBQWhCLEVBQXFDLFVBQVUsS0FBVixFQUFrQjtBQUN0RCxXQUFVLElBQVY7QUFDQSxDQUZEOzs7OztBQzdEQSxPQUFPLE9BQVAsR0FBaUI7QUFDaEIsT0FBTSxZQUFVLENBQ2YsQ0FGZTtBQUdoQixpQkFBZ0IsVUFBUyxRQUFULEVBQW1CLE1BQW5CLEVBQTBCO0FBQ3pDLElBQUUsUUFBRixFQUFZLFVBQVosQ0FBdUI7QUFDbkIsY0FBVyxPQURRO0FBRW5CLGVBQVksS0FGTztBQUduQixpQkFBYyxLQUhLO0FBSW5CLGtCQUFlLEtBSkk7QUFLbkIsbUJBQWlCLEdBTEU7QUFNbkIsVUFBTyxLQU5ZO0FBT25CLFVBQU8sVUFBUyxRQUFULEVBQW1CLE1BQW5CLEVBQTBCO0FBQ25DLGVBQVcsUUFBWCxHQUFzQjtBQUN0QjtBQVRxQixHQUF2QjtBQVdBLElBQUUsTUFBRixFQUFVLFVBQVYsQ0FBcUI7QUFDakIsY0FBVyxPQURNO0FBRWpCLGlCQUFnQixLQUZDO0FBR3BCLGVBQWdCLElBSEk7QUFJcEIsa0JBQWdCLElBSkk7QUFLcEIsa0JBQWdCLElBTEk7QUFNcEIsaUJBQWdCLEtBTkk7QUFPcEIsbUJBQWlCLEdBUEc7QUFRcEIsbUJBQWlCLElBUkc7QUFTcEIsVUFBTyxJQVRhO0FBVWpCLFNBQU0sUUFWVztBQVdqQixVQUFPLFVBQVMsTUFBVCxFQUFnQjtBQUN0QixRQUFJLGNBQWMsRUFBRSw4QkFBRixFQUFrQyxJQUFsQyxDQUF1QyxPQUF2QyxDQUFsQjtBQUNILE1BQUUsMkJBQUYsRUFBK0IsR0FBL0IsQ0FBbUMsa0JBQW5DLEVBQXNELFdBQXREO0FBQ0csSUFkZ0I7QUFlakIsV0FBUSxVQUFTLE1BQVQsRUFBZ0I7QUFDdkIsTUFBRSxvQkFBRixFQUF3QixPQUF4QixDQUFnQztBQUMvQixjQUFTO0FBRHNCLEtBQWhDLEVBRUcsR0FGSDtBQUdBLGVBQVcsWUFBVTtBQUNwQixPQUFFLG9CQUFGLEVBQXdCLE9BQXhCLENBQWdDO0FBQy9CLGVBQVM7QUFEc0IsTUFBaEMsRUFFRyxHQUZIO0FBR0EsS0FKRCxFQUlHLEdBSkg7QUFLQSxJQXhCZ0I7QUF5QmpCLFVBQU8sVUFBUyxNQUFULEVBQWdCO0FBQ3pCLFFBQUksY0FBYyxFQUFFLDhCQUFGLEVBQWtDLElBQWxDLENBQXVDLE9BQXZDLENBQWxCO0FBQ0EsTUFBRSwyQkFBRixFQUErQixHQUEvQixDQUFtQyxrQkFBbkMsRUFBc0QsV0FBdEQ7QUFDQSxlQUFXLFFBQVg7QUFDQTtBQTdCbUIsR0FBckI7QUErQkEsRUE5Q2U7QUErQ2hCLFlBQVcsVUFBVSxJQUFWLEVBQWdCO0FBQzFCLE1BQUcsRUFBRSxJQUFGLEVBQVEsTUFBUixLQUFpQixDQUFwQixFQUF3QixPQUFPLEtBQVA7QUFDeEIsSUFBRSxJQUFGLEVBQVEsVUFBUixDQUFtQjtBQUNsQixjQUFXLE9BRE87QUFFbEIsY0FBVyxZQUZPO0FBR2xCLGlCQUFnQixLQUhFO0FBSWxCLGVBQWdCLElBSkU7QUFLbEIsa0JBQWdCLElBTEU7QUFNbEIsa0JBQWdCLElBTkU7QUFPbEIsaUJBQWdCLEtBUEU7QUFRbEIsbUJBQWlCLEdBUkM7QUFTbEIsbUJBQWlCLElBVEM7QUFVbEIsVUFBTyxLQVZXO0FBV2xCLFVBQU8sVUFBUyxJQUFULEVBQWM7QUFDakIsUUFBSSxjQUFjLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxvQkFBYixFQUFtQyxJQUFuQyxDQUF3QyxPQUF4QyxDQUFsQjtBQUNILE1BQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxxQkFBYixFQUFvQyxHQUFwQyxDQUF3QyxrQkFBeEMsRUFBMkQsV0FBM0Q7QUFDRyxJQWRjO0FBZWxCLFVBQU8sVUFBUyxJQUFULEVBQWM7QUFDcEIsUUFBSSxjQUFjLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxvQkFBYixFQUFtQyxJQUFuQyxDQUF3QyxPQUF4QyxDQUFsQjtBQUNBLE1BQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxxQkFBYixFQUFvQyxHQUFwQyxDQUF3QyxrQkFBeEMsRUFBMkQsV0FBM0Q7QUFDQSxlQUFXLFFBQVg7QUFDQTtBQW5CaUIsR0FBbkI7QUFxQkEsRUF0RWU7QUF1RWhCLGFBQVksVUFBVSxJQUFWLEVBQWdCO0FBQzNCLE1BQUcsRUFBRSxJQUFGLEVBQVEsTUFBUixLQUFpQixDQUFwQixFQUF3QixPQUFPLEtBQVA7QUFDeEIsSUFBRSxJQUFGLEVBQVEsVUFBUixDQUFtQjtBQUNsQixjQUFXLE9BRE87QUFFbEIsY0FBVyxZQUZPO0FBR2xCLGlCQUFnQixLQUhFO0FBSWxCLGVBQWdCLElBSkU7QUFLbEIsa0JBQWdCLElBTEU7QUFNbEIsa0JBQWdCLElBTkU7QUFPbEIsaUJBQWdCLEtBUEU7QUFRbEIsbUJBQWlCLEdBUkM7QUFTbEIsbUJBQWlCLElBVEM7QUFVbEIsVUFBTyxVQUFTLE1BQVQsRUFBZ0I7QUFDdEIsZUFBVyxRQUFYO0FBQ0E7QUFaaUIsR0FBbkI7QUFjQTtBQXZGZSxDQUFqQjs7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNwdUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsInZhciBwYWdlX2hvbWVfbG9hZGVkID0gMTtcclxuZ2xvYmFsLnBhZ2VfaG9tZV9sb2FkZWQgPSBwYWdlX2hvbWVfbG9hZGVkO1xyXG5cclxudmFyIGZsZXhzbGlkZXJMb2FkID0gcmVxdWlyZSgnZmxleHNsaWRlcicpLFxyXG5cdGZsZXhzbGlkZXIgPSByZXF1aXJlKCcuLi9tb2R1bGVzL3NsaWRlcicpO1xyXG5cclxucGFnZV9ob21lID0ge1xyXG5cdGxvYWQ6IGZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLmZsZXhzbGlkZXIoKTtcclxuXHRcdHRoaXMubGVuc0FuaW0oKTtcclxuXHRcdHRoaXMucHJvZFBhcmFsbGF4KCk7XHJcblx0XHR0aGlzLnNlcnZJY29ucygpO1xyXG5cdH0sXHJcblx0ZmxleHNsaWRlcjogZnVuY3Rpb24oKXtcclxuXHRcdGZsZXhzbGlkZXIuaG9tZU1haW5TbGlkZXIoJyNjYXJvdXNlbCcsICcjc2xpZGVyJyk7XHJcblx0XHRzbGlkZXIgPSAkKCcuaG9tZVByb2RTbGlkZXInKTtcclxuXHRcdHNsaWRlci5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRmbGV4c2xpZGVyLnByb2RzTGlzdChzbGlkZXIpO1xyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRsZW5zQW5pbTogZnVuY3Rpb24oKXtcclxuXHRcdHZhciBjb250cm9sbGVyID0gbmV3IHNtSW5pdC5Db250cm9sbGVyKCk7XHJcblx0XHR2YXIgdGwgPSBuZXcgdG1Jbml0KCk7XHJcblxyXG5cdFx0aWYgKCQod2luZG93KS5vdXRlcldpZHRoKHRydWUpID4gNzY3KSB7XHJcblx0XHRcdHZhciB0d2VlbiA9IHRsLnRvKFwiI3NtYWxsX2xlbnNcIiwgLjgsIHt0b3A6IC0yMzAsIHJvdGF0aW9uWTogLTQwLCByb3RhdGlvblg6IC01MCwgZWFzZTogTGluZWFyLmVhc2VOb25lfSwgXCItPTJcIilcclxuXHRcdFx0XHRcdFx0LnRvKFwiI2JpZ19sZW5zXCIsIDEsIHt0b3A6IDE2MCwgcm90YXRpb25ZOiA2MCwgcm90YXRpb25YOiAtMzUsIGVhc2U6IExpbmVhci5lYXNlTm9uZX0sIFwiLT0yXCIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHR3ZWVuID0gdGwudG8oXCIjc21hbGxfbGVuc1wiLCAuOCwge3RvcDogLTE1LCByb3RhdGlvblk6IC0yMCwgcm90YXRpb25YOiAtNDAsIGVhc2U6IExpbmVhci5lYXNlTm9uZX0sIFwiLT0yXCIpXHJcblx0XHRcdFx0XHRcdC50byhcIiNiaWdfbGVuc1wiLCAxLCB7dG9wOiAtMjAsIHJvdGF0aW9uWTogNTAsIHJvdGF0aW9uWDogLTM1LCBlYXNlOiBMaW5lYXIuZWFzZU5vbmV9LCBcIi09MlwiKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgc2NlbmUgPSBuZXcgc21Jbml0LlNjZW5lKHt0cmlnZ2VyRWxlbWVudDogXCIjaG9tZV9tYWluX3RyaWdnZXJcIiwgZHVyYXRpb246ICQod2luZG93KS5oZWlnaHQoKX0pLnNldFR3ZWVuKHR3ZWVuKS5hZGRUbyhjb250cm9sbGVyKTtcclxuXHR9LFxyXG5cdHByb2RQYXJhbGxheDogZnVuY3Rpb24oKXtcclxuXHRcdCQoJy5ob21lUHJvZCcpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYgKCQod2luZG93KS5vdXRlcldpZHRoKHRydWUpID4gNzY3KSB7XHJcblx0XHRcdFx0dmFyIHByb2QgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdFx0Y29udHJvbGxlciA9IG5ldyBzbUluaXQuQ29udHJvbGxlcigpLFxyXG5cdFx0XHRcdFx0dGwgPSBuZXcgdG1Jbml0KCksXHJcblx0XHRcdFx0XHRnYWxsZXJ5QmxvY2sgPSAkKHRoaXMpLmZpbmQoJy5ob21lUHJvZF9fZ2FsJyksXHJcblx0XHRcdFx0XHRsaXN0QmxvY2sgPSAkKHRoaXMpLmZpbmQoJy5ob21lUHJvZF9fbGlzdEJsb2NrJyksXHJcblx0XHRcdFx0XHRwcm9qZWN0VHJpZ2dlciA9IHByb2QuZmluZCgnLmhvbWVQcm9kX190cmlnZ2VyJykucGFyZW50KCk7XHJcblx0XHRcdFx0dmFyIHR3ZWVuID0gdGwudG8obGlzdEJsb2NrLCAxLjIsIHt0b3A6IDE5MCwgZWFzZTogTGluZWFyLmVhc2VOb25lfSwgXCItPTNcIik7XHJcblx0XHRcdFx0dmFyIHNjZW5lID0gbmV3IHNtSW5pdC5TY2VuZSh7dHJpZ2dlckVsZW1lbnQ6ICQocHJvamVjdFRyaWdnZXIpWzBdLCBkdXJhdGlvbjogJCh3aW5kb3cpLmhlaWdodCgpfSkuc2V0VHdlZW4odHdlZW4pLmFkZFRvKGNvbnRyb2xsZXIpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSlcclxuXHR9LFxyXG5cdHNlcnZJY29uczogZnVuY3Rpb24oKXtcclxuXHRcdHZhciBjb250cm9sbGVyID0gbmV3IHNtSW5pdC5Db250cm9sbGVyKCksXHJcblx0XHRcdHRsID0gbmV3IHRtSW5pdCgpLFxyXG5cdFx0XHR0d2VlbiA9IHRsLnN0YWdnZXJUbygnLmhvbWVTZXJ2X19zZXJ2JywgLjI1LCB7eTowLCBvcGFjaXR5OjF9LCAuMTUpO1xyXG5cdFx0XHRzY2VuZSA9IG5ldyBzbUluaXQuU2NlbmUoe3RyaWdnZXJFbGVtZW50OiAkKCcjaG9tZV9zZXJ2X3RyaWdnZXInKVswXX0pLnNldFR3ZWVuKHR3ZWVuKS5hZGRUbyhjb250cm9sbGVyKTtcclxuXHR9XHJcbn1cclxuXHJcbiQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uKCl7XHJcblx0cGFnZV9ob21lLmxvYWQoKTtcclxufSlcclxuXHJcbiQoIHdpbmRvdyApLm9uKCAnb3JpZW50YXRpb25jaGFuZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XHJcblx0cGFnZV9ob21lLmxvYWQoKTtcclxufSk7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG5cdGluaXQ6IGZ1bmN0aW9uKCl7XG5cdH0sXG5cdGhvbWVNYWluU2xpZGVyOiBmdW5jdGlvbihjYXJvdXNlbCwgc2xpZGVyKXtcblx0XHQkKGNhcm91c2VsKS5mbGV4c2xpZGVyKHtcblx0XHQgICAgYW5pbWF0aW9uOiBcInNsaWRlXCIsXG5cdFx0ICAgIGNvbnRyb2xOYXY6IGZhbHNlLFxuXHRcdCAgICBkaXJlY3Rpb25OYXY6IGZhbHNlLFxuXHRcdCAgICBhbmltYXRpb25Mb29wOiBmYWxzZSxcblx0XHQgICAgYW5pbWF0aW9uU3BlZWQ6ICA5MDAsXG5cdFx0ICAgIHRvdWNoOiBmYWxzZSxcblx0XHQgICAgYWZ0ZXI6IGZ1bmN0aW9uKGNhcm91c2VsLCBzbGlkZXIpe1xuXHRcdFx0XHRzaXRlR2xvYmFsLmxhenlMb2FkKCk7O1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdCQoc2xpZGVyKS5mbGV4c2xpZGVyKHtcblx0XHQgICAgYW5pbWF0aW9uOiBcInNsaWRlXCIsXG5cdFx0ICAgIGRpcmVjdGlvbk5hdjogICBmYWxzZSxcblx0XHRcdGNvbnRyb2xOYXY6ICAgICB0cnVlLFxuXHRcdFx0YW5pbWF0aW9uTG9vcDogIHRydWUsXG5cdFx0XHRwYXVzZU9uQWN0aW9uOiAgdHJ1ZSxcblx0XHRcdHBhdXNlT25Ib3ZlcjogICBmYWxzZSxcblx0XHRcdGFuaW1hdGlvblNwZWVkOiAgODAwLFxuXHRcdFx0c2xpZGVzaG93U3BlZWQ6ICA1MDAwLFxuXHRcdFx0dG91Y2g6IHRydWUsXG5cdFx0ICAgIHN5bmM6IGNhcm91c2VsLFxuXHRcdCAgICBzdGFydDogZnVuY3Rpb24oc2xpZGVyKXtcblx0XHQgICAgXHR2YXIgc2xpZGVfY29sb3IgPSAkKCcjY2Fyb3VzZWwgLmZsZXgtYWN0aXZlLXNsaWRlJykuZGF0YSgnY29sb3InKTtcblx0XHRcdFx0JCgnI2Nhcm91c2VsIC5ob21lVmlzdWFsX19iZycpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsc2xpZGVfY29sb3IpO1xuXHRcdCAgICB9LFxuXHRcdCAgICBiZWZvcmU6IGZ1bmN0aW9uKHNsaWRlcil7XG5cdFx0ICAgIFx0JCgnLmhvbWVWaXN1YWxfX2Jsb2NrJykuYW5pbWF0ZSh7XG5cdFx0ICAgIFx0XHRvcGFjaXR5OiAwXG5cdFx0ICAgIFx0fSwgMjUwKTtcblx0XHQgICAgXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0ICAgIFx0XHQkKCcuaG9tZVZpc3VhbF9fYmxvY2snKS5hbmltYXRlKHtcblx0XHRcdCAgICBcdFx0b3BhY2l0eTogMVxuXHRcdFx0ICAgIFx0fSwgMjUwKTtcblx0XHQgICAgXHR9LCA1MDApXG5cdFx0ICAgIH0sXG5cdFx0ICAgIGFmdGVyOiBmdW5jdGlvbihzbGlkZXIpe1xuXHRcdFx0XHR2YXIgc2xpZGVfY29sb3IgPSAkKCcjY2Fyb3VzZWwgLmZsZXgtYWN0aXZlLXNsaWRlJykuZGF0YSgnY29sb3InKTtcblx0XHRcdFx0JCgnI2Nhcm91c2VsIC5ob21lVmlzdWFsX19iZycpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsc2xpZGVfY29sb3IpO1xuXHRcdFx0XHRzaXRlR2xvYmFsLmxhenlMb2FkKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cdHByb2RzTGlzdDogZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRpZigkKGl0ZW0pLmxlbmd0aD09PTAgKSByZXR1cm4gZmFsc2U7XG5cdFx0JChpdGVtKS5mbGV4c2xpZGVyKHtcblx0XHRcdGFuaW1hdGlvbjogJ3NsaWRlJyxcblx0XHRcdGRpcmVjdGlvbjogJ2hvcml6b250YWwnLFxuXHRcdFx0ZGlyZWN0aW9uTmF2OiAgIGZhbHNlLFxuXHRcdFx0Y29udHJvbE5hdjogICAgIHRydWUsXG5cdFx0XHRhbmltYXRpb25Mb29wOiAgdHJ1ZSxcblx0XHRcdHBhdXNlT25BY3Rpb246ICB0cnVlLFxuXHRcdFx0cGF1c2VPbkhvdmVyOiAgIGZhbHNlLFxuXHRcdFx0YW5pbWF0aW9uU3BlZWQ6ICA4MDAsXG5cdFx0XHRzbGlkZXNob3dTcGVlZDogIDM1MDAsXG5cdFx0XHR0b3VjaDogZmFsc2UsXG5cdFx0XHRzdGFydDogZnVuY3Rpb24oaXRlbSl7XG5cdFx0ICAgIFx0dmFyIHNsaWRlX2NvbG9yID0gJChpdGVtKS5maW5kKCcuZmxleC1hY3RpdmUtc2xpZGUnKS5kYXRhKCdjb2xvcicpO1xuXHRcdFx0XHQkKGl0ZW0pLmZpbmQoJy5ob21lUHJvZFNsaWRlcl9fYmcnKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLHNsaWRlX2NvbG9yKTtcblx0XHQgICAgfSxcblx0XHRcdGFmdGVyOiBmdW5jdGlvbihpdGVtKXtcblx0XHRcdFx0dmFyIHNsaWRlX2NvbG9yID0gJChpdGVtKS5maW5kKCcuZmxleC1hY3RpdmUtc2xpZGUnKS5kYXRhKCdjb2xvcicpO1xuXHRcdFx0XHQkKGl0ZW0pLmZpbmQoJy5ob21lUHJvZFNsaWRlcl9fYmcnKS5jc3MoJ2JhY2tncm91bmQtY29sb3InLHNsaWRlX2NvbG9yKTtcblx0XHRcdFx0c2l0ZUdsb2JhbC5sYXp5TG9hZCgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9LFxuXHR2aXN1YWxGdWxsOiBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdGlmKCQoaXRlbSkubGVuZ3RoPT09MCApIHJldHVybiBmYWxzZTtcblx0XHQkKGl0ZW0pLmZsZXhzbGlkZXIoe1xuXHRcdFx0YW5pbWF0aW9uOiAnc2xpZGUnLFxuXHRcdFx0ZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcsXG5cdFx0XHRkaXJlY3Rpb25OYXY6ICAgZmFsc2UsXG5cdFx0XHRjb250cm9sTmF2OiAgICAgdHJ1ZSxcblx0XHRcdGFuaW1hdGlvbkxvb3A6ICB0cnVlLFxuXHRcdFx0cGF1c2VPbkFjdGlvbjogIHRydWUsXG5cdFx0XHRwYXVzZU9uSG92ZXI6ICAgZmFsc2UsXG5cdFx0XHRhbmltYXRpb25TcGVlZDogIDQ1MCxcblx0XHRcdHNsaWRlc2hvd1NwZWVkOiAgNTAwMCxcblx0XHRcdGFmdGVyOiBmdW5jdGlvbihzbGlkZXIpe1xuXHRcdFx0XHRzaXRlR2xvYmFsLmxhenlMb2FkKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG59IiwiLypcbiAqIGpRdWVyeSBGbGV4U2xpZGVyIHYyLjcuMlxuICogQ29weXJpZ2h0IDIwMTIgV29vVGhlbWVzXG4gKiBDb250cmlidXRpbmcgQXV0aG9yOiBUeWxlciBTbWl0aFxuICovXG47XG4oZnVuY3Rpb24gKCQpIHtcblxuICB2YXIgZm9jdXNlZCA9IHRydWU7XG5cbiAgLy9GbGV4U2xpZGVyOiBPYmplY3QgSW5zdGFuY2VcbiAgJC5mbGV4c2xpZGVyID0gZnVuY3Rpb24oZWwsIG9wdGlvbnMpIHtcbiAgICB2YXIgc2xpZGVyID0gJChlbCk7XG5cbiAgICAvLyBtYWtpbmcgdmFyaWFibGVzIHB1YmxpY1xuXG4gICAgLy9pZiBydGwgdmFsdWUgd2FzIG5vdCBwYXNzZWQgYW5kIGh0bWwgaXMgaW4gcnRsLi5lbmFibGUgaXQgYnkgZGVmYXVsdC5cbiAgICBpZih0eXBlb2Ygb3B0aW9ucy5ydGw9PSd1bmRlZmluZWQnICYmICQoJ2h0bWwnKS5hdHRyKCdkaXInKT09J3J0bCcpe1xuICAgICAgb3B0aW9ucy5ydGw9dHJ1ZTtcbiAgICB9XG4gICAgc2xpZGVyLnZhcnMgPSAkLmV4dGVuZCh7fSwgJC5mbGV4c2xpZGVyLmRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgIHZhciBuYW1lc3BhY2UgPSBzbGlkZXIudmFycy5uYW1lc3BhY2UsXG4gICAgICAgIG1zR2VzdHVyZSA9IHdpbmRvdy5uYXZpZ2F0b3IgJiYgd2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkICYmIHdpbmRvdy5NU0dlc3R1cmUsXG4gICAgICAgIHRvdWNoID0gKCggXCJvbnRvdWNoc3RhcnRcIiBpbiB3aW5kb3cgKSB8fCBtc0dlc3R1cmUgfHwgd2luZG93LkRvY3VtZW50VG91Y2ggJiYgZG9jdW1lbnQgaW5zdGFuY2VvZiBEb2N1bWVudFRvdWNoKSAmJiBzbGlkZXIudmFycy50b3VjaCxcbiAgICAgICAgLy8gZGVwcmVjYXRpbmcgdGhpcyBpZGVhLCBhcyBkZXZpY2VzIGFyZSBiZWluZyByZWxlYXNlZCB3aXRoIGJvdGggb2YgdGhlc2UgZXZlbnRzXG4gICAgICAgIGV2ZW50VHlwZSA9IFwiY2xpY2sgdG91Y2hlbmQgTVNQb2ludGVyVXAga2V5dXBcIixcbiAgICAgICAgd2F0Y2hlZEV2ZW50ID0gXCJcIixcbiAgICAgICAgd2F0Y2hlZEV2ZW50Q2xlYXJUaW1lcixcbiAgICAgICAgdmVydGljYWwgPSBzbGlkZXIudmFycy5kaXJlY3Rpb24gPT09IFwidmVydGljYWxcIixcbiAgICAgICAgcmV2ZXJzZSA9IHNsaWRlci52YXJzLnJldmVyc2UsXG4gICAgICAgIGNhcm91c2VsID0gKHNsaWRlci52YXJzLml0ZW1XaWR0aCA+IDApLFxuICAgICAgICBmYWRlID0gc2xpZGVyLnZhcnMuYW5pbWF0aW9uID09PSBcImZhZGVcIixcbiAgICAgICAgYXNOYXYgPSBzbGlkZXIudmFycy5hc05hdkZvciAhPT0gXCJcIixcbiAgICAgICAgbWV0aG9kcyA9IHt9O1xuXG4gICAgLy8gU3RvcmUgYSByZWZlcmVuY2UgdG8gdGhlIHNsaWRlciBvYmplY3RcbiAgICAkLmRhdGEoZWwsIFwiZmxleHNsaWRlclwiLCBzbGlkZXIpO1xuXG4gICAgLy8gUHJpdmF0ZSBzbGlkZXIgbWV0aG9kc1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgc2xpZGVyLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAvLyBHZXQgY3VycmVudCBzbGlkZSBhbmQgbWFrZSBzdXJlIGl0IGlzIGEgbnVtYmVyXG4gICAgICAgIHNsaWRlci5jdXJyZW50U2xpZGUgPSBwYXJzZUludCggKCBzbGlkZXIudmFycy5zdGFydEF0ID8gc2xpZGVyLnZhcnMuc3RhcnRBdCA6IDApLCAxMCApO1xuICAgICAgICBpZiAoIGlzTmFOKCBzbGlkZXIuY3VycmVudFNsaWRlICkgKSB7IHNsaWRlci5jdXJyZW50U2xpZGUgPSAwOyB9XG4gICAgICAgIHNsaWRlci5hbmltYXRpbmdUbyA9IHNsaWRlci5jdXJyZW50U2xpZGU7XG4gICAgICAgIHNsaWRlci5hdEVuZCA9IChzbGlkZXIuY3VycmVudFNsaWRlID09PSAwIHx8IHNsaWRlci5jdXJyZW50U2xpZGUgPT09IHNsaWRlci5sYXN0KTtcbiAgICAgICAgc2xpZGVyLmNvbnRhaW5lclNlbGVjdG9yID0gc2xpZGVyLnZhcnMuc2VsZWN0b3Iuc3Vic3RyKDAsc2xpZGVyLnZhcnMuc2VsZWN0b3Iuc2VhcmNoKCcgJykpO1xuICAgICAgICBzbGlkZXIuc2xpZGVzID0gJChzbGlkZXIudmFycy5zZWxlY3Rvciwgc2xpZGVyKTtcbiAgICAgICAgc2xpZGVyLmNvbnRhaW5lciA9ICQoc2xpZGVyLmNvbnRhaW5lclNlbGVjdG9yLCBzbGlkZXIpO1xuICAgICAgICBzbGlkZXIuY291bnQgPSBzbGlkZXIuc2xpZGVzLmxlbmd0aDtcbiAgICAgICAgLy8gU1lOQzpcbiAgICAgICAgc2xpZGVyLnN5bmNFeGlzdHMgPSAkKHNsaWRlci52YXJzLnN5bmMpLmxlbmd0aCA+IDA7XG4gICAgICAgIC8vIFNMSURFOlxuICAgICAgICBpZiAoc2xpZGVyLnZhcnMuYW5pbWF0aW9uID09PSBcInNsaWRlXCIpIHsgc2xpZGVyLnZhcnMuYW5pbWF0aW9uID0gXCJzd2luZ1wiOyB9XG4gICAgICAgIHNsaWRlci5wcm9wID0gKHZlcnRpY2FsKSA/IFwidG9wXCIgOiAoIHNsaWRlci52YXJzLnJ0bCA/IFwibWFyZ2luUmlnaHRcIiA6IFwibWFyZ2luTGVmdFwiICk7XG4gICAgICAgIHNsaWRlci5hcmdzID0ge307XG4gICAgICAgIC8vIFNMSURFU0hPVzpcbiAgICAgICAgc2xpZGVyLm1hbnVhbFBhdXNlID0gZmFsc2U7XG4gICAgICAgIHNsaWRlci5zdG9wcGVkID0gZmFsc2U7XG4gICAgICAgIC8vUEFVU0UgV0hFTiBJTlZJU0lCTEVcbiAgICAgICAgc2xpZGVyLnN0YXJ0ZWQgPSBmYWxzZTtcbiAgICAgICAgc2xpZGVyLnN0YXJ0VGltZW91dCA9IG51bGw7XG4gICAgICAgIC8vIFRPVUNIL1VTRUNTUzpcbiAgICAgICAgc2xpZGVyLnRyYW5zaXRpb25zID0gIXNsaWRlci52YXJzLnZpZGVvICYmICFmYWRlICYmIHNsaWRlci52YXJzLnVzZUNTUyAmJiAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIG9iaiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuICAgICAgICAgICAgICBwcm9wcyA9IFsncGVyc3BlY3RpdmVQcm9wZXJ0eScsICdXZWJraXRQZXJzcGVjdGl2ZScsICdNb3pQZXJzcGVjdGl2ZScsICdPUGVyc3BlY3RpdmUnLCAnbXNQZXJzcGVjdGl2ZSddO1xuICAgICAgICAgIGZvciAodmFyIGkgaW4gcHJvcHMpIHtcbiAgICAgICAgICAgIGlmICggb2JqLnN0eWxlWyBwcm9wc1tpXSBdICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgIHNsaWRlci5wZnggPSBwcm9wc1tpXS5yZXBsYWNlKCdQZXJzcGVjdGl2ZScsJycpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgICAgIHNsaWRlci5wcm9wID0gXCItXCIgKyBzbGlkZXIucGZ4ICsgXCItdHJhbnNmb3JtXCI7XG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH0oKSk7XG4gICAgICAgIHNsaWRlci5pc0ZpcmVmb3ggPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignZmlyZWZveCcpID4gLTE7XG4gICAgICAgIHNsaWRlci5lbnN1cmVBbmltYXRpb25FbmQgPSAnJztcbiAgICAgICAgLy8gQ09OVFJPTFNDT05UQUlORVI6XG4gICAgICAgIGlmIChzbGlkZXIudmFycy5jb250cm9sc0NvbnRhaW5lciAhPT0gXCJcIikgc2xpZGVyLmNvbnRyb2xzQ29udGFpbmVyID0gJChzbGlkZXIudmFycy5jb250cm9sc0NvbnRhaW5lcikubGVuZ3RoID4gMCAmJiAkKHNsaWRlci52YXJzLmNvbnRyb2xzQ29udGFpbmVyKTtcbiAgICAgICAgLy8gTUFOVUFMOlxuICAgICAgICBpZiAoc2xpZGVyLnZhcnMubWFudWFsQ29udHJvbHMgIT09IFwiXCIpIHNsaWRlci5tYW51YWxDb250cm9scyA9ICQoc2xpZGVyLnZhcnMubWFudWFsQ29udHJvbHMpLmxlbmd0aCA+IDAgJiYgJChzbGlkZXIudmFycy5tYW51YWxDb250cm9scyk7XG5cbiAgICAgICAgLy8gQ1VTVE9NIERJUkVDVElPTiBOQVY6XG4gICAgICAgIGlmIChzbGlkZXIudmFycy5jdXN0b21EaXJlY3Rpb25OYXYgIT09IFwiXCIpIHNsaWRlci5jdXN0b21EaXJlY3Rpb25OYXYgPSAkKHNsaWRlci52YXJzLmN1c3RvbURpcmVjdGlvbk5hdikubGVuZ3RoID09PSAyICYmICQoc2xpZGVyLnZhcnMuY3VzdG9tRGlyZWN0aW9uTmF2KTtcblxuICAgICAgICAvLyBSQU5ET01JWkU6XG4gICAgICAgIGlmIChzbGlkZXIudmFycy5yYW5kb21pemUpIHtcbiAgICAgICAgICBzbGlkZXIuc2xpZGVzLnNvcnQoZnVuY3Rpb24oKSB7IHJldHVybiAoTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKS0wLjUpOyB9KTtcbiAgICAgICAgICBzbGlkZXIuY29udGFpbmVyLmVtcHR5KCkuYXBwZW5kKHNsaWRlci5zbGlkZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2xpZGVyLmRvTWF0aCgpO1xuXG4gICAgICAgIC8vIElOSVRcbiAgICAgICAgc2xpZGVyLnNldHVwKFwiaW5pdFwiKTtcblxuICAgICAgICAvLyBDT05UUk9MTkFWOlxuICAgICAgICBpZiAoc2xpZGVyLnZhcnMuY29udHJvbE5hdikgeyBtZXRob2RzLmNvbnRyb2xOYXYuc2V0dXAoKTsgfVxuXG4gICAgICAgIC8vIERJUkVDVElPTk5BVjpcbiAgICAgICAgaWYgKHNsaWRlci52YXJzLmRpcmVjdGlvbk5hdikgeyBtZXRob2RzLmRpcmVjdGlvbk5hdi5zZXR1cCgpOyB9XG5cbiAgICAgICAgLy8gS0VZQk9BUkQ6XG4gICAgICAgIGlmIChzbGlkZXIudmFycy5rZXlib2FyZCAmJiAoJChzbGlkZXIuY29udGFpbmVyU2VsZWN0b3IpLmxlbmd0aCA9PT0gMSB8fCBzbGlkZXIudmFycy5tdWx0aXBsZUtleWJvYXJkKSkge1xuICAgICAgICAgICQoZG9jdW1lbnQpLmJpbmQoJ2tleXVwJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBrZXljb2RlID0gZXZlbnQua2V5Q29kZTtcbiAgICAgICAgICAgIGlmICghc2xpZGVyLmFuaW1hdGluZyAmJiAoa2V5Y29kZSA9PT0gMzkgfHwga2V5Y29kZSA9PT0gMzcpKSB7XG4gICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAoc2xpZGVyLnZhcnMucnRsP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKGtleWNvZGUgPT09IDM3KSA/IHNsaWRlci5nZXRUYXJnZXQoJ25leHQnKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChrZXljb2RlID09PSAzOSkgPyBzbGlkZXIuZ2V0VGFyZ2V0KCdwcmV2JykgOiBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKGtleWNvZGUgPT09IDM5KSA/IHNsaWRlci5nZXRUYXJnZXQoJ25leHQnKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChrZXljb2RlID09PSAzNykgPyBzbGlkZXIuZ2V0VGFyZ2V0KCdwcmV2JykgOiBmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA7XG4gICAgICAgICAgICAgIHNsaWRlci5mbGV4QW5pbWF0ZSh0YXJnZXQsIHNsaWRlci52YXJzLnBhdXNlT25BY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIE1PVVNFV0hFRUw6XG4gICAgICAgIGlmIChzbGlkZXIudmFycy5tb3VzZXdoZWVsKSB7XG4gICAgICAgICAgc2xpZGVyLmJpbmQoJ21vdXNld2hlZWwnLCBmdW5jdGlvbihldmVudCwgZGVsdGEsIGRlbHRhWCwgZGVsdGFZKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIHRhcmdldCA9IChkZWx0YSA8IDApID8gc2xpZGVyLmdldFRhcmdldCgnbmV4dCcpIDogc2xpZGVyLmdldFRhcmdldCgncHJldicpO1xuICAgICAgICAgICAgc2xpZGVyLmZsZXhBbmltYXRlKHRhcmdldCwgc2xpZGVyLnZhcnMucGF1c2VPbkFjdGlvbik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBQQVVTRVBMQVlcbiAgICAgICAgaWYgKHNsaWRlci52YXJzLnBhdXNlUGxheSkgeyBtZXRob2RzLnBhdXNlUGxheS5zZXR1cCgpOyB9XG5cbiAgICAgICAgLy9QQVVTRSBXSEVOIElOVklTSUJMRVxuICAgICAgICBpZiAoc2xpZGVyLnZhcnMuc2xpZGVzaG93ICYmIHNsaWRlci52YXJzLnBhdXNlSW52aXNpYmxlKSB7IG1ldGhvZHMucGF1c2VJbnZpc2libGUuaW5pdCgpOyB9XG5cbiAgICAgICAgLy8gU0xJRFNFU0hPV1xuICAgICAgICBpZiAoc2xpZGVyLnZhcnMuc2xpZGVzaG93KSB7XG4gICAgICAgICAgaWYgKHNsaWRlci52YXJzLnBhdXNlT25Ib3Zlcikge1xuICAgICAgICAgICAgc2xpZGVyLmhvdmVyKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBpZiAoIXNsaWRlci5tYW51YWxQbGF5ICYmICFzbGlkZXIubWFudWFsUGF1c2UpIHsgc2xpZGVyLnBhdXNlKCk7IH1cbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBpZiAoIXNsaWRlci5tYW51YWxQYXVzZSAmJiAhc2xpZGVyLm1hbnVhbFBsYXkgJiYgIXNsaWRlci5zdG9wcGVkKSB7IHNsaWRlci5wbGF5KCk7IH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBpbml0aWFsaXplIGFuaW1hdGlvblxuICAgICAgICAgIC8vSWYgd2UncmUgdmlzaWJsZSwgb3Igd2UgZG9uJ3QgdXNlIFBhZ2VWaXNpYmlsaXR5IEFQSVxuICAgICAgICAgIGlmKCFzbGlkZXIudmFycy5wYXVzZUludmlzaWJsZSB8fCAhbWV0aG9kcy5wYXVzZUludmlzaWJsZS5pc0hpZGRlbigpKSB7XG4gICAgICAgICAgICAoc2xpZGVyLnZhcnMuaW5pdERlbGF5ID4gMCkgPyBzbGlkZXIuc3RhcnRUaW1lb3V0ID0gc2V0VGltZW91dChzbGlkZXIucGxheSwgc2xpZGVyLnZhcnMuaW5pdERlbGF5KSA6IHNsaWRlci5wbGF5KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQVNOQVY6XG4gICAgICAgIGlmIChhc05hdikgeyBtZXRob2RzLmFzTmF2LnNldHVwKCk7IH1cblxuICAgICAgICAvLyBUT1VDSFxuICAgICAgICBpZiAodG91Y2ggJiYgc2xpZGVyLnZhcnMudG91Y2gpIHsgbWV0aG9kcy50b3VjaCgpOyB9XG5cbiAgICAgICAgLy8gRkFERSYmU01PT1RISEVJR0hUIHx8IFNMSURFOlxuICAgICAgICBpZiAoIWZhZGUgfHwgKGZhZGUgJiYgc2xpZGVyLnZhcnMuc21vb3RoSGVpZ2h0KSkgeyAkKHdpbmRvdykuYmluZChcInJlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZSBmb2N1c1wiLCBtZXRob2RzLnJlc2l6ZSk7IH1cblxuICAgICAgICBzbGlkZXIuZmluZChcImltZ1wiKS5hdHRyKFwiZHJhZ2dhYmxlXCIsIFwiZmFsc2VcIik7XG5cbiAgICAgICAgLy8gQVBJOiBzdGFydCgpIENhbGxiYWNrXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICBzbGlkZXIudmFycy5zdGFydChzbGlkZXIpO1xuICAgICAgICB9LCAyMDApO1xuICAgICAgfSxcbiAgICAgIGFzTmF2OiB7XG4gICAgICAgIHNldHVwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzbGlkZXIuYXNOYXYgPSB0cnVlO1xuICAgICAgICAgIHNsaWRlci5hbmltYXRpbmdUbyA9IE1hdGguZmxvb3Ioc2xpZGVyLmN1cnJlbnRTbGlkZS9zbGlkZXIubW92ZSk7XG4gICAgICAgICAgc2xpZGVyLmN1cnJlbnRJdGVtID0gc2xpZGVyLmN1cnJlbnRTbGlkZTtcbiAgICAgICAgICBzbGlkZXIuc2xpZGVzLnJlbW92ZUNsYXNzKG5hbWVzcGFjZSArIFwiYWN0aXZlLXNsaWRlXCIpLmVxKHNsaWRlci5jdXJyZW50SXRlbSkuYWRkQ2xhc3MobmFtZXNwYWNlICsgXCJhY3RpdmUtc2xpZGVcIik7XG4gICAgICAgICAgaWYoIW1zR2VzdHVyZSl7XG4gICAgICAgICAgICAgIHNsaWRlci5zbGlkZXMub24oZXZlbnRUeXBlLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyICRzbGlkZSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9ICRzbGlkZS5pbmRleCgpO1xuICAgICAgICAgICAgICAgIHZhciBwb3NGcm9tWDtcbiAgICAgICAgICAgICAgICBpZihzbGlkZXIudmFycy5ydGwpe1xuICAgICAgICAgICAgICAgICAgcG9zRnJvbVggPSAtMSooJHNsaWRlLm9mZnNldCgpLnJpZ2h0IC0gJChzbGlkZXIpLnNjcm9sbExlZnQoKSk7IC8vIEZpbmQgcG9zaXRpb24gb2Ygc2xpZGUgcmVsYXRpdmUgdG8gcmlnaHQgb2Ygc2xpZGVyIGNvbnRhaW5lclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgcG9zRnJvbVggPSAkc2xpZGUub2Zmc2V0KCkubGVmdCAtICQoc2xpZGVyKS5zY3JvbGxMZWZ0KCk7IC8vIEZpbmQgcG9zaXRpb24gb2Ygc2xpZGUgcmVsYXRpdmUgdG8gbGVmdCBvZiBzbGlkZXIgY29udGFpbmVyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKCBwb3NGcm9tWCA8PSAwICYmICRzbGlkZS5oYXNDbGFzcyggbmFtZXNwYWNlICsgJ2FjdGl2ZS1zbGlkZScgKSApIHtcbiAgICAgICAgICAgICAgICAgIHNsaWRlci5mbGV4QW5pbWF0ZShzbGlkZXIuZ2V0VGFyZ2V0KFwicHJldlwiKSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICghJChzbGlkZXIudmFycy5hc05hdkZvcikuZGF0YSgnZmxleHNsaWRlcicpLmFuaW1hdGluZyAmJiAhJHNsaWRlLmhhc0NsYXNzKG5hbWVzcGFjZSArIFwiYWN0aXZlLXNsaWRlXCIpKSB7XG4gICAgICAgICAgICAgICAgICBzbGlkZXIuZGlyZWN0aW9uID0gKHNsaWRlci5jdXJyZW50SXRlbSA8IHRhcmdldCkgPyBcIm5leHRcIiA6IFwicHJldlwiO1xuICAgICAgICAgICAgICAgICAgc2xpZGVyLmZsZXhBbmltYXRlKHRhcmdldCwgc2xpZGVyLnZhcnMucGF1c2VPbkFjdGlvbiwgZmFsc2UsIHRydWUsIHRydWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIGVsLl9zbGlkZXIgPSBzbGlkZXI7XG4gICAgICAgICAgICAgIHNsaWRlci5zbGlkZXMuZWFjaChmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgICAgICAgIHRoYXQuX2dlc3R1cmUgPSBuZXcgTVNHZXN0dXJlKCk7XG4gICAgICAgICAgICAgICAgICB0aGF0Ll9nZXN0dXJlLnRhcmdldCA9IHRoYXQ7XG4gICAgICAgICAgICAgICAgICB0aGF0LmFkZEV2ZW50TGlzdGVuZXIoXCJNU1BvaW50ZXJEb3duXCIsIGZ1bmN0aW9uIChlKXtcbiAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgaWYoZS5jdXJyZW50VGFyZ2V0Ll9nZXN0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLmN1cnJlbnRUYXJnZXQuX2dlc3R1cmUuYWRkUG9pbnRlcihlLnBvaW50ZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgdGhhdC5hZGRFdmVudExpc3RlbmVyKFwiTVNHZXN0dXJlVGFwXCIsIGZ1bmN0aW9uIChlKXtcbiAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyICRzbGlkZSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCA9ICRzbGlkZS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgIGlmICghJChzbGlkZXIudmFycy5hc05hdkZvcikuZGF0YSgnZmxleHNsaWRlcicpLmFuaW1hdGluZyAmJiAhJHNsaWRlLmhhc0NsYXNzKCdhY3RpdmUnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXIuZGlyZWN0aW9uID0gKHNsaWRlci5jdXJyZW50SXRlbSA8IHRhcmdldCkgPyBcIm5leHRcIiA6IFwicHJldlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXIuZmxleEFuaW1hdGUodGFyZ2V0LCBzbGlkZXIudmFycy5wYXVzZU9uQWN0aW9uLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNvbnRyb2xOYXY6IHtcbiAgICAgICAgc2V0dXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICghc2xpZGVyLm1hbnVhbENvbnRyb2xzKSB7XG4gICAgICAgICAgICBtZXRob2RzLmNvbnRyb2xOYXYuc2V0dXBQYWdpbmcoKTtcbiAgICAgICAgICB9IGVsc2UgeyAvLyBNQU5VQUxDT05UUk9MUzpcbiAgICAgICAgICAgIG1ldGhvZHMuY29udHJvbE5hdi5zZXR1cE1hbnVhbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgc2V0dXBQYWdpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB0eXBlID0gKHNsaWRlci52YXJzLmNvbnRyb2xOYXYgPT09IFwidGh1bWJuYWlsc1wiKSA/ICdjb250cm9sLXRodW1icycgOiAnY29udHJvbC1wYWdpbmcnLFxuICAgICAgICAgICAgICBqID0gMSxcbiAgICAgICAgICAgICAgaXRlbSxcbiAgICAgICAgICAgICAgc2xpZGU7XG5cbiAgICAgICAgICBzbGlkZXIuY29udHJvbE5hdlNjYWZmb2xkID0gJCgnPG9sIGNsYXNzPVwiJysgbmFtZXNwYWNlICsgJ2NvbnRyb2wtbmF2ICcgKyBuYW1lc3BhY2UgKyB0eXBlICsgJ1wiPjwvb2w+Jyk7XG5cbiAgICAgICAgICBpZiAoc2xpZGVyLnBhZ2luZ0NvdW50ID4gMSkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGlkZXIucGFnaW5nQ291bnQ7IGkrKykge1xuICAgICAgICAgICAgICBzbGlkZSA9IHNsaWRlci5zbGlkZXMuZXEoaSk7XG5cbiAgICAgICAgICAgICAgaWYgKCB1bmRlZmluZWQgPT09IHNsaWRlLmF0dHIoICdkYXRhLXRodW1iLWFsdCcgKSApIHsgXG4gICAgICAgICAgICAgICAgc2xpZGUuYXR0ciggJ2RhdGEtdGh1bWItYWx0JywgJycgKTsgXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgIGl0ZW0gPSAkKCAnPGE+PC9hPicgKS5hdHRyKCAnaHJlZicsICcjJyApLnRleHQoIGogKTtcbiAgICAgICAgICAgICAgaWYgKCBzbGlkZXIudmFycy5jb250cm9sTmF2ID09PSBcInRodW1ibmFpbHNcIiApIHtcbiAgICAgICAgICAgICAgICBpdGVtID0gJCggJzxpbWcvPicgKS5hdHRyKCAnc3JjJywgc2xpZGUuYXR0ciggJ2RhdGEtdGh1bWInICkgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgaWYgKCAnJyAhPT0gc2xpZGUuYXR0ciggJ2RhdGEtdGh1bWItYWx0JyApICkge1xuICAgICAgICAgICAgICAgIGl0ZW0uYXR0ciggJ2FsdCcsIHNsaWRlLmF0dHIoICdkYXRhLXRodW1iLWFsdCcgKSApO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKCAndGh1bWJuYWlscycgPT09IHNsaWRlci52YXJzLmNvbnRyb2xOYXYgJiYgdHJ1ZSA9PT0gc2xpZGVyLnZhcnMudGh1bWJDYXB0aW9ucyApIHtcbiAgICAgICAgICAgICAgICB2YXIgY2FwdG4gPSBzbGlkZS5hdHRyKCAnZGF0YS10aHVtYmNhcHRpb24nICk7XG4gICAgICAgICAgICAgICAgaWYgKCAnJyAhPT0gY2FwdG4gJiYgdW5kZWZpbmVkICE9PSBjYXB0biApIHsgXG4gICAgICAgICAgICAgICAgICB2YXIgY2FwdGlvbiA9ICQoJzxzcGFuPjwvc3Bhbj4nICkuYWRkQ2xhc3MoIG5hbWVzcGFjZSArICdjYXB0aW9uJyApLnRleHQoIGNhcHRuICk7XG4gICAgICAgICAgICAgICAgICBpdGVtLmFwcGVuZCggY2FwdGlvbiApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgdmFyIGxpRWxlbWVudCA9ICQoICc8bGk+JyApO1xuICAgICAgICAgICAgICBpdGVtLmFwcGVuZFRvKCBsaUVsZW1lbnQgKTtcbiAgICAgICAgICAgICAgbGlFbGVtZW50LmFwcGVuZCggJzwvbGk+JyApO1xuXG4gICAgICAgICAgICAgIHNsaWRlci5jb250cm9sTmF2U2NhZmZvbGQuYXBwZW5kKGxpRWxlbWVudCk7XG4gICAgICAgICAgICAgIGorKztcblxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIENPTlRST0xTQ09OVEFJTkVSOlxuICAgICAgICAgIChzbGlkZXIuY29udHJvbHNDb250YWluZXIpID8gJChzbGlkZXIuY29udHJvbHNDb250YWluZXIpLmFwcGVuZChzbGlkZXIuY29udHJvbE5hdlNjYWZmb2xkKSA6IHNsaWRlci5hcHBlbmQoc2xpZGVyLmNvbnRyb2xOYXZTY2FmZm9sZCk7XG4gICAgICAgICAgbWV0aG9kcy5jb250cm9sTmF2LnNldCgpO1xuXG4gICAgICAgICAgbWV0aG9kcy5jb250cm9sTmF2LmFjdGl2ZSgpO1xuXG4gICAgICAgICAgc2xpZGVyLmNvbnRyb2xOYXZTY2FmZm9sZC5kZWxlZ2F0ZSgnYSwgaW1nJywgZXZlbnRUeXBlLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKHdhdGNoZWRFdmVudCA9PT0gXCJcIiB8fCB3YXRjaGVkRXZlbnQgPT09IGV2ZW50LnR5cGUpIHtcbiAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgIHRhcmdldCA9IHNsaWRlci5jb250cm9sTmF2LmluZGV4KCR0aGlzKTtcblxuICAgICAgICAgICAgICBpZiAoISR0aGlzLmhhc0NsYXNzKG5hbWVzcGFjZSArICdhY3RpdmUnKSkge1xuICAgICAgICAgICAgICAgIHNsaWRlci5kaXJlY3Rpb24gPSAodGFyZ2V0ID4gc2xpZGVyLmN1cnJlbnRTbGlkZSkgPyBcIm5leHRcIiA6IFwicHJldlwiO1xuICAgICAgICAgICAgICAgIHNsaWRlci5mbGV4QW5pbWF0ZSh0YXJnZXQsIHNsaWRlci52YXJzLnBhdXNlT25BY3Rpb24pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNldHVwIGZsYWdzIHRvIHByZXZlbnQgZXZlbnQgZHVwbGljYXRpb25cbiAgICAgICAgICAgIGlmICh3YXRjaGVkRXZlbnQgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgd2F0Y2hlZEV2ZW50ID0gZXZlbnQudHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1ldGhvZHMuc2V0VG9DbGVhcldhdGNoZWRFdmVudCgpO1xuXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldHVwTWFudWFsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzbGlkZXIuY29udHJvbE5hdiA9IHNsaWRlci5tYW51YWxDb250cm9scztcbiAgICAgICAgICBtZXRob2RzLmNvbnRyb2xOYXYuYWN0aXZlKCk7XG5cbiAgICAgICAgICBzbGlkZXIuY29udHJvbE5hdi5iaW5kKGV2ZW50VHlwZSwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmICh3YXRjaGVkRXZlbnQgPT09IFwiXCIgfHwgd2F0Y2hlZEV2ZW50ID09PSBldmVudC50eXBlKSB7XG4gICAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICB0YXJnZXQgPSBzbGlkZXIuY29udHJvbE5hdi5pbmRleCgkdGhpcyk7XG5cbiAgICAgICAgICAgICAgaWYgKCEkdGhpcy5oYXNDbGFzcyhuYW1lc3BhY2UgKyAnYWN0aXZlJykpIHtcbiAgICAgICAgICAgICAgICAodGFyZ2V0ID4gc2xpZGVyLmN1cnJlbnRTbGlkZSkgPyBzbGlkZXIuZGlyZWN0aW9uID0gXCJuZXh0XCIgOiBzbGlkZXIuZGlyZWN0aW9uID0gXCJwcmV2XCI7XG4gICAgICAgICAgICAgICAgc2xpZGVyLmZsZXhBbmltYXRlKHRhcmdldCwgc2xpZGVyLnZhcnMucGF1c2VPbkFjdGlvbik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2V0dXAgZmxhZ3MgdG8gcHJldmVudCBldmVudCBkdXBsaWNhdGlvblxuICAgICAgICAgICAgaWYgKHdhdGNoZWRFdmVudCA9PT0gXCJcIikge1xuICAgICAgICAgICAgICB3YXRjaGVkRXZlbnQgPSBldmVudC50eXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWV0aG9kcy5zZXRUb0NsZWFyV2F0Y2hlZEV2ZW50KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHNlbGVjdG9yID0gKHNsaWRlci52YXJzLmNvbnRyb2xOYXYgPT09IFwidGh1bWJuYWlsc1wiKSA/ICdpbWcnIDogJ2EnO1xuICAgICAgICAgIHNsaWRlci5jb250cm9sTmF2ID0gJCgnLicgKyBuYW1lc3BhY2UgKyAnY29udHJvbC1uYXYgbGkgJyArIHNlbGVjdG9yLCAoc2xpZGVyLmNvbnRyb2xzQ29udGFpbmVyKSA/IHNsaWRlci5jb250cm9sc0NvbnRhaW5lciA6IHNsaWRlcik7XG4gICAgICAgIH0sXG4gICAgICAgIGFjdGl2ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc2xpZGVyLmNvbnRyb2xOYXYucmVtb3ZlQ2xhc3MobmFtZXNwYWNlICsgXCJhY3RpdmVcIikuZXEoc2xpZGVyLmFuaW1hdGluZ1RvKS5hZGRDbGFzcyhuYW1lc3BhY2UgKyBcImFjdGl2ZVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbihhY3Rpb24sIHBvcykge1xuICAgICAgICAgIGlmIChzbGlkZXIucGFnaW5nQ291bnQgPiAxICYmIGFjdGlvbiA9PT0gXCJhZGRcIikge1xuICAgICAgICAgICAgc2xpZGVyLmNvbnRyb2xOYXZTY2FmZm9sZC5hcHBlbmQoJCgnPGxpPjxhIGhyZWY9XCIjXCI+JyArIHNsaWRlci5jb3VudCArICc8L2E+PC9saT4nKSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChzbGlkZXIucGFnaW5nQ291bnQgPT09IDEpIHtcbiAgICAgICAgICAgIHNsaWRlci5jb250cm9sTmF2U2NhZmZvbGQuZmluZCgnbGknKS5yZW1vdmUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2xpZGVyLmNvbnRyb2xOYXYuZXEocG9zKS5jbG9zZXN0KCdsaScpLnJlbW92ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtZXRob2RzLmNvbnRyb2xOYXYuc2V0KCk7XG4gICAgICAgICAgKHNsaWRlci5wYWdpbmdDb3VudCA+IDEgJiYgc2xpZGVyLnBhZ2luZ0NvdW50ICE9PSBzbGlkZXIuY29udHJvbE5hdi5sZW5ndGgpID8gc2xpZGVyLnVwZGF0ZShwb3MsIGFjdGlvbikgOiBtZXRob2RzLmNvbnRyb2xOYXYuYWN0aXZlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkaXJlY3Rpb25OYXY6IHtcbiAgICAgICAgc2V0dXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBkaXJlY3Rpb25OYXZTY2FmZm9sZCA9ICQoJzx1bCBjbGFzcz1cIicgKyBuYW1lc3BhY2UgKyAnZGlyZWN0aW9uLW5hdlwiPjxsaSBjbGFzcz1cIicgKyBuYW1lc3BhY2UgKyAnbmF2LXByZXZcIj48YSBjbGFzcz1cIicgKyBuYW1lc3BhY2UgKyAncHJldlwiIGhyZWY9XCIjXCI+JyArIHNsaWRlci52YXJzLnByZXZUZXh0ICsgJzwvYT48L2xpPjxsaSBjbGFzcz1cIicgKyBuYW1lc3BhY2UgKyAnbmF2LW5leHRcIj48YSBjbGFzcz1cIicgKyBuYW1lc3BhY2UgKyAnbmV4dFwiIGhyZWY9XCIjXCI+JyArIHNsaWRlci52YXJzLm5leHRUZXh0ICsgJzwvYT48L2xpPjwvdWw+Jyk7XG5cbiAgICAgICAgICAvLyBDVVNUT00gRElSRUNUSU9OIE5BVjpcbiAgICAgICAgICBpZiAoc2xpZGVyLmN1c3RvbURpcmVjdGlvbk5hdikge1xuICAgICAgICAgICAgc2xpZGVyLmRpcmVjdGlvbk5hdiA9IHNsaWRlci5jdXN0b21EaXJlY3Rpb25OYXY7XG4gICAgICAgICAgLy8gQ09OVFJPTFNDT05UQUlORVI6XG4gICAgICAgICAgfSBlbHNlIGlmIChzbGlkZXIuY29udHJvbHNDb250YWluZXIpIHtcbiAgICAgICAgICAgICQoc2xpZGVyLmNvbnRyb2xzQ29udGFpbmVyKS5hcHBlbmQoZGlyZWN0aW9uTmF2U2NhZmZvbGQpO1xuICAgICAgICAgICAgc2xpZGVyLmRpcmVjdGlvbk5hdiA9ICQoJy4nICsgbmFtZXNwYWNlICsgJ2RpcmVjdGlvbi1uYXYgbGkgYScsIHNsaWRlci5jb250cm9sc0NvbnRhaW5lcik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWRlci5hcHBlbmQoZGlyZWN0aW9uTmF2U2NhZmZvbGQpO1xuICAgICAgICAgICAgc2xpZGVyLmRpcmVjdGlvbk5hdiA9ICQoJy4nICsgbmFtZXNwYWNlICsgJ2RpcmVjdGlvbi1uYXYgbGkgYScsIHNsaWRlcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbWV0aG9kcy5kaXJlY3Rpb25OYXYudXBkYXRlKCk7XG5cbiAgICAgICAgICBzbGlkZXIuZGlyZWN0aW9uTmF2LmJpbmQoZXZlbnRUeXBlLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHZhciB0YXJnZXQ7XG5cbiAgICAgICAgICAgIGlmICh3YXRjaGVkRXZlbnQgPT09IFwiXCIgfHwgd2F0Y2hlZEV2ZW50ID09PSBldmVudC50eXBlKSB7XG4gICAgICAgICAgICAgIHRhcmdldCA9ICgkKHRoaXMpLmhhc0NsYXNzKG5hbWVzcGFjZSArICduZXh0JykpID8gc2xpZGVyLmdldFRhcmdldCgnbmV4dCcpIDogc2xpZGVyLmdldFRhcmdldCgncHJldicpO1xuICAgICAgICAgICAgICBzbGlkZXIuZmxleEFuaW1hdGUodGFyZ2V0LCBzbGlkZXIudmFycy5wYXVzZU9uQWN0aW9uKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2V0dXAgZmxhZ3MgdG8gcHJldmVudCBldmVudCBkdXBsaWNhdGlvblxuICAgICAgICAgICAgaWYgKHdhdGNoZWRFdmVudCA9PT0gXCJcIikge1xuICAgICAgICAgICAgICB3YXRjaGVkRXZlbnQgPSBldmVudC50eXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWV0aG9kcy5zZXRUb0NsZWFyV2F0Y2hlZEV2ZW50KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGRpc2FibGVkQ2xhc3MgPSBuYW1lc3BhY2UgKyAnZGlzYWJsZWQnO1xuICAgICAgICAgIGlmIChzbGlkZXIucGFnaW5nQ291bnQgPT09IDEpIHtcbiAgICAgICAgICAgIHNsaWRlci5kaXJlY3Rpb25OYXYuYWRkQ2xhc3MoZGlzYWJsZWRDbGFzcykuYXR0cigndGFiaW5kZXgnLCAnLTEnKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKCFzbGlkZXIudmFycy5hbmltYXRpb25Mb29wKSB7XG4gICAgICAgICAgICBpZiAoc2xpZGVyLmFuaW1hdGluZ1RvID09PSAwKSB7XG4gICAgICAgICAgICAgIHNsaWRlci5kaXJlY3Rpb25OYXYucmVtb3ZlQ2xhc3MoZGlzYWJsZWRDbGFzcykuZmlsdGVyKCcuJyArIG5hbWVzcGFjZSArIFwicHJldlwiKS5hZGRDbGFzcyhkaXNhYmxlZENsYXNzKS5hdHRyKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzbGlkZXIuYW5pbWF0aW5nVG8gPT09IHNsaWRlci5sYXN0KSB7XG4gICAgICAgICAgICAgIHNsaWRlci5kaXJlY3Rpb25OYXYucmVtb3ZlQ2xhc3MoZGlzYWJsZWRDbGFzcykuZmlsdGVyKCcuJyArIG5hbWVzcGFjZSArIFwibmV4dFwiKS5hZGRDbGFzcyhkaXNhYmxlZENsYXNzKS5hdHRyKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2xpZGVyLmRpcmVjdGlvbk5hdi5yZW1vdmVDbGFzcyhkaXNhYmxlZENsYXNzKS5yZW1vdmVBdHRyKCd0YWJpbmRleCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzbGlkZXIuZGlyZWN0aW9uTmF2LnJlbW92ZUNsYXNzKGRpc2FibGVkQ2xhc3MpLnJlbW92ZUF0dHIoJ3RhYmluZGV4Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcGF1c2VQbGF5OiB7XG4gICAgICAgIHNldHVwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgcGF1c2VQbGF5U2NhZmZvbGQgPSAkKCc8ZGl2IGNsYXNzPVwiJyArIG5hbWVzcGFjZSArICdwYXVzZXBsYXlcIj48YSBocmVmPVwiI1wiPjwvYT48L2Rpdj4nKTtcblxuICAgICAgICAgIC8vIENPTlRST0xTQ09OVEFJTkVSOlxuICAgICAgICAgIGlmIChzbGlkZXIuY29udHJvbHNDb250YWluZXIpIHtcbiAgICAgICAgICAgIHNsaWRlci5jb250cm9sc0NvbnRhaW5lci5hcHBlbmQocGF1c2VQbGF5U2NhZmZvbGQpO1xuICAgICAgICAgICAgc2xpZGVyLnBhdXNlUGxheSA9ICQoJy4nICsgbmFtZXNwYWNlICsgJ3BhdXNlcGxheSBhJywgc2xpZGVyLmNvbnRyb2xzQ29udGFpbmVyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2xpZGVyLmFwcGVuZChwYXVzZVBsYXlTY2FmZm9sZCk7XG4gICAgICAgICAgICBzbGlkZXIucGF1c2VQbGF5ID0gJCgnLicgKyBuYW1lc3BhY2UgKyAncGF1c2VwbGF5IGEnLCBzbGlkZXIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG1ldGhvZHMucGF1c2VQbGF5LnVwZGF0ZSgoc2xpZGVyLnZhcnMuc2xpZGVzaG93KSA/IG5hbWVzcGFjZSArICdwYXVzZScgOiBuYW1lc3BhY2UgKyAncGxheScpO1xuXG4gICAgICAgICAgc2xpZGVyLnBhdXNlUGxheS5iaW5kKGV2ZW50VHlwZSwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmICh3YXRjaGVkRXZlbnQgPT09IFwiXCIgfHwgd2F0Y2hlZEV2ZW50ID09PSBldmVudC50eXBlKSB7XG4gICAgICAgICAgICAgIGlmICgkKHRoaXMpLmhhc0NsYXNzKG5hbWVzcGFjZSArICdwYXVzZScpKSB7XG4gICAgICAgICAgICAgICAgc2xpZGVyLm1hbnVhbFBhdXNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzbGlkZXIubWFudWFsUGxheSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHNsaWRlci5wYXVzZSgpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNsaWRlci5tYW51YWxQYXVzZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHNsaWRlci5tYW51YWxQbGF5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzbGlkZXIucGxheSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNldHVwIGZsYWdzIHRvIHByZXZlbnQgZXZlbnQgZHVwbGljYXRpb25cbiAgICAgICAgICAgIGlmICh3YXRjaGVkRXZlbnQgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgd2F0Y2hlZEV2ZW50ID0gZXZlbnQudHlwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1ldGhvZHMuc2V0VG9DbGVhcldhdGNoZWRFdmVudCgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICAgICAgKHN0YXRlID09PSBcInBsYXlcIikgPyBzbGlkZXIucGF1c2VQbGF5LnJlbW92ZUNsYXNzKG5hbWVzcGFjZSArICdwYXVzZScpLmFkZENsYXNzKG5hbWVzcGFjZSArICdwbGF5JykuaHRtbChzbGlkZXIudmFycy5wbGF5VGV4dCkgOiBzbGlkZXIucGF1c2VQbGF5LnJlbW92ZUNsYXNzKG5hbWVzcGFjZSArICdwbGF5JykuYWRkQ2xhc3MobmFtZXNwYWNlICsgJ3BhdXNlJykuaHRtbChzbGlkZXIudmFycy5wYXVzZVRleHQpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdG91Y2g6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc3RhcnRYLFxuICAgICAgICAgIHN0YXJ0WSxcbiAgICAgICAgICBvZmZzZXQsXG4gICAgICAgICAgY3dpZHRoLFxuICAgICAgICAgIGR4LFxuICAgICAgICAgIHN0YXJ0VCxcbiAgICAgICAgICBvblRvdWNoU3RhcnQsXG4gICAgICAgICAgb25Ub3VjaE1vdmUsXG4gICAgICAgICAgb25Ub3VjaEVuZCxcbiAgICAgICAgICBzY3JvbGxpbmcgPSBmYWxzZSxcbiAgICAgICAgICBsb2NhbFggPSAwLFxuICAgICAgICAgIGxvY2FsWSA9IDAsXG4gICAgICAgICAgYWNjRHggPSAwO1xuXG4gICAgICAgIGlmKCFtc0dlc3R1cmUpe1xuICAgICAgICAgICAgb25Ub3VjaFN0YXJ0ID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICBpZiAoc2xpZGVyLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICggKCB3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQgKSB8fCBlLnRvdWNoZXMubGVuZ3RoID09PSAxICkge1xuICAgICAgICAgICAgICAgIHNsaWRlci5wYXVzZSgpO1xuICAgICAgICAgICAgICAgIC8vIENBUk9VU0VMOlxuICAgICAgICAgICAgICAgIGN3aWR0aCA9ICh2ZXJ0aWNhbCkgPyBzbGlkZXIuaCA6IHNsaWRlci4gdztcbiAgICAgICAgICAgICAgICBzdGFydFQgPSBOdW1iZXIobmV3IERhdGUoKSk7XG4gICAgICAgICAgICAgICAgLy8gQ0FST1VTRUw6XG5cbiAgICAgICAgICAgICAgICAvLyBMb2NhbCB2YXJzIGZvciBYIGFuZCBZIHBvaW50cy5cbiAgICAgICAgICAgICAgICBsb2NhbFggPSBlLnRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICAgICAgICAgICAgbG9jYWxZID0gZS50b3VjaGVzWzBdLnBhZ2VZO1xuXG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gKGNhcm91c2VsICYmIHJldmVyc2UgJiYgc2xpZGVyLmFuaW1hdGluZ1RvID09PSBzbGlkZXIubGFzdCkgPyAwIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAoY2Fyb3VzZWwgJiYgcmV2ZXJzZSkgPyBzbGlkZXIubGltaXQgLSAoKChzbGlkZXIuaXRlbVcgKyBzbGlkZXIudmFycy5pdGVtTWFyZ2luKSAqIHNsaWRlci5tb3ZlKSAqIHNsaWRlci5hbmltYXRpbmdUbykgOlxuICAgICAgICAgICAgICAgICAgICAgICAgIChjYXJvdXNlbCAmJiBzbGlkZXIuY3VycmVudFNsaWRlID09PSBzbGlkZXIubGFzdCkgPyBzbGlkZXIubGltaXQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgIChjYXJvdXNlbCkgPyAoKHNsaWRlci5pdGVtVyArIHNsaWRlci52YXJzLml0ZW1NYXJnaW4pICogc2xpZGVyLm1vdmUpICogc2xpZGVyLmN1cnJlbnRTbGlkZSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgKHJldmVyc2UpID8gKHNsaWRlci5sYXN0IC0gc2xpZGVyLmN1cnJlbnRTbGlkZSArIHNsaWRlci5jbG9uZU9mZnNldCkgKiBjd2lkdGggOiAoc2xpZGVyLmN1cnJlbnRTbGlkZSArIHNsaWRlci5jbG9uZU9mZnNldCkgKiBjd2lkdGg7XG4gICAgICAgICAgICAgICAgc3RhcnRYID0gKHZlcnRpY2FsKSA/IGxvY2FsWSA6IGxvY2FsWDtcbiAgICAgICAgICAgICAgICBzdGFydFkgPSAodmVydGljYWwpID8gbG9jYWxYIDogbG9jYWxZO1xuICAgICAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uVG91Y2hNb3ZlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBvblRvdWNoRW5kLCBmYWxzZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIG9uVG91Y2hNb3ZlID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAvLyBMb2NhbCB2YXJzIGZvciBYIGFuZCBZIHBvaW50cy5cblxuICAgICAgICAgICAgICBsb2NhbFggPSBlLnRvdWNoZXNbMF0ucGFnZVg7XG4gICAgICAgICAgICAgIGxvY2FsWSA9IGUudG91Y2hlc1swXS5wYWdlWTtcblxuICAgICAgICAgICAgICBkeCA9ICh2ZXJ0aWNhbCkgPyBzdGFydFggLSBsb2NhbFkgOiAoc2xpZGVyLnZhcnMucnRsPy0xOjEpKihzdGFydFggLSBsb2NhbFgpO1xuICAgICAgICAgICAgICBzY3JvbGxpbmcgPSAodmVydGljYWwpID8gKE1hdGguYWJzKGR4KSA8IE1hdGguYWJzKGxvY2FsWCAtIHN0YXJ0WSkpIDogKE1hdGguYWJzKGR4KSA8IE1hdGguYWJzKGxvY2FsWSAtIHN0YXJ0WSkpO1xuICAgICAgICAgICAgICB2YXIgZnhtcyA9IDUwMDtcblxuICAgICAgICAgICAgICBpZiAoICEgc2Nyb2xsaW5nIHx8IE51bWJlciggbmV3IERhdGUoKSApIC0gc3RhcnRUID4gZnhtcyApIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgaWYgKCFmYWRlICYmIHNsaWRlci50cmFuc2l0aW9ucykge1xuICAgICAgICAgICAgICAgICAgaWYgKCFzbGlkZXIudmFycy5hbmltYXRpb25Mb29wKSB7XG4gICAgICAgICAgICAgICAgICAgIGR4ID0gZHgvKChzbGlkZXIuY3VycmVudFNsaWRlID09PSAwICYmIGR4IDwgMCB8fCBzbGlkZXIuY3VycmVudFNsaWRlID09PSBzbGlkZXIubGFzdCAmJiBkeCA+IDApID8gKE1hdGguYWJzKGR4KS9jd2lkdGgrMikgOiAxKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHNsaWRlci5zZXRQcm9wcyhvZmZzZXQgKyBkeCwgXCJzZXRUb3VjaFwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIG9uVG91Y2hFbmQgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIC8vIGZpbmlzaCB0aGUgdG91Y2ggYnkgdW5kb2luZyB0aGUgdG91Y2ggc2Vzc2lvblxuICAgICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSwgZmFsc2UpO1xuXG4gICAgICAgICAgICAgIGlmIChzbGlkZXIuYW5pbWF0aW5nVG8gPT09IHNsaWRlci5jdXJyZW50U2xpZGUgJiYgIXNjcm9sbGluZyAmJiAhKGR4ID09PSBudWxsKSkge1xuICAgICAgICAgICAgICAgIHZhciB1cGRhdGVEeCA9IChyZXZlcnNlKSA/IC1keCA6IGR4LFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSAodXBkYXRlRHggPiAwKSA/IHNsaWRlci5nZXRUYXJnZXQoJ25leHQnKSA6IHNsaWRlci5nZXRUYXJnZXQoJ3ByZXYnKTtcblxuICAgICAgICAgICAgICAgIGlmIChzbGlkZXIuY2FuQWR2YW5jZSh0YXJnZXQpICYmIChOdW1iZXIobmV3IERhdGUoKSkgLSBzdGFydFQgPCA1NTAgJiYgTWF0aC5hYnModXBkYXRlRHgpID4gNTAgfHwgTWF0aC5hYnModXBkYXRlRHgpID4gY3dpZHRoLzIpKSB7XG4gICAgICAgICAgICAgICAgICBzbGlkZXIuZmxleEFuaW1hdGUodGFyZ2V0LCBzbGlkZXIudmFycy5wYXVzZU9uQWN0aW9uKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgaWYgKCFmYWRlKSB7IHNsaWRlci5mbGV4QW5pbWF0ZShzbGlkZXIuY3VycmVudFNsaWRlLCBzbGlkZXIudmFycy5wYXVzZU9uQWN0aW9uLCB0cnVlKTsgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG9uVG91Y2hFbmQsIGZhbHNlKTtcblxuICAgICAgICAgICAgICBzdGFydFggPSBudWxsO1xuICAgICAgICAgICAgICBzdGFydFkgPSBudWxsO1xuICAgICAgICAgICAgICBkeCA9IG51bGw7XG4gICAgICAgICAgICAgIG9mZnNldCA9IG51bGw7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgb25Ub3VjaFN0YXJ0LCBmYWxzZSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgZWwuc3R5bGUubXNUb3VjaEFjdGlvbiA9IFwibm9uZVwiO1xuICAgICAgICAgICAgZWwuX2dlc3R1cmUgPSBuZXcgTVNHZXN0dXJlKCk7XG4gICAgICAgICAgICBlbC5fZ2VzdHVyZS50YXJnZXQgPSBlbDtcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJNU1BvaW50ZXJEb3duXCIsIG9uTVNQb2ludGVyRG93biwgZmFsc2UpO1xuICAgICAgICAgICAgZWwuX3NsaWRlciA9IHNsaWRlcjtcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJNU0dlc3R1cmVDaGFuZ2VcIiwgb25NU0dlc3R1cmVDaGFuZ2UsIGZhbHNlKTtcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoXCJNU0dlc3R1cmVFbmRcIiwgb25NU0dlc3R1cmVFbmQsIGZhbHNlKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gb25NU1BvaW50ZXJEb3duKGUpe1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHNsaWRlci5hbmltYXRpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICBzbGlkZXIucGF1c2UoKTtcbiAgICAgICAgICAgICAgICAgICAgZWwuX2dlc3R1cmUuYWRkUG9pbnRlcihlLnBvaW50ZXJJZCk7XG4gICAgICAgICAgICAgICAgICAgIGFjY0R4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgY3dpZHRoID0gKHZlcnRpY2FsKSA/IHNsaWRlci5oIDogc2xpZGVyLiB3O1xuICAgICAgICAgICAgICAgICAgICBzdGFydFQgPSBOdW1iZXIobmV3IERhdGUoKSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIENBUk9VU0VMOlxuXG4gICAgICAgICAgICAgICAgICAgIG9mZnNldCA9IChjYXJvdXNlbCAmJiByZXZlcnNlICYmIHNsaWRlci5hbmltYXRpbmdUbyA9PT0gc2xpZGVyLmxhc3QpID8gMCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAoY2Fyb3VzZWwgJiYgcmV2ZXJzZSkgPyBzbGlkZXIubGltaXQgLSAoKChzbGlkZXIuaXRlbVcgKyBzbGlkZXIudmFycy5pdGVtTWFyZ2luKSAqIHNsaWRlci5tb3ZlKSAqIHNsaWRlci5hbmltYXRpbmdUbykgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjYXJvdXNlbCAmJiBzbGlkZXIuY3VycmVudFNsaWRlID09PSBzbGlkZXIubGFzdCkgPyBzbGlkZXIubGltaXQgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoY2Fyb3VzZWwpID8gKChzbGlkZXIuaXRlbVcgKyBzbGlkZXIudmFycy5pdGVtTWFyZ2luKSAqIHNsaWRlci5tb3ZlKSAqIHNsaWRlci5jdXJyZW50U2xpZGUgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHJldmVyc2UpID8gKHNsaWRlci5sYXN0IC0gc2xpZGVyLmN1cnJlbnRTbGlkZSArIHNsaWRlci5jbG9uZU9mZnNldCkgKiBjd2lkdGggOiAoc2xpZGVyLmN1cnJlbnRTbGlkZSArIHNsaWRlci5jbG9uZU9mZnNldCkgKiBjd2lkdGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmdW5jdGlvbiBvbk1TR2VzdHVyZUNoYW5nZShlKSB7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICB2YXIgc2xpZGVyID0gZS50YXJnZXQuX3NsaWRlcjtcbiAgICAgICAgICAgICAgICBpZighc2xpZGVyKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdHJhbnNYID0gLWUudHJhbnNsYXRpb25YLFxuICAgICAgICAgICAgICAgICAgICB0cmFuc1kgPSAtZS50cmFuc2xhdGlvblk7XG5cbiAgICAgICAgICAgICAgICAvL0FjY3VtdWxhdGUgdHJhbnNsYXRpb25zLlxuICAgICAgICAgICAgICAgIGFjY0R4ID0gYWNjRHggKyAoKHZlcnRpY2FsKSA/IHRyYW5zWSA6IHRyYW5zWCk7XG4gICAgICAgICAgICAgICAgZHggPSAoc2xpZGVyLnZhcnMucnRsPy0xOjEpKmFjY0R4O1xuICAgICAgICAgICAgICAgIHNjcm9sbGluZyA9ICh2ZXJ0aWNhbCkgPyAoTWF0aC5hYnMoYWNjRHgpIDwgTWF0aC5hYnMoLXRyYW5zWCkpIDogKE1hdGguYWJzKGFjY0R4KSA8IE1hdGguYWJzKC10cmFuc1kpKTtcblxuICAgICAgICAgICAgICAgIGlmKGUuZGV0YWlsID09PSBlLk1TR0VTVFVSRV9GTEFHX0lORVJUSUEpe1xuICAgICAgICAgICAgICAgICAgICBzZXRJbW1lZGlhdGUoZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbC5fZ2VzdHVyZS5zdG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIXNjcm9sbGluZyB8fCBOdW1iZXIobmV3IERhdGUoKSkgLSBzdGFydFQgPiA1MDApIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWZhZGUgJiYgc2xpZGVyLnRyYW5zaXRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXNsaWRlci52YXJzLmFuaW1hdGlvbkxvb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkeCA9IGFjY0R4IC8gKChzbGlkZXIuY3VycmVudFNsaWRlID09PSAwICYmIGFjY0R4IDwgMCB8fCBzbGlkZXIuY3VycmVudFNsaWRlID09PSBzbGlkZXIubGFzdCAmJiBhY2NEeCA+IDApID8gKE1hdGguYWJzKGFjY0R4KSAvIGN3aWR0aCArIDIpIDogMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXIuc2V0UHJvcHMob2Zmc2V0ICsgZHgsIFwic2V0VG91Y2hcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uTVNHZXN0dXJlRW5kKGUpIHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIHZhciBzbGlkZXIgPSBlLnRhcmdldC5fc2xpZGVyO1xuICAgICAgICAgICAgICAgIGlmKCFzbGlkZXIpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzbGlkZXIuYW5pbWF0aW5nVG8gPT09IHNsaWRlci5jdXJyZW50U2xpZGUgJiYgIXNjcm9sbGluZyAmJiAhKGR4ID09PSBudWxsKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdXBkYXRlRHggPSAocmV2ZXJzZSkgPyAtZHggOiBkeCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldCA9ICh1cGRhdGVEeCA+IDApID8gc2xpZGVyLmdldFRhcmdldCgnbmV4dCcpIDogc2xpZGVyLmdldFRhcmdldCgncHJldicpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChzbGlkZXIuY2FuQWR2YW5jZSh0YXJnZXQpICYmIChOdW1iZXIobmV3IERhdGUoKSkgLSBzdGFydFQgPCA1NTAgJiYgTWF0aC5hYnModXBkYXRlRHgpID4gNTAgfHwgTWF0aC5hYnModXBkYXRlRHgpID4gY3dpZHRoLzIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZXIuZmxleEFuaW1hdGUodGFyZ2V0LCBzbGlkZXIudmFycy5wYXVzZU9uQWN0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZmFkZSkgeyBzbGlkZXIuZmxleEFuaW1hdGUoc2xpZGVyLmN1cnJlbnRTbGlkZSwgc2xpZGVyLnZhcnMucGF1c2VPbkFjdGlvbiwgdHJ1ZSk7IH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN0YXJ0WCA9IG51bGw7XG4gICAgICAgICAgICAgICAgc3RhcnRZID0gbnVsbDtcbiAgICAgICAgICAgICAgICBkeCA9IG51bGw7XG4gICAgICAgICAgICAgICAgb2Zmc2V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBhY2NEeCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICByZXNpemU6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoIXNsaWRlci5hbmltYXRpbmcgJiYgc2xpZGVyLmlzKCc6dmlzaWJsZScpKSB7XG4gICAgICAgICAgaWYgKCFjYXJvdXNlbCkgeyBzbGlkZXIuZG9NYXRoKCk7IH1cblxuICAgICAgICAgIGlmIChmYWRlKSB7XG4gICAgICAgICAgICAvLyBTTU9PVEggSEVJR0hUOlxuICAgICAgICAgICAgbWV0aG9kcy5zbW9vdGhIZWlnaHQoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGNhcm91c2VsKSB7IC8vQ0FST1VTRUw6XG4gICAgICAgICAgICBzbGlkZXIuc2xpZGVzLndpZHRoKHNsaWRlci5jb21wdXRlZFcpO1xuICAgICAgICAgICAgc2xpZGVyLnVwZGF0ZShzbGlkZXIucGFnaW5nQ291bnQpO1xuICAgICAgICAgICAgc2xpZGVyLnNldFByb3BzKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKHZlcnRpY2FsKSB7IC8vVkVSVElDQUw6XG4gICAgICAgICAgICBzbGlkZXIudmlld3BvcnQuaGVpZ2h0KHNsaWRlci5oKTtcbiAgICAgICAgICAgIHNsaWRlci5zZXRQcm9wcyhzbGlkZXIuaCwgXCJzZXRUb3RhbFwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gU01PT1RIIEhFSUdIVDpcbiAgICAgICAgICAgIGlmIChzbGlkZXIudmFycy5zbW9vdGhIZWlnaHQpIHsgbWV0aG9kcy5zbW9vdGhIZWlnaHQoKTsgfVxuICAgICAgICAgICAgc2xpZGVyLm5ld1NsaWRlcy53aWR0aChzbGlkZXIuY29tcHV0ZWRXKTtcbiAgICAgICAgICAgIHNsaWRlci5zZXRQcm9wcyhzbGlkZXIuY29tcHV0ZWRXLCBcInNldFRvdGFsXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNtb290aEhlaWdodDogZnVuY3Rpb24oZHVyKSB7XG4gICAgICAgIGlmICghdmVydGljYWwgfHwgZmFkZSkge1xuICAgICAgICAgIHZhciAkb2JqID0gKGZhZGUpID8gc2xpZGVyIDogc2xpZGVyLnZpZXdwb3J0O1xuICAgICAgICAgIChkdXIpID8gJG9iai5hbmltYXRlKHtcImhlaWdodFwiOiBzbGlkZXIuc2xpZGVzLmVxKHNsaWRlci5hbmltYXRpbmdUbykuaW5uZXJIZWlnaHQoKX0sIGR1cikgOiAkb2JqLmlubmVySGVpZ2h0KHNsaWRlci5zbGlkZXMuZXEoc2xpZGVyLmFuaW1hdGluZ1RvKS5pbm5lckhlaWdodCgpKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHN5bmM6IGZ1bmN0aW9uKGFjdGlvbikge1xuICAgICAgICB2YXIgJG9iaiA9ICQoc2xpZGVyLnZhcnMuc3luYykuZGF0YShcImZsZXhzbGlkZXJcIiksXG4gICAgICAgICAgICB0YXJnZXQgPSBzbGlkZXIuYW5pbWF0aW5nVG87XG5cbiAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgICBjYXNlIFwiYW5pbWF0ZVwiOiAkb2JqLmZsZXhBbmltYXRlKHRhcmdldCwgc2xpZGVyLnZhcnMucGF1c2VPbkFjdGlvbiwgZmFsc2UsIHRydWUpOyBicmVhaztcbiAgICAgICAgICBjYXNlIFwicGxheVwiOiBpZiAoISRvYmoucGxheWluZyAmJiAhJG9iai5hc05hdikgeyAkb2JqLnBsYXkoKTsgfSBicmVhaztcbiAgICAgICAgICBjYXNlIFwicGF1c2VcIjogJG9iai5wYXVzZSgpOyBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHVuaXF1ZUlEOiBmdW5jdGlvbigkY2xvbmUpIHtcbiAgICAgICAgLy8gQXBwZW5kIF9jbG9uZSB0byBjdXJyZW50IGxldmVsIGFuZCBjaGlsZHJlbiBlbGVtZW50cyB3aXRoIGlkIGF0dHJpYnV0ZXNcbiAgICAgICAgJGNsb25lLmZpbHRlciggJ1tpZF0nICkuYWRkKCRjbG9uZS5maW5kKCAnW2lkXScgKSkuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICAgICR0aGlzLmF0dHIoICdpZCcsICR0aGlzLmF0dHIoICdpZCcgKSArICdfY2xvbmUnICk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gJGNsb25lO1xuICAgICAgfSxcbiAgICAgIHBhdXNlSW52aXNpYmxlOiB7XG4gICAgICAgIHZpc1Byb3A6IG51bGwsXG4gICAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciB2aXNQcm9wID0gbWV0aG9kcy5wYXVzZUludmlzaWJsZS5nZXRIaWRkZW5Qcm9wKCk7XG4gICAgICAgICAgaWYgKHZpc1Byb3ApIHtcbiAgICAgICAgICAgIHZhciBldnRuYW1lID0gdmlzUHJvcC5yZXBsYWNlKC9bSHxoXWlkZGVuLywnJykgKyAndmlzaWJpbGl0eWNoYW5nZSc7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2dG5hbWUsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBpZiAobWV0aG9kcy5wYXVzZUludmlzaWJsZS5pc0hpZGRlbigpKSB7XG4gICAgICAgICAgICAgICAgaWYoc2xpZGVyLnN0YXJ0VGltZW91dCkge1xuICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHNsaWRlci5zdGFydFRpbWVvdXQpOyAvL0lmIGNsb2NrIGlzIHRpY2tpbmcsIHN0b3AgdGltZXIgYW5kIHByZXZlbnQgZnJvbSBzdGFydGluZyB3aGlsZSBpbnZpc2libGVcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgc2xpZGVyLnBhdXNlKCk7IC8vT3IganVzdCBwYXVzZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZihzbGlkZXIuc3RhcnRlZCkge1xuICAgICAgICAgICAgICAgICAgc2xpZGVyLnBsYXkoKTsgLy9Jbml0aWF0ZWQgYmVmb3JlLCBqdXN0IHBsYXlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgaWYgKHNsaWRlci52YXJzLmluaXREZWxheSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChzbGlkZXIucGxheSwgc2xpZGVyLnZhcnMuaW5pdERlbGF5KTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5wbGF5KCk7IC8vRGlkbid0IGluaXQgYmVmb3JlOiBzaW1wbHkgaW5pdCBvciB3YWl0IGZvciBpdFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBpc0hpZGRlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHByb3AgPSBtZXRob2RzLnBhdXNlSW52aXNpYmxlLmdldEhpZGRlblByb3AoKTtcbiAgICAgICAgICBpZiAoIXByb3ApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGRvY3VtZW50W3Byb3BdO1xuICAgICAgICB9LFxuICAgICAgICBnZXRIaWRkZW5Qcm9wOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgcHJlZml4ZXMgPSBbJ3dlYmtpdCcsJ21veicsJ21zJywnbyddO1xuICAgICAgICAgIC8vIGlmICdoaWRkZW4nIGlzIG5hdGl2ZWx5IHN1cHBvcnRlZCBqdXN0IHJldHVybiBpdFxuICAgICAgICAgIGlmICgnaGlkZGVuJyBpbiBkb2N1bWVudCkge1xuICAgICAgICAgICAgcmV0dXJuICdoaWRkZW4nO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBvdGhlcndpc2UgbG9vcCBvdmVyIGFsbCB0aGUga25vd24gcHJlZml4ZXMgdW50aWwgd2UgZmluZCBvbmVcbiAgICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBwcmVmaXhlcy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgICAgaWYgKChwcmVmaXhlc1tpXSArICdIaWRkZW4nKSBpbiBkb2N1bWVudCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcmVmaXhlc1tpXSArICdIaWRkZW4nO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIG90aGVyd2lzZSBpdCdzIG5vdCBzdXBwb3J0ZWRcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHNldFRvQ2xlYXJXYXRjaGVkRXZlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjbGVhclRpbWVvdXQod2F0Y2hlZEV2ZW50Q2xlYXJUaW1lcik7XG4gICAgICAgIHdhdGNoZWRFdmVudENsZWFyVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHdhdGNoZWRFdmVudCA9IFwiXCI7XG4gICAgICAgIH0sIDMwMDApO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBwdWJsaWMgbWV0aG9kc1xuICAgIHNsaWRlci5mbGV4QW5pbWF0ZSA9IGZ1bmN0aW9uKHRhcmdldCwgcGF1c2UsIG92ZXJyaWRlLCB3aXRoU3luYywgZnJvbU5hdikge1xuICAgICAgaWYgKCFzbGlkZXIudmFycy5hbmltYXRpb25Mb29wICYmIHRhcmdldCAhPT0gc2xpZGVyLmN1cnJlbnRTbGlkZSkge1xuICAgICAgICBzbGlkZXIuZGlyZWN0aW9uID0gKHRhcmdldCA+IHNsaWRlci5jdXJyZW50U2xpZGUpID8gXCJuZXh0XCIgOiBcInByZXZcIjtcbiAgICAgIH1cblxuICAgICAgaWYgKGFzTmF2ICYmIHNsaWRlci5wYWdpbmdDb3VudCA9PT0gMSkgc2xpZGVyLmRpcmVjdGlvbiA9IChzbGlkZXIuY3VycmVudEl0ZW0gPCB0YXJnZXQpID8gXCJuZXh0XCIgOiBcInByZXZcIjtcblxuICAgICAgaWYgKCFzbGlkZXIuYW5pbWF0aW5nICYmIChzbGlkZXIuY2FuQWR2YW5jZSh0YXJnZXQsIGZyb21OYXYpIHx8IG92ZXJyaWRlKSAmJiBzbGlkZXIuaXMoXCI6dmlzaWJsZVwiKSkge1xuICAgICAgICBpZiAoYXNOYXYgJiYgd2l0aFN5bmMpIHtcbiAgICAgICAgICB2YXIgbWFzdGVyID0gJChzbGlkZXIudmFycy5hc05hdkZvcikuZGF0YSgnZmxleHNsaWRlcicpO1xuICAgICAgICAgIHNsaWRlci5hdEVuZCA9IHRhcmdldCA9PT0gMCB8fCB0YXJnZXQgPT09IHNsaWRlci5jb3VudCAtIDE7XG4gICAgICAgICAgbWFzdGVyLmZsZXhBbmltYXRlKHRhcmdldCwgdHJ1ZSwgZmFsc2UsIHRydWUsIGZyb21OYXYpO1xuICAgICAgICAgIHNsaWRlci5kaXJlY3Rpb24gPSAoc2xpZGVyLmN1cnJlbnRJdGVtIDwgdGFyZ2V0KSA/IFwibmV4dFwiIDogXCJwcmV2XCI7XG4gICAgICAgICAgbWFzdGVyLmRpcmVjdGlvbiA9IHNsaWRlci5kaXJlY3Rpb247XG5cbiAgICAgICAgICBpZiAoTWF0aC5jZWlsKCh0YXJnZXQgKyAxKS9zbGlkZXIudmlzaWJsZSkgLSAxICE9PSBzbGlkZXIuY3VycmVudFNsaWRlICYmIHRhcmdldCAhPT0gMCkge1xuICAgICAgICAgICAgc2xpZGVyLmN1cnJlbnRJdGVtID0gdGFyZ2V0O1xuICAgICAgICAgICAgc2xpZGVyLnNsaWRlcy5yZW1vdmVDbGFzcyhuYW1lc3BhY2UgKyBcImFjdGl2ZS1zbGlkZVwiKS5lcSh0YXJnZXQpLmFkZENsYXNzKG5hbWVzcGFjZSArIFwiYWN0aXZlLXNsaWRlXCIpO1xuICAgICAgICAgICAgdGFyZ2V0ID0gTWF0aC5mbG9vcih0YXJnZXQvc2xpZGVyLnZpc2libGUpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzbGlkZXIuY3VycmVudEl0ZW0gPSB0YXJnZXQ7XG4gICAgICAgICAgICBzbGlkZXIuc2xpZGVzLnJlbW92ZUNsYXNzKG5hbWVzcGFjZSArIFwiYWN0aXZlLXNsaWRlXCIpLmVxKHRhcmdldCkuYWRkQ2xhc3MobmFtZXNwYWNlICsgXCJhY3RpdmUtc2xpZGVcIik7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2xpZGVyLmFuaW1hdGluZyA9IHRydWU7XG4gICAgICAgIHNsaWRlci5hbmltYXRpbmdUbyA9IHRhcmdldDtcblxuICAgICAgICAvLyBTTElERVNIT1c6XG4gICAgICAgIGlmIChwYXVzZSkgeyBzbGlkZXIucGF1c2UoKTsgfVxuXG4gICAgICAgIC8vIEFQSTogYmVmb3JlKCkgYW5pbWF0aW9uIENhbGxiYWNrXG4gICAgICAgIHNsaWRlci52YXJzLmJlZm9yZShzbGlkZXIpO1xuXG4gICAgICAgIC8vIFNZTkM6XG4gICAgICAgIGlmIChzbGlkZXIuc3luY0V4aXN0cyAmJiAhZnJvbU5hdikgeyBtZXRob2RzLnN5bmMoXCJhbmltYXRlXCIpOyB9XG5cbiAgICAgICAgLy8gQ09OVFJPTE5BVlxuICAgICAgICBpZiAoc2xpZGVyLnZhcnMuY29udHJvbE5hdikgeyBtZXRob2RzLmNvbnRyb2xOYXYuYWN0aXZlKCk7IH1cblxuICAgICAgICAvLyAhQ0FST1VTRUw6XG4gICAgICAgIC8vIENBTkRJREFURTogc2xpZGUgYWN0aXZlIGNsYXNzIChmb3IgYWRkL3JlbW92ZSBzbGlkZSlcbiAgICAgICAgaWYgKCFjYXJvdXNlbCkgeyBzbGlkZXIuc2xpZGVzLnJlbW92ZUNsYXNzKG5hbWVzcGFjZSArICdhY3RpdmUtc2xpZGUnKS5lcSh0YXJnZXQpLmFkZENsYXNzKG5hbWVzcGFjZSArICdhY3RpdmUtc2xpZGUnKTsgfVxuXG4gICAgICAgIC8vIElORklOSVRFIExPT1A6XG4gICAgICAgIC8vIENBTkRJREFURTogYXRFbmRcbiAgICAgICAgc2xpZGVyLmF0RW5kID0gdGFyZ2V0ID09PSAwIHx8IHRhcmdldCA9PT0gc2xpZGVyLmxhc3Q7XG5cbiAgICAgICAgLy8gRElSRUNUSU9OTkFWOlxuICAgICAgICBpZiAoc2xpZGVyLnZhcnMuZGlyZWN0aW9uTmF2KSB7IG1ldGhvZHMuZGlyZWN0aW9uTmF2LnVwZGF0ZSgpOyB9XG5cbiAgICAgICAgaWYgKHRhcmdldCA9PT0gc2xpZGVyLmxhc3QpIHtcbiAgICAgICAgICAvLyBBUEk6IGVuZCgpIG9mIGN5Y2xlIENhbGxiYWNrXG4gICAgICAgICAgc2xpZGVyLnZhcnMuZW5kKHNsaWRlcik7XG4gICAgICAgICAgLy8gU0xJREVTSE9XICYmICFJTkZJTklURSBMT09QOlxuICAgICAgICAgIGlmICghc2xpZGVyLnZhcnMuYW5pbWF0aW9uTG9vcCkgeyBzbGlkZXIucGF1c2UoKTsgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gU0xJREU6XG4gICAgICAgIGlmICghZmFkZSkge1xuICAgICAgICAgIHZhciBkaW1lbnNpb24gPSAodmVydGljYWwpID8gc2xpZGVyLnNsaWRlcy5maWx0ZXIoJzpmaXJzdCcpLmhlaWdodCgpIDogc2xpZGVyLmNvbXB1dGVkVyxcbiAgICAgICAgICAgICAgbWFyZ2luLCBzbGlkZVN0cmluZywgY2FsY05leHQ7XG5cbiAgICAgICAgICAvLyBJTkZJTklURSBMT09QIC8gUkVWRVJTRTpcbiAgICAgICAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgICAgICAgIG1hcmdpbiA9IHNsaWRlci52YXJzLml0ZW1NYXJnaW47XG4gICAgICAgICAgICBjYWxjTmV4dCA9ICgoc2xpZGVyLml0ZW1XICsgbWFyZ2luKSAqIHNsaWRlci5tb3ZlKSAqIHNsaWRlci5hbmltYXRpbmdUbztcbiAgICAgICAgICAgIHNsaWRlU3RyaW5nID0gKGNhbGNOZXh0ID4gc2xpZGVyLmxpbWl0ICYmIHNsaWRlci52aXNpYmxlICE9PSAxKSA/IHNsaWRlci5saW1pdCA6IGNhbGNOZXh0O1xuICAgICAgICAgIH0gZWxzZSBpZiAoc2xpZGVyLmN1cnJlbnRTbGlkZSA9PT0gMCAmJiB0YXJnZXQgPT09IHNsaWRlci5jb3VudCAtIDEgJiYgc2xpZGVyLnZhcnMuYW5pbWF0aW9uTG9vcCAmJiBzbGlkZXIuZGlyZWN0aW9uICE9PSBcIm5leHRcIikge1xuICAgICAgICAgICAgc2xpZGVTdHJpbmcgPSAocmV2ZXJzZSkgPyAoc2xpZGVyLmNvdW50ICsgc2xpZGVyLmNsb25lT2Zmc2V0KSAqIGRpbWVuc2lvbiA6IDA7XG4gICAgICAgICAgfSBlbHNlIGlmIChzbGlkZXIuY3VycmVudFNsaWRlID09PSBzbGlkZXIubGFzdCAmJiB0YXJnZXQgPT09IDAgJiYgc2xpZGVyLnZhcnMuYW5pbWF0aW9uTG9vcCAmJiBzbGlkZXIuZGlyZWN0aW9uICE9PSBcInByZXZcIikge1xuICAgICAgICAgICAgc2xpZGVTdHJpbmcgPSAocmV2ZXJzZSkgPyAwIDogKHNsaWRlci5jb3VudCArIDEpICogZGltZW5zaW9uO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzbGlkZVN0cmluZyA9IChyZXZlcnNlKSA/ICgoc2xpZGVyLmNvdW50IC0gMSkgLSB0YXJnZXQgKyBzbGlkZXIuY2xvbmVPZmZzZXQpICogZGltZW5zaW9uIDogKHRhcmdldCArIHNsaWRlci5jbG9uZU9mZnNldCkgKiBkaW1lbnNpb247XG4gICAgICAgICAgfVxuICAgICAgICAgIHNsaWRlci5zZXRQcm9wcyhzbGlkZVN0cmluZywgXCJcIiwgc2xpZGVyLnZhcnMuYW5pbWF0aW9uU3BlZWQpO1xuICAgICAgICAgIGlmIChzbGlkZXIudHJhbnNpdGlvbnMpIHtcbiAgICAgICAgICAgIGlmICghc2xpZGVyLnZhcnMuYW5pbWF0aW9uTG9vcCB8fCAhc2xpZGVyLmF0RW5kKSB7XG4gICAgICAgICAgICAgIHNsaWRlci5hbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgc2xpZGVyLmN1cnJlbnRTbGlkZSA9IHNsaWRlci5hbmltYXRpbmdUbztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVW5iaW5kIHByZXZpb3VzIHRyYW5zaXRpb25FbmQgZXZlbnRzIGFuZCByZS1iaW5kIG5ldyB0cmFuc2l0aW9uRW5kIGV2ZW50XG4gICAgICAgICAgICBzbGlkZXIuY29udGFpbmVyLnVuYmluZChcIndlYmtpdFRyYW5zaXRpb25FbmQgdHJhbnNpdGlvbmVuZFwiKTtcbiAgICAgICAgICAgIHNsaWRlci5jb250YWluZXIuYmluZChcIndlYmtpdFRyYW5zaXRpb25FbmQgdHJhbnNpdGlvbmVuZFwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHNsaWRlci5lbnN1cmVBbmltYXRpb25FbmQpO1xuICAgICAgICAgICAgICBzbGlkZXIud3JhcHVwKGRpbWVuc2lvbik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gSW5zdXJhbmNlIGZvciB0aGUgZXZlci1zby1maWNrbGUgdHJhbnNpdGlvbkVuZCBldmVudFxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHNsaWRlci5lbnN1cmVBbmltYXRpb25FbmQpO1xuICAgICAgICAgICAgc2xpZGVyLmVuc3VyZUFuaW1hdGlvbkVuZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHNsaWRlci53cmFwdXAoZGltZW5zaW9uKTtcbiAgICAgICAgICAgIH0sIHNsaWRlci52YXJzLmFuaW1hdGlvblNwZWVkICsgMTAwKTtcblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzbGlkZXIuY29udGFpbmVyLmFuaW1hdGUoc2xpZGVyLmFyZ3MsIHNsaWRlci52YXJzLmFuaW1hdGlvblNwZWVkLCBzbGlkZXIudmFycy5lYXNpbmcsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgIHNsaWRlci53cmFwdXAoZGltZW5zaW9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy8gRkFERTpcbiAgICAgICAgICBpZiAoIXRvdWNoKSB7XG4gICAgICAgICAgICBzbGlkZXIuc2xpZGVzLmVxKHNsaWRlci5jdXJyZW50U2xpZGUpLmNzcyh7XCJ6SW5kZXhcIjogMX0pLmFuaW1hdGUoe1wib3BhY2l0eVwiOiAwfSwgc2xpZGVyLnZhcnMuYW5pbWF0aW9uU3BlZWQsIHNsaWRlci52YXJzLmVhc2luZyk7XG4gICAgICAgICAgICBzbGlkZXIuc2xpZGVzLmVxKHRhcmdldCkuY3NzKHtcInpJbmRleFwiOiAyfSkuYW5pbWF0ZSh7XCJvcGFjaXR5XCI6IDF9LCBzbGlkZXIudmFycy5hbmltYXRpb25TcGVlZCwgc2xpZGVyLnZhcnMuZWFzaW5nLCBzbGlkZXIud3JhcHVwKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2xpZGVyLnNsaWRlcy5lcShzbGlkZXIuY3VycmVudFNsaWRlKS5jc3MoeyBcIm9wYWNpdHlcIjogMCwgXCJ6SW5kZXhcIjogMSB9KTtcbiAgICAgICAgICAgIHNsaWRlci5zbGlkZXMuZXEodGFyZ2V0KS5jc3MoeyBcIm9wYWNpdHlcIjogMSwgXCJ6SW5kZXhcIjogMiB9KTtcbiAgICAgICAgICAgIHNsaWRlci53cmFwdXAoZGltZW5zaW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gU01PT1RIIEhFSUdIVDpcbiAgICAgICAgaWYgKHNsaWRlci52YXJzLnNtb290aEhlaWdodCkgeyBtZXRob2RzLnNtb290aEhlaWdodChzbGlkZXIudmFycy5hbmltYXRpb25TcGVlZCk7IH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHNsaWRlci53cmFwdXAgPSBmdW5jdGlvbihkaW1lbnNpb24pIHtcbiAgICAgIC8vIFNMSURFOlxuICAgICAgaWYgKCFmYWRlICYmICFjYXJvdXNlbCkge1xuICAgICAgICBpZiAoc2xpZGVyLmN1cnJlbnRTbGlkZSA9PT0gMCAmJiBzbGlkZXIuYW5pbWF0aW5nVG8gPT09IHNsaWRlci5sYXN0ICYmIHNsaWRlci52YXJzLmFuaW1hdGlvbkxvb3ApIHtcbiAgICAgICAgICBzbGlkZXIuc2V0UHJvcHMoZGltZW5zaW9uLCBcImp1bXBFbmRcIik7XG4gICAgICAgIH0gZWxzZSBpZiAoc2xpZGVyLmN1cnJlbnRTbGlkZSA9PT0gc2xpZGVyLmxhc3QgJiYgc2xpZGVyLmFuaW1hdGluZ1RvID09PSAwICYmIHNsaWRlci52YXJzLmFuaW1hdGlvbkxvb3ApIHtcbiAgICAgICAgICBzbGlkZXIuc2V0UHJvcHMoZGltZW5zaW9uLCBcImp1bXBTdGFydFwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc2xpZGVyLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgc2xpZGVyLmN1cnJlbnRTbGlkZSA9IHNsaWRlci5hbmltYXRpbmdUbztcbiAgICAgIC8vIEFQSTogYWZ0ZXIoKSBhbmltYXRpb24gQ2FsbGJhY2tcbiAgICAgIHNsaWRlci52YXJzLmFmdGVyKHNsaWRlcik7XG4gICAgfTtcblxuICAgIC8vIFNMSURFU0hPVzpcbiAgICBzbGlkZXIuYW5pbWF0ZVNsaWRlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKCFzbGlkZXIuYW5pbWF0aW5nICYmIGZvY3VzZWQgKSB7IHNsaWRlci5mbGV4QW5pbWF0ZShzbGlkZXIuZ2V0VGFyZ2V0KFwibmV4dFwiKSk7IH1cbiAgICB9O1xuICAgIC8vIFNMSURFU0hPVzpcbiAgICBzbGlkZXIucGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIGNsZWFySW50ZXJ2YWwoc2xpZGVyLmFuaW1hdGVkU2xpZGVzKTtcbiAgICAgIHNsaWRlci5hbmltYXRlZFNsaWRlcyA9IG51bGw7XG4gICAgICBzbGlkZXIucGxheWluZyA9IGZhbHNlO1xuICAgICAgLy8gUEFVU0VQTEFZOlxuICAgICAgaWYgKHNsaWRlci52YXJzLnBhdXNlUGxheSkgeyBtZXRob2RzLnBhdXNlUGxheS51cGRhdGUoXCJwbGF5XCIpOyB9XG4gICAgICAvLyBTWU5DOlxuICAgICAgaWYgKHNsaWRlci5zeW5jRXhpc3RzKSB7IG1ldGhvZHMuc3luYyhcInBhdXNlXCIpOyB9XG4gICAgfTtcbiAgICAvLyBTTElERVNIT1c6XG4gICAgc2xpZGVyLnBsYXkgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmIChzbGlkZXIucGxheWluZykgeyBjbGVhckludGVydmFsKHNsaWRlci5hbmltYXRlZFNsaWRlcyk7IH1cbiAgICAgIHNsaWRlci5hbmltYXRlZFNsaWRlcyA9IHNsaWRlci5hbmltYXRlZFNsaWRlcyB8fCBzZXRJbnRlcnZhbChzbGlkZXIuYW5pbWF0ZVNsaWRlcywgc2xpZGVyLnZhcnMuc2xpZGVzaG93U3BlZWQpO1xuICAgICAgc2xpZGVyLnN0YXJ0ZWQgPSBzbGlkZXIucGxheWluZyA9IHRydWU7XG4gICAgICAvLyBQQVVTRVBMQVk6XG4gICAgICBpZiAoc2xpZGVyLnZhcnMucGF1c2VQbGF5KSB7IG1ldGhvZHMucGF1c2VQbGF5LnVwZGF0ZShcInBhdXNlXCIpOyB9XG4gICAgICAvLyBTWU5DOlxuICAgICAgaWYgKHNsaWRlci5zeW5jRXhpc3RzKSB7IG1ldGhvZHMuc3luYyhcInBsYXlcIik7IH1cbiAgICB9O1xuICAgIC8vIFNUT1A6XG4gICAgc2xpZGVyLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBzbGlkZXIucGF1c2UoKTtcbiAgICAgIHNsaWRlci5zdG9wcGVkID0gdHJ1ZTtcbiAgICB9O1xuICAgIHNsaWRlci5jYW5BZHZhbmNlID0gZnVuY3Rpb24odGFyZ2V0LCBmcm9tTmF2KSB7XG4gICAgICAvLyBBU05BVjpcbiAgICAgIHZhciBsYXN0ID0gKGFzTmF2KSA/IHNsaWRlci5wYWdpbmdDb3VudCAtIDEgOiBzbGlkZXIubGFzdDtcbiAgICAgIHJldHVybiAoZnJvbU5hdikgPyB0cnVlIDpcbiAgICAgICAgICAgICAoYXNOYXYgJiYgc2xpZGVyLmN1cnJlbnRJdGVtID09PSBzbGlkZXIuY291bnQgLSAxICYmIHRhcmdldCA9PT0gMCAmJiBzbGlkZXIuZGlyZWN0aW9uID09PSBcInByZXZcIikgPyB0cnVlIDpcbiAgICAgICAgICAgICAoYXNOYXYgJiYgc2xpZGVyLmN1cnJlbnRJdGVtID09PSAwICYmIHRhcmdldCA9PT0gc2xpZGVyLnBhZ2luZ0NvdW50IC0gMSAmJiBzbGlkZXIuZGlyZWN0aW9uICE9PSBcIm5leHRcIikgPyBmYWxzZSA6XG4gICAgICAgICAgICAgKHRhcmdldCA9PT0gc2xpZGVyLmN1cnJlbnRTbGlkZSAmJiAhYXNOYXYpID8gZmFsc2UgOlxuICAgICAgICAgICAgIChzbGlkZXIudmFycy5hbmltYXRpb25Mb29wKSA/IHRydWUgOlxuICAgICAgICAgICAgIChzbGlkZXIuYXRFbmQgJiYgc2xpZGVyLmN1cnJlbnRTbGlkZSA9PT0gMCAmJiB0YXJnZXQgPT09IGxhc3QgJiYgc2xpZGVyLmRpcmVjdGlvbiAhPT0gXCJuZXh0XCIpID8gZmFsc2UgOlxuICAgICAgICAgICAgIChzbGlkZXIuYXRFbmQgJiYgc2xpZGVyLmN1cnJlbnRTbGlkZSA9PT0gbGFzdCAmJiB0YXJnZXQgPT09IDAgJiYgc2xpZGVyLmRpcmVjdGlvbiA9PT0gXCJuZXh0XCIpID8gZmFsc2UgOlxuICAgICAgICAgICAgIHRydWU7XG4gICAgfTtcbiAgICBzbGlkZXIuZ2V0VGFyZ2V0ID0gZnVuY3Rpb24oZGlyKSB7XG4gICAgICBzbGlkZXIuZGlyZWN0aW9uID0gZGlyO1xuICAgICAgaWYgKGRpciA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgcmV0dXJuIChzbGlkZXIuY3VycmVudFNsaWRlID09PSBzbGlkZXIubGFzdCkgPyAwIDogc2xpZGVyLmN1cnJlbnRTbGlkZSArIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gKHNsaWRlci5jdXJyZW50U2xpZGUgPT09IDApID8gc2xpZGVyLmxhc3QgOiBzbGlkZXIuY3VycmVudFNsaWRlIC0gMTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gU0xJREU6XG4gICAgc2xpZGVyLnNldFByb3BzID0gZnVuY3Rpb24ocG9zLCBzcGVjaWFsLCBkdXIpIHtcbiAgICAgIHZhciB0YXJnZXQgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBwb3NDaGVjayA9IChwb3MpID8gcG9zIDogKChzbGlkZXIuaXRlbVcgKyBzbGlkZXIudmFycy5pdGVtTWFyZ2luKSAqIHNsaWRlci5tb3ZlKSAqIHNsaWRlci5hbmltYXRpbmdUbyxcbiAgICAgICAgICAgIHBvc0NhbGMgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGlmIChjYXJvdXNlbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAoc3BlY2lhbCA9PT0gXCJzZXRUb3VjaFwiKSA/IHBvcyA6XG4gICAgICAgICAgICAgICAgICAgICAgIChyZXZlcnNlICYmIHNsaWRlci5hbmltYXRpbmdUbyA9PT0gc2xpZGVyLmxhc3QpID8gMCA6XG4gICAgICAgICAgICAgICAgICAgICAgIChyZXZlcnNlKSA/IHNsaWRlci5saW1pdCAtICgoKHNsaWRlci5pdGVtVyArIHNsaWRlci52YXJzLml0ZW1NYXJnaW4pICogc2xpZGVyLm1vdmUpICogc2xpZGVyLmFuaW1hdGluZ1RvKSA6XG4gICAgICAgICAgICAgICAgICAgICAgIChzbGlkZXIuYW5pbWF0aW5nVG8gPT09IHNsaWRlci5sYXN0KSA/IHNsaWRlci5saW1pdCA6IHBvc0NoZWNrO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHN3aXRjaCAoc3BlY2lhbCkge1xuICAgICAgICAgICAgICAgICAgY2FzZSBcInNldFRvdGFsXCI6IHJldHVybiAocmV2ZXJzZSkgPyAoKHNsaWRlci5jb3VudCAtIDEpIC0gc2xpZGVyLmN1cnJlbnRTbGlkZSArIHNsaWRlci5jbG9uZU9mZnNldCkgKiBwb3MgOiAoc2xpZGVyLmN1cnJlbnRTbGlkZSArIHNsaWRlci5jbG9uZU9mZnNldCkgKiBwb3M7XG4gICAgICAgICAgICAgICAgICBjYXNlIFwic2V0VG91Y2hcIjogcmV0dXJuIChyZXZlcnNlKSA/IHBvcyA6IHBvcztcbiAgICAgICAgICAgICAgICAgIGNhc2UgXCJqdW1wRW5kXCI6IHJldHVybiAocmV2ZXJzZSkgPyBwb3MgOiBzbGlkZXIuY291bnQgKiBwb3M7XG4gICAgICAgICAgICAgICAgICBjYXNlIFwianVtcFN0YXJ0XCI6IHJldHVybiAocmV2ZXJzZSkgPyBzbGlkZXIuY291bnQgKiBwb3MgOiBwb3M7XG4gICAgICAgICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gcG9zO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSgpKTtcblxuICAgICAgICAgICAgcmV0dXJuIChwb3NDYWxjICogKChzbGlkZXIudmFycy5ydGwpPzE6LTEpKSArIFwicHhcIjtcbiAgICAgICAgICB9KCkpO1xuXG4gICAgICBpZiAoc2xpZGVyLnRyYW5zaXRpb25zKSB7XG4gICAgICAgIGlmIChzbGlkZXIuaXNGaXJlZm94KSB7XG4gICAgICAgICAgdGFyZ2V0ID0gKHZlcnRpY2FsKSA/IFwidHJhbnNsYXRlM2QoMCxcIiArIHRhcmdldCArIFwiLDApXCIgOiBcInRyYW5zbGF0ZTNkKFwiICsgKHBhcnNlSW50KHRhcmdldCkrJ3B4JykgKyBcIiwwLDApXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGFyZ2V0ID0gKHZlcnRpY2FsKSA/IFwidHJhbnNsYXRlM2QoMCxcIiArIHRhcmdldCArIFwiLDApXCIgOiBcInRyYW5zbGF0ZTNkKFwiICsgKChzbGlkZXIudmFycy5ydGw/LTE6MSkqcGFyc2VJbnQodGFyZ2V0KSsncHgnKSArIFwiLDAsMClcIjtcbiAgICAgICAgfVxuICAgICAgICBkdXIgPSAoZHVyICE9PSB1bmRlZmluZWQpID8gKGR1ci8xMDAwKSArIFwic1wiIDogXCIwc1wiO1xuICAgICAgICBzbGlkZXIuY29udGFpbmVyLmNzcyhcIi1cIiArIHNsaWRlci5wZnggKyBcIi10cmFuc2l0aW9uLWR1cmF0aW9uXCIsIGR1cik7XG4gICAgICAgICBzbGlkZXIuY29udGFpbmVyLmNzcyhcInRyYW5zaXRpb24tZHVyYXRpb25cIiwgZHVyKTtcbiAgICAgIH1cblxuICAgICAgc2xpZGVyLmFyZ3Nbc2xpZGVyLnByb3BdID0gdGFyZ2V0O1xuICAgICAgaWYgKHNsaWRlci50cmFuc2l0aW9ucyB8fCBkdXIgPT09IHVuZGVmaW5lZCkgeyBzbGlkZXIuY29udGFpbmVyLmNzcyhzbGlkZXIuYXJncyk7IH1cblxuICAgICAgc2xpZGVyLmNvbnRhaW5lci5jc3MoJ3RyYW5zZm9ybScsdGFyZ2V0KTtcbiAgICB9O1xuXG4gICAgc2xpZGVyLnNldHVwID0gZnVuY3Rpb24odHlwZSkge1xuICAgICAgLy8gU0xJREU6XG4gICAgICBpZiAoIWZhZGUpIHtcbiAgICAgICAgdmFyIHNsaWRlck9mZnNldCwgYXJyO1xuXG4gICAgICAgIGlmICh0eXBlID09PSBcImluaXRcIikge1xuICAgICAgICAgIHNsaWRlci52aWV3cG9ydCA9ICQoJzxkaXYgY2xhc3M9XCInICsgbmFtZXNwYWNlICsgJ3ZpZXdwb3J0XCI+PC9kaXY+JykuY3NzKHtcIm92ZXJmbG93XCI6IFwiaGlkZGVuXCIsIFwicG9zaXRpb25cIjogXCJyZWxhdGl2ZVwifSkuYXBwZW5kVG8oc2xpZGVyKS5hcHBlbmQoc2xpZGVyLmNvbnRhaW5lcik7XG4gICAgICAgICAgLy8gSU5GSU5JVEUgTE9PUDpcbiAgICAgICAgICBzbGlkZXIuY2xvbmVDb3VudCA9IDA7XG4gICAgICAgICAgc2xpZGVyLmNsb25lT2Zmc2V0ID0gMDtcbiAgICAgICAgICAvLyBSRVZFUlNFOlxuICAgICAgICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICAgICAgICBhcnIgPSAkLm1ha2VBcnJheShzbGlkZXIuc2xpZGVzKS5yZXZlcnNlKCk7XG4gICAgICAgICAgICBzbGlkZXIuc2xpZGVzID0gJChhcnIpO1xuICAgICAgICAgICAgc2xpZGVyLmNvbnRhaW5lci5lbXB0eSgpLmFwcGVuZChzbGlkZXIuc2xpZGVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gSU5GSU5JVEUgTE9PUCAmJiAhQ0FST1VTRUw6XG4gICAgICAgIGlmIChzbGlkZXIudmFycy5hbmltYXRpb25Mb29wICYmICFjYXJvdXNlbCkge1xuICAgICAgICAgIHNsaWRlci5jbG9uZUNvdW50ID0gMjtcbiAgICAgICAgICBzbGlkZXIuY2xvbmVPZmZzZXQgPSAxO1xuICAgICAgICAgIC8vIGNsZWFyIG91dCBvbGQgY2xvbmVzXG4gICAgICAgICAgaWYgKHR5cGUgIT09IFwiaW5pdFwiKSB7IHNsaWRlci5jb250YWluZXIuZmluZCgnLmNsb25lJykucmVtb3ZlKCk7IH1cbiAgICAgICAgICBzbGlkZXIuY29udGFpbmVyLmFwcGVuZChtZXRob2RzLnVuaXF1ZUlEKHNsaWRlci5zbGlkZXMuZmlyc3QoKS5jbG9uZSgpLmFkZENsYXNzKCdjbG9uZScpKS5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJykpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIC5wcmVwZW5kKG1ldGhvZHMudW5pcXVlSUQoc2xpZGVyLnNsaWRlcy5sYXN0KCkuY2xvbmUoKS5hZGRDbGFzcygnY2xvbmUnKSkuYXR0cignYXJpYS1oaWRkZW4nLCAndHJ1ZScpKTtcbiAgICAgICAgfVxuICAgICAgICBzbGlkZXIubmV3U2xpZGVzID0gJChzbGlkZXIudmFycy5zZWxlY3Rvciwgc2xpZGVyKTtcblxuICAgICAgICBzbGlkZXJPZmZzZXQgPSAocmV2ZXJzZSkgPyBzbGlkZXIuY291bnQgLSAxIC0gc2xpZGVyLmN1cnJlbnRTbGlkZSArIHNsaWRlci5jbG9uZU9mZnNldCA6IHNsaWRlci5jdXJyZW50U2xpZGUgKyBzbGlkZXIuY2xvbmVPZmZzZXQ7XG4gICAgICAgIC8vIFZFUlRJQ0FMOlxuICAgICAgICBpZiAodmVydGljYWwgJiYgIWNhcm91c2VsKSB7XG4gICAgICAgICAgc2xpZGVyLmNvbnRhaW5lci5oZWlnaHQoKHNsaWRlci5jb3VudCArIHNsaWRlci5jbG9uZUNvdW50KSAqIDIwMCArIFwiJVwiKS5jc3MoXCJwb3NpdGlvblwiLCBcImFic29sdXRlXCIpLndpZHRoKFwiMTAwJVwiKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBzbGlkZXIubmV3U2xpZGVzLmNzcyh7XCJkaXNwbGF5XCI6IFwiYmxvY2tcIn0pO1xuICAgICAgICAgICAgc2xpZGVyLmRvTWF0aCgpO1xuICAgICAgICAgICAgc2xpZGVyLnZpZXdwb3J0LmhlaWdodChzbGlkZXIuaCk7XG4gICAgICAgICAgICBzbGlkZXIuc2V0UHJvcHMoc2xpZGVyT2Zmc2V0ICogc2xpZGVyLmgsIFwiaW5pdFwiKTtcbiAgICAgICAgICB9LCAodHlwZSA9PT0gXCJpbml0XCIpID8gMTAwIDogMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2xpZGVyLmNvbnRhaW5lci53aWR0aCgoc2xpZGVyLmNvdW50ICsgc2xpZGVyLmNsb25lQ291bnQpICogMjAwICsgXCIlXCIpO1xuICAgICAgICAgIHNsaWRlci5zZXRQcm9wcyhzbGlkZXJPZmZzZXQgKiBzbGlkZXIuY29tcHV0ZWRXLCBcImluaXRcIik7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgc2xpZGVyLmRvTWF0aCgpO1xuICAgICAgICAgIGlmKHNsaWRlci52YXJzLnJ0bCl7XG4gICAgICAgICAgICBpZiAoc2xpZGVyLmlzRmlyZWZveCkge1xuICAgICAgICAgICAgICBzbGlkZXIubmV3U2xpZGVzLmNzcyh7XCJ3aWR0aFwiOiBzbGlkZXIuY29tcHV0ZWRXLCBcIm1hcmdpblJpZ2h0XCIgOiBzbGlkZXIuY29tcHV0ZWRNLCBcImZsb2F0XCI6IFwicmlnaHRcIiwgXCJkaXNwbGF5XCI6IFwiYmxvY2tcIn0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2xpZGVyLm5ld1NsaWRlcy5jc3Moe1wid2lkdGhcIjogc2xpZGVyLmNvbXB1dGVkVywgXCJtYXJnaW5SaWdodFwiIDogc2xpZGVyLmNvbXB1dGVkTSwgXCJmbG9hdFwiOiBcImxlZnRcIiwgXCJkaXNwbGF5XCI6IFwiYmxvY2tcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgc2xpZGVyLm5ld1NsaWRlcy5jc3Moe1wid2lkdGhcIjogc2xpZGVyLmNvbXB1dGVkVywgXCJtYXJnaW5SaWdodFwiIDogc2xpZGVyLmNvbXB1dGVkTSwgXCJmbG9hdFwiOiBcImxlZnRcIiwgXCJkaXNwbGF5XCI6IFwiYmxvY2tcIn0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gU01PT1RIIEhFSUdIVDpcbiAgICAgICAgICAgIGlmIChzbGlkZXIudmFycy5zbW9vdGhIZWlnaHQpIHsgbWV0aG9kcy5zbW9vdGhIZWlnaHQoKTsgfVxuICAgICAgICAgIH0sICh0eXBlID09PSBcImluaXRcIikgPyAxMDAgOiAwKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHsgLy8gRkFERTpcbiAgICAgICAgaWYoc2xpZGVyLnZhcnMucnRsKXtcbiAgICAgICAgICBzbGlkZXIuc2xpZGVzLmNzcyh7XCJ3aWR0aFwiOiBcIjEwMCVcIiwgXCJmbG9hdFwiOiAncmlnaHQnLCBcIm1hcmdpbkxlZnRcIjogXCItMTAwJVwiLCBcInBvc2l0aW9uXCI6IFwicmVsYXRpdmVcIn0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgc2xpZGVyLnNsaWRlcy5jc3Moe1wid2lkdGhcIjogXCIxMDAlXCIsIFwiZmxvYXRcIjogJ2xlZnQnLCBcIm1hcmdpblJpZ2h0XCI6IFwiLTEwMCVcIiwgXCJwb3NpdGlvblwiOiBcInJlbGF0aXZlXCJ9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZSA9PT0gXCJpbml0XCIpIHtcbiAgICAgICAgICBpZiAoIXRvdWNoKSB7XG4gICAgICAgICAgICAvL3NsaWRlci5zbGlkZXMuZXEoc2xpZGVyLmN1cnJlbnRTbGlkZSkuZmFkZUluKHNsaWRlci52YXJzLmFuaW1hdGlvblNwZWVkLCBzbGlkZXIudmFycy5lYXNpbmcpO1xuICAgICAgICAgICAgaWYgKHNsaWRlci52YXJzLmZhZGVGaXJzdFNsaWRlID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIHNsaWRlci5zbGlkZXMuY3NzKHsgXCJvcGFjaXR5XCI6IDAsIFwiZGlzcGxheVwiOiBcImJsb2NrXCIsIFwiekluZGV4XCI6IDEgfSkuZXEoc2xpZGVyLmN1cnJlbnRTbGlkZSkuY3NzKHtcInpJbmRleFwiOiAyfSkuY3NzKHtcIm9wYWNpdHlcIjogMX0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc2xpZGVyLnNsaWRlcy5jc3MoeyBcIm9wYWNpdHlcIjogMCwgXCJkaXNwbGF5XCI6IFwiYmxvY2tcIiwgXCJ6SW5kZXhcIjogMSB9KS5lcShzbGlkZXIuY3VycmVudFNsaWRlKS5jc3Moe1wiekluZGV4XCI6IDJ9KS5hbmltYXRlKHtcIm9wYWNpdHlcIjogMX0sc2xpZGVyLnZhcnMuYW5pbWF0aW9uU3BlZWQsc2xpZGVyLnZhcnMuZWFzaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2xpZGVyLnNsaWRlcy5jc3MoeyBcIm9wYWNpdHlcIjogMCwgXCJkaXNwbGF5XCI6IFwiYmxvY2tcIiwgXCJ3ZWJraXRUcmFuc2l0aW9uXCI6IFwib3BhY2l0eSBcIiArIHNsaWRlci52YXJzLmFuaW1hdGlvblNwZWVkIC8gMTAwMCArIFwicyBlYXNlXCIsIFwiekluZGV4XCI6IDEgfSkuZXEoc2xpZGVyLmN1cnJlbnRTbGlkZSkuY3NzKHsgXCJvcGFjaXR5XCI6IDEsIFwiekluZGV4XCI6IDJ9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gU01PT1RIIEhFSUdIVDpcbiAgICAgICAgaWYgKHNsaWRlci52YXJzLnNtb290aEhlaWdodCkgeyBtZXRob2RzLnNtb290aEhlaWdodCgpOyB9XG4gICAgICB9XG4gICAgICAvLyAhQ0FST1VTRUw6XG4gICAgICAvLyBDQU5ESURBVEU6IGFjdGl2ZSBzbGlkZVxuICAgICAgaWYgKCFjYXJvdXNlbCkgeyBzbGlkZXIuc2xpZGVzLnJlbW92ZUNsYXNzKG5hbWVzcGFjZSArIFwiYWN0aXZlLXNsaWRlXCIpLmVxKHNsaWRlci5jdXJyZW50U2xpZGUpLmFkZENsYXNzKG5hbWVzcGFjZSArIFwiYWN0aXZlLXNsaWRlXCIpOyB9XG5cbiAgICAgIC8vRmxleFNsaWRlcjogaW5pdCgpIENhbGxiYWNrXG4gICAgICBzbGlkZXIudmFycy5pbml0KHNsaWRlcik7XG4gICAgfTtcblxuICAgIHNsaWRlci5kb01hdGggPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzbGlkZSA9IHNsaWRlci5zbGlkZXMuZmlyc3QoKSxcbiAgICAgICAgICBzbGlkZU1hcmdpbiA9IHNsaWRlci52YXJzLml0ZW1NYXJnaW4sXG4gICAgICAgICAgbWluSXRlbXMgPSBzbGlkZXIudmFycy5taW5JdGVtcyxcbiAgICAgICAgICBtYXhJdGVtcyA9IHNsaWRlci52YXJzLm1heEl0ZW1zO1xuXG4gICAgICBzbGlkZXIudyA9IChzbGlkZXIudmlld3BvcnQ9PT11bmRlZmluZWQpID8gc2xpZGVyLndpZHRoKCkgOiBzbGlkZXIudmlld3BvcnQud2lkdGgoKTtcbiAgICAgIGlmIChzbGlkZXIuaXNGaXJlZm94KSB7IHNsaWRlci53ID0gc2xpZGVyLndpZHRoKCk7IH1cbiAgICAgIHNsaWRlci5oID0gc2xpZGUuaGVpZ2h0KCk7XG4gICAgICBzbGlkZXIuYm94UGFkZGluZyA9IHNsaWRlLm91dGVyV2lkdGgoKSAtIHNsaWRlLndpZHRoKCk7XG5cbiAgICAgIC8vIENBUk9VU0VMOlxuICAgICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICAgIHNsaWRlci5pdGVtVCA9IHNsaWRlci52YXJzLml0ZW1XaWR0aCArIHNsaWRlTWFyZ2luO1xuICAgICAgICBzbGlkZXIuaXRlbU0gPSBzbGlkZU1hcmdpbjtcbiAgICAgICAgc2xpZGVyLm1pblcgPSAobWluSXRlbXMpID8gbWluSXRlbXMgKiBzbGlkZXIuaXRlbVQgOiBzbGlkZXIudztcbiAgICAgICAgc2xpZGVyLm1heFcgPSAobWF4SXRlbXMpID8gKG1heEl0ZW1zICogc2xpZGVyLml0ZW1UKSAtIHNsaWRlTWFyZ2luIDogc2xpZGVyLnc7XG4gICAgICAgIHNsaWRlci5pdGVtVyA9IChzbGlkZXIubWluVyA+IHNsaWRlci53KSA/IChzbGlkZXIudyAtIChzbGlkZU1hcmdpbiAqIChtaW5JdGVtcyAtIDEpKSkvbWluSXRlbXMgOlxuICAgICAgICAgICAgICAgICAgICAgICAoc2xpZGVyLm1heFcgPCBzbGlkZXIudykgPyAoc2xpZGVyLncgLSAoc2xpZGVNYXJnaW4gKiAobWF4SXRlbXMgLSAxKSkpL21heEl0ZW1zIDpcbiAgICAgICAgICAgICAgICAgICAgICAgKHNsaWRlci52YXJzLml0ZW1XaWR0aCA+IHNsaWRlci53KSA/IHNsaWRlci53IDogc2xpZGVyLnZhcnMuaXRlbVdpZHRoO1xuXG4gICAgICAgIHNsaWRlci52aXNpYmxlID0gTWF0aC5mbG9vcihzbGlkZXIudy8oc2xpZGVyLml0ZW1XKSk7XG4gICAgICAgIHNsaWRlci5tb3ZlID0gKHNsaWRlci52YXJzLm1vdmUgPiAwICYmIHNsaWRlci52YXJzLm1vdmUgPCBzbGlkZXIudmlzaWJsZSApID8gc2xpZGVyLnZhcnMubW92ZSA6IHNsaWRlci52aXNpYmxlO1xuICAgICAgICBzbGlkZXIucGFnaW5nQ291bnQgPSBNYXRoLmNlaWwoKChzbGlkZXIuY291bnQgLSBzbGlkZXIudmlzaWJsZSkvc2xpZGVyLm1vdmUpICsgMSk7XG4gICAgICAgIHNsaWRlci5sYXN0ID0gIHNsaWRlci5wYWdpbmdDb3VudCAtIDE7XG4gICAgICAgIHNsaWRlci5saW1pdCA9IChzbGlkZXIucGFnaW5nQ291bnQgPT09IDEpID8gMCA6XG4gICAgICAgICAgICAgICAgICAgICAgIChzbGlkZXIudmFycy5pdGVtV2lkdGggPiBzbGlkZXIudykgPyAoc2xpZGVyLml0ZW1XICogKHNsaWRlci5jb3VudCAtIDEpKSArIChzbGlkZU1hcmdpbiAqIChzbGlkZXIuY291bnQgLSAxKSkgOiAoKHNsaWRlci5pdGVtVyArIHNsaWRlTWFyZ2luKSAqIHNsaWRlci5jb3VudCkgLSBzbGlkZXIudyAtIHNsaWRlTWFyZ2luO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2xpZGVyLml0ZW1XID0gc2xpZGVyLnc7XG4gICAgICAgIHNsaWRlci5pdGVtTSA9IHNsaWRlTWFyZ2luO1xuICAgICAgICBzbGlkZXIucGFnaW5nQ291bnQgPSBzbGlkZXIuY291bnQ7XG4gICAgICAgIHNsaWRlci5sYXN0ID0gc2xpZGVyLmNvdW50IC0gMTtcbiAgICAgIH1cbiAgICAgIHNsaWRlci5jb21wdXRlZFcgPSBzbGlkZXIuaXRlbVcgLSBzbGlkZXIuYm94UGFkZGluZztcbiAgICAgIHNsaWRlci5jb21wdXRlZE0gPSBzbGlkZXIuaXRlbU07XG4gICAgfTtcblxuICAgIHNsaWRlci51cGRhdGUgPSBmdW5jdGlvbihwb3MsIGFjdGlvbikge1xuICAgICAgc2xpZGVyLmRvTWF0aCgpO1xuXG4gICAgICAvLyB1cGRhdGUgY3VycmVudFNsaWRlIGFuZCBzbGlkZXIuYW5pbWF0aW5nVG8gaWYgbmVjZXNzYXJ5XG4gICAgICBpZiAoIWNhcm91c2VsKSB7XG4gICAgICAgIGlmIChwb3MgPCBzbGlkZXIuY3VycmVudFNsaWRlKSB7XG4gICAgICAgICAgc2xpZGVyLmN1cnJlbnRTbGlkZSArPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKHBvcyA8PSBzbGlkZXIuY3VycmVudFNsaWRlICYmIHBvcyAhPT0gMCkge1xuICAgICAgICAgIHNsaWRlci5jdXJyZW50U2xpZGUgLT0gMTtcbiAgICAgICAgfVxuICAgICAgICBzbGlkZXIuYW5pbWF0aW5nVG8gPSBzbGlkZXIuY3VycmVudFNsaWRlO1xuICAgICAgfVxuXG4gICAgICAvLyB1cGRhdGUgY29udHJvbE5hdlxuICAgICAgaWYgKHNsaWRlci52YXJzLmNvbnRyb2xOYXYgJiYgIXNsaWRlci5tYW51YWxDb250cm9scykge1xuICAgICAgICBpZiAoKGFjdGlvbiA9PT0gXCJhZGRcIiAmJiAhY2Fyb3VzZWwpIHx8IHNsaWRlci5wYWdpbmdDb3VudCA+IHNsaWRlci5jb250cm9sTmF2Lmxlbmd0aCkge1xuICAgICAgICAgIG1ldGhvZHMuY29udHJvbE5hdi51cGRhdGUoXCJhZGRcIik7XG4gICAgICAgIH0gZWxzZSBpZiAoKGFjdGlvbiA9PT0gXCJyZW1vdmVcIiAmJiAhY2Fyb3VzZWwpIHx8IHNsaWRlci5wYWdpbmdDb3VudCA8IHNsaWRlci5jb250cm9sTmF2Lmxlbmd0aCkge1xuICAgICAgICAgIGlmIChjYXJvdXNlbCAmJiBzbGlkZXIuY3VycmVudFNsaWRlID4gc2xpZGVyLmxhc3QpIHtcbiAgICAgICAgICAgIHNsaWRlci5jdXJyZW50U2xpZGUgLT0gMTtcbiAgICAgICAgICAgIHNsaWRlci5hbmltYXRpbmdUbyAtPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtZXRob2RzLmNvbnRyb2xOYXYudXBkYXRlKFwicmVtb3ZlXCIsIHNsaWRlci5sYXN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gdXBkYXRlIGRpcmVjdGlvbk5hdlxuICAgICAgaWYgKHNsaWRlci52YXJzLmRpcmVjdGlvbk5hdikgeyBtZXRob2RzLmRpcmVjdGlvbk5hdi51cGRhdGUoKTsgfVxuXG4gICAgfTtcblxuICAgIHNsaWRlci5hZGRTbGlkZSA9IGZ1bmN0aW9uKG9iaiwgcG9zKSB7XG4gICAgICB2YXIgJG9iaiA9ICQob2JqKTtcblxuICAgICAgc2xpZGVyLmNvdW50ICs9IDE7XG4gICAgICBzbGlkZXIubGFzdCA9IHNsaWRlci5jb3VudCAtIDE7XG5cbiAgICAgIC8vIGFwcGVuZCBuZXcgc2xpZGVcbiAgICAgIGlmICh2ZXJ0aWNhbCAmJiByZXZlcnNlKSB7XG4gICAgICAgIChwb3MgIT09IHVuZGVmaW5lZCkgPyBzbGlkZXIuc2xpZGVzLmVxKHNsaWRlci5jb3VudCAtIHBvcykuYWZ0ZXIoJG9iaikgOiBzbGlkZXIuY29udGFpbmVyLnByZXBlbmQoJG9iaik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAocG9zICE9PSB1bmRlZmluZWQpID8gc2xpZGVyLnNsaWRlcy5lcShwb3MpLmJlZm9yZSgkb2JqKSA6IHNsaWRlci5jb250YWluZXIuYXBwZW5kKCRvYmopO1xuICAgICAgfVxuXG4gICAgICAvLyB1cGRhdGUgY3VycmVudFNsaWRlLCBhbmltYXRpbmdUbywgY29udHJvbE5hdiwgYW5kIGRpcmVjdGlvbk5hdlxuICAgICAgc2xpZGVyLnVwZGF0ZShwb3MsIFwiYWRkXCIpO1xuXG4gICAgICAvLyB1cGRhdGUgc2xpZGVyLnNsaWRlc1xuICAgICAgc2xpZGVyLnNsaWRlcyA9ICQoc2xpZGVyLnZhcnMuc2VsZWN0b3IgKyAnOm5vdCguY2xvbmUpJywgc2xpZGVyKTtcbiAgICAgIC8vIHJlLXNldHVwIHRoZSBzbGlkZXIgdG8gYWNjb21kYXRlIG5ldyBzbGlkZVxuICAgICAgc2xpZGVyLnNldHVwKCk7XG5cbiAgICAgIC8vRmxleFNsaWRlcjogYWRkZWQoKSBDYWxsYmFja1xuICAgICAgc2xpZGVyLnZhcnMuYWRkZWQoc2xpZGVyKTtcbiAgICB9O1xuICAgIHNsaWRlci5yZW1vdmVTbGlkZSA9IGZ1bmN0aW9uKG9iaikge1xuICAgICAgdmFyIHBvcyA9IChpc05hTihvYmopKSA/IHNsaWRlci5zbGlkZXMuaW5kZXgoJChvYmopKSA6IG9iajtcblxuICAgICAgLy8gdXBkYXRlIGNvdW50XG4gICAgICBzbGlkZXIuY291bnQgLT0gMTtcbiAgICAgIHNsaWRlci5sYXN0ID0gc2xpZGVyLmNvdW50IC0gMTtcblxuICAgICAgLy8gcmVtb3ZlIHNsaWRlXG4gICAgICBpZiAoaXNOYU4ob2JqKSkge1xuICAgICAgICAkKG9iaiwgc2xpZGVyLnNsaWRlcykucmVtb3ZlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAodmVydGljYWwgJiYgcmV2ZXJzZSkgPyBzbGlkZXIuc2xpZGVzLmVxKHNsaWRlci5sYXN0KS5yZW1vdmUoKSA6IHNsaWRlci5zbGlkZXMuZXEob2JqKS5yZW1vdmUoKTtcbiAgICAgIH1cblxuICAgICAgLy8gdXBkYXRlIGN1cnJlbnRTbGlkZSwgYW5pbWF0aW5nVG8sIGNvbnRyb2xOYXYsIGFuZCBkaXJlY3Rpb25OYXZcbiAgICAgIHNsaWRlci5kb01hdGgoKTtcbiAgICAgIHNsaWRlci51cGRhdGUocG9zLCBcInJlbW92ZVwiKTtcblxuICAgICAgLy8gdXBkYXRlIHNsaWRlci5zbGlkZXNcbiAgICAgIHNsaWRlci5zbGlkZXMgPSAkKHNsaWRlci52YXJzLnNlbGVjdG9yICsgJzpub3QoLmNsb25lKScsIHNsaWRlcik7XG4gICAgICAvLyByZS1zZXR1cCB0aGUgc2xpZGVyIHRvIGFjY29tZGF0ZSBuZXcgc2xpZGVcbiAgICAgIHNsaWRlci5zZXR1cCgpO1xuXG4gICAgICAvLyBGbGV4U2xpZGVyOiByZW1vdmVkKCkgQ2FsbGJhY2tcbiAgICAgIHNsaWRlci52YXJzLnJlbW92ZWQoc2xpZGVyKTtcbiAgICB9O1xuXG4gICAgLy9GbGV4U2xpZGVyOiBJbml0aWFsaXplXG4gICAgbWV0aG9kcy5pbml0KCk7XG4gIH07XG5cbiAgLy8gRW5zdXJlIHRoZSBzbGlkZXIgaXNuJ3QgZm9jdXNzZWQgaWYgdGhlIHdpbmRvdyBsb3NlcyBmb2N1cy5cbiAgJCggd2luZG93ICkuYmx1ciggZnVuY3Rpb24gKCBlICkge1xuICAgIGZvY3VzZWQgPSBmYWxzZTtcbiAgfSkuZm9jdXMoIGZ1bmN0aW9uICggZSApIHtcbiAgICBmb2N1c2VkID0gdHJ1ZTtcbiAgfSk7XG5cbiAgLy9GbGV4U2xpZGVyOiBEZWZhdWx0IFNldHRpbmdzXG4gICQuZmxleHNsaWRlci5kZWZhdWx0cyA9IHtcbiAgICBuYW1lc3BhY2U6IFwiZmxleC1cIiwgICAgICAgICAgICAgLy97TkVXfSBTdHJpbmc6IFByZWZpeCBzdHJpbmcgYXR0YWNoZWQgdG8gdGhlIGNsYXNzIG9mIGV2ZXJ5IGVsZW1lbnQgZ2VuZXJhdGVkIGJ5IHRoZSBwbHVnaW5cbiAgICBzZWxlY3RvcjogXCIuc2xpZGVzID4gbGlcIiwgICAgICAgLy97TkVXfSBTZWxlY3RvcjogTXVzdCBtYXRjaCBhIHNpbXBsZSBwYXR0ZXJuLiAne2NvbnRhaW5lcn0gPiB7c2xpZGV9JyAtLSBJZ25vcmUgcGF0dGVybiBhdCB5b3VyIG93biBwZXJpbFxuICAgIGFuaW1hdGlvbjogXCJmYWRlXCIsICAgICAgICAgICAgICAvL1N0cmluZzogU2VsZWN0IHlvdXIgYW5pbWF0aW9uIHR5cGUsIFwiZmFkZVwiIG9yIFwic2xpZGVcIlxuICAgIGVhc2luZzogXCJzd2luZ1wiLCAgICAgICAgICAgICAgICAvL3tORVd9IFN0cmluZzogRGV0ZXJtaW5lcyB0aGUgZWFzaW5nIG1ldGhvZCB1c2VkIGluIGpRdWVyeSB0cmFuc2l0aW9ucy4galF1ZXJ5IGVhc2luZyBwbHVnaW4gaXMgc3VwcG9ydGVkIVxuICAgIGRpcmVjdGlvbjogXCJob3Jpem9udGFsXCIsICAgICAgICAvL1N0cmluZzogU2VsZWN0IHRoZSBzbGlkaW5nIGRpcmVjdGlvbiwgXCJob3Jpem9udGFsXCIgb3IgXCJ2ZXJ0aWNhbFwiXG4gICAgcmV2ZXJzZTogZmFsc2UsICAgICAgICAgICAgICAgICAvL3tORVd9IEJvb2xlYW46IFJldmVyc2UgdGhlIGFuaW1hdGlvbiBkaXJlY3Rpb25cbiAgICBhbmltYXRpb25Mb29wOiB0cnVlLCAgICAgICAgICAgIC8vQm9vbGVhbjogU2hvdWxkIHRoZSBhbmltYXRpb24gbG9vcD8gSWYgZmFsc2UsIGRpcmVjdGlvbk5hdiB3aWxsIHJlY2VpdmVkIFwiZGlzYWJsZVwiIGNsYXNzZXMgYXQgZWl0aGVyIGVuZFxuICAgIHNtb290aEhlaWdodDogZmFsc2UsICAgICAgICAgICAgLy97TkVXfSBCb29sZWFuOiBBbGxvdyBoZWlnaHQgb2YgdGhlIHNsaWRlciB0byBhbmltYXRlIHNtb290aGx5IGluIGhvcml6b250YWwgbW9kZVxuICAgIHN0YXJ0QXQ6IDAsICAgICAgICAgICAgICAgICAgICAgLy9JbnRlZ2VyOiBUaGUgc2xpZGUgdGhhdCB0aGUgc2xpZGVyIHNob3VsZCBzdGFydCBvbi4gQXJyYXkgbm90YXRpb24gKDAgPSBmaXJzdCBzbGlkZSlcbiAgICBzbGlkZXNob3c6IHRydWUsICAgICAgICAgICAgICAgIC8vQm9vbGVhbjogQW5pbWF0ZSBzbGlkZXIgYXV0b21hdGljYWxseVxuICAgIHNsaWRlc2hvd1NwZWVkOiA3MDAwLCAgICAgICAgICAgLy9JbnRlZ2VyOiBTZXQgdGhlIHNwZWVkIG9mIHRoZSBzbGlkZXNob3cgY3ljbGluZywgaW4gbWlsbGlzZWNvbmRzXG4gICAgYW5pbWF0aW9uU3BlZWQ6IDYwMCwgICAgICAgICAgICAvL0ludGVnZXI6IFNldCB0aGUgc3BlZWQgb2YgYW5pbWF0aW9ucywgaW4gbWlsbGlzZWNvbmRzXG4gICAgaW5pdERlbGF5OiAwLCAgICAgICAgICAgICAgICAgICAvL3tORVd9IEludGVnZXI6IFNldCBhbiBpbml0aWFsaXphdGlvbiBkZWxheSwgaW4gbWlsbGlzZWNvbmRzXG4gICAgcmFuZG9taXplOiBmYWxzZSwgICAgICAgICAgICAgICAvL0Jvb2xlYW46IFJhbmRvbWl6ZSBzbGlkZSBvcmRlclxuICAgIGZhZGVGaXJzdFNsaWRlOiB0cnVlLCAgICAgICAgICAgLy9Cb29sZWFuOiBGYWRlIGluIHRoZSBmaXJzdCBzbGlkZSB3aGVuIGFuaW1hdGlvbiB0eXBlIGlzIFwiZmFkZVwiXG4gICAgdGh1bWJDYXB0aW9uczogZmFsc2UsICAgICAgICAgICAvL0Jvb2xlYW46IFdoZXRoZXIgb3Igbm90IHRvIHB1dCBjYXB0aW9ucyBvbiB0aHVtYm5haWxzIHdoZW4gdXNpbmcgdGhlIFwidGh1bWJuYWlsc1wiIGNvbnRyb2xOYXYuXG5cbiAgICAvLyBVc2FiaWxpdHkgZmVhdHVyZXNcbiAgICBwYXVzZU9uQWN0aW9uOiB0cnVlLCAgICAgICAgICAgIC8vQm9vbGVhbjogUGF1c2UgdGhlIHNsaWRlc2hvdyB3aGVuIGludGVyYWN0aW5nIHdpdGggY29udHJvbCBlbGVtZW50cywgaGlnaGx5IHJlY29tbWVuZGVkLlxuICAgIHBhdXNlT25Ib3ZlcjogZmFsc2UsICAgICAgICAgICAgLy9Cb29sZWFuOiBQYXVzZSB0aGUgc2xpZGVzaG93IHdoZW4gaG92ZXJpbmcgb3ZlciBzbGlkZXIsIHRoZW4gcmVzdW1lIHdoZW4gbm8gbG9uZ2VyIGhvdmVyaW5nXG4gICAgcGF1c2VJbnZpc2libGU6IHRydWUsICAgICAgIC8ve05FV30gQm9vbGVhbjogUGF1c2UgdGhlIHNsaWRlc2hvdyB3aGVuIHRhYiBpcyBpbnZpc2libGUsIHJlc3VtZSB3aGVuIHZpc2libGUuIFByb3ZpZGVzIGJldHRlciBVWCwgbG93ZXIgQ1BVIHVzYWdlLlxuICAgIHVzZUNTUzogdHJ1ZSwgICAgICAgICAgICAgICAgICAgLy97TkVXfSBCb29sZWFuOiBTbGlkZXIgd2lsbCB1c2UgQ1NTMyB0cmFuc2l0aW9ucyBpZiBhdmFpbGFibGVcbiAgICB0b3VjaDogdHJ1ZSwgICAgICAgICAgICAgICAgICAgIC8ve05FV30gQm9vbGVhbjogQWxsb3cgdG91Y2ggc3dpcGUgbmF2aWdhdGlvbiBvZiB0aGUgc2xpZGVyIG9uIHRvdWNoLWVuYWJsZWQgZGV2aWNlc1xuICAgIHZpZGVvOiBmYWxzZSwgICAgICAgICAgICAgICAgICAgLy97TkVXfSBCb29sZWFuOiBJZiB1c2luZyB2aWRlbyBpbiB0aGUgc2xpZGVyLCB3aWxsIHByZXZlbnQgQ1NTMyAzRCBUcmFuc2Zvcm1zIHRvIGF2b2lkIGdyYXBoaWNhbCBnbGl0Y2hlc1xuXG4gICAgLy8gUHJpbWFyeSBDb250cm9sc1xuICAgIGNvbnRyb2xOYXY6IHRydWUsICAgICAgICAgICAgICAgLy9Cb29sZWFuOiBDcmVhdGUgbmF2aWdhdGlvbiBmb3IgcGFnaW5nIGNvbnRyb2wgb2YgZWFjaCBzbGlkZT8gTm90ZTogTGVhdmUgdHJ1ZSBmb3IgbWFudWFsQ29udHJvbHMgdXNhZ2VcbiAgICBkaXJlY3Rpb25OYXY6IHRydWUsICAgICAgICAgICAgIC8vQm9vbGVhbjogQ3JlYXRlIG5hdmlnYXRpb24gZm9yIHByZXZpb3VzL25leHQgbmF2aWdhdGlvbj8gKHRydWUvZmFsc2UpXG4gICAgcHJldlRleHQ6IFwiUHJldmlvdXNcIiwgICAgICAgICAgIC8vU3RyaW5nOiBTZXQgdGhlIHRleHQgZm9yIHRoZSBcInByZXZpb3VzXCIgZGlyZWN0aW9uTmF2IGl0ZW1cbiAgICBuZXh0VGV4dDogXCJOZXh0XCIsICAgICAgICAgICAgICAgLy9TdHJpbmc6IFNldCB0aGUgdGV4dCBmb3IgdGhlIFwibmV4dFwiIGRpcmVjdGlvbk5hdiBpdGVtXG5cbiAgICAvLyBTZWNvbmRhcnkgTmF2aWdhdGlvblxuICAgIGtleWJvYXJkOiB0cnVlLCAgICAgICAgICAgICAgICAgLy9Cb29sZWFuOiBBbGxvdyBzbGlkZXIgbmF2aWdhdGluZyB2aWEga2V5Ym9hcmQgbGVmdC9yaWdodCBrZXlzXG4gICAgbXVsdGlwbGVLZXlib2FyZDogZmFsc2UsICAgICAgICAvL3tORVd9IEJvb2xlYW46IEFsbG93IGtleWJvYXJkIG5hdmlnYXRpb24gdG8gYWZmZWN0IG11bHRpcGxlIHNsaWRlcnMuIERlZmF1bHQgYmVoYXZpb3IgY3V0cyBvdXQga2V5Ym9hcmQgbmF2aWdhdGlvbiB3aXRoIG1vcmUgdGhhbiBvbmUgc2xpZGVyIHByZXNlbnQuXG4gICAgbW91c2V3aGVlbDogZmFsc2UsICAgICAgICAgICAgICAvL3tVUERBVEVEfSBCb29sZWFuOiBSZXF1aXJlcyBqcXVlcnkubW91c2V3aGVlbC5qcyAoaHR0cHM6Ly9naXRodWIuY29tL2JyYW5kb25hYXJvbi9qcXVlcnktbW91c2V3aGVlbCkgLSBBbGxvd3Mgc2xpZGVyIG5hdmlnYXRpbmcgdmlhIG1vdXNld2hlZWxcbiAgICBwYXVzZVBsYXk6IGZhbHNlLCAgICAgICAgICAgICAgIC8vQm9vbGVhbjogQ3JlYXRlIHBhdXNlL3BsYXkgZHluYW1pYyBlbGVtZW50XG4gICAgcGF1c2VUZXh0OiBcIlBhdXNlXCIsICAgICAgICAgICAgIC8vU3RyaW5nOiBTZXQgdGhlIHRleHQgZm9yIHRoZSBcInBhdXNlXCIgcGF1c2VQbGF5IGl0ZW1cbiAgICBwbGF5VGV4dDogXCJQbGF5XCIsICAgICAgICAgICAgICAgLy9TdHJpbmc6IFNldCB0aGUgdGV4dCBmb3IgdGhlIFwicGxheVwiIHBhdXNlUGxheSBpdGVtXG5cbiAgICAvLyBTcGVjaWFsIHByb3BlcnRpZXNcbiAgICBjb250cm9sc0NvbnRhaW5lcjogXCJcIiwgICAgICAgICAgLy97VVBEQVRFRH0galF1ZXJ5IE9iamVjdC9TZWxlY3RvcjogRGVjbGFyZSB3aGljaCBjb250YWluZXIgdGhlIG5hdmlnYXRpb24gZWxlbWVudHMgc2hvdWxkIGJlIGFwcGVuZGVkIHRvby4gRGVmYXVsdCBjb250YWluZXIgaXMgdGhlIEZsZXhTbGlkZXIgZWxlbWVudC4gRXhhbXBsZSB1c2Ugd291bGQgYmUgJChcIi5mbGV4c2xpZGVyLWNvbnRhaW5lclwiKS4gUHJvcGVydHkgaXMgaWdub3JlZCBpZiBnaXZlbiBlbGVtZW50IGlzIG5vdCBmb3VuZC5cbiAgICBtYW51YWxDb250cm9sczogXCJcIiwgICAgICAgICAgICAgLy97VVBEQVRFRH0galF1ZXJ5IE9iamVjdC9TZWxlY3RvcjogRGVjbGFyZSBjdXN0b20gY29udHJvbCBuYXZpZ2F0aW9uLiBFeGFtcGxlcyB3b3VsZCBiZSAkKFwiLmZsZXgtY29udHJvbC1uYXYgbGlcIikgb3IgXCIjdGFicy1uYXYgbGkgaW1nXCIsIGV0Yy4gVGhlIG51bWJlciBvZiBlbGVtZW50cyBpbiB5b3VyIGNvbnRyb2xOYXYgc2hvdWxkIG1hdGNoIHRoZSBudW1iZXIgb2Ygc2xpZGVzL3RhYnMuXG4gICAgY3VzdG9tRGlyZWN0aW9uTmF2OiBcIlwiLCAgICAgICAgIC8ve05FV30galF1ZXJ5IE9iamVjdC9TZWxlY3RvcjogQ3VzdG9tIHByZXYgLyBuZXh0IGJ1dHRvbi4gTXVzdCBiZSB0d28galF1ZXJ5IGVsZW1lbnRzLiBJbiBvcmRlciB0byBtYWtlIHRoZSBldmVudHMgd29yayB0aGV5IGhhdmUgdG8gaGF2ZSB0aGUgY2xhc3NlcyBcInByZXZcIiBhbmQgXCJuZXh0XCIgKHBsdXMgbmFtZXNwYWNlKVxuICAgIHN5bmM6IFwiXCIsICAgICAgICAgICAgICAgICAgICAgICAvL3tORVd9IFNlbGVjdG9yOiBNaXJyb3IgdGhlIGFjdGlvbnMgcGVyZm9ybWVkIG9uIHRoaXMgc2xpZGVyIHdpdGggYW5vdGhlciBzbGlkZXIuIFVzZSB3aXRoIGNhcmUuXG4gICAgYXNOYXZGb3I6IFwiXCIsICAgICAgICAgICAgICAgICAgIC8ve05FV30gU2VsZWN0b3I6IEludGVybmFsIHByb3BlcnR5IGV4cG9zZWQgZm9yIHR1cm5pbmcgdGhlIHNsaWRlciBpbnRvIGEgdGh1bWJuYWlsIG5hdmlnYXRpb24gZm9yIGFub3RoZXIgc2xpZGVyXG5cbiAgICAvLyBDYXJvdXNlbCBPcHRpb25zXG4gICAgaXRlbVdpZHRoOiAwLCAgICAgICAgICAgICAgICAgICAvL3tORVd9IEludGVnZXI6IEJveC1tb2RlbCB3aWR0aCBvZiBpbmRpdmlkdWFsIGNhcm91c2VsIGl0ZW1zLCBpbmNsdWRpbmcgaG9yaXpvbnRhbCBib3JkZXJzIGFuZCBwYWRkaW5nLlxuICAgIGl0ZW1NYXJnaW46IDAsICAgICAgICAgICAgICAgICAgLy97TkVXfSBJbnRlZ2VyOiBNYXJnaW4gYmV0d2VlbiBjYXJvdXNlbCBpdGVtcy5cbiAgICBtaW5JdGVtczogMSwgICAgICAgICAgICAgICAgICAgIC8ve05FV30gSW50ZWdlcjogTWluaW11bSBudW1iZXIgb2YgY2Fyb3VzZWwgaXRlbXMgdGhhdCBzaG91bGQgYmUgdmlzaWJsZS4gSXRlbXMgd2lsbCByZXNpemUgZmx1aWRseSB3aGVuIGJlbG93IHRoaXMuXG4gICAgbWF4SXRlbXM6IDAsICAgICAgICAgICAgICAgICAgICAvL3tORVd9IEludGVnZXI6IE1heG1pbXVtIG51bWJlciBvZiBjYXJvdXNlbCBpdGVtcyB0aGF0IHNob3VsZCBiZSB2aXNpYmxlLiBJdGVtcyB3aWxsIHJlc2l6ZSBmbHVpZGx5IHdoZW4gYWJvdmUgdGhpcyBsaW1pdC5cbiAgICBtb3ZlOiAwLCAgICAgICAgICAgICAgICAgICAgICAgIC8ve05FV30gSW50ZWdlcjogTnVtYmVyIG9mIGNhcm91c2VsIGl0ZW1zIHRoYXQgc2hvdWxkIG1vdmUgb24gYW5pbWF0aW9uLiBJZiAwLCBzbGlkZXIgd2lsbCBtb3ZlIGFsbCB2aXNpYmxlIGl0ZW1zLlxuICAgIGFsbG93T25lU2xpZGU6IHRydWUsICAgICAgICAgICAvL3tORVd9IEJvb2xlYW46IFdoZXRoZXIgb3Igbm90IHRvIGFsbG93IGEgc2xpZGVyIGNvbXByaXNlZCBvZiBhIHNpbmdsZSBzbGlkZVxuXG4gICAgLy8gQnJvd3NlciBTcGVjaWZpY1xuICAgIGlzRmlyZWZveDogZmFsc2UsICAgICAgICAgICAgIC8vIHtORVd9IEJvb2xlYW46IFNldCB0byB0cnVlIHdoZW4gRmlyZWZveCBpcyB0aGUgYnJvd3NlciB1c2VkLlxuXG4gICAgLy8gQ2FsbGJhY2sgQVBJXG4gICAgc3RhcnQ6IGZ1bmN0aW9uKCl7fSwgICAgICAgICAgICAvL0NhbGxiYWNrOiBmdW5jdGlvbihzbGlkZXIpIC0gRmlyZXMgd2hlbiB0aGUgc2xpZGVyIGxvYWRzIHRoZSBmaXJzdCBzbGlkZVxuICAgIGJlZm9yZTogZnVuY3Rpb24oKXt9LCAgICAgICAgICAgLy9DYWxsYmFjazogZnVuY3Rpb24oc2xpZGVyKSAtIEZpcmVzIGFzeW5jaHJvbm91c2x5IHdpdGggZWFjaCBzbGlkZXIgYW5pbWF0aW9uXG4gICAgYWZ0ZXI6IGZ1bmN0aW9uKCl7fSwgICAgICAgICAgICAvL0NhbGxiYWNrOiBmdW5jdGlvbihzbGlkZXIpIC0gRmlyZXMgYWZ0ZXIgZWFjaCBzbGlkZXIgYW5pbWF0aW9uIGNvbXBsZXRlc1xuICAgIGVuZDogZnVuY3Rpb24oKXt9LCAgICAgICAgICAgICAgLy9DYWxsYmFjazogZnVuY3Rpb24oc2xpZGVyKSAtIEZpcmVzIHdoZW4gdGhlIHNsaWRlciByZWFjaGVzIHRoZSBsYXN0IHNsaWRlIChhc3luY2hyb25vdXMpXG4gICAgYWRkZWQ6IGZ1bmN0aW9uKCl7fSwgICAgICAgICAgICAvL3tORVd9IENhbGxiYWNrOiBmdW5jdGlvbihzbGlkZXIpIC0gRmlyZXMgYWZ0ZXIgYSBzbGlkZSBpcyBhZGRlZFxuICAgIHJlbW92ZWQ6IGZ1bmN0aW9uKCl7fSwgICAgICAgICAgIC8ve05FV30gQ2FsbGJhY2s6IGZ1bmN0aW9uKHNsaWRlcikgLSBGaXJlcyBhZnRlciBhIHNsaWRlIGlzIHJlbW92ZWRcbiAgICBpbml0OiBmdW5jdGlvbigpIHt9LCAgICAgICAgICAgICAvL3tORVd9IENhbGxiYWNrOiBmdW5jdGlvbihzbGlkZXIpIC0gRmlyZXMgYWZ0ZXIgdGhlIHNsaWRlciBpcyBpbml0aWFsbHkgc2V0dXBcbiAgcnRsOiBmYWxzZSAgICAgICAgICAgICAvL3tORVd9IEJvb2xlYW46IFdoZXRoZXIgb3Igbm90IHRvIGVuYWJsZSBSVEwgbW9kZVxuICB9O1xuXG4gIC8vRmxleFNsaWRlcjogUGx1Z2luIEZ1bmN0aW9uXG4gICQuZm4uZmxleHNsaWRlciA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7IG9wdGlvbnMgPSB7fTsgfVxuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSBcIm9iamVjdFwiKSB7XG4gICAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgc2VsZWN0b3IgPSAob3B0aW9ucy5zZWxlY3RvcikgPyBvcHRpb25zLnNlbGVjdG9yIDogXCIuc2xpZGVzID4gbGlcIixcbiAgICAgICAgICAgICRzbGlkZXMgPSAkdGhpcy5maW5kKHNlbGVjdG9yKTtcblxuICAgICAgaWYgKCAoICRzbGlkZXMubGVuZ3RoID09PSAxICYmIG9wdGlvbnMuYWxsb3dPbmVTbGlkZSA9PT0gZmFsc2UgKSB8fCAkc2xpZGVzLmxlbmd0aCA9PT0gMCApIHtcbiAgICAgICAgICAkc2xpZGVzLmZhZGVJbig0MDApO1xuICAgICAgICAgIGlmIChvcHRpb25zLnN0YXJ0KSB7IG9wdGlvbnMuc3RhcnQoJHRoaXMpOyB9XG4gICAgICAgIH0gZWxzZSBpZiAoJHRoaXMuZGF0YSgnZmxleHNsaWRlcicpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBuZXcgJC5mbGV4c2xpZGVyKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSGVscGVyIHN0cmluZ3MgdG8gcXVpY2tseSBwZXJmb3JtIGZ1bmN0aW9ucyBvbiB0aGUgc2xpZGVyXG4gICAgICB2YXIgJHNsaWRlciA9ICQodGhpcykuZGF0YSgnZmxleHNsaWRlcicpO1xuICAgICAgc3dpdGNoIChvcHRpb25zKSB7XG4gICAgICAgIGNhc2UgXCJwbGF5XCI6ICRzbGlkZXIucGxheSgpOyBicmVhaztcbiAgICAgICAgY2FzZSBcInBhdXNlXCI6ICRzbGlkZXIucGF1c2UoKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzdG9wXCI6ICRzbGlkZXIuc3RvcCgpOyBicmVhaztcbiAgICAgICAgY2FzZSBcIm5leHRcIjogJHNsaWRlci5mbGV4QW5pbWF0ZSgkc2xpZGVyLmdldFRhcmdldChcIm5leHRcIiksIHRydWUpOyBicmVhaztcbiAgICAgICAgY2FzZSBcInByZXZcIjpcbiAgICAgICAgY2FzZSBcInByZXZpb3VzXCI6ICRzbGlkZXIuZmxleEFuaW1hdGUoJHNsaWRlci5nZXRUYXJnZXQoXCJwcmV2XCIpLCB0cnVlKTsgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6IGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJudW1iZXJcIikgeyAkc2xpZGVyLmZsZXhBbmltYXRlKG9wdGlvbnMsIHRydWUpOyB9XG4gICAgICB9XG4gICAgfVxuICB9O1xufSkoalF1ZXJ5KTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJ2YXIgbmV4dFRpY2sgPSByZXF1aXJlKCdwcm9jZXNzL2Jyb3dzZXIuanMnKS5uZXh0VGljaztcbnZhciBhcHBseSA9IEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseTtcbnZhciBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBpbW1lZGlhdGVJZHMgPSB7fTtcbnZhciBuZXh0SW1tZWRpYXRlSWQgPSAwO1xuXG4vLyBET00gQVBJcywgZm9yIGNvbXBsZXRlbmVzc1xuXG5leHBvcnRzLnNldFRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0VGltZW91dCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhclRpbWVvdXQpO1xufTtcbmV4cG9ydHMuc2V0SW50ZXJ2YWwgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIG5ldyBUaW1lb3V0KGFwcGx5LmNhbGwoc2V0SW50ZXJ2YWwsIHdpbmRvdywgYXJndW1lbnRzKSwgY2xlYXJJbnRlcnZhbCk7XG59O1xuZXhwb3J0cy5jbGVhclRpbWVvdXQgPVxuZXhwb3J0cy5jbGVhckludGVydmFsID0gZnVuY3Rpb24odGltZW91dCkgeyB0aW1lb3V0LmNsb3NlKCk7IH07XG5cbmZ1bmN0aW9uIFRpbWVvdXQoaWQsIGNsZWFyRm4pIHtcbiAgdGhpcy5faWQgPSBpZDtcbiAgdGhpcy5fY2xlYXJGbiA9IGNsZWFyRm47XG59XG5UaW1lb3V0LnByb3RvdHlwZS51bnJlZiA9IFRpbWVvdXQucHJvdG90eXBlLnJlZiA9IGZ1bmN0aW9uKCkge307XG5UaW1lb3V0LnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLl9jbGVhckZuLmNhbGwod2luZG93LCB0aGlzLl9pZCk7XG59O1xuXG4vLyBEb2VzIG5vdCBzdGFydCB0aGUgdGltZSwganVzdCBzZXRzIHVwIHRoZSBtZW1iZXJzIG5lZWRlZC5cbmV4cG9ydHMuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSwgbXNlY3MpIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IG1zZWNzO1xufTtcblxuZXhwb3J0cy51bmVucm9sbCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuICBpdGVtLl9pZGxlVGltZW91dCA9IC0xO1xufTtcblxuZXhwb3J0cy5fdW5yZWZBY3RpdmUgPSBleHBvcnRzLmFjdGl2ZSA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgY2xlYXJUaW1lb3V0KGl0ZW0uX2lkbGVUaW1lb3V0SWQpO1xuXG4gIHZhciBtc2VjcyA9IGl0ZW0uX2lkbGVUaW1lb3V0O1xuICBpZiAobXNlY3MgPj0gMCkge1xuICAgIGl0ZW0uX2lkbGVUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uIG9uVGltZW91dCgpIHtcbiAgICAgIGlmIChpdGVtLl9vblRpbWVvdXQpXG4gICAgICAgIGl0ZW0uX29uVGltZW91dCgpO1xuICAgIH0sIG1zZWNzKTtcbiAgfVxufTtcblxuLy8gVGhhdCdzIG5vdCBob3cgbm9kZS5qcyBpbXBsZW1lbnRzIGl0IGJ1dCB0aGUgZXhwb3NlZCBhcGkgaXMgdGhlIHNhbWUuXG5leHBvcnRzLnNldEltbWVkaWF0ZSA9IHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09IFwiZnVuY3Rpb25cIiA/IHNldEltbWVkaWF0ZSA6IGZ1bmN0aW9uKGZuKSB7XG4gIHZhciBpZCA9IG5leHRJbW1lZGlhdGVJZCsrO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPCAyID8gZmFsc2UgOiBzbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgaW1tZWRpYXRlSWRzW2lkXSA9IHRydWU7XG5cbiAgbmV4dFRpY2soZnVuY3Rpb24gb25OZXh0VGljaygpIHtcbiAgICBpZiAoaW1tZWRpYXRlSWRzW2lkXSkge1xuICAgICAgLy8gZm4uY2FsbCgpIGlzIGZhc3RlciBzbyB3ZSBvcHRpbWl6ZSBmb3IgdGhlIGNvbW1vbiB1c2UtY2FzZVxuICAgICAgLy8gQHNlZSBodHRwOi8vanNwZXJmLmNvbS9jYWxsLWFwcGx5LXNlZ3VcbiAgICAgIGlmIChhcmdzKSB7XG4gICAgICAgIGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm4uY2FsbChudWxsKTtcbiAgICAgIH1cbiAgICAgIC8vIFByZXZlbnQgaWRzIGZyb20gbGVha2luZ1xuICAgICAgZXhwb3J0cy5jbGVhckltbWVkaWF0ZShpZCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gaWQ7XG59O1xuXG5leHBvcnRzLmNsZWFySW1tZWRpYXRlID0gdHlwZW9mIGNsZWFySW1tZWRpYXRlID09PSBcImZ1bmN0aW9uXCIgPyBjbGVhckltbWVkaWF0ZSA6IGZ1bmN0aW9uKGlkKSB7XG4gIGRlbGV0ZSBpbW1lZGlhdGVJZHNbaWRdO1xufTsiXX0=
