(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
var page_minerali_organiche_loaded = 1;
global.page_minerali_organiche_loaded = page_minerali_organiche_loaded;

var flexsliderLoad = require('flexslider'),
    flexslider = require('../modules/slider');

page_minerali_organiche = {
	load: function () {
		this.flexslider();
	},
	flexslider: function () {
		slider = $('.org__slider');
		if (slider.length) {
			slider.each(function () {
				flexslider.prodsList(slider);
			});
		}
	}
};

$(window).on('load', function () {
	page_minerali_organiche.load();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc2NyaXB0cy9mdW5jdGlvbnMvcGFnZV9taW5lcmFsaV9vcmdhbmljaGUuanMiLCJhcHAvc2NyaXB0cy9tb2R1bGVzL3NsaWRlci5qcyIsIm5vZGVfbW9kdWxlcy9mbGV4c2xpZGVyL2pxdWVyeS5mbGV4c2xpZGVyLmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy90aW1lcnMtYnJvd3NlcmlmeS9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLElBQUksaUNBQWlDLENBQXJDO0FBQ0EsT0FBTyw4QkFBUCxHQUF3Qyw4QkFBeEM7O0FBRUEsSUFBSSxpQkFBaUIsUUFBUSxZQUFSLENBQXJCO0FBQUEsSUFDQyxhQUFhLFFBQVEsbUJBQVIsQ0FEZDs7QUFHQSwwQkFBMEI7QUFDekIsT0FBTSxZQUFVO0FBQ2YsT0FBSyxVQUFMO0FBQ0EsRUFId0I7QUFJekIsYUFBWSxZQUFVO0FBQ3JCLFdBQVMsRUFBRSxjQUFGLENBQVQ7QUFDQSxNQUFJLE9BQU8sTUFBWCxFQUFtQjtBQUNsQixVQUFPLElBQVAsQ0FBWSxZQUFXO0FBQ3RCLGVBQVcsU0FBWCxDQUFxQixNQUFyQjtBQUNBLElBRkQ7QUFHQTtBQUNEO0FBWHdCLENBQTFCOztBQWNBLEVBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxNQUFiLEVBQXFCLFlBQVU7QUFDOUIseUJBQXdCLElBQXhCO0FBQ0EsQ0FGRDs7Ozs7QUNwQkEsT0FBTyxPQUFQLEdBQWlCO0FBQ2hCLE9BQU0sWUFBVSxDQUNmLENBRmU7QUFHaEIsaUJBQWdCLFVBQVMsUUFBVCxFQUFtQixNQUFuQixFQUEwQjtBQUN6QyxJQUFFLFFBQUYsRUFBWSxVQUFaLENBQXVCO0FBQ25CLGNBQVcsT0FEUTtBQUVuQixlQUFZLEtBRk87QUFHbkIsaUJBQWMsS0FISztBQUluQixrQkFBZSxLQUpJO0FBS25CLG1CQUFpQixHQUxFO0FBTW5CLFVBQU8sS0FOWTtBQU9uQixVQUFPLFVBQVMsUUFBVCxFQUFtQixNQUFuQixFQUEwQjtBQUNuQyxlQUFXLFFBQVgsR0FBc0I7QUFDdEI7QUFUcUIsR0FBdkI7QUFXQSxJQUFFLE1BQUYsRUFBVSxVQUFWLENBQXFCO0FBQ2pCLGNBQVcsT0FETTtBQUVqQixpQkFBZ0IsS0FGQztBQUdwQixlQUFnQixJQUhJO0FBSXBCLGtCQUFnQixJQUpJO0FBS3BCLGtCQUFnQixJQUxJO0FBTXBCLGlCQUFnQixLQU5JO0FBT3BCLG1CQUFpQixHQVBHO0FBUXBCLG1CQUFpQixJQVJHO0FBU3BCLFVBQU8sSUFUYTtBQVVqQixTQUFNLFFBVlc7QUFXakIsVUFBTyxVQUFTLE1BQVQsRUFBZ0I7QUFDdEIsUUFBSSxjQUFjLEVBQUUsOEJBQUYsRUFBa0MsSUFBbEMsQ0FBdUMsT0FBdkMsQ0FBbEI7QUFDSCxNQUFFLDJCQUFGLEVBQStCLEdBQS9CLENBQW1DLGtCQUFuQyxFQUFzRCxXQUF0RDtBQUNHLElBZGdCO0FBZWpCLFdBQVEsVUFBUyxNQUFULEVBQWdCO0FBQ3ZCLE1BQUUsb0JBQUYsRUFBd0IsT0FBeEIsQ0FBZ0M7QUFDL0IsY0FBUztBQURzQixLQUFoQyxFQUVHLEdBRkg7QUFHQSxlQUFXLFlBQVU7QUFDcEIsT0FBRSxvQkFBRixFQUF3QixPQUF4QixDQUFnQztBQUMvQixlQUFTO0FBRHNCLE1BQWhDLEVBRUcsR0FGSDtBQUdBLEtBSkQsRUFJRyxHQUpIO0FBS0EsSUF4QmdCO0FBeUJqQixVQUFPLFVBQVMsTUFBVCxFQUFnQjtBQUN6QixRQUFJLGNBQWMsRUFBRSw4QkFBRixFQUFrQyxJQUFsQyxDQUF1QyxPQUF2QyxDQUFsQjtBQUNBLE1BQUUsMkJBQUYsRUFBK0IsR0FBL0IsQ0FBbUMsa0JBQW5DLEVBQXNELFdBQXREO0FBQ0EsZUFBVyxRQUFYO0FBQ0E7QUE3Qm1CLEdBQXJCO0FBK0JBLEVBOUNlO0FBK0NoQixZQUFXLFVBQVUsSUFBVixFQUFnQjtBQUMxQixNQUFHLEVBQUUsSUFBRixFQUFRLE1BQVIsS0FBaUIsQ0FBcEIsRUFBd0IsT0FBTyxLQUFQO0FBQ3hCLElBQUUsSUFBRixFQUFRLFVBQVIsQ0FBbUI7QUFDbEIsY0FBVyxPQURPO0FBRWxCLGNBQVcsWUFGTztBQUdsQixpQkFBZ0IsS0FIRTtBQUlsQixlQUFnQixJQUpFO0FBS2xCLGtCQUFnQixJQUxFO0FBTWxCLGtCQUFnQixJQU5FO0FBT2xCLGlCQUFnQixLQVBFO0FBUWxCLG1CQUFpQixHQVJDO0FBU2xCLG1CQUFpQixJQVRDO0FBVWxCLFVBQU8sS0FWVztBQVdsQixVQUFPLFVBQVMsSUFBVCxFQUFjO0FBQ2pCLFFBQUksY0FBYyxFQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsb0JBQWIsRUFBbUMsSUFBbkMsQ0FBd0MsT0FBeEMsQ0FBbEI7QUFDSCxNQUFFLElBQUYsRUFBUSxJQUFSLENBQWEscUJBQWIsRUFBb0MsR0FBcEMsQ0FBd0Msa0JBQXhDLEVBQTJELFdBQTNEO0FBQ0csSUFkYztBQWVsQixVQUFPLFVBQVMsSUFBVCxFQUFjO0FBQ3BCLFFBQUksY0FBYyxFQUFFLElBQUYsRUFBUSxJQUFSLENBQWEsb0JBQWIsRUFBbUMsSUFBbkMsQ0FBd0MsT0FBeEMsQ0FBbEI7QUFDQSxNQUFFLElBQUYsRUFBUSxJQUFSLENBQWEscUJBQWIsRUFBb0MsR0FBcEMsQ0FBd0Msa0JBQXhDLEVBQTJELFdBQTNEO0FBQ0EsZUFBVyxRQUFYO0FBQ0E7QUFuQmlCLEdBQW5CO0FBcUJBLEVBdEVlO0FBdUVoQixhQUFZLFVBQVUsSUFBVixFQUFnQjtBQUMzQixNQUFHLEVBQUUsSUFBRixFQUFRLE1BQVIsS0FBaUIsQ0FBcEIsRUFBd0IsT0FBTyxLQUFQO0FBQ3hCLElBQUUsSUFBRixFQUFRLFVBQVIsQ0FBbUI7QUFDbEIsY0FBVyxPQURPO0FBRWxCLGNBQVcsWUFGTztBQUdsQixpQkFBZ0IsS0FIRTtBQUlsQixlQUFnQixJQUpFO0FBS2xCLGtCQUFnQixJQUxFO0FBTWxCLGtCQUFnQixJQU5FO0FBT2xCLGlCQUFnQixLQVBFO0FBUWxCLG1CQUFpQixHQVJDO0FBU2xCLG1CQUFpQixJQVRDO0FBVWxCLFVBQU8sVUFBUyxNQUFULEVBQWdCO0FBQ3RCLGVBQVcsUUFBWDtBQUNBO0FBWmlCLEdBQW5CO0FBY0E7QUF2RmUsQ0FBakI7Ozs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcHVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4TEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJ2YXIgcGFnZV9taW5lcmFsaV9vcmdhbmljaGVfbG9hZGVkID0gMTtcclxuZ2xvYmFsLnBhZ2VfbWluZXJhbGlfb3JnYW5pY2hlX2xvYWRlZCA9IHBhZ2VfbWluZXJhbGlfb3JnYW5pY2hlX2xvYWRlZDtcclxuXHJcbnZhciBmbGV4c2xpZGVyTG9hZCA9IHJlcXVpcmUoJ2ZsZXhzbGlkZXInKSxcclxuXHRmbGV4c2xpZGVyID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9zbGlkZXInKTtcclxuXHJcbnBhZ2VfbWluZXJhbGlfb3JnYW5pY2hlID0ge1xyXG5cdGxvYWQ6IGZ1bmN0aW9uKCl7XHJcblx0XHR0aGlzLmZsZXhzbGlkZXIoKTtcclxuXHR9LFxyXG5cdGZsZXhzbGlkZXI6IGZ1bmN0aW9uKCl7XHJcblx0XHRzbGlkZXIgPSAkKCcub3JnX19zbGlkZXInKTtcclxuXHRcdGlmIChzbGlkZXIubGVuZ3RoKSB7XHRcdFxyXG5cdFx0XHRzbGlkZXIuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRmbGV4c2xpZGVyLnByb2RzTGlzdChzbGlkZXIpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9LFxyXG59XHJcblxyXG4kKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbigpe1xyXG5cdHBhZ2VfbWluZXJhbGlfb3JnYW5pY2hlLmxvYWQoKTtcclxufSkiLCJtb2R1bGUuZXhwb3J0cyA9IHtcblx0aW5pdDogZnVuY3Rpb24oKXtcblx0fSxcblx0aG9tZU1haW5TbGlkZXI6IGZ1bmN0aW9uKGNhcm91c2VsLCBzbGlkZXIpe1xuXHRcdCQoY2Fyb3VzZWwpLmZsZXhzbGlkZXIoe1xuXHRcdCAgICBhbmltYXRpb246IFwic2xpZGVcIixcblx0XHQgICAgY29udHJvbE5hdjogZmFsc2UsXG5cdFx0ICAgIGRpcmVjdGlvbk5hdjogZmFsc2UsXG5cdFx0ICAgIGFuaW1hdGlvbkxvb3A6IGZhbHNlLFxuXHRcdCAgICBhbmltYXRpb25TcGVlZDogIDkwMCxcblx0XHQgICAgdG91Y2g6IGZhbHNlLFxuXHRcdCAgICBhZnRlcjogZnVuY3Rpb24oY2Fyb3VzZWwsIHNsaWRlcil7XG5cdFx0XHRcdHNpdGVHbG9iYWwubGF6eUxvYWQoKTs7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0JChzbGlkZXIpLmZsZXhzbGlkZXIoe1xuXHRcdCAgICBhbmltYXRpb246IFwic2xpZGVcIixcblx0XHQgICAgZGlyZWN0aW9uTmF2OiAgIGZhbHNlLFxuXHRcdFx0Y29udHJvbE5hdjogICAgIHRydWUsXG5cdFx0XHRhbmltYXRpb25Mb29wOiAgdHJ1ZSxcblx0XHRcdHBhdXNlT25BY3Rpb246ICB0cnVlLFxuXHRcdFx0cGF1c2VPbkhvdmVyOiAgIGZhbHNlLFxuXHRcdFx0YW5pbWF0aW9uU3BlZWQ6ICA4MDAsXG5cdFx0XHRzbGlkZXNob3dTcGVlZDogIDUwMDAsXG5cdFx0XHR0b3VjaDogdHJ1ZSxcblx0XHQgICAgc3luYzogY2Fyb3VzZWwsXG5cdFx0ICAgIHN0YXJ0OiBmdW5jdGlvbihzbGlkZXIpe1xuXHRcdCAgICBcdHZhciBzbGlkZV9jb2xvciA9ICQoJyNjYXJvdXNlbCAuZmxleC1hY3RpdmUtc2xpZGUnKS5kYXRhKCdjb2xvcicpO1xuXHRcdFx0XHQkKCcjY2Fyb3VzZWwgLmhvbWVWaXN1YWxfX2JnJykuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJyxzbGlkZV9jb2xvcik7XG5cdFx0ICAgIH0sXG5cdFx0ICAgIGJlZm9yZTogZnVuY3Rpb24oc2xpZGVyKXtcblx0XHQgICAgXHQkKCcuaG9tZVZpc3VhbF9fYmxvY2snKS5hbmltYXRlKHtcblx0XHQgICAgXHRcdG9wYWNpdHk6IDBcblx0XHQgICAgXHR9LCAyNTApO1xuXHRcdCAgICBcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHQgICAgXHRcdCQoJy5ob21lVmlzdWFsX19ibG9jaycpLmFuaW1hdGUoe1xuXHRcdFx0ICAgIFx0XHRvcGFjaXR5OiAxXG5cdFx0XHQgICAgXHR9LCAyNTApO1xuXHRcdCAgICBcdH0sIDUwMClcblx0XHQgICAgfSxcblx0XHQgICAgYWZ0ZXI6IGZ1bmN0aW9uKHNsaWRlcil7XG5cdFx0XHRcdHZhciBzbGlkZV9jb2xvciA9ICQoJyNjYXJvdXNlbCAuZmxleC1hY3RpdmUtc2xpZGUnKS5kYXRhKCdjb2xvcicpO1xuXHRcdFx0XHQkKCcjY2Fyb3VzZWwgLmhvbWVWaXN1YWxfX2JnJykuY3NzKCdiYWNrZ3JvdW5kLWNvbG9yJyxzbGlkZV9jb2xvcik7XG5cdFx0XHRcdHNpdGVHbG9iYWwubGF6eUxvYWQoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblx0cHJvZHNMaXN0OiBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdGlmKCQoaXRlbSkubGVuZ3RoPT09MCApIHJldHVybiBmYWxzZTtcblx0XHQkKGl0ZW0pLmZsZXhzbGlkZXIoe1xuXHRcdFx0YW5pbWF0aW9uOiAnc2xpZGUnLFxuXHRcdFx0ZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcsXG5cdFx0XHRkaXJlY3Rpb25OYXY6ICAgZmFsc2UsXG5cdFx0XHRjb250cm9sTmF2OiAgICAgdHJ1ZSxcblx0XHRcdGFuaW1hdGlvbkxvb3A6ICB0cnVlLFxuXHRcdFx0cGF1c2VPbkFjdGlvbjogIHRydWUsXG5cdFx0XHRwYXVzZU9uSG92ZXI6ICAgZmFsc2UsXG5cdFx0XHRhbmltYXRpb25TcGVlZDogIDgwMCxcblx0XHRcdHNsaWRlc2hvd1NwZWVkOiAgMzUwMCxcblx0XHRcdHRvdWNoOiBmYWxzZSxcblx0XHRcdHN0YXJ0OiBmdW5jdGlvbihpdGVtKXtcblx0XHQgICAgXHR2YXIgc2xpZGVfY29sb3IgPSAkKGl0ZW0pLmZpbmQoJy5mbGV4LWFjdGl2ZS1zbGlkZScpLmRhdGEoJ2NvbG9yJyk7XG5cdFx0XHRcdCQoaXRlbSkuZmluZCgnLmhvbWVQcm9kU2xpZGVyX19iZycpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsc2xpZGVfY29sb3IpO1xuXHRcdCAgICB9LFxuXHRcdFx0YWZ0ZXI6IGZ1bmN0aW9uKGl0ZW0pe1xuXHRcdFx0XHR2YXIgc2xpZGVfY29sb3IgPSAkKGl0ZW0pLmZpbmQoJy5mbGV4LWFjdGl2ZS1zbGlkZScpLmRhdGEoJ2NvbG9yJyk7XG5cdFx0XHRcdCQoaXRlbSkuZmluZCgnLmhvbWVQcm9kU2xpZGVyX19iZycpLmNzcygnYmFja2dyb3VuZC1jb2xvcicsc2xpZGVfY29sb3IpO1xuXHRcdFx0XHRzaXRlR2xvYmFsLmxhenlMb2FkKCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0sXG5cdHZpc3VhbEZ1bGw6IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0aWYoJChpdGVtKS5sZW5ndGg9PT0wICkgcmV0dXJuIGZhbHNlO1xuXHRcdCQoaXRlbSkuZmxleHNsaWRlcih7XG5cdFx0XHRhbmltYXRpb246ICdzbGlkZScsXG5cdFx0XHRkaXJlY3Rpb246ICdob3Jpem9udGFsJyxcblx0XHRcdGRpcmVjdGlvbk5hdjogICBmYWxzZSxcblx0XHRcdGNvbnRyb2xOYXY6ICAgICB0cnVlLFxuXHRcdFx0YW5pbWF0aW9uTG9vcDogIHRydWUsXG5cdFx0XHRwYXVzZU9uQWN0aW9uOiAgdHJ1ZSxcblx0XHRcdHBhdXNlT25Ib3ZlcjogICBmYWxzZSxcblx0XHRcdGFuaW1hdGlvblNwZWVkOiAgNDUwLFxuXHRcdFx0c2xpZGVzaG93U3BlZWQ6ICA1MDAwLFxuXHRcdFx0YWZ0ZXI6IGZ1bmN0aW9uKHNsaWRlcil7XG5cdFx0XHRcdHNpdGVHbG9iYWwubGF6eUxvYWQoKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcbn0iLCIvKlxuICogalF1ZXJ5IEZsZXhTbGlkZXIgdjIuNy4yXG4gKiBDb3B5cmlnaHQgMjAxMiBXb29UaGVtZXNcbiAqIENvbnRyaWJ1dGluZyBBdXRob3I6IFR5bGVyIFNtaXRoXG4gKi9cbjtcbihmdW5jdGlvbiAoJCkge1xuXG4gIHZhciBmb2N1c2VkID0gdHJ1ZTtcblxuICAvL0ZsZXhTbGlkZXI6IE9iamVjdCBJbnN0YW5jZVxuICAkLmZsZXhzbGlkZXIgPSBmdW5jdGlvbihlbCwgb3B0aW9ucykge1xuICAgIHZhciBzbGlkZXIgPSAkKGVsKTtcblxuICAgIC8vIG1ha2luZyB2YXJpYWJsZXMgcHVibGljXG5cbiAgICAvL2lmIHJ0bCB2YWx1ZSB3YXMgbm90IHBhc3NlZCBhbmQgaHRtbCBpcyBpbiBydGwuLmVuYWJsZSBpdCBieSBkZWZhdWx0LlxuICAgIGlmKHR5cGVvZiBvcHRpb25zLnJ0bD09J3VuZGVmaW5lZCcgJiYgJCgnaHRtbCcpLmF0dHIoJ2RpcicpPT0ncnRsJyl7XG4gICAgICBvcHRpb25zLnJ0bD10cnVlO1xuICAgIH1cbiAgICBzbGlkZXIudmFycyA9ICQuZXh0ZW5kKHt9LCAkLmZsZXhzbGlkZXIuZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgdmFyIG5hbWVzcGFjZSA9IHNsaWRlci52YXJzLm5hbWVzcGFjZSxcbiAgICAgICAgbXNHZXN0dXJlID0gd2luZG93Lm5hdmlnYXRvciAmJiB3aW5kb3cubmF2aWdhdG9yLm1zUG9pbnRlckVuYWJsZWQgJiYgd2luZG93Lk1TR2VzdHVyZSxcbiAgICAgICAgdG91Y2ggPSAoKCBcIm9udG91Y2hzdGFydFwiIGluIHdpbmRvdyApIHx8IG1zR2VzdHVyZSB8fCB3aW5kb3cuRG9jdW1lbnRUb3VjaCAmJiBkb2N1bWVudCBpbnN0YW5jZW9mIERvY3VtZW50VG91Y2gpICYmIHNsaWRlci52YXJzLnRvdWNoLFxuICAgICAgICAvLyBkZXByZWNhdGluZyB0aGlzIGlkZWEsIGFzIGRldmljZXMgYXJlIGJlaW5nIHJlbGVhc2VkIHdpdGggYm90aCBvZiB0aGVzZSBldmVudHNcbiAgICAgICAgZXZlbnRUeXBlID0gXCJjbGljayB0b3VjaGVuZCBNU1BvaW50ZXJVcCBrZXl1cFwiLFxuICAgICAgICB3YXRjaGVkRXZlbnQgPSBcIlwiLFxuICAgICAgICB3YXRjaGVkRXZlbnRDbGVhclRpbWVyLFxuICAgICAgICB2ZXJ0aWNhbCA9IHNsaWRlci52YXJzLmRpcmVjdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiLFxuICAgICAgICByZXZlcnNlID0gc2xpZGVyLnZhcnMucmV2ZXJzZSxcbiAgICAgICAgY2Fyb3VzZWwgPSAoc2xpZGVyLnZhcnMuaXRlbVdpZHRoID4gMCksXG4gICAgICAgIGZhZGUgPSBzbGlkZXIudmFycy5hbmltYXRpb24gPT09IFwiZmFkZVwiLFxuICAgICAgICBhc05hdiA9IHNsaWRlci52YXJzLmFzTmF2Rm9yICE9PSBcIlwiLFxuICAgICAgICBtZXRob2RzID0ge307XG5cbiAgICAvLyBTdG9yZSBhIHJlZmVyZW5jZSB0byB0aGUgc2xpZGVyIG9iamVjdFxuICAgICQuZGF0YShlbCwgXCJmbGV4c2xpZGVyXCIsIHNsaWRlcik7XG5cbiAgICAvLyBQcml2YXRlIHNsaWRlciBtZXRob2RzXG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIGluaXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBzbGlkZXIuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICAgIC8vIEdldCBjdXJyZW50IHNsaWRlIGFuZCBtYWtlIHN1cmUgaXQgaXMgYSBudW1iZXJcbiAgICAgICAgc2xpZGVyLmN1cnJlbnRTbGlkZSA9IHBhcnNlSW50KCAoIHNsaWRlci52YXJzLnN0YXJ0QXQgPyBzbGlkZXIudmFycy5zdGFydEF0IDogMCksIDEwICk7XG4gICAgICAgIGlmICggaXNOYU4oIHNsaWRlci5jdXJyZW50U2xpZGUgKSApIHsgc2xpZGVyLmN1cnJlbnRTbGlkZSA9IDA7IH1cbiAgICAgICAgc2xpZGVyLmFuaW1hdGluZ1RvID0gc2xpZGVyLmN1cnJlbnRTbGlkZTtcbiAgICAgICAgc2xpZGVyLmF0RW5kID0gKHNsaWRlci5jdXJyZW50U2xpZGUgPT09IDAgfHwgc2xpZGVyLmN1cnJlbnRTbGlkZSA9PT0gc2xpZGVyLmxhc3QpO1xuICAgICAgICBzbGlkZXIuY29udGFpbmVyU2VsZWN0b3IgPSBzbGlkZXIudmFycy5zZWxlY3Rvci5zdWJzdHIoMCxzbGlkZXIudmFycy5zZWxlY3Rvci5zZWFyY2goJyAnKSk7XG4gICAgICAgIHNsaWRlci5zbGlkZXMgPSAkKHNsaWRlci52YXJzLnNlbGVjdG9yLCBzbGlkZXIpO1xuICAgICAgICBzbGlkZXIuY29udGFpbmVyID0gJChzbGlkZXIuY29udGFpbmVyU2VsZWN0b3IsIHNsaWRlcik7XG4gICAgICAgIHNsaWRlci5jb3VudCA9IHNsaWRlci5zbGlkZXMubGVuZ3RoO1xuICAgICAgICAvLyBTWU5DOlxuICAgICAgICBzbGlkZXIuc3luY0V4aXN0cyA9ICQoc2xpZGVyLnZhcnMuc3luYykubGVuZ3RoID4gMDtcbiAgICAgICAgLy8gU0xJREU6XG4gICAgICAgIGlmIChzbGlkZXIudmFycy5hbmltYXRpb24gPT09IFwic2xpZGVcIikgeyBzbGlkZXIudmFycy5hbmltYXRpb24gPSBcInN3aW5nXCI7IH1cbiAgICAgICAgc2xpZGVyLnByb3AgPSAodmVydGljYWwpID8gXCJ0b3BcIiA6ICggc2xpZGVyLnZhcnMucnRsID8gXCJtYXJnaW5SaWdodFwiIDogXCJtYXJnaW5MZWZ0XCIgKTtcbiAgICAgICAgc2xpZGVyLmFyZ3MgPSB7fTtcbiAgICAgICAgLy8gU0xJREVTSE9XOlxuICAgICAgICBzbGlkZXIubWFudWFsUGF1c2UgPSBmYWxzZTtcbiAgICAgICAgc2xpZGVyLnN0b3BwZWQgPSBmYWxzZTtcbiAgICAgICAgLy9QQVVTRSBXSEVOIElOVklTSUJMRVxuICAgICAgICBzbGlkZXIuc3RhcnRlZCA9IGZhbHNlO1xuICAgICAgICBzbGlkZXIuc3RhcnRUaW1lb3V0ID0gbnVsbDtcbiAgICAgICAgLy8gVE9VQ0gvVVNFQ1NTOlxuICAgICAgICBzbGlkZXIudHJhbnNpdGlvbnMgPSAhc2xpZGVyLnZhcnMudmlkZW8gJiYgIWZhZGUgJiYgc2xpZGVyLnZhcnMudXNlQ1NTICYmIChmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgb2JqID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG4gICAgICAgICAgICAgIHByb3BzID0gWydwZXJzcGVjdGl2ZVByb3BlcnR5JywgJ1dlYmtpdFBlcnNwZWN0aXZlJywgJ01velBlcnNwZWN0aXZlJywgJ09QZXJzcGVjdGl2ZScsICdtc1BlcnNwZWN0aXZlJ107XG4gICAgICAgICAgZm9yICh2YXIgaSBpbiBwcm9wcykge1xuICAgICAgICAgICAgaWYgKCBvYmouc3R5bGVbIHByb3BzW2ldIF0gIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgc2xpZGVyLnBmeCA9IHByb3BzW2ldLnJlcGxhY2UoJ1BlcnNwZWN0aXZlJywnJykudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgICAgc2xpZGVyLnByb3AgPSBcIi1cIiArIHNsaWRlci5wZnggKyBcIi10cmFuc2Zvcm1cIjtcbiAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSgpKTtcbiAgICAgICAgc2xpZGVyLmlzRmlyZWZveCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKCdmaXJlZm94JykgPiAtMTtcbiAgICAgICAgc2xpZGVyLmVuc3VyZUFuaW1hdGlvbkVuZCA9ICcnO1xuICAgICAgICAvLyBDT05UUk9MU0NPTlRBSU5FUjpcbiAgICAgICAgaWYgKHNsaWRlci52YXJzLmNvbnRyb2xzQ29udGFpbmVyICE9PSBcIlwiKSBzbGlkZXIuY29udHJvbHNDb250YWluZXIgPSAkKHNsaWRlci52YXJzLmNvbnRyb2xzQ29udGFpbmVyKS5sZW5ndGggPiAwICYmICQoc2xpZGVyLnZhcnMuY29udHJvbHNDb250YWluZXIpO1xuICAgICAgICAvLyBNQU5VQUw6XG4gICAgICAgIGlmIChzbGlkZXIudmFycy5tYW51YWxDb250cm9scyAhPT0gXCJcIikgc2xpZGVyLm1hbnVhbENvbnRyb2xzID0gJChzbGlkZXIudmFycy5tYW51YWxDb250cm9scykubGVuZ3RoID4gMCAmJiAkKHNsaWRlci52YXJzLm1hbnVhbENvbnRyb2xzKTtcblxuICAgICAgICAvLyBDVVNUT00gRElSRUNUSU9OIE5BVjpcbiAgICAgICAgaWYgKHNsaWRlci52YXJzLmN1c3RvbURpcmVjdGlvbk5hdiAhPT0gXCJcIikgc2xpZGVyLmN1c3RvbURpcmVjdGlvbk5hdiA9ICQoc2xpZGVyLnZhcnMuY3VzdG9tRGlyZWN0aW9uTmF2KS5sZW5ndGggPT09IDIgJiYgJChzbGlkZXIudmFycy5jdXN0b21EaXJlY3Rpb25OYXYpO1xuXG4gICAgICAgIC8vIFJBTkRPTUlaRTpcbiAgICAgICAgaWYgKHNsaWRlci52YXJzLnJhbmRvbWl6ZSkge1xuICAgICAgICAgIHNsaWRlci5zbGlkZXMuc29ydChmdW5jdGlvbigpIHsgcmV0dXJuIChNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkpLTAuNSk7IH0pO1xuICAgICAgICAgIHNsaWRlci5jb250YWluZXIuZW1wdHkoKS5hcHBlbmQoc2xpZGVyLnNsaWRlcyk7XG4gICAgICAgIH1cblxuICAgICAgICBzbGlkZXIuZG9NYXRoKCk7XG5cbiAgICAgICAgLy8gSU5JVFxuICAgICAgICBzbGlkZXIuc2V0dXAoXCJpbml0XCIpO1xuXG4gICAgICAgIC8vIENPTlRST0xOQVY6XG4gICAgICAgIGlmIChzbGlkZXIudmFycy5jb250cm9sTmF2KSB7IG1ldGhvZHMuY29udHJvbE5hdi5zZXR1cCgpOyB9XG5cbiAgICAgICAgLy8gRElSRUNUSU9OTkFWOlxuICAgICAgICBpZiAoc2xpZGVyLnZhcnMuZGlyZWN0aW9uTmF2KSB7IG1ldGhvZHMuZGlyZWN0aW9uTmF2LnNldHVwKCk7IH1cblxuICAgICAgICAvLyBLRVlCT0FSRDpcbiAgICAgICAgaWYgKHNsaWRlci52YXJzLmtleWJvYXJkICYmICgkKHNsaWRlci5jb250YWluZXJTZWxlY3RvcikubGVuZ3RoID09PSAxIHx8IHNsaWRlci52YXJzLm11bHRpcGxlS2V5Ym9hcmQpKSB7XG4gICAgICAgICAgJChkb2N1bWVudCkuYmluZCgna2V5dXAnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgdmFyIGtleWNvZGUgPSBldmVudC5rZXlDb2RlO1xuICAgICAgICAgICAgaWYgKCFzbGlkZXIuYW5pbWF0aW5nICYmIChrZXljb2RlID09PSAzOSB8fCBrZXljb2RlID09PSAzNykpIHtcbiAgICAgICAgICAgICAgdmFyIHRhcmdldCA9IChzbGlkZXIudmFycy5ydGw/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoa2V5Y29kZSA9PT0gMzcpID8gc2xpZGVyLmdldFRhcmdldCgnbmV4dCcpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGtleWNvZGUgPT09IDM5KSA/IHNsaWRlci5nZXRUYXJnZXQoJ3ByZXYnKSA6IGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoa2V5Y29kZSA9PT0gMzkpID8gc2xpZGVyLmdldFRhcmdldCgnbmV4dCcpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGtleWNvZGUgPT09IDM3KSA/IHNsaWRlci5nZXRUYXJnZXQoJ3ByZXYnKSA6IGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDtcbiAgICAgICAgICAgICAgc2xpZGVyLmZsZXhBbmltYXRlKHRhcmdldCwgc2xpZGVyLnZhcnMucGF1c2VPbkFjdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gTU9VU0VXSEVFTDpcbiAgICAgICAgaWYgKHNsaWRlci52YXJzLm1vdXNld2hlZWwpIHtcbiAgICAgICAgICBzbGlkZXIuYmluZCgnbW91c2V3aGVlbCcsIGZ1bmN0aW9uKGV2ZW50LCBkZWx0YSwgZGVsdGFYLCBkZWx0YVkpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gKGRlbHRhIDwgMCkgPyBzbGlkZXIuZ2V0VGFyZ2V0KCduZXh0JykgOiBzbGlkZXIuZ2V0VGFyZ2V0KCdwcmV2Jyk7XG4gICAgICAgICAgICBzbGlkZXIuZmxleEFuaW1hdGUodGFyZ2V0LCBzbGlkZXIudmFycy5wYXVzZU9uQWN0aW9uKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFBBVVNFUExBWVxuICAgICAgICBpZiAoc2xpZGVyLnZhcnMucGF1c2VQbGF5KSB7IG1ldGhvZHMucGF1c2VQbGF5LnNldHVwKCk7IH1cblxuICAgICAgICAvL1BBVVNFIFdIRU4gSU5WSVNJQkxFXG4gICAgICAgIGlmIChzbGlkZXIudmFycy5zbGlkZXNob3cgJiYgc2xpZGVyLnZhcnMucGF1c2VJbnZpc2libGUpIHsgbWV0aG9kcy5wYXVzZUludmlzaWJsZS5pbml0KCk7IH1cblxuICAgICAgICAvLyBTTElEU0VTSE9XXG4gICAgICAgIGlmIChzbGlkZXIudmFycy5zbGlkZXNob3cpIHtcbiAgICAgICAgICBpZiAoc2xpZGVyLnZhcnMucGF1c2VPbkhvdmVyKSB7XG4gICAgICAgICAgICBzbGlkZXIuaG92ZXIoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGlmICghc2xpZGVyLm1hbnVhbFBsYXkgJiYgIXNsaWRlci5tYW51YWxQYXVzZSkgeyBzbGlkZXIucGF1c2UoKTsgfVxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGlmICghc2xpZGVyLm1hbnVhbFBhdXNlICYmICFzbGlkZXIubWFudWFsUGxheSAmJiAhc2xpZGVyLnN0b3BwZWQpIHsgc2xpZGVyLnBsYXkoKTsgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGluaXRpYWxpemUgYW5pbWF0aW9uXG4gICAgICAgICAgLy9JZiB3ZSdyZSB2aXNpYmxlLCBvciB3ZSBkb24ndCB1c2UgUGFnZVZpc2liaWxpdHkgQVBJXG4gICAgICAgICAgaWYoIXNsaWRlci52YXJzLnBhdXNlSW52aXNpYmxlIHx8ICFtZXRob2RzLnBhdXNlSW52aXNpYmxlLmlzSGlkZGVuKCkpIHtcbiAgICAgICAgICAgIChzbGlkZXIudmFycy5pbml0RGVsYXkgPiAwKSA/IHNsaWRlci5zdGFydFRpbWVvdXQgPSBzZXRUaW1lb3V0KHNsaWRlci5wbGF5LCBzbGlkZXIudmFycy5pbml0RGVsYXkpIDogc2xpZGVyLnBsYXkoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBU05BVjpcbiAgICAgICAgaWYgKGFzTmF2KSB7IG1ldGhvZHMuYXNOYXYuc2V0dXAoKTsgfVxuXG4gICAgICAgIC8vIFRPVUNIXG4gICAgICAgIGlmICh0b3VjaCAmJiBzbGlkZXIudmFycy50b3VjaCkgeyBtZXRob2RzLnRvdWNoKCk7IH1cblxuICAgICAgICAvLyBGQURFJiZTTU9PVEhIRUlHSFQgfHwgU0xJREU6XG4gICAgICAgIGlmICghZmFkZSB8fCAoZmFkZSAmJiBzbGlkZXIudmFycy5zbW9vdGhIZWlnaHQpKSB7ICQod2luZG93KS5iaW5kKFwicmVzaXplIG9yaWVudGF0aW9uY2hhbmdlIGZvY3VzXCIsIG1ldGhvZHMucmVzaXplKTsgfVxuXG4gICAgICAgIHNsaWRlci5maW5kKFwiaW1nXCIpLmF0dHIoXCJkcmFnZ2FibGVcIiwgXCJmYWxzZVwiKTtcblxuICAgICAgICAvLyBBUEk6IHN0YXJ0KCkgQ2FsbGJhY2tcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgIHNsaWRlci52YXJzLnN0YXJ0KHNsaWRlcik7XG4gICAgICAgIH0sIDIwMCk7XG4gICAgICB9LFxuICAgICAgYXNOYXY6IHtcbiAgICAgICAgc2V0dXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHNsaWRlci5hc05hdiA9IHRydWU7XG4gICAgICAgICAgc2xpZGVyLmFuaW1hdGluZ1RvID0gTWF0aC5mbG9vcihzbGlkZXIuY3VycmVudFNsaWRlL3NsaWRlci5tb3ZlKTtcbiAgICAgICAgICBzbGlkZXIuY3VycmVudEl0ZW0gPSBzbGlkZXIuY3VycmVudFNsaWRlO1xuICAgICAgICAgIHNsaWRlci5zbGlkZXMucmVtb3ZlQ2xhc3MobmFtZXNwYWNlICsgXCJhY3RpdmUtc2xpZGVcIikuZXEoc2xpZGVyLmN1cnJlbnRJdGVtKS5hZGRDbGFzcyhuYW1lc3BhY2UgKyBcImFjdGl2ZS1zbGlkZVwiKTtcbiAgICAgICAgICBpZighbXNHZXN0dXJlKXtcbiAgICAgICAgICAgICAgc2xpZGVyLnNsaWRlcy5vbihldmVudFR5cGUsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgJHNsaWRlID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gJHNsaWRlLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgdmFyIHBvc0Zyb21YO1xuICAgICAgICAgICAgICAgIGlmKHNsaWRlci52YXJzLnJ0bCl7XG4gICAgICAgICAgICAgICAgICBwb3NGcm9tWCA9IC0xKigkc2xpZGUub2Zmc2V0KCkucmlnaHQgLSAkKHNsaWRlcikuc2Nyb2xsTGVmdCgpKTsgLy8gRmluZCBwb3NpdGlvbiBvZiBzbGlkZSByZWxhdGl2ZSB0byByaWdodCBvZiBzbGlkZXIgY29udGFpbmVyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBwb3NGcm9tWCA9ICRzbGlkZS5vZmZzZXQoKS5sZWZ0IC0gJChzbGlkZXIpLnNjcm9sbExlZnQoKTsgLy8gRmluZCBwb3NpdGlvbiBvZiBzbGlkZSByZWxhdGl2ZSB0byBsZWZ0IG9mIHNsaWRlciBjb250YWluZXJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoIHBvc0Zyb21YIDw9IDAgJiYgJHNsaWRlLmhhc0NsYXNzKCBuYW1lc3BhY2UgKyAnYWN0aXZlLXNsaWRlJyApICkge1xuICAgICAgICAgICAgICAgICAgc2xpZGVyLmZsZXhBbmltYXRlKHNsaWRlci5nZXRUYXJnZXQoXCJwcmV2XCIpLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCEkKHNsaWRlci52YXJzLmFzTmF2Rm9yKS5kYXRhKCdmbGV4c2xpZGVyJykuYW5pbWF0aW5nICYmICEkc2xpZGUuaGFzQ2xhc3MobmFtZXNwYWNlICsgXCJhY3RpdmUtc2xpZGVcIikpIHtcbiAgICAgICAgICAgICAgICAgIHNsaWRlci5kaXJlY3Rpb24gPSAoc2xpZGVyLmN1cnJlbnRJdGVtIDwgdGFyZ2V0KSA/IFwibmV4dFwiIDogXCJwcmV2XCI7XG4gICAgICAgICAgICAgICAgICBzbGlkZXIuZmxleEFuaW1hdGUodGFyZ2V0LCBzbGlkZXIudmFycy5wYXVzZU9uQWN0aW9uLCBmYWxzZSwgdHJ1ZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgZWwuX3NsaWRlciA9IHNsaWRlcjtcbiAgICAgICAgICAgICAgc2xpZGVyLnNsaWRlcy5lYWNoKGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgdGhhdC5fZ2VzdHVyZSA9IG5ldyBNU0dlc3R1cmUoKTtcbiAgICAgICAgICAgICAgICAgIHRoYXQuX2dlc3R1cmUudGFyZ2V0ID0gdGhhdDtcbiAgICAgICAgICAgICAgICAgIHRoYXQuYWRkRXZlbnRMaXN0ZW5lcihcIk1TUG9pbnRlckRvd25cIiwgZnVuY3Rpb24gKGUpe1xuICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICBpZihlLmN1cnJlbnRUYXJnZXQuX2dlc3R1cmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuY3VycmVudFRhcmdldC5fZ2VzdHVyZS5hZGRQb2ludGVyKGUucG9pbnRlcklkKTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICB0aGF0LmFkZEV2ZW50TGlzdGVuZXIoXCJNU0dlc3R1cmVUYXBcIiwgZnVuY3Rpb24gKGUpe1xuICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgJHNsaWRlID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gJHNsaWRlLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKCEkKHNsaWRlci52YXJzLmFzTmF2Rm9yKS5kYXRhKCdmbGV4c2xpZGVyJykuYW5pbWF0aW5nICYmICEkc2xpZGUuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlci5kaXJlY3Rpb24gPSAoc2xpZGVyLmN1cnJlbnRJdGVtIDwgdGFyZ2V0KSA/IFwibmV4dFwiIDogXCJwcmV2XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlci5mbGV4QW5pbWF0ZSh0YXJnZXQsIHNsaWRlci52YXJzLnBhdXNlT25BY3Rpb24sIGZhbHNlLCB0cnVlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgY29udHJvbE5hdjoge1xuICAgICAgICBzZXR1cDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaWYgKCFzbGlkZXIubWFudWFsQ29udHJvbHMpIHtcbiAgICAgICAgICAgIG1ldGhvZHMuY29udHJvbE5hdi5zZXR1cFBhZ2luZygpO1xuICAgICAgICAgIH0gZWxzZSB7IC8vIE1BTlVBTENPTlRST0xTOlxuICAgICAgICAgICAgbWV0aG9kcy5jb250cm9sTmF2LnNldHVwTWFudWFsKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBzZXR1cFBhZ2luZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHR5cGUgPSAoc2xpZGVyLnZhcnMuY29udHJvbE5hdiA9PT0gXCJ0aHVtYm5haWxzXCIpID8gJ2NvbnRyb2wtdGh1bWJzJyA6ICdjb250cm9sLXBhZ2luZycsXG4gICAgICAgICAgICAgIGogPSAxLFxuICAgICAgICAgICAgICBpdGVtLFxuICAgICAgICAgICAgICBzbGlkZTtcblxuICAgICAgICAgIHNsaWRlci5jb250cm9sTmF2U2NhZmZvbGQgPSAkKCc8b2wgY2xhc3M9XCInKyBuYW1lc3BhY2UgKyAnY29udHJvbC1uYXYgJyArIG5hbWVzcGFjZSArIHR5cGUgKyAnXCI+PC9vbD4nKTtcblxuICAgICAgICAgIGlmIChzbGlkZXIucGFnaW5nQ291bnQgPiAxKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWRlci5wYWdpbmdDb3VudDsgaSsrKSB7XG4gICAgICAgICAgICAgIHNsaWRlID0gc2xpZGVyLnNsaWRlcy5lcShpKTtcblxuICAgICAgICAgICAgICBpZiAoIHVuZGVmaW5lZCA9PT0gc2xpZGUuYXR0ciggJ2RhdGEtdGh1bWItYWx0JyApICkgeyBcbiAgICAgICAgICAgICAgICBzbGlkZS5hdHRyKCAnZGF0YS10aHVtYi1hbHQnLCAnJyApOyBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgaXRlbSA9ICQoICc8YT48L2E+JyApLmF0dHIoICdocmVmJywgJyMnICkudGV4dCggaiApO1xuICAgICAgICAgICAgICBpZiAoIHNsaWRlci52YXJzLmNvbnRyb2xOYXYgPT09IFwidGh1bWJuYWlsc1wiICkge1xuICAgICAgICAgICAgICAgIGl0ZW0gPSAkKCAnPGltZy8+JyApLmF0dHIoICdzcmMnLCBzbGlkZS5hdHRyKCAnZGF0YS10aHVtYicgKSApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICBpZiAoICcnICE9PSBzbGlkZS5hdHRyKCAnZGF0YS10aHVtYi1hbHQnICkgKSB7XG4gICAgICAgICAgICAgICAgaXRlbS5hdHRyKCAnYWx0Jywgc2xpZGUuYXR0ciggJ2RhdGEtdGh1bWItYWx0JyApICk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAoICd0aHVtYm5haWxzJyA9PT0gc2xpZGVyLnZhcnMuY29udHJvbE5hdiAmJiB0cnVlID09PSBzbGlkZXIudmFycy50aHVtYkNhcHRpb25zICkge1xuICAgICAgICAgICAgICAgIHZhciBjYXB0biA9IHNsaWRlLmF0dHIoICdkYXRhLXRodW1iY2FwdGlvbicgKTtcbiAgICAgICAgICAgICAgICBpZiAoICcnICE9PSBjYXB0biAmJiB1bmRlZmluZWQgIT09IGNhcHRuICkgeyBcbiAgICAgICAgICAgICAgICAgIHZhciBjYXB0aW9uID0gJCgnPHNwYW4+PC9zcGFuPicgKS5hZGRDbGFzcyggbmFtZXNwYWNlICsgJ2NhcHRpb24nICkudGV4dCggY2FwdG4gKTtcbiAgICAgICAgICAgICAgICAgIGl0ZW0uYXBwZW5kKCBjYXB0aW9uICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICAgICB2YXIgbGlFbGVtZW50ID0gJCggJzxsaT4nICk7XG4gICAgICAgICAgICAgIGl0ZW0uYXBwZW5kVG8oIGxpRWxlbWVudCApO1xuICAgICAgICAgICAgICBsaUVsZW1lbnQuYXBwZW5kKCAnPC9saT4nICk7XG5cbiAgICAgICAgICAgICAgc2xpZGVyLmNvbnRyb2xOYXZTY2FmZm9sZC5hcHBlbmQobGlFbGVtZW50KTtcbiAgICAgICAgICAgICAgaisrO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQ09OVFJPTFNDT05UQUlORVI6XG4gICAgICAgICAgKHNsaWRlci5jb250cm9sc0NvbnRhaW5lcikgPyAkKHNsaWRlci5jb250cm9sc0NvbnRhaW5lcikuYXBwZW5kKHNsaWRlci5jb250cm9sTmF2U2NhZmZvbGQpIDogc2xpZGVyLmFwcGVuZChzbGlkZXIuY29udHJvbE5hdlNjYWZmb2xkKTtcbiAgICAgICAgICBtZXRob2RzLmNvbnRyb2xOYXYuc2V0KCk7XG5cbiAgICAgICAgICBtZXRob2RzLmNvbnRyb2xOYXYuYWN0aXZlKCk7XG5cbiAgICAgICAgICBzbGlkZXIuY29udHJvbE5hdlNjYWZmb2xkLmRlbGVnYXRlKCdhLCBpbWcnLCBldmVudFR5cGUsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZiAod2F0Y2hlZEV2ZW50ID09PSBcIlwiIHx8IHdhdGNoZWRFdmVudCA9PT0gZXZlbnQudHlwZSkge1xuICAgICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gc2xpZGVyLmNvbnRyb2xOYXYuaW5kZXgoJHRoaXMpO1xuXG4gICAgICAgICAgICAgIGlmICghJHRoaXMuaGFzQ2xhc3MobmFtZXNwYWNlICsgJ2FjdGl2ZScpKSB7XG4gICAgICAgICAgICAgICAgc2xpZGVyLmRpcmVjdGlvbiA9ICh0YXJnZXQgPiBzbGlkZXIuY3VycmVudFNsaWRlKSA/IFwibmV4dFwiIDogXCJwcmV2XCI7XG4gICAgICAgICAgICAgICAgc2xpZGVyLmZsZXhBbmltYXRlKHRhcmdldCwgc2xpZGVyLnZhcnMucGF1c2VPbkFjdGlvbik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2V0dXAgZmxhZ3MgdG8gcHJldmVudCBldmVudCBkdXBsaWNhdGlvblxuICAgICAgICAgICAgaWYgKHdhdGNoZWRFdmVudCA9PT0gXCJcIikge1xuICAgICAgICAgICAgICB3YXRjaGVkRXZlbnQgPSBldmVudC50eXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWV0aG9kcy5zZXRUb0NsZWFyV2F0Y2hlZEV2ZW50KCk7XG5cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0dXBNYW51YWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHNsaWRlci5jb250cm9sTmF2ID0gc2xpZGVyLm1hbnVhbENvbnRyb2xzO1xuICAgICAgICAgIG1ldGhvZHMuY29udHJvbE5hdi5hY3RpdmUoKTtcblxuICAgICAgICAgIHNsaWRlci5jb250cm9sTmF2LmJpbmQoZXZlbnRUeXBlLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKHdhdGNoZWRFdmVudCA9PT0gXCJcIiB8fCB3YXRjaGVkRXZlbnQgPT09IGV2ZW50LnR5cGUpIHtcbiAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgIHRhcmdldCA9IHNsaWRlci5jb250cm9sTmF2LmluZGV4KCR0aGlzKTtcblxuICAgICAgICAgICAgICBpZiAoISR0aGlzLmhhc0NsYXNzKG5hbWVzcGFjZSArICdhY3RpdmUnKSkge1xuICAgICAgICAgICAgICAgICh0YXJnZXQgPiBzbGlkZXIuY3VycmVudFNsaWRlKSA/IHNsaWRlci5kaXJlY3Rpb24gPSBcIm5leHRcIiA6IHNsaWRlci5kaXJlY3Rpb24gPSBcInByZXZcIjtcbiAgICAgICAgICAgICAgICBzbGlkZXIuZmxleEFuaW1hdGUodGFyZ2V0LCBzbGlkZXIudmFycy5wYXVzZU9uQWN0aW9uKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZXR1cCBmbGFncyB0byBwcmV2ZW50IGV2ZW50IGR1cGxpY2F0aW9uXG4gICAgICAgICAgICBpZiAod2F0Y2hlZEV2ZW50ID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgIHdhdGNoZWRFdmVudCA9IGV2ZW50LnR5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXRob2RzLnNldFRvQ2xlYXJXYXRjaGVkRXZlbnQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgc2VsZWN0b3IgPSAoc2xpZGVyLnZhcnMuY29udHJvbE5hdiA9PT0gXCJ0aHVtYm5haWxzXCIpID8gJ2ltZycgOiAnYSc7XG4gICAgICAgICAgc2xpZGVyLmNvbnRyb2xOYXYgPSAkKCcuJyArIG5hbWVzcGFjZSArICdjb250cm9sLW5hdiBsaSAnICsgc2VsZWN0b3IsIChzbGlkZXIuY29udHJvbHNDb250YWluZXIpID8gc2xpZGVyLmNvbnRyb2xzQ29udGFpbmVyIDogc2xpZGVyKTtcbiAgICAgICAgfSxcbiAgICAgICAgYWN0aXZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzbGlkZXIuY29udHJvbE5hdi5yZW1vdmVDbGFzcyhuYW1lc3BhY2UgKyBcImFjdGl2ZVwiKS5lcShzbGlkZXIuYW5pbWF0aW5nVG8pLmFkZENsYXNzKG5hbWVzcGFjZSArIFwiYWN0aXZlXCIpO1xuICAgICAgICB9LFxuICAgICAgICB1cGRhdGU6IGZ1bmN0aW9uKGFjdGlvbiwgcG9zKSB7XG4gICAgICAgICAgaWYgKHNsaWRlci5wYWdpbmdDb3VudCA+IDEgJiYgYWN0aW9uID09PSBcImFkZFwiKSB7XG4gICAgICAgICAgICBzbGlkZXIuY29udHJvbE5hdlNjYWZmb2xkLmFwcGVuZCgkKCc8bGk+PGEgaHJlZj1cIiNcIj4nICsgc2xpZGVyLmNvdW50ICsgJzwvYT48L2xpPicpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNsaWRlci5wYWdpbmdDb3VudCA9PT0gMSkge1xuICAgICAgICAgICAgc2xpZGVyLmNvbnRyb2xOYXZTY2FmZm9sZC5maW5kKCdsaScpLnJlbW92ZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzbGlkZXIuY29udHJvbE5hdi5lcShwb3MpLmNsb3Nlc3QoJ2xpJykucmVtb3ZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1ldGhvZHMuY29udHJvbE5hdi5zZXQoKTtcbiAgICAgICAgICAoc2xpZGVyLnBhZ2luZ0NvdW50ID4gMSAmJiBzbGlkZXIucGFnaW5nQ291bnQgIT09IHNsaWRlci5jb250cm9sTmF2Lmxlbmd0aCkgPyBzbGlkZXIudXBkYXRlKHBvcywgYWN0aW9uKSA6IG1ldGhvZHMuY29udHJvbE5hdi5hY3RpdmUoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRpcmVjdGlvbk5hdjoge1xuICAgICAgICBzZXR1cDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGRpcmVjdGlvbk5hdlNjYWZmb2xkID0gJCgnPHVsIGNsYXNzPVwiJyArIG5hbWVzcGFjZSArICdkaXJlY3Rpb24tbmF2XCI+PGxpIGNsYXNzPVwiJyArIG5hbWVzcGFjZSArICduYXYtcHJldlwiPjxhIGNsYXNzPVwiJyArIG5hbWVzcGFjZSArICdwcmV2XCIgaHJlZj1cIiNcIj4nICsgc2xpZGVyLnZhcnMucHJldlRleHQgKyAnPC9hPjwvbGk+PGxpIGNsYXNzPVwiJyArIG5hbWVzcGFjZSArICduYXYtbmV4dFwiPjxhIGNsYXNzPVwiJyArIG5hbWVzcGFjZSArICduZXh0XCIgaHJlZj1cIiNcIj4nICsgc2xpZGVyLnZhcnMubmV4dFRleHQgKyAnPC9hPjwvbGk+PC91bD4nKTtcblxuICAgICAgICAgIC8vIENVU1RPTSBESVJFQ1RJT04gTkFWOlxuICAgICAgICAgIGlmIChzbGlkZXIuY3VzdG9tRGlyZWN0aW9uTmF2KSB7XG4gICAgICAgICAgICBzbGlkZXIuZGlyZWN0aW9uTmF2ID0gc2xpZGVyLmN1c3RvbURpcmVjdGlvbk5hdjtcbiAgICAgICAgICAvLyBDT05UUk9MU0NPTlRBSU5FUjpcbiAgICAgICAgICB9IGVsc2UgaWYgKHNsaWRlci5jb250cm9sc0NvbnRhaW5lcikge1xuICAgICAgICAgICAgJChzbGlkZXIuY29udHJvbHNDb250YWluZXIpLmFwcGVuZChkaXJlY3Rpb25OYXZTY2FmZm9sZCk7XG4gICAgICAgICAgICBzbGlkZXIuZGlyZWN0aW9uTmF2ID0gJCgnLicgKyBuYW1lc3BhY2UgKyAnZGlyZWN0aW9uLW5hdiBsaSBhJywgc2xpZGVyLmNvbnRyb2xzQ29udGFpbmVyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2xpZGVyLmFwcGVuZChkaXJlY3Rpb25OYXZTY2FmZm9sZCk7XG4gICAgICAgICAgICBzbGlkZXIuZGlyZWN0aW9uTmF2ID0gJCgnLicgKyBuYW1lc3BhY2UgKyAnZGlyZWN0aW9uLW5hdiBsaSBhJywgc2xpZGVyKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBtZXRob2RzLmRpcmVjdGlvbk5hdi51cGRhdGUoKTtcblxuICAgICAgICAgIHNsaWRlci5kaXJlY3Rpb25OYXYuYmluZChldmVudFR5cGUsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdmFyIHRhcmdldDtcblxuICAgICAgICAgICAgaWYgKHdhdGNoZWRFdmVudCA9PT0gXCJcIiB8fCB3YXRjaGVkRXZlbnQgPT09IGV2ZW50LnR5cGUpIHtcbiAgICAgICAgICAgICAgdGFyZ2V0ID0gKCQodGhpcykuaGFzQ2xhc3MobmFtZXNwYWNlICsgJ25leHQnKSkgPyBzbGlkZXIuZ2V0VGFyZ2V0KCduZXh0JykgOiBzbGlkZXIuZ2V0VGFyZ2V0KCdwcmV2Jyk7XG4gICAgICAgICAgICAgIHNsaWRlci5mbGV4QW5pbWF0ZSh0YXJnZXQsIHNsaWRlci52YXJzLnBhdXNlT25BY3Rpb24pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzZXR1cCBmbGFncyB0byBwcmV2ZW50IGV2ZW50IGR1cGxpY2F0aW9uXG4gICAgICAgICAgICBpZiAod2F0Y2hlZEV2ZW50ID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgIHdhdGNoZWRFdmVudCA9IGV2ZW50LnR5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtZXRob2RzLnNldFRvQ2xlYXJXYXRjaGVkRXZlbnQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgZGlzYWJsZWRDbGFzcyA9IG5hbWVzcGFjZSArICdkaXNhYmxlZCc7XG4gICAgICAgICAgaWYgKHNsaWRlci5wYWdpbmdDb3VudCA9PT0gMSkge1xuICAgICAgICAgICAgc2xpZGVyLmRpcmVjdGlvbk5hdi5hZGRDbGFzcyhkaXNhYmxlZENsYXNzKS5hdHRyKCd0YWJpbmRleCcsICctMScpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoIXNsaWRlci52YXJzLmFuaW1hdGlvbkxvb3ApIHtcbiAgICAgICAgICAgIGlmIChzbGlkZXIuYW5pbWF0aW5nVG8gPT09IDApIHtcbiAgICAgICAgICAgICAgc2xpZGVyLmRpcmVjdGlvbk5hdi5yZW1vdmVDbGFzcyhkaXNhYmxlZENsYXNzKS5maWx0ZXIoJy4nICsgbmFtZXNwYWNlICsgXCJwcmV2XCIpLmFkZENsYXNzKGRpc2FibGVkQ2xhc3MpLmF0dHIoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNsaWRlci5hbmltYXRpbmdUbyA9PT0gc2xpZGVyLmxhc3QpIHtcbiAgICAgICAgICAgICAgc2xpZGVyLmRpcmVjdGlvbk5hdi5yZW1vdmVDbGFzcyhkaXNhYmxlZENsYXNzKS5maWx0ZXIoJy4nICsgbmFtZXNwYWNlICsgXCJuZXh0XCIpLmFkZENsYXNzKGRpc2FibGVkQ2xhc3MpLmF0dHIoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzbGlkZXIuZGlyZWN0aW9uTmF2LnJlbW92ZUNsYXNzKGRpc2FibGVkQ2xhc3MpLnJlbW92ZUF0dHIoJ3RhYmluZGV4Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWRlci5kaXJlY3Rpb25OYXYucmVtb3ZlQ2xhc3MoZGlzYWJsZWRDbGFzcykucmVtb3ZlQXR0cigndGFiaW5kZXgnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBwYXVzZVBsYXk6IHtcbiAgICAgICAgc2V0dXA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBwYXVzZVBsYXlTY2FmZm9sZCA9ICQoJzxkaXYgY2xhc3M9XCInICsgbmFtZXNwYWNlICsgJ3BhdXNlcGxheVwiPjxhIGhyZWY9XCIjXCI+PC9hPjwvZGl2PicpO1xuXG4gICAgICAgICAgLy8gQ09OVFJPTFNDT05UQUlORVI6XG4gICAgICAgICAgaWYgKHNsaWRlci5jb250cm9sc0NvbnRhaW5lcikge1xuICAgICAgICAgICAgc2xpZGVyLmNvbnRyb2xzQ29udGFpbmVyLmFwcGVuZChwYXVzZVBsYXlTY2FmZm9sZCk7XG4gICAgICAgICAgICBzbGlkZXIucGF1c2VQbGF5ID0gJCgnLicgKyBuYW1lc3BhY2UgKyAncGF1c2VwbGF5IGEnLCBzbGlkZXIuY29udHJvbHNDb250YWluZXIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzbGlkZXIuYXBwZW5kKHBhdXNlUGxheVNjYWZmb2xkKTtcbiAgICAgICAgICAgIHNsaWRlci5wYXVzZVBsYXkgPSAkKCcuJyArIG5hbWVzcGFjZSArICdwYXVzZXBsYXkgYScsIHNsaWRlcik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbWV0aG9kcy5wYXVzZVBsYXkudXBkYXRlKChzbGlkZXIudmFycy5zbGlkZXNob3cpID8gbmFtZXNwYWNlICsgJ3BhdXNlJyA6IG5hbWVzcGFjZSArICdwbGF5Jyk7XG5cbiAgICAgICAgICBzbGlkZXIucGF1c2VQbGF5LmJpbmQoZXZlbnRUeXBlLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKHdhdGNoZWRFdmVudCA9PT0gXCJcIiB8fCB3YXRjaGVkRXZlbnQgPT09IGV2ZW50LnR5cGUpIHtcbiAgICAgICAgICAgICAgaWYgKCQodGhpcykuaGFzQ2xhc3MobmFtZXNwYWNlICsgJ3BhdXNlJykpIHtcbiAgICAgICAgICAgICAgICBzbGlkZXIubWFudWFsUGF1c2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNsaWRlci5tYW51YWxQbGF5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc2xpZGVyLnBhdXNlKCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2xpZGVyLm1hbnVhbFBhdXNlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc2xpZGVyLm1hbnVhbFBsYXkgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNsaWRlci5wbGF5KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc2V0dXAgZmxhZ3MgdG8gcHJldmVudCBldmVudCBkdXBsaWNhdGlvblxuICAgICAgICAgICAgaWYgKHdhdGNoZWRFdmVudCA9PT0gXCJcIikge1xuICAgICAgICAgICAgICB3YXRjaGVkRXZlbnQgPSBldmVudC50eXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWV0aG9kcy5zZXRUb0NsZWFyV2F0Y2hlZEV2ZW50KCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHVwZGF0ZTogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgICAgICAoc3RhdGUgPT09IFwicGxheVwiKSA/IHNsaWRlci5wYXVzZVBsYXkucmVtb3ZlQ2xhc3MobmFtZXNwYWNlICsgJ3BhdXNlJykuYWRkQ2xhc3MobmFtZXNwYWNlICsgJ3BsYXknKS5odG1sKHNsaWRlci52YXJzLnBsYXlUZXh0KSA6IHNsaWRlci5wYXVzZVBsYXkucmVtb3ZlQ2xhc3MobmFtZXNwYWNlICsgJ3BsYXknKS5hZGRDbGFzcyhuYW1lc3BhY2UgKyAncGF1c2UnKS5odG1sKHNsaWRlci52YXJzLnBhdXNlVGV4dCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0b3VjaDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzdGFydFgsXG4gICAgICAgICAgc3RhcnRZLFxuICAgICAgICAgIG9mZnNldCxcbiAgICAgICAgICBjd2lkdGgsXG4gICAgICAgICAgZHgsXG4gICAgICAgICAgc3RhcnRULFxuICAgICAgICAgIG9uVG91Y2hTdGFydCxcbiAgICAgICAgICBvblRvdWNoTW92ZSxcbiAgICAgICAgICBvblRvdWNoRW5kLFxuICAgICAgICAgIHNjcm9sbGluZyA9IGZhbHNlLFxuICAgICAgICAgIGxvY2FsWCA9IDAsXG4gICAgICAgICAgbG9jYWxZID0gMCxcbiAgICAgICAgICBhY2NEeCA9IDA7XG5cbiAgICAgICAgaWYoIW1zR2VzdHVyZSl7XG4gICAgICAgICAgICBvblRvdWNoU3RhcnQgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIGlmIChzbGlkZXIuYW5pbWF0aW5nKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAoIHdpbmRvdy5uYXZpZ2F0b3IubXNQb2ludGVyRW5hYmxlZCApIHx8IGUudG91Y2hlcy5sZW5ndGggPT09IDEgKSB7XG4gICAgICAgICAgICAgICAgc2xpZGVyLnBhdXNlKCk7XG4gICAgICAgICAgICAgICAgLy8gQ0FST1VTRUw6XG4gICAgICAgICAgICAgICAgY3dpZHRoID0gKHZlcnRpY2FsKSA/IHNsaWRlci5oIDogc2xpZGVyLiB3O1xuICAgICAgICAgICAgICAgIHN0YXJ0VCA9IE51bWJlcihuZXcgRGF0ZSgpKTtcbiAgICAgICAgICAgICAgICAvLyBDQVJPVVNFTDpcblxuICAgICAgICAgICAgICAgIC8vIExvY2FsIHZhcnMgZm9yIFggYW5kIFkgcG9pbnRzLlxuICAgICAgICAgICAgICAgIGxvY2FsWCA9IGUudG91Y2hlc1swXS5wYWdlWDtcbiAgICAgICAgICAgICAgICBsb2NhbFkgPSBlLnRvdWNoZXNbMF0ucGFnZVk7XG5cbiAgICAgICAgICAgICAgICBvZmZzZXQgPSAoY2Fyb3VzZWwgJiYgcmV2ZXJzZSAmJiBzbGlkZXIuYW5pbWF0aW5nVG8gPT09IHNsaWRlci5sYXN0KSA/IDAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgIChjYXJvdXNlbCAmJiByZXZlcnNlKSA/IHNsaWRlci5saW1pdCAtICgoKHNsaWRlci5pdGVtVyArIHNsaWRlci52YXJzLml0ZW1NYXJnaW4pICogc2xpZGVyLm1vdmUpICogc2xpZGVyLmFuaW1hdGluZ1RvKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgKGNhcm91c2VsICYmIHNsaWRlci5jdXJyZW50U2xpZGUgPT09IHNsaWRlci5sYXN0KSA/IHNsaWRlci5saW1pdCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgKGNhcm91c2VsKSA/ICgoc2xpZGVyLml0ZW1XICsgc2xpZGVyLnZhcnMuaXRlbU1hcmdpbikgKiBzbGlkZXIubW92ZSkgKiBzbGlkZXIuY3VycmVudFNsaWRlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAocmV2ZXJzZSkgPyAoc2xpZGVyLmxhc3QgLSBzbGlkZXIuY3VycmVudFNsaWRlICsgc2xpZGVyLmNsb25lT2Zmc2V0KSAqIGN3aWR0aCA6IChzbGlkZXIuY3VycmVudFNsaWRlICsgc2xpZGVyLmNsb25lT2Zmc2V0KSAqIGN3aWR0aDtcbiAgICAgICAgICAgICAgICBzdGFydFggPSAodmVydGljYWwpID8gbG9jYWxZIDogbG9jYWxYO1xuICAgICAgICAgICAgICAgIHN0YXJ0WSA9ICh2ZXJ0aWNhbCkgPyBsb2NhbFggOiBsb2NhbFk7XG4gICAgICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgb25Ub3VjaE1vdmUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG9uVG91Y2hFbmQsIGZhbHNlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgb25Ub3VjaE1vdmUgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgIC8vIExvY2FsIHZhcnMgZm9yIFggYW5kIFkgcG9pbnRzLlxuXG4gICAgICAgICAgICAgIGxvY2FsWCA9IGUudG91Y2hlc1swXS5wYWdlWDtcbiAgICAgICAgICAgICAgbG9jYWxZID0gZS50b3VjaGVzWzBdLnBhZ2VZO1xuXG4gICAgICAgICAgICAgIGR4ID0gKHZlcnRpY2FsKSA/IHN0YXJ0WCAtIGxvY2FsWSA6IChzbGlkZXIudmFycy5ydGw/LTE6MSkqKHN0YXJ0WCAtIGxvY2FsWCk7XG4gICAgICAgICAgICAgIHNjcm9sbGluZyA9ICh2ZXJ0aWNhbCkgPyAoTWF0aC5hYnMoZHgpIDwgTWF0aC5hYnMobG9jYWxYIC0gc3RhcnRZKSkgOiAoTWF0aC5hYnMoZHgpIDwgTWF0aC5hYnMobG9jYWxZIC0gc3RhcnRZKSk7XG4gICAgICAgICAgICAgIHZhciBmeG1zID0gNTAwO1xuXG4gICAgICAgICAgICAgIGlmICggISBzY3JvbGxpbmcgfHwgTnVtYmVyKCBuZXcgRGF0ZSgpICkgLSBzdGFydFQgPiBmeG1zICkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWZhZGUgJiYgc2xpZGVyLnRyYW5zaXRpb25zKSB7XG4gICAgICAgICAgICAgICAgICBpZiAoIXNsaWRlci52YXJzLmFuaW1hdGlvbkxvb3ApIHtcbiAgICAgICAgICAgICAgICAgICAgZHggPSBkeC8oKHNsaWRlci5jdXJyZW50U2xpZGUgPT09IDAgJiYgZHggPCAwIHx8IHNsaWRlci5jdXJyZW50U2xpZGUgPT09IHNsaWRlci5sYXN0ICYmIGR4ID4gMCkgPyAoTWF0aC5hYnMoZHgpL2N3aWR0aCsyKSA6IDEpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgc2xpZGVyLnNldFByb3BzKG9mZnNldCArIGR4LCBcInNldFRvdWNoXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgb25Ub3VjaEVuZCA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgLy8gZmluaXNoIHRoZSB0b3VjaCBieSB1bmRvaW5nIHRoZSB0b3VjaCBzZXNzaW9uXG4gICAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIG9uVG91Y2hNb3ZlLCBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgaWYgKHNsaWRlci5hbmltYXRpbmdUbyA9PT0gc2xpZGVyLmN1cnJlbnRTbGlkZSAmJiAhc2Nyb2xsaW5nICYmICEoZHggPT09IG51bGwpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHVwZGF0ZUR4ID0gKHJldmVyc2UpID8gLWR4IDogZHgsXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9ICh1cGRhdGVEeCA+IDApID8gc2xpZGVyLmdldFRhcmdldCgnbmV4dCcpIDogc2xpZGVyLmdldFRhcmdldCgncHJldicpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNsaWRlci5jYW5BZHZhbmNlKHRhcmdldCkgJiYgKE51bWJlcihuZXcgRGF0ZSgpKSAtIHN0YXJ0VCA8IDU1MCAmJiBNYXRoLmFicyh1cGRhdGVEeCkgPiA1MCB8fCBNYXRoLmFicyh1cGRhdGVEeCkgPiBjd2lkdGgvMikpIHtcbiAgICAgICAgICAgICAgICAgIHNsaWRlci5mbGV4QW5pbWF0ZSh0YXJnZXQsIHNsaWRlci52YXJzLnBhdXNlT25BY3Rpb24pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBpZiAoIWZhZGUpIHsgc2xpZGVyLmZsZXhBbmltYXRlKHNsaWRlci5jdXJyZW50U2xpZGUsIHNsaWRlci52YXJzLnBhdXNlT25BY3Rpb24sIHRydWUpOyB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCwgZmFsc2UpO1xuXG4gICAgICAgICAgICAgIHN0YXJ0WCA9IG51bGw7XG4gICAgICAgICAgICAgIHN0YXJ0WSA9IG51bGw7XG4gICAgICAgICAgICAgIGR4ID0gbnVsbDtcbiAgICAgICAgICAgICAgb2Zmc2V0ID0gbnVsbDtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBvblRvdWNoU3RhcnQsIGZhbHNlKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBlbC5zdHlsZS5tc1RvdWNoQWN0aW9uID0gXCJub25lXCI7XG4gICAgICAgICAgICBlbC5fZ2VzdHVyZSA9IG5ldyBNU0dlc3R1cmUoKTtcbiAgICAgICAgICAgIGVsLl9nZXN0dXJlLnRhcmdldCA9IGVsO1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcIk1TUG9pbnRlckRvd25cIiwgb25NU1BvaW50ZXJEb3duLCBmYWxzZSk7XG4gICAgICAgICAgICBlbC5fc2xpZGVyID0gc2xpZGVyO1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcIk1TR2VzdHVyZUNoYW5nZVwiLCBvbk1TR2VzdHVyZUNoYW5nZSwgZmFsc2UpO1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcIk1TR2VzdHVyZUVuZFwiLCBvbk1TR2VzdHVyZUVuZCwgZmFsc2UpO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBvbk1TUG9pbnRlckRvd24oZSl7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAoc2xpZGVyLmFuaW1hdGluZykge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlci5wYXVzZSgpO1xuICAgICAgICAgICAgICAgICAgICBlbC5fZ2VzdHVyZS5hZGRQb2ludGVyKGUucG9pbnRlcklkKTtcbiAgICAgICAgICAgICAgICAgICAgYWNjRHggPSAwO1xuICAgICAgICAgICAgICAgICAgICBjd2lkdGggPSAodmVydGljYWwpID8gc2xpZGVyLmggOiBzbGlkZXIuIHc7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0VCA9IE51bWJlcihuZXcgRGF0ZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ0FST1VTRUw6XG5cbiAgICAgICAgICAgICAgICAgICAgb2Zmc2V0ID0gKGNhcm91c2VsICYmIHJldmVyc2UgJiYgc2xpZGVyLmFuaW1hdGluZ1RvID09PSBzbGlkZXIubGFzdCkgPyAwIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIChjYXJvdXNlbCAmJiByZXZlcnNlKSA/IHNsaWRlci5saW1pdCAtICgoKHNsaWRlci5pdGVtVyArIHNsaWRlci52YXJzLml0ZW1NYXJnaW4pICogc2xpZGVyLm1vdmUpICogc2xpZGVyLmFuaW1hdGluZ1RvKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNhcm91c2VsICYmIHNsaWRlci5jdXJyZW50U2xpZGUgPT09IHNsaWRlci5sYXN0KSA/IHNsaWRlci5saW1pdCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChjYXJvdXNlbCkgPyAoKHNsaWRlci5pdGVtVyArIHNsaWRlci52YXJzLml0ZW1NYXJnaW4pICogc2xpZGVyLm1vdmUpICogc2xpZGVyLmN1cnJlbnRTbGlkZSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAocmV2ZXJzZSkgPyAoc2xpZGVyLmxhc3QgLSBzbGlkZXIuY3VycmVudFNsaWRlICsgc2xpZGVyLmNsb25lT2Zmc2V0KSAqIGN3aWR0aCA6IChzbGlkZXIuY3VycmVudFNsaWRlICsgc2xpZGVyLmNsb25lT2Zmc2V0KSAqIGN3aWR0aDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIG9uTVNHZXN0dXJlQ2hhbmdlKGUpIHtcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIHZhciBzbGlkZXIgPSBlLnRhcmdldC5fc2xpZGVyO1xuICAgICAgICAgICAgICAgIGlmKCFzbGlkZXIpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciB0cmFuc1ggPSAtZS50cmFuc2xhdGlvblgsXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zWSA9IC1lLnRyYW5zbGF0aW9uWTtcblxuICAgICAgICAgICAgICAgIC8vQWNjdW11bGF0ZSB0cmFuc2xhdGlvbnMuXG4gICAgICAgICAgICAgICAgYWNjRHggPSBhY2NEeCArICgodmVydGljYWwpID8gdHJhbnNZIDogdHJhbnNYKTtcbiAgICAgICAgICAgICAgICBkeCA9IChzbGlkZXIudmFycy5ydGw/LTE6MSkqYWNjRHg7XG4gICAgICAgICAgICAgICAgc2Nyb2xsaW5nID0gKHZlcnRpY2FsKSA/IChNYXRoLmFicyhhY2NEeCkgPCBNYXRoLmFicygtdHJhbnNYKSkgOiAoTWF0aC5hYnMoYWNjRHgpIDwgTWF0aC5hYnMoLXRyYW5zWSkpO1xuXG4gICAgICAgICAgICAgICAgaWYoZS5kZXRhaWwgPT09IGUuTVNHRVNUVVJFX0ZMQUdfSU5FUlRJQSl7XG4gICAgICAgICAgICAgICAgICAgIHNldEltbWVkaWF0ZShmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsLl9nZXN0dXJlLnN0b3AoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghc2Nyb2xsaW5nIHx8IE51bWJlcihuZXcgRGF0ZSgpKSAtIHN0YXJ0VCA+IDUwMCkge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZmFkZSAmJiBzbGlkZXIudHJhbnNpdGlvbnMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2xpZGVyLnZhcnMuYW5pbWF0aW9uTG9vcCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR4ID0gYWNjRHggLyAoKHNsaWRlci5jdXJyZW50U2xpZGUgPT09IDAgJiYgYWNjRHggPCAwIHx8IHNsaWRlci5jdXJyZW50U2xpZGUgPT09IHNsaWRlci5sYXN0ICYmIGFjY0R4ID4gMCkgPyAoTWF0aC5hYnMoYWNjRHgpIC8gY3dpZHRoICsgMikgOiAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlci5zZXRQcm9wcyhvZmZzZXQgKyBkeCwgXCJzZXRUb3VjaFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZnVuY3Rpb24gb25NU0dlc3R1cmVFbmQoZSkge1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgdmFyIHNsaWRlciA9IGUudGFyZ2V0Ll9zbGlkZXI7XG4gICAgICAgICAgICAgICAgaWYoIXNsaWRlcil7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNsaWRlci5hbmltYXRpbmdUbyA9PT0gc2xpZGVyLmN1cnJlbnRTbGlkZSAmJiAhc2Nyb2xsaW5nICYmICEoZHggPT09IG51bGwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB1cGRhdGVEeCA9IChyZXZlcnNlKSA/IC1keCA6IGR4LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gKHVwZGF0ZUR4ID4gMCkgPyBzbGlkZXIuZ2V0VGFyZ2V0KCduZXh0JykgOiBzbGlkZXIuZ2V0VGFyZ2V0KCdwcmV2Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHNsaWRlci5jYW5BZHZhbmNlKHRhcmdldCkgJiYgKE51bWJlcihuZXcgRGF0ZSgpKSAtIHN0YXJ0VCA8IDU1MCAmJiBNYXRoLmFicyh1cGRhdGVEeCkgPiA1MCB8fCBNYXRoLmFicyh1cGRhdGVEeCkgPiBjd2lkdGgvMikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlci5mbGV4QW5pbWF0ZSh0YXJnZXQsIHNsaWRlci52YXJzLnBhdXNlT25BY3Rpb24pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmYWRlKSB7IHNsaWRlci5mbGV4QW5pbWF0ZShzbGlkZXIuY3VycmVudFNsaWRlLCBzbGlkZXIudmFycy5wYXVzZU9uQWN0aW9uLCB0cnVlKTsgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3RhcnRYID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzdGFydFkgPSBudWxsO1xuICAgICAgICAgICAgICAgIGR4ID0gbnVsbDtcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSBudWxsO1xuICAgICAgICAgICAgICAgIGFjY0R4ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHJlc2l6ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghc2xpZGVyLmFuaW1hdGluZyAmJiBzbGlkZXIuaXMoJzp2aXNpYmxlJykpIHtcbiAgICAgICAgICBpZiAoIWNhcm91c2VsKSB7IHNsaWRlci5kb01hdGgoKTsgfVxuXG4gICAgICAgICAgaWYgKGZhZGUpIHtcbiAgICAgICAgICAgIC8vIFNNT09USCBIRUlHSFQ6XG4gICAgICAgICAgICBtZXRob2RzLnNtb290aEhlaWdodCgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoY2Fyb3VzZWwpIHsgLy9DQVJPVVNFTDpcbiAgICAgICAgICAgIHNsaWRlci5zbGlkZXMud2lkdGgoc2xpZGVyLmNvbXB1dGVkVyk7XG4gICAgICAgICAgICBzbGlkZXIudXBkYXRlKHNsaWRlci5wYWdpbmdDb3VudCk7XG4gICAgICAgICAgICBzbGlkZXIuc2V0UHJvcHMoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAodmVydGljYWwpIHsgLy9WRVJUSUNBTDpcbiAgICAgICAgICAgIHNsaWRlci52aWV3cG9ydC5oZWlnaHQoc2xpZGVyLmgpO1xuICAgICAgICAgICAgc2xpZGVyLnNldFByb3BzKHNsaWRlci5oLCBcInNldFRvdGFsXCIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBTTU9PVEggSEVJR0hUOlxuICAgICAgICAgICAgaWYgKHNsaWRlci52YXJzLnNtb290aEhlaWdodCkgeyBtZXRob2RzLnNtb290aEhlaWdodCgpOyB9XG4gICAgICAgICAgICBzbGlkZXIubmV3U2xpZGVzLndpZHRoKHNsaWRlci5jb21wdXRlZFcpO1xuICAgICAgICAgICAgc2xpZGVyLnNldFByb3BzKHNsaWRlci5jb21wdXRlZFcsIFwic2V0VG90YWxcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc21vb3RoSGVpZ2h0OiBmdW5jdGlvbihkdXIpIHtcbiAgICAgICAgaWYgKCF2ZXJ0aWNhbCB8fCBmYWRlKSB7XG4gICAgICAgICAgdmFyICRvYmogPSAoZmFkZSkgPyBzbGlkZXIgOiBzbGlkZXIudmlld3BvcnQ7XG4gICAgICAgICAgKGR1cikgPyAkb2JqLmFuaW1hdGUoe1wiaGVpZ2h0XCI6IHNsaWRlci5zbGlkZXMuZXEoc2xpZGVyLmFuaW1hdGluZ1RvKS5pbm5lckhlaWdodCgpfSwgZHVyKSA6ICRvYmouaW5uZXJIZWlnaHQoc2xpZGVyLnNsaWRlcy5lcShzbGlkZXIuYW5pbWF0aW5nVG8pLmlubmVySGVpZ2h0KCkpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc3luYzogZnVuY3Rpb24oYWN0aW9uKSB7XG4gICAgICAgIHZhciAkb2JqID0gJChzbGlkZXIudmFycy5zeW5jKS5kYXRhKFwiZmxleHNsaWRlclwiKSxcbiAgICAgICAgICAgIHRhcmdldCA9IHNsaWRlci5hbmltYXRpbmdUbztcblxuICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICAgIGNhc2UgXCJhbmltYXRlXCI6ICRvYmouZmxleEFuaW1hdGUodGFyZ2V0LCBzbGlkZXIudmFycy5wYXVzZU9uQWN0aW9uLCBmYWxzZSwgdHJ1ZSk7IGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJwbGF5XCI6IGlmICghJG9iai5wbGF5aW5nICYmICEkb2JqLmFzTmF2KSB7ICRvYmoucGxheSgpOyB9IGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJwYXVzZVwiOiAkb2JqLnBhdXNlKCk7IGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdW5pcXVlSUQ6IGZ1bmN0aW9uKCRjbG9uZSkge1xuICAgICAgICAvLyBBcHBlbmQgX2Nsb25lIHRvIGN1cnJlbnQgbGV2ZWwgYW5kIGNoaWxkcmVuIGVsZW1lbnRzIHdpdGggaWQgYXR0cmlidXRlc1xuICAgICAgICAkY2xvbmUuZmlsdGVyKCAnW2lkXScgKS5hZGQoJGNsb25lLmZpbmQoICdbaWRdJyApKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgJHRoaXMuYXR0ciggJ2lkJywgJHRoaXMuYXR0ciggJ2lkJyApICsgJ19jbG9uZScgKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiAkY2xvbmU7XG4gICAgICB9LFxuICAgICAgcGF1c2VJbnZpc2libGU6IHtcbiAgICAgICAgdmlzUHJvcDogbnVsbCxcbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIHZpc1Byb3AgPSBtZXRob2RzLnBhdXNlSW52aXNpYmxlLmdldEhpZGRlblByb3AoKTtcbiAgICAgICAgICBpZiAodmlzUHJvcCkge1xuICAgICAgICAgICAgdmFyIGV2dG5hbWUgPSB2aXNQcm9wLnJlcGxhY2UoL1tIfGhdaWRkZW4vLCcnKSArICd2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZ0bmFtZSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGlmIChtZXRob2RzLnBhdXNlSW52aXNpYmxlLmlzSGlkZGVuKCkpIHtcbiAgICAgICAgICAgICAgICBpZihzbGlkZXIuc3RhcnRUaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoc2xpZGVyLnN0YXJ0VGltZW91dCk7IC8vSWYgY2xvY2sgaXMgdGlja2luZywgc3RvcCB0aW1lciBhbmQgcHJldmVudCBmcm9tIHN0YXJ0aW5nIHdoaWxlIGludmlzaWJsZVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBzbGlkZXIucGF1c2UoKTsgLy9PciBqdXN0IHBhdXNlXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmKHNsaWRlci5zdGFydGVkKSB7XG4gICAgICAgICAgICAgICAgICBzbGlkZXIucGxheSgpOyAvL0luaXRpYXRlZCBiZWZvcmUsIGp1c3QgcGxheVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBpZiAoc2xpZGVyLnZhcnMuaW5pdERlbGF5ID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KHNsaWRlci5wbGF5LCBzbGlkZXIudmFycy5pbml0RGVsYXkpO1xuICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2xpZGVyLnBsYXkoKTsgLy9EaWRuJ3QgaW5pdCBiZWZvcmU6IHNpbXBseSBpbml0IG9yIHdhaXQgZm9yIGl0XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGlzSGlkZGVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICB2YXIgcHJvcCA9IG1ldGhvZHMucGF1c2VJbnZpc2libGUuZ2V0SGlkZGVuUHJvcCgpO1xuICAgICAgICAgIGlmICghcHJvcCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZG9jdW1lbnRbcHJvcF07XG4gICAgICAgIH0sXG4gICAgICAgIGdldEhpZGRlblByb3A6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBwcmVmaXhlcyA9IFsnd2Via2l0JywnbW96JywnbXMnLCdvJ107XG4gICAgICAgICAgLy8gaWYgJ2hpZGRlbicgaXMgbmF0aXZlbHkgc3VwcG9ydGVkIGp1c3QgcmV0dXJuIGl0XG4gICAgICAgICAgaWYgKCdoaWRkZW4nIGluIGRvY3VtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gJ2hpZGRlbic7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIG90aGVyd2lzZSBsb29wIG92ZXIgYWxsIHRoZSBrbm93biBwcmVmaXhlcyB1bnRpbCB3ZSBmaW5kIG9uZVxuICAgICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgICBpZiAoKHByZWZpeGVzW2ldICsgJ0hpZGRlbicpIGluIGRvY3VtZW50KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZWZpeGVzW2ldICsgJ0hpZGRlbic7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gb3RoZXJ3aXNlIGl0J3Mgbm90IHN1cHBvcnRlZFxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgc2V0VG9DbGVhcldhdGNoZWRFdmVudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh3YXRjaGVkRXZlbnRDbGVhclRpbWVyKTtcbiAgICAgICAgd2F0Y2hlZEV2ZW50Q2xlYXJUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgd2F0Y2hlZEV2ZW50ID0gXCJcIjtcbiAgICAgICAgfSwgMzAwMCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgc2xpZGVyLmZsZXhBbmltYXRlID0gZnVuY3Rpb24odGFyZ2V0LCBwYXVzZSwgb3ZlcnJpZGUsIHdpdGhTeW5jLCBmcm9tTmF2KSB7XG4gICAgICBpZiAoIXNsaWRlci52YXJzLmFuaW1hdGlvbkxvb3AgJiYgdGFyZ2V0ICE9PSBzbGlkZXIuY3VycmVudFNsaWRlKSB7XG4gICAgICAgIHNsaWRlci5kaXJlY3Rpb24gPSAodGFyZ2V0ID4gc2xpZGVyLmN1cnJlbnRTbGlkZSkgPyBcIm5leHRcIiA6IFwicHJldlwiO1xuICAgICAgfVxuXG4gICAgICBpZiAoYXNOYXYgJiYgc2xpZGVyLnBhZ2luZ0NvdW50ID09PSAxKSBzbGlkZXIuZGlyZWN0aW9uID0gKHNsaWRlci5jdXJyZW50SXRlbSA8IHRhcmdldCkgPyBcIm5leHRcIiA6IFwicHJldlwiO1xuXG4gICAgICBpZiAoIXNsaWRlci5hbmltYXRpbmcgJiYgKHNsaWRlci5jYW5BZHZhbmNlKHRhcmdldCwgZnJvbU5hdikgfHwgb3ZlcnJpZGUpICYmIHNsaWRlci5pcyhcIjp2aXNpYmxlXCIpKSB7XG4gICAgICAgIGlmIChhc05hdiAmJiB3aXRoU3luYykge1xuICAgICAgICAgIHZhciBtYXN0ZXIgPSAkKHNsaWRlci52YXJzLmFzTmF2Rm9yKS5kYXRhKCdmbGV4c2xpZGVyJyk7XG4gICAgICAgICAgc2xpZGVyLmF0RW5kID0gdGFyZ2V0ID09PSAwIHx8IHRhcmdldCA9PT0gc2xpZGVyLmNvdW50IC0gMTtcbiAgICAgICAgICBtYXN0ZXIuZmxleEFuaW1hdGUodGFyZ2V0LCB0cnVlLCBmYWxzZSwgdHJ1ZSwgZnJvbU5hdik7XG4gICAgICAgICAgc2xpZGVyLmRpcmVjdGlvbiA9IChzbGlkZXIuY3VycmVudEl0ZW0gPCB0YXJnZXQpID8gXCJuZXh0XCIgOiBcInByZXZcIjtcbiAgICAgICAgICBtYXN0ZXIuZGlyZWN0aW9uID0gc2xpZGVyLmRpcmVjdGlvbjtcblxuICAgICAgICAgIGlmIChNYXRoLmNlaWwoKHRhcmdldCArIDEpL3NsaWRlci52aXNpYmxlKSAtIDEgIT09IHNsaWRlci5jdXJyZW50U2xpZGUgJiYgdGFyZ2V0ICE9PSAwKSB7XG4gICAgICAgICAgICBzbGlkZXIuY3VycmVudEl0ZW0gPSB0YXJnZXQ7XG4gICAgICAgICAgICBzbGlkZXIuc2xpZGVzLnJlbW92ZUNsYXNzKG5hbWVzcGFjZSArIFwiYWN0aXZlLXNsaWRlXCIpLmVxKHRhcmdldCkuYWRkQ2xhc3MobmFtZXNwYWNlICsgXCJhY3RpdmUtc2xpZGVcIik7XG4gICAgICAgICAgICB0YXJnZXQgPSBNYXRoLmZsb29yKHRhcmdldC9zbGlkZXIudmlzaWJsZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWRlci5jdXJyZW50SXRlbSA9IHRhcmdldDtcbiAgICAgICAgICAgIHNsaWRlci5zbGlkZXMucmVtb3ZlQ2xhc3MobmFtZXNwYWNlICsgXCJhY3RpdmUtc2xpZGVcIikuZXEodGFyZ2V0KS5hZGRDbGFzcyhuYW1lc3BhY2UgKyBcImFjdGl2ZS1zbGlkZVwiKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzbGlkZXIuYW5pbWF0aW5nID0gdHJ1ZTtcbiAgICAgICAgc2xpZGVyLmFuaW1hdGluZ1RvID0gdGFyZ2V0O1xuXG4gICAgICAgIC8vIFNMSURFU0hPVzpcbiAgICAgICAgaWYgKHBhdXNlKSB7IHNsaWRlci5wYXVzZSgpOyB9XG5cbiAgICAgICAgLy8gQVBJOiBiZWZvcmUoKSBhbmltYXRpb24gQ2FsbGJhY2tcbiAgICAgICAgc2xpZGVyLnZhcnMuYmVmb3JlKHNsaWRlcik7XG5cbiAgICAgICAgLy8gU1lOQzpcbiAgICAgICAgaWYgKHNsaWRlci5zeW5jRXhpc3RzICYmICFmcm9tTmF2KSB7IG1ldGhvZHMuc3luYyhcImFuaW1hdGVcIik7IH1cblxuICAgICAgICAvLyBDT05UUk9MTkFWXG4gICAgICAgIGlmIChzbGlkZXIudmFycy5jb250cm9sTmF2KSB7IG1ldGhvZHMuY29udHJvbE5hdi5hY3RpdmUoKTsgfVxuXG4gICAgICAgIC8vICFDQVJPVVNFTDpcbiAgICAgICAgLy8gQ0FORElEQVRFOiBzbGlkZSBhY3RpdmUgY2xhc3MgKGZvciBhZGQvcmVtb3ZlIHNsaWRlKVxuICAgICAgICBpZiAoIWNhcm91c2VsKSB7IHNsaWRlci5zbGlkZXMucmVtb3ZlQ2xhc3MobmFtZXNwYWNlICsgJ2FjdGl2ZS1zbGlkZScpLmVxKHRhcmdldCkuYWRkQ2xhc3MobmFtZXNwYWNlICsgJ2FjdGl2ZS1zbGlkZScpOyB9XG5cbiAgICAgICAgLy8gSU5GSU5JVEUgTE9PUDpcbiAgICAgICAgLy8gQ0FORElEQVRFOiBhdEVuZFxuICAgICAgICBzbGlkZXIuYXRFbmQgPSB0YXJnZXQgPT09IDAgfHwgdGFyZ2V0ID09PSBzbGlkZXIubGFzdDtcblxuICAgICAgICAvLyBESVJFQ1RJT05OQVY6XG4gICAgICAgIGlmIChzbGlkZXIudmFycy5kaXJlY3Rpb25OYXYpIHsgbWV0aG9kcy5kaXJlY3Rpb25OYXYudXBkYXRlKCk7IH1cblxuICAgICAgICBpZiAodGFyZ2V0ID09PSBzbGlkZXIubGFzdCkge1xuICAgICAgICAgIC8vIEFQSTogZW5kKCkgb2YgY3ljbGUgQ2FsbGJhY2tcbiAgICAgICAgICBzbGlkZXIudmFycy5lbmQoc2xpZGVyKTtcbiAgICAgICAgICAvLyBTTElERVNIT1cgJiYgIUlORklOSVRFIExPT1A6XG4gICAgICAgICAgaWYgKCFzbGlkZXIudmFycy5hbmltYXRpb25Mb29wKSB7IHNsaWRlci5wYXVzZSgpOyB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTTElERTpcbiAgICAgICAgaWYgKCFmYWRlKSB7XG4gICAgICAgICAgdmFyIGRpbWVuc2lvbiA9ICh2ZXJ0aWNhbCkgPyBzbGlkZXIuc2xpZGVzLmZpbHRlcignOmZpcnN0JykuaGVpZ2h0KCkgOiBzbGlkZXIuY29tcHV0ZWRXLFxuICAgICAgICAgICAgICBtYXJnaW4sIHNsaWRlU3RyaW5nLCBjYWxjTmV4dDtcblxuICAgICAgICAgIC8vIElORklOSVRFIExPT1AgLyBSRVZFUlNFOlxuICAgICAgICAgIGlmIChjYXJvdXNlbCkge1xuICAgICAgICAgICAgbWFyZ2luID0gc2xpZGVyLnZhcnMuaXRlbU1hcmdpbjtcbiAgICAgICAgICAgIGNhbGNOZXh0ID0gKChzbGlkZXIuaXRlbVcgKyBtYXJnaW4pICogc2xpZGVyLm1vdmUpICogc2xpZGVyLmFuaW1hdGluZ1RvO1xuICAgICAgICAgICAgc2xpZGVTdHJpbmcgPSAoY2FsY05leHQgPiBzbGlkZXIubGltaXQgJiYgc2xpZGVyLnZpc2libGUgIT09IDEpID8gc2xpZGVyLmxpbWl0IDogY2FsY05leHQ7XG4gICAgICAgICAgfSBlbHNlIGlmIChzbGlkZXIuY3VycmVudFNsaWRlID09PSAwICYmIHRhcmdldCA9PT0gc2xpZGVyLmNvdW50IC0gMSAmJiBzbGlkZXIudmFycy5hbmltYXRpb25Mb29wICYmIHNsaWRlci5kaXJlY3Rpb24gIT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgICBzbGlkZVN0cmluZyA9IChyZXZlcnNlKSA/IChzbGlkZXIuY291bnQgKyBzbGlkZXIuY2xvbmVPZmZzZXQpICogZGltZW5zaW9uIDogMDtcbiAgICAgICAgICB9IGVsc2UgaWYgKHNsaWRlci5jdXJyZW50U2xpZGUgPT09IHNsaWRlci5sYXN0ICYmIHRhcmdldCA9PT0gMCAmJiBzbGlkZXIudmFycy5hbmltYXRpb25Mb29wICYmIHNsaWRlci5kaXJlY3Rpb24gIT09IFwicHJldlwiKSB7XG4gICAgICAgICAgICBzbGlkZVN0cmluZyA9IChyZXZlcnNlKSA/IDAgOiAoc2xpZGVyLmNvdW50ICsgMSkgKiBkaW1lbnNpb247XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWRlU3RyaW5nID0gKHJldmVyc2UpID8gKChzbGlkZXIuY291bnQgLSAxKSAtIHRhcmdldCArIHNsaWRlci5jbG9uZU9mZnNldCkgKiBkaW1lbnNpb24gOiAodGFyZ2V0ICsgc2xpZGVyLmNsb25lT2Zmc2V0KSAqIGRpbWVuc2lvbjtcbiAgICAgICAgICB9XG4gICAgICAgICAgc2xpZGVyLnNldFByb3BzKHNsaWRlU3RyaW5nLCBcIlwiLCBzbGlkZXIudmFycy5hbmltYXRpb25TcGVlZCk7XG4gICAgICAgICAgaWYgKHNsaWRlci50cmFuc2l0aW9ucykge1xuICAgICAgICAgICAgaWYgKCFzbGlkZXIudmFycy5hbmltYXRpb25Mb29wIHx8ICFzbGlkZXIuYXRFbmQpIHtcbiAgICAgICAgICAgICAgc2xpZGVyLmFuaW1hdGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICBzbGlkZXIuY3VycmVudFNsaWRlID0gc2xpZGVyLmFuaW1hdGluZ1RvO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBVbmJpbmQgcHJldmlvdXMgdHJhbnNpdGlvbkVuZCBldmVudHMgYW5kIHJlLWJpbmQgbmV3IHRyYW5zaXRpb25FbmQgZXZlbnRcbiAgICAgICAgICAgIHNsaWRlci5jb250YWluZXIudW5iaW5kKFwid2Via2l0VHJhbnNpdGlvbkVuZCB0cmFuc2l0aW9uZW5kXCIpO1xuICAgICAgICAgICAgc2xpZGVyLmNvbnRhaW5lci5iaW5kKFwid2Via2l0VHJhbnNpdGlvbkVuZCB0cmFuc2l0aW9uZW5kXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoc2xpZGVyLmVuc3VyZUFuaW1hdGlvbkVuZCk7XG4gICAgICAgICAgICAgIHNsaWRlci53cmFwdXAoZGltZW5zaW9uKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBJbnN1cmFuY2UgZm9yIHRoZSBldmVyLXNvLWZpY2tsZSB0cmFuc2l0aW9uRW5kIGV2ZW50XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoc2xpZGVyLmVuc3VyZUFuaW1hdGlvbkVuZCk7XG4gICAgICAgICAgICBzbGlkZXIuZW5zdXJlQW5pbWF0aW9uRW5kID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgc2xpZGVyLndyYXB1cChkaW1lbnNpb24pO1xuICAgICAgICAgICAgfSwgc2xpZGVyLnZhcnMuYW5pbWF0aW9uU3BlZWQgKyAxMDApO1xuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWRlci5jb250YWluZXIuYW5pbWF0ZShzbGlkZXIuYXJncywgc2xpZGVyLnZhcnMuYW5pbWF0aW9uU3BlZWQsIHNsaWRlci52YXJzLmVhc2luZywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgc2xpZGVyLndyYXB1cChkaW1lbnNpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgeyAvLyBGQURFOlxuICAgICAgICAgIGlmICghdG91Y2gpIHtcbiAgICAgICAgICAgIHNsaWRlci5zbGlkZXMuZXEoc2xpZGVyLmN1cnJlbnRTbGlkZSkuY3NzKHtcInpJbmRleFwiOiAxfSkuYW5pbWF0ZSh7XCJvcGFjaXR5XCI6IDB9LCBzbGlkZXIudmFycy5hbmltYXRpb25TcGVlZCwgc2xpZGVyLnZhcnMuZWFzaW5nKTtcbiAgICAgICAgICAgIHNsaWRlci5zbGlkZXMuZXEodGFyZ2V0KS5jc3Moe1wiekluZGV4XCI6IDJ9KS5hbmltYXRlKHtcIm9wYWNpdHlcIjogMX0sIHNsaWRlci52YXJzLmFuaW1hdGlvblNwZWVkLCBzbGlkZXIudmFycy5lYXNpbmcsIHNsaWRlci53cmFwdXApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzbGlkZXIuc2xpZGVzLmVxKHNsaWRlci5jdXJyZW50U2xpZGUpLmNzcyh7IFwib3BhY2l0eVwiOiAwLCBcInpJbmRleFwiOiAxIH0pO1xuICAgICAgICAgICAgc2xpZGVyLnNsaWRlcy5lcSh0YXJnZXQpLmNzcyh7IFwib3BhY2l0eVwiOiAxLCBcInpJbmRleFwiOiAyIH0pO1xuICAgICAgICAgICAgc2xpZGVyLndyYXB1cChkaW1lbnNpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBTTU9PVEggSEVJR0hUOlxuICAgICAgICBpZiAoc2xpZGVyLnZhcnMuc21vb3RoSGVpZ2h0KSB7IG1ldGhvZHMuc21vb3RoSGVpZ2h0KHNsaWRlci52YXJzLmFuaW1hdGlvblNwZWVkKTsgfVxuICAgICAgfVxuICAgIH07XG4gICAgc2xpZGVyLndyYXB1cCA9IGZ1bmN0aW9uKGRpbWVuc2lvbikge1xuICAgICAgLy8gU0xJREU6XG4gICAgICBpZiAoIWZhZGUgJiYgIWNhcm91c2VsKSB7XG4gICAgICAgIGlmIChzbGlkZXIuY3VycmVudFNsaWRlID09PSAwICYmIHNsaWRlci5hbmltYXRpbmdUbyA9PT0gc2xpZGVyLmxhc3QgJiYgc2xpZGVyLnZhcnMuYW5pbWF0aW9uTG9vcCkge1xuICAgICAgICAgIHNsaWRlci5zZXRQcm9wcyhkaW1lbnNpb24sIFwianVtcEVuZFwiKTtcbiAgICAgICAgfSBlbHNlIGlmIChzbGlkZXIuY3VycmVudFNsaWRlID09PSBzbGlkZXIubGFzdCAmJiBzbGlkZXIuYW5pbWF0aW5nVG8gPT09IDAgJiYgc2xpZGVyLnZhcnMuYW5pbWF0aW9uTG9vcCkge1xuICAgICAgICAgIHNsaWRlci5zZXRQcm9wcyhkaW1lbnNpb24sIFwianVtcFN0YXJ0XCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzbGlkZXIuYW5pbWF0aW5nID0gZmFsc2U7XG4gICAgICBzbGlkZXIuY3VycmVudFNsaWRlID0gc2xpZGVyLmFuaW1hdGluZ1RvO1xuICAgICAgLy8gQVBJOiBhZnRlcigpIGFuaW1hdGlvbiBDYWxsYmFja1xuICAgICAgc2xpZGVyLnZhcnMuYWZ0ZXIoc2xpZGVyKTtcbiAgICB9O1xuXG4gICAgLy8gU0xJREVTSE9XOlxuICAgIHNsaWRlci5hbmltYXRlU2xpZGVzID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXNsaWRlci5hbmltYXRpbmcgJiYgZm9jdXNlZCApIHsgc2xpZGVyLmZsZXhBbmltYXRlKHNsaWRlci5nZXRUYXJnZXQoXCJuZXh0XCIpKTsgfVxuICAgIH07XG4gICAgLy8gU0xJREVTSE9XOlxuICAgIHNsaWRlci5wYXVzZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgY2xlYXJJbnRlcnZhbChzbGlkZXIuYW5pbWF0ZWRTbGlkZXMpO1xuICAgICAgc2xpZGVyLmFuaW1hdGVkU2xpZGVzID0gbnVsbDtcbiAgICAgIHNsaWRlci5wbGF5aW5nID0gZmFsc2U7XG4gICAgICAvLyBQQVVTRVBMQVk6XG4gICAgICBpZiAoc2xpZGVyLnZhcnMucGF1c2VQbGF5KSB7IG1ldGhvZHMucGF1c2VQbGF5LnVwZGF0ZShcInBsYXlcIik7IH1cbiAgICAgIC8vIFNZTkM6XG4gICAgICBpZiAoc2xpZGVyLnN5bmNFeGlzdHMpIHsgbWV0aG9kcy5zeW5jKFwicGF1c2VcIik7IH1cbiAgICB9O1xuICAgIC8vIFNMSURFU0hPVzpcbiAgICBzbGlkZXIucGxheSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHNsaWRlci5wbGF5aW5nKSB7IGNsZWFySW50ZXJ2YWwoc2xpZGVyLmFuaW1hdGVkU2xpZGVzKTsgfVxuICAgICAgc2xpZGVyLmFuaW1hdGVkU2xpZGVzID0gc2xpZGVyLmFuaW1hdGVkU2xpZGVzIHx8IHNldEludGVydmFsKHNsaWRlci5hbmltYXRlU2xpZGVzLCBzbGlkZXIudmFycy5zbGlkZXNob3dTcGVlZCk7XG4gICAgICBzbGlkZXIuc3RhcnRlZCA9IHNsaWRlci5wbGF5aW5nID0gdHJ1ZTtcbiAgICAgIC8vIFBBVVNFUExBWTpcbiAgICAgIGlmIChzbGlkZXIudmFycy5wYXVzZVBsYXkpIHsgbWV0aG9kcy5wYXVzZVBsYXkudXBkYXRlKFwicGF1c2VcIik7IH1cbiAgICAgIC8vIFNZTkM6XG4gICAgICBpZiAoc2xpZGVyLnN5bmNFeGlzdHMpIHsgbWV0aG9kcy5zeW5jKFwicGxheVwiKTsgfVxuICAgIH07XG4gICAgLy8gU1RPUDpcbiAgICBzbGlkZXIuc3RvcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHNsaWRlci5wYXVzZSgpO1xuICAgICAgc2xpZGVyLnN0b3BwZWQgPSB0cnVlO1xuICAgIH07XG4gICAgc2xpZGVyLmNhbkFkdmFuY2UgPSBmdW5jdGlvbih0YXJnZXQsIGZyb21OYXYpIHtcbiAgICAgIC8vIEFTTkFWOlxuICAgICAgdmFyIGxhc3QgPSAoYXNOYXYpID8gc2xpZGVyLnBhZ2luZ0NvdW50IC0gMSA6IHNsaWRlci5sYXN0O1xuICAgICAgcmV0dXJuIChmcm9tTmF2KSA/IHRydWUgOlxuICAgICAgICAgICAgIChhc05hdiAmJiBzbGlkZXIuY3VycmVudEl0ZW0gPT09IHNsaWRlci5jb3VudCAtIDEgJiYgdGFyZ2V0ID09PSAwICYmIHNsaWRlci5kaXJlY3Rpb24gPT09IFwicHJldlwiKSA/IHRydWUgOlxuICAgICAgICAgICAgIChhc05hdiAmJiBzbGlkZXIuY3VycmVudEl0ZW0gPT09IDAgJiYgdGFyZ2V0ID09PSBzbGlkZXIucGFnaW5nQ291bnQgLSAxICYmIHNsaWRlci5kaXJlY3Rpb24gIT09IFwibmV4dFwiKSA/IGZhbHNlIDpcbiAgICAgICAgICAgICAodGFyZ2V0ID09PSBzbGlkZXIuY3VycmVudFNsaWRlICYmICFhc05hdikgPyBmYWxzZSA6XG4gICAgICAgICAgICAgKHNsaWRlci52YXJzLmFuaW1hdGlvbkxvb3ApID8gdHJ1ZSA6XG4gICAgICAgICAgICAgKHNsaWRlci5hdEVuZCAmJiBzbGlkZXIuY3VycmVudFNsaWRlID09PSAwICYmIHRhcmdldCA9PT0gbGFzdCAmJiBzbGlkZXIuZGlyZWN0aW9uICE9PSBcIm5leHRcIikgPyBmYWxzZSA6XG4gICAgICAgICAgICAgKHNsaWRlci5hdEVuZCAmJiBzbGlkZXIuY3VycmVudFNsaWRlID09PSBsYXN0ICYmIHRhcmdldCA9PT0gMCAmJiBzbGlkZXIuZGlyZWN0aW9uID09PSBcIm5leHRcIikgPyBmYWxzZSA6XG4gICAgICAgICAgICAgdHJ1ZTtcbiAgICB9O1xuICAgIHNsaWRlci5nZXRUYXJnZXQgPSBmdW5jdGlvbihkaXIpIHtcbiAgICAgIHNsaWRlci5kaXJlY3Rpb24gPSBkaXI7XG4gICAgICBpZiAoZGlyID09PSBcIm5leHRcIikge1xuICAgICAgICByZXR1cm4gKHNsaWRlci5jdXJyZW50U2xpZGUgPT09IHNsaWRlci5sYXN0KSA/IDAgOiBzbGlkZXIuY3VycmVudFNsaWRlICsgMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAoc2xpZGVyLmN1cnJlbnRTbGlkZSA9PT0gMCkgPyBzbGlkZXIubGFzdCA6IHNsaWRlci5jdXJyZW50U2xpZGUgLSAxO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBTTElERTpcbiAgICBzbGlkZXIuc2V0UHJvcHMgPSBmdW5jdGlvbihwb3MsIHNwZWNpYWwsIGR1cikge1xuICAgICAgdmFyIHRhcmdldCA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHBvc0NoZWNrID0gKHBvcykgPyBwb3MgOiAoKHNsaWRlci5pdGVtVyArIHNsaWRlci52YXJzLml0ZW1NYXJnaW4pICogc2xpZGVyLm1vdmUpICogc2xpZGVyLmFuaW1hdGluZ1RvLFxuICAgICAgICAgICAgcG9zQ2FsYyA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgaWYgKGNhcm91c2VsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChzcGVjaWFsID09PSBcInNldFRvdWNoXCIpID8gcG9zIDpcbiAgICAgICAgICAgICAgICAgICAgICAgKHJldmVyc2UgJiYgc2xpZGVyLmFuaW1hdGluZ1RvID09PSBzbGlkZXIubGFzdCkgPyAwIDpcbiAgICAgICAgICAgICAgICAgICAgICAgKHJldmVyc2UpID8gc2xpZGVyLmxpbWl0IC0gKCgoc2xpZGVyLml0ZW1XICsgc2xpZGVyLnZhcnMuaXRlbU1hcmdpbikgKiBzbGlkZXIubW92ZSkgKiBzbGlkZXIuYW5pbWF0aW5nVG8pIDpcbiAgICAgICAgICAgICAgICAgICAgICAgKHNsaWRlci5hbmltYXRpbmdUbyA9PT0gc2xpZGVyLmxhc3QpID8gc2xpZGVyLmxpbWl0IDogcG9zQ2hlY2s7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChzcGVjaWFsKSB7XG4gICAgICAgICAgICAgICAgICBjYXNlIFwic2V0VG90YWxcIjogcmV0dXJuIChyZXZlcnNlKSA/ICgoc2xpZGVyLmNvdW50IC0gMSkgLSBzbGlkZXIuY3VycmVudFNsaWRlICsgc2xpZGVyLmNsb25lT2Zmc2V0KSAqIHBvcyA6IChzbGlkZXIuY3VycmVudFNsaWRlICsgc2xpZGVyLmNsb25lT2Zmc2V0KSAqIHBvcztcbiAgICAgICAgICAgICAgICAgIGNhc2UgXCJzZXRUb3VjaFwiOiByZXR1cm4gKHJldmVyc2UpID8gcG9zIDogcG9zO1xuICAgICAgICAgICAgICAgICAgY2FzZSBcImp1bXBFbmRcIjogcmV0dXJuIChyZXZlcnNlKSA/IHBvcyA6IHNsaWRlci5jb3VudCAqIHBvcztcbiAgICAgICAgICAgICAgICAgIGNhc2UgXCJqdW1wU3RhcnRcIjogcmV0dXJuIChyZXZlcnNlKSA/IHNsaWRlci5jb3VudCAqIHBvcyA6IHBvcztcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiBwb3M7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KCkpO1xuXG4gICAgICAgICAgICByZXR1cm4gKHBvc0NhbGMgKiAoKHNsaWRlci52YXJzLnJ0bCk/MTotMSkpICsgXCJweFwiO1xuICAgICAgICAgIH0oKSk7XG5cbiAgICAgIGlmIChzbGlkZXIudHJhbnNpdGlvbnMpIHtcbiAgICAgICAgaWYgKHNsaWRlci5pc0ZpcmVmb3gpIHtcbiAgICAgICAgICB0YXJnZXQgPSAodmVydGljYWwpID8gXCJ0cmFuc2xhdGUzZCgwLFwiICsgdGFyZ2V0ICsgXCIsMClcIiA6IFwidHJhbnNsYXRlM2QoXCIgKyAocGFyc2VJbnQodGFyZ2V0KSsncHgnKSArIFwiLDAsMClcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0YXJnZXQgPSAodmVydGljYWwpID8gXCJ0cmFuc2xhdGUzZCgwLFwiICsgdGFyZ2V0ICsgXCIsMClcIiA6IFwidHJhbnNsYXRlM2QoXCIgKyAoKHNsaWRlci52YXJzLnJ0bD8tMToxKSpwYXJzZUludCh0YXJnZXQpKydweCcpICsgXCIsMCwwKVwiO1xuICAgICAgICB9XG4gICAgICAgIGR1ciA9IChkdXIgIT09IHVuZGVmaW5lZCkgPyAoZHVyLzEwMDApICsgXCJzXCIgOiBcIjBzXCI7XG4gICAgICAgIHNsaWRlci5jb250YWluZXIuY3NzKFwiLVwiICsgc2xpZGVyLnBmeCArIFwiLXRyYW5zaXRpb24tZHVyYXRpb25cIiwgZHVyKTtcbiAgICAgICAgIHNsaWRlci5jb250YWluZXIuY3NzKFwidHJhbnNpdGlvbi1kdXJhdGlvblwiLCBkdXIpO1xuICAgICAgfVxuXG4gICAgICBzbGlkZXIuYXJnc1tzbGlkZXIucHJvcF0gPSB0YXJnZXQ7XG4gICAgICBpZiAoc2xpZGVyLnRyYW5zaXRpb25zIHx8IGR1ciA9PT0gdW5kZWZpbmVkKSB7IHNsaWRlci5jb250YWluZXIuY3NzKHNsaWRlci5hcmdzKTsgfVxuXG4gICAgICBzbGlkZXIuY29udGFpbmVyLmNzcygndHJhbnNmb3JtJyx0YXJnZXQpO1xuICAgIH07XG5cbiAgICBzbGlkZXIuc2V0dXAgPSBmdW5jdGlvbih0eXBlKSB7XG4gICAgICAvLyBTTElERTpcbiAgICAgIGlmICghZmFkZSkge1xuICAgICAgICB2YXIgc2xpZGVyT2Zmc2V0LCBhcnI7XG5cbiAgICAgICAgaWYgKHR5cGUgPT09IFwiaW5pdFwiKSB7XG4gICAgICAgICAgc2xpZGVyLnZpZXdwb3J0ID0gJCgnPGRpdiBjbGFzcz1cIicgKyBuYW1lc3BhY2UgKyAndmlld3BvcnRcIj48L2Rpdj4nKS5jc3Moe1wib3ZlcmZsb3dcIjogXCJoaWRkZW5cIiwgXCJwb3NpdGlvblwiOiBcInJlbGF0aXZlXCJ9KS5hcHBlbmRUbyhzbGlkZXIpLmFwcGVuZChzbGlkZXIuY29udGFpbmVyKTtcbiAgICAgICAgICAvLyBJTkZJTklURSBMT09QOlxuICAgICAgICAgIHNsaWRlci5jbG9uZUNvdW50ID0gMDtcbiAgICAgICAgICBzbGlkZXIuY2xvbmVPZmZzZXQgPSAwO1xuICAgICAgICAgIC8vIFJFVkVSU0U6XG4gICAgICAgICAgaWYgKHJldmVyc2UpIHtcbiAgICAgICAgICAgIGFyciA9ICQubWFrZUFycmF5KHNsaWRlci5zbGlkZXMpLnJldmVyc2UoKTtcbiAgICAgICAgICAgIHNsaWRlci5zbGlkZXMgPSAkKGFycik7XG4gICAgICAgICAgICBzbGlkZXIuY29udGFpbmVyLmVtcHR5KCkuYXBwZW5kKHNsaWRlci5zbGlkZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJTkZJTklURSBMT09QICYmICFDQVJPVVNFTDpcbiAgICAgICAgaWYgKHNsaWRlci52YXJzLmFuaW1hdGlvbkxvb3AgJiYgIWNhcm91c2VsKSB7XG4gICAgICAgICAgc2xpZGVyLmNsb25lQ291bnQgPSAyO1xuICAgICAgICAgIHNsaWRlci5jbG9uZU9mZnNldCA9IDE7XG4gICAgICAgICAgLy8gY2xlYXIgb3V0IG9sZCBjbG9uZXNcbiAgICAgICAgICBpZiAodHlwZSAhPT0gXCJpbml0XCIpIHsgc2xpZGVyLmNvbnRhaW5lci5maW5kKCcuY2xvbmUnKS5yZW1vdmUoKTsgfVxuICAgICAgICAgIHNsaWRlci5jb250YWluZXIuYXBwZW5kKG1ldGhvZHMudW5pcXVlSUQoc2xpZGVyLnNsaWRlcy5maXJzdCgpLmNsb25lKCkuYWRkQ2xhc3MoJ2Nsb25lJykpLmF0dHIoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLnByZXBlbmQobWV0aG9kcy51bmlxdWVJRChzbGlkZXIuc2xpZGVzLmxhc3QoKS5jbG9uZSgpLmFkZENsYXNzKCdjbG9uZScpKS5hdHRyKCdhcmlhLWhpZGRlbicsICd0cnVlJykpO1xuICAgICAgICB9XG4gICAgICAgIHNsaWRlci5uZXdTbGlkZXMgPSAkKHNsaWRlci52YXJzLnNlbGVjdG9yLCBzbGlkZXIpO1xuXG4gICAgICAgIHNsaWRlck9mZnNldCA9IChyZXZlcnNlKSA/IHNsaWRlci5jb3VudCAtIDEgLSBzbGlkZXIuY3VycmVudFNsaWRlICsgc2xpZGVyLmNsb25lT2Zmc2V0IDogc2xpZGVyLmN1cnJlbnRTbGlkZSArIHNsaWRlci5jbG9uZU9mZnNldDtcbiAgICAgICAgLy8gVkVSVElDQUw6XG4gICAgICAgIGlmICh2ZXJ0aWNhbCAmJiAhY2Fyb3VzZWwpIHtcbiAgICAgICAgICBzbGlkZXIuY29udGFpbmVyLmhlaWdodCgoc2xpZGVyLmNvdW50ICsgc2xpZGVyLmNsb25lQ291bnQpICogMjAwICsgXCIlXCIpLmNzcyhcInBvc2l0aW9uXCIsIFwiYWJzb2x1dGVcIikud2lkdGgoXCIxMDAlXCIpO1xuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHNsaWRlci5uZXdTbGlkZXMuY3NzKHtcImRpc3BsYXlcIjogXCJibG9ja1wifSk7XG4gICAgICAgICAgICBzbGlkZXIuZG9NYXRoKCk7XG4gICAgICAgICAgICBzbGlkZXIudmlld3BvcnQuaGVpZ2h0KHNsaWRlci5oKTtcbiAgICAgICAgICAgIHNsaWRlci5zZXRQcm9wcyhzbGlkZXJPZmZzZXQgKiBzbGlkZXIuaCwgXCJpbml0XCIpO1xuICAgICAgICAgIH0sICh0eXBlID09PSBcImluaXRcIikgPyAxMDAgOiAwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzbGlkZXIuY29udGFpbmVyLndpZHRoKChzbGlkZXIuY291bnQgKyBzbGlkZXIuY2xvbmVDb3VudCkgKiAyMDAgKyBcIiVcIik7XG4gICAgICAgICAgc2xpZGVyLnNldFByb3BzKHNsaWRlck9mZnNldCAqIHNsaWRlci5jb21wdXRlZFcsIFwiaW5pdFwiKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBzbGlkZXIuZG9NYXRoKCk7XG4gICAgICAgICAgaWYoc2xpZGVyLnZhcnMucnRsKXtcbiAgICAgICAgICAgIGlmIChzbGlkZXIuaXNGaXJlZm94KSB7XG4gICAgICAgICAgICAgIHNsaWRlci5uZXdTbGlkZXMuY3NzKHtcIndpZHRoXCI6IHNsaWRlci5jb21wdXRlZFcsIFwibWFyZ2luUmlnaHRcIiA6IHNsaWRlci5jb21wdXRlZE0sIFwiZmxvYXRcIjogXCJyaWdodFwiLCBcImRpc3BsYXlcIjogXCJibG9ja1wifSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzbGlkZXIubmV3U2xpZGVzLmNzcyh7XCJ3aWR0aFwiOiBzbGlkZXIuY29tcHV0ZWRXLCBcIm1hcmdpblJpZ2h0XCIgOiBzbGlkZXIuY29tcHV0ZWRNLCBcImZsb2F0XCI6IFwibGVmdFwiLCBcImRpc3BsYXlcIjogXCJibG9ja1wifSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAgIFxuICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICBzbGlkZXIubmV3U2xpZGVzLmNzcyh7XCJ3aWR0aFwiOiBzbGlkZXIuY29tcHV0ZWRXLCBcIm1hcmdpblJpZ2h0XCIgOiBzbGlkZXIuY29tcHV0ZWRNLCBcImZsb2F0XCI6IFwibGVmdFwiLCBcImRpc3BsYXlcIjogXCJibG9ja1wifSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBTTU9PVEggSEVJR0hUOlxuICAgICAgICAgICAgaWYgKHNsaWRlci52YXJzLnNtb290aEhlaWdodCkgeyBtZXRob2RzLnNtb290aEhlaWdodCgpOyB9XG4gICAgICAgICAgfSwgKHR5cGUgPT09IFwiaW5pdFwiKSA/IDEwMCA6IDApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgeyAvLyBGQURFOlxuICAgICAgICBpZihzbGlkZXIudmFycy5ydGwpe1xuICAgICAgICAgIHNsaWRlci5zbGlkZXMuY3NzKHtcIndpZHRoXCI6IFwiMTAwJVwiLCBcImZsb2F0XCI6ICdyaWdodCcsIFwibWFyZ2luTGVmdFwiOiBcIi0xMDAlXCIsIFwicG9zaXRpb25cIjogXCJyZWxhdGl2ZVwifSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICBzbGlkZXIuc2xpZGVzLmNzcyh7XCJ3aWR0aFwiOiBcIjEwMCVcIiwgXCJmbG9hdFwiOiAnbGVmdCcsIFwibWFyZ2luUmlnaHRcIjogXCItMTAwJVwiLCBcInBvc2l0aW9uXCI6IFwicmVsYXRpdmVcIn0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlID09PSBcImluaXRcIikge1xuICAgICAgICAgIGlmICghdG91Y2gpIHtcbiAgICAgICAgICAgIC8vc2xpZGVyLnNsaWRlcy5lcShzbGlkZXIuY3VycmVudFNsaWRlKS5mYWRlSW4oc2xpZGVyLnZhcnMuYW5pbWF0aW9uU3BlZWQsIHNsaWRlci52YXJzLmVhc2luZyk7XG4gICAgICAgICAgICBpZiAoc2xpZGVyLnZhcnMuZmFkZUZpcnN0U2xpZGUgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgc2xpZGVyLnNsaWRlcy5jc3MoeyBcIm9wYWNpdHlcIjogMCwgXCJkaXNwbGF5XCI6IFwiYmxvY2tcIiwgXCJ6SW5kZXhcIjogMSB9KS5lcShzbGlkZXIuY3VycmVudFNsaWRlKS5jc3Moe1wiekluZGV4XCI6IDJ9KS5jc3Moe1wib3BhY2l0eVwiOiAxfSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBzbGlkZXIuc2xpZGVzLmNzcyh7IFwib3BhY2l0eVwiOiAwLCBcImRpc3BsYXlcIjogXCJibG9ja1wiLCBcInpJbmRleFwiOiAxIH0pLmVxKHNsaWRlci5jdXJyZW50U2xpZGUpLmNzcyh7XCJ6SW5kZXhcIjogMn0pLmFuaW1hdGUoe1wib3BhY2l0eVwiOiAxfSxzbGlkZXIudmFycy5hbmltYXRpb25TcGVlZCxzbGlkZXIudmFycy5lYXNpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzbGlkZXIuc2xpZGVzLmNzcyh7IFwib3BhY2l0eVwiOiAwLCBcImRpc3BsYXlcIjogXCJibG9ja1wiLCBcIndlYmtpdFRyYW5zaXRpb25cIjogXCJvcGFjaXR5IFwiICsgc2xpZGVyLnZhcnMuYW5pbWF0aW9uU3BlZWQgLyAxMDAwICsgXCJzIGVhc2VcIiwgXCJ6SW5kZXhcIjogMSB9KS5lcShzbGlkZXIuY3VycmVudFNsaWRlKS5jc3MoeyBcIm9wYWNpdHlcIjogMSwgXCJ6SW5kZXhcIjogMn0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBTTU9PVEggSEVJR0hUOlxuICAgICAgICBpZiAoc2xpZGVyLnZhcnMuc21vb3RoSGVpZ2h0KSB7IG1ldGhvZHMuc21vb3RoSGVpZ2h0KCk7IH1cbiAgICAgIH1cbiAgICAgIC8vICFDQVJPVVNFTDpcbiAgICAgIC8vIENBTkRJREFURTogYWN0aXZlIHNsaWRlXG4gICAgICBpZiAoIWNhcm91c2VsKSB7IHNsaWRlci5zbGlkZXMucmVtb3ZlQ2xhc3MobmFtZXNwYWNlICsgXCJhY3RpdmUtc2xpZGVcIikuZXEoc2xpZGVyLmN1cnJlbnRTbGlkZSkuYWRkQ2xhc3MobmFtZXNwYWNlICsgXCJhY3RpdmUtc2xpZGVcIik7IH1cblxuICAgICAgLy9GbGV4U2xpZGVyOiBpbml0KCkgQ2FsbGJhY2tcbiAgICAgIHNsaWRlci52YXJzLmluaXQoc2xpZGVyKTtcbiAgICB9O1xuXG4gICAgc2xpZGVyLmRvTWF0aCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNsaWRlID0gc2xpZGVyLnNsaWRlcy5maXJzdCgpLFxuICAgICAgICAgIHNsaWRlTWFyZ2luID0gc2xpZGVyLnZhcnMuaXRlbU1hcmdpbixcbiAgICAgICAgICBtaW5JdGVtcyA9IHNsaWRlci52YXJzLm1pbkl0ZW1zLFxuICAgICAgICAgIG1heEl0ZW1zID0gc2xpZGVyLnZhcnMubWF4SXRlbXM7XG5cbiAgICAgIHNsaWRlci53ID0gKHNsaWRlci52aWV3cG9ydD09PXVuZGVmaW5lZCkgPyBzbGlkZXIud2lkdGgoKSA6IHNsaWRlci52aWV3cG9ydC53aWR0aCgpO1xuICAgICAgaWYgKHNsaWRlci5pc0ZpcmVmb3gpIHsgc2xpZGVyLncgPSBzbGlkZXIud2lkdGgoKTsgfVxuICAgICAgc2xpZGVyLmggPSBzbGlkZS5oZWlnaHQoKTtcbiAgICAgIHNsaWRlci5ib3hQYWRkaW5nID0gc2xpZGUub3V0ZXJXaWR0aCgpIC0gc2xpZGUud2lkdGgoKTtcblxuICAgICAgLy8gQ0FST1VTRUw6XG4gICAgICBpZiAoY2Fyb3VzZWwpIHtcbiAgICAgICAgc2xpZGVyLml0ZW1UID0gc2xpZGVyLnZhcnMuaXRlbVdpZHRoICsgc2xpZGVNYXJnaW47XG4gICAgICAgIHNsaWRlci5pdGVtTSA9IHNsaWRlTWFyZ2luO1xuICAgICAgICBzbGlkZXIubWluVyA9IChtaW5JdGVtcykgPyBtaW5JdGVtcyAqIHNsaWRlci5pdGVtVCA6IHNsaWRlci53O1xuICAgICAgICBzbGlkZXIubWF4VyA9IChtYXhJdGVtcykgPyAobWF4SXRlbXMgKiBzbGlkZXIuaXRlbVQpIC0gc2xpZGVNYXJnaW4gOiBzbGlkZXIudztcbiAgICAgICAgc2xpZGVyLml0ZW1XID0gKHNsaWRlci5taW5XID4gc2xpZGVyLncpID8gKHNsaWRlci53IC0gKHNsaWRlTWFyZ2luICogKG1pbkl0ZW1zIC0gMSkpKS9taW5JdGVtcyA6XG4gICAgICAgICAgICAgICAgICAgICAgIChzbGlkZXIubWF4VyA8IHNsaWRlci53KSA/IChzbGlkZXIudyAtIChzbGlkZU1hcmdpbiAqIChtYXhJdGVtcyAtIDEpKSkvbWF4SXRlbXMgOlxuICAgICAgICAgICAgICAgICAgICAgICAoc2xpZGVyLnZhcnMuaXRlbVdpZHRoID4gc2xpZGVyLncpID8gc2xpZGVyLncgOiBzbGlkZXIudmFycy5pdGVtV2lkdGg7XG5cbiAgICAgICAgc2xpZGVyLnZpc2libGUgPSBNYXRoLmZsb29yKHNsaWRlci53LyhzbGlkZXIuaXRlbVcpKTtcbiAgICAgICAgc2xpZGVyLm1vdmUgPSAoc2xpZGVyLnZhcnMubW92ZSA+IDAgJiYgc2xpZGVyLnZhcnMubW92ZSA8IHNsaWRlci52aXNpYmxlICkgPyBzbGlkZXIudmFycy5tb3ZlIDogc2xpZGVyLnZpc2libGU7XG4gICAgICAgIHNsaWRlci5wYWdpbmdDb3VudCA9IE1hdGguY2VpbCgoKHNsaWRlci5jb3VudCAtIHNsaWRlci52aXNpYmxlKS9zbGlkZXIubW92ZSkgKyAxKTtcbiAgICAgICAgc2xpZGVyLmxhc3QgPSAgc2xpZGVyLnBhZ2luZ0NvdW50IC0gMTtcbiAgICAgICAgc2xpZGVyLmxpbWl0ID0gKHNsaWRlci5wYWdpbmdDb3VudCA9PT0gMSkgPyAwIDpcbiAgICAgICAgICAgICAgICAgICAgICAgKHNsaWRlci52YXJzLml0ZW1XaWR0aCA+IHNsaWRlci53KSA/IChzbGlkZXIuaXRlbVcgKiAoc2xpZGVyLmNvdW50IC0gMSkpICsgKHNsaWRlTWFyZ2luICogKHNsaWRlci5jb3VudCAtIDEpKSA6ICgoc2xpZGVyLml0ZW1XICsgc2xpZGVNYXJnaW4pICogc2xpZGVyLmNvdW50KSAtIHNsaWRlci53IC0gc2xpZGVNYXJnaW47XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzbGlkZXIuaXRlbVcgPSBzbGlkZXIudztcbiAgICAgICAgc2xpZGVyLml0ZW1NID0gc2xpZGVNYXJnaW47XG4gICAgICAgIHNsaWRlci5wYWdpbmdDb3VudCA9IHNsaWRlci5jb3VudDtcbiAgICAgICAgc2xpZGVyLmxhc3QgPSBzbGlkZXIuY291bnQgLSAxO1xuICAgICAgfVxuICAgICAgc2xpZGVyLmNvbXB1dGVkVyA9IHNsaWRlci5pdGVtVyAtIHNsaWRlci5ib3hQYWRkaW5nO1xuICAgICAgc2xpZGVyLmNvbXB1dGVkTSA9IHNsaWRlci5pdGVtTTtcbiAgICB9O1xuXG4gICAgc2xpZGVyLnVwZGF0ZSA9IGZ1bmN0aW9uKHBvcywgYWN0aW9uKSB7XG4gICAgICBzbGlkZXIuZG9NYXRoKCk7XG5cbiAgICAgIC8vIHVwZGF0ZSBjdXJyZW50U2xpZGUgYW5kIHNsaWRlci5hbmltYXRpbmdUbyBpZiBuZWNlc3NhcnlcbiAgICAgIGlmICghY2Fyb3VzZWwpIHtcbiAgICAgICAgaWYgKHBvcyA8IHNsaWRlci5jdXJyZW50U2xpZGUpIHtcbiAgICAgICAgICBzbGlkZXIuY3VycmVudFNsaWRlICs9IDE7XG4gICAgICAgIH0gZWxzZSBpZiAocG9zIDw9IHNsaWRlci5jdXJyZW50U2xpZGUgJiYgcG9zICE9PSAwKSB7XG4gICAgICAgICAgc2xpZGVyLmN1cnJlbnRTbGlkZSAtPSAxO1xuICAgICAgICB9XG4gICAgICAgIHNsaWRlci5hbmltYXRpbmdUbyA9IHNsaWRlci5jdXJyZW50U2xpZGU7XG4gICAgICB9XG5cbiAgICAgIC8vIHVwZGF0ZSBjb250cm9sTmF2XG4gICAgICBpZiAoc2xpZGVyLnZhcnMuY29udHJvbE5hdiAmJiAhc2xpZGVyLm1hbnVhbENvbnRyb2xzKSB7XG4gICAgICAgIGlmICgoYWN0aW9uID09PSBcImFkZFwiICYmICFjYXJvdXNlbCkgfHwgc2xpZGVyLnBhZ2luZ0NvdW50ID4gc2xpZGVyLmNvbnRyb2xOYXYubGVuZ3RoKSB7XG4gICAgICAgICAgbWV0aG9kcy5jb250cm9sTmF2LnVwZGF0ZShcImFkZFwiKTtcbiAgICAgICAgfSBlbHNlIGlmICgoYWN0aW9uID09PSBcInJlbW92ZVwiICYmICFjYXJvdXNlbCkgfHwgc2xpZGVyLnBhZ2luZ0NvdW50IDwgc2xpZGVyLmNvbnRyb2xOYXYubGVuZ3RoKSB7XG4gICAgICAgICAgaWYgKGNhcm91c2VsICYmIHNsaWRlci5jdXJyZW50U2xpZGUgPiBzbGlkZXIubGFzdCkge1xuICAgICAgICAgICAgc2xpZGVyLmN1cnJlbnRTbGlkZSAtPSAxO1xuICAgICAgICAgICAgc2xpZGVyLmFuaW1hdGluZ1RvIC09IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIG1ldGhvZHMuY29udHJvbE5hdi51cGRhdGUoXCJyZW1vdmVcIiwgc2xpZGVyLmxhc3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyB1cGRhdGUgZGlyZWN0aW9uTmF2XG4gICAgICBpZiAoc2xpZGVyLnZhcnMuZGlyZWN0aW9uTmF2KSB7IG1ldGhvZHMuZGlyZWN0aW9uTmF2LnVwZGF0ZSgpOyB9XG5cbiAgICB9O1xuXG4gICAgc2xpZGVyLmFkZFNsaWRlID0gZnVuY3Rpb24ob2JqLCBwb3MpIHtcbiAgICAgIHZhciAkb2JqID0gJChvYmopO1xuXG4gICAgICBzbGlkZXIuY291bnQgKz0gMTtcbiAgICAgIHNsaWRlci5sYXN0ID0gc2xpZGVyLmNvdW50IC0gMTtcblxuICAgICAgLy8gYXBwZW5kIG5ldyBzbGlkZVxuICAgICAgaWYgKHZlcnRpY2FsICYmIHJldmVyc2UpIHtcbiAgICAgICAgKHBvcyAhPT0gdW5kZWZpbmVkKSA/IHNsaWRlci5zbGlkZXMuZXEoc2xpZGVyLmNvdW50IC0gcG9zKS5hZnRlcigkb2JqKSA6IHNsaWRlci5jb250YWluZXIucHJlcGVuZCgkb2JqKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIChwb3MgIT09IHVuZGVmaW5lZCkgPyBzbGlkZXIuc2xpZGVzLmVxKHBvcykuYmVmb3JlKCRvYmopIDogc2xpZGVyLmNvbnRhaW5lci5hcHBlbmQoJG9iaik7XG4gICAgICB9XG5cbiAgICAgIC8vIHVwZGF0ZSBjdXJyZW50U2xpZGUsIGFuaW1hdGluZ1RvLCBjb250cm9sTmF2LCBhbmQgZGlyZWN0aW9uTmF2XG4gICAgICBzbGlkZXIudXBkYXRlKHBvcywgXCJhZGRcIik7XG5cbiAgICAgIC8vIHVwZGF0ZSBzbGlkZXIuc2xpZGVzXG4gICAgICBzbGlkZXIuc2xpZGVzID0gJChzbGlkZXIudmFycy5zZWxlY3RvciArICc6bm90KC5jbG9uZSknLCBzbGlkZXIpO1xuICAgICAgLy8gcmUtc2V0dXAgdGhlIHNsaWRlciB0byBhY2NvbWRhdGUgbmV3IHNsaWRlXG4gICAgICBzbGlkZXIuc2V0dXAoKTtcblxuICAgICAgLy9GbGV4U2xpZGVyOiBhZGRlZCgpIENhbGxiYWNrXG4gICAgICBzbGlkZXIudmFycy5hZGRlZChzbGlkZXIpO1xuICAgIH07XG4gICAgc2xpZGVyLnJlbW92ZVNsaWRlID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICB2YXIgcG9zID0gKGlzTmFOKG9iaikpID8gc2xpZGVyLnNsaWRlcy5pbmRleCgkKG9iaikpIDogb2JqO1xuXG4gICAgICAvLyB1cGRhdGUgY291bnRcbiAgICAgIHNsaWRlci5jb3VudCAtPSAxO1xuICAgICAgc2xpZGVyLmxhc3QgPSBzbGlkZXIuY291bnQgLSAxO1xuXG4gICAgICAvLyByZW1vdmUgc2xpZGVcbiAgICAgIGlmIChpc05hTihvYmopKSB7XG4gICAgICAgICQob2JqLCBzbGlkZXIuc2xpZGVzKS5yZW1vdmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICh2ZXJ0aWNhbCAmJiByZXZlcnNlKSA/IHNsaWRlci5zbGlkZXMuZXEoc2xpZGVyLmxhc3QpLnJlbW92ZSgpIDogc2xpZGVyLnNsaWRlcy5lcShvYmopLnJlbW92ZSgpO1xuICAgICAgfVxuXG4gICAgICAvLyB1cGRhdGUgY3VycmVudFNsaWRlLCBhbmltYXRpbmdUbywgY29udHJvbE5hdiwgYW5kIGRpcmVjdGlvbk5hdlxuICAgICAgc2xpZGVyLmRvTWF0aCgpO1xuICAgICAgc2xpZGVyLnVwZGF0ZShwb3MsIFwicmVtb3ZlXCIpO1xuXG4gICAgICAvLyB1cGRhdGUgc2xpZGVyLnNsaWRlc1xuICAgICAgc2xpZGVyLnNsaWRlcyA9ICQoc2xpZGVyLnZhcnMuc2VsZWN0b3IgKyAnOm5vdCguY2xvbmUpJywgc2xpZGVyKTtcbiAgICAgIC8vIHJlLXNldHVwIHRoZSBzbGlkZXIgdG8gYWNjb21kYXRlIG5ldyBzbGlkZVxuICAgICAgc2xpZGVyLnNldHVwKCk7XG5cbiAgICAgIC8vIEZsZXhTbGlkZXI6IHJlbW92ZWQoKSBDYWxsYmFja1xuICAgICAgc2xpZGVyLnZhcnMucmVtb3ZlZChzbGlkZXIpO1xuICAgIH07XG5cbiAgICAvL0ZsZXhTbGlkZXI6IEluaXRpYWxpemVcbiAgICBtZXRob2RzLmluaXQoKTtcbiAgfTtcblxuICAvLyBFbnN1cmUgdGhlIHNsaWRlciBpc24ndCBmb2N1c3NlZCBpZiB0aGUgd2luZG93IGxvc2VzIGZvY3VzLlxuICAkKCB3aW5kb3cgKS5ibHVyKCBmdW5jdGlvbiAoIGUgKSB7XG4gICAgZm9jdXNlZCA9IGZhbHNlO1xuICB9KS5mb2N1cyggZnVuY3Rpb24gKCBlICkge1xuICAgIGZvY3VzZWQgPSB0cnVlO1xuICB9KTtcblxuICAvL0ZsZXhTbGlkZXI6IERlZmF1bHQgU2V0dGluZ3NcbiAgJC5mbGV4c2xpZGVyLmRlZmF1bHRzID0ge1xuICAgIG5hbWVzcGFjZTogXCJmbGV4LVwiLCAgICAgICAgICAgICAvL3tORVd9IFN0cmluZzogUHJlZml4IHN0cmluZyBhdHRhY2hlZCB0byB0aGUgY2xhc3Mgb2YgZXZlcnkgZWxlbWVudCBnZW5lcmF0ZWQgYnkgdGhlIHBsdWdpblxuICAgIHNlbGVjdG9yOiBcIi5zbGlkZXMgPiBsaVwiLCAgICAgICAvL3tORVd9IFNlbGVjdG9yOiBNdXN0IG1hdGNoIGEgc2ltcGxlIHBhdHRlcm4uICd7Y29udGFpbmVyfSA+IHtzbGlkZX0nIC0tIElnbm9yZSBwYXR0ZXJuIGF0IHlvdXIgb3duIHBlcmlsXG4gICAgYW5pbWF0aW9uOiBcImZhZGVcIiwgICAgICAgICAgICAgIC8vU3RyaW5nOiBTZWxlY3QgeW91ciBhbmltYXRpb24gdHlwZSwgXCJmYWRlXCIgb3IgXCJzbGlkZVwiXG4gICAgZWFzaW5nOiBcInN3aW5nXCIsICAgICAgICAgICAgICAgIC8ve05FV30gU3RyaW5nOiBEZXRlcm1pbmVzIHRoZSBlYXNpbmcgbWV0aG9kIHVzZWQgaW4galF1ZXJ5IHRyYW5zaXRpb25zLiBqUXVlcnkgZWFzaW5nIHBsdWdpbiBpcyBzdXBwb3J0ZWQhXG4gICAgZGlyZWN0aW9uOiBcImhvcml6b250YWxcIiwgICAgICAgIC8vU3RyaW5nOiBTZWxlY3QgdGhlIHNsaWRpbmcgZGlyZWN0aW9uLCBcImhvcml6b250YWxcIiBvciBcInZlcnRpY2FsXCJcbiAgICByZXZlcnNlOiBmYWxzZSwgICAgICAgICAgICAgICAgIC8ve05FV30gQm9vbGVhbjogUmV2ZXJzZSB0aGUgYW5pbWF0aW9uIGRpcmVjdGlvblxuICAgIGFuaW1hdGlvbkxvb3A6IHRydWUsICAgICAgICAgICAgLy9Cb29sZWFuOiBTaG91bGQgdGhlIGFuaW1hdGlvbiBsb29wPyBJZiBmYWxzZSwgZGlyZWN0aW9uTmF2IHdpbGwgcmVjZWl2ZWQgXCJkaXNhYmxlXCIgY2xhc3NlcyBhdCBlaXRoZXIgZW5kXG4gICAgc21vb3RoSGVpZ2h0OiBmYWxzZSwgICAgICAgICAgICAvL3tORVd9IEJvb2xlYW46IEFsbG93IGhlaWdodCBvZiB0aGUgc2xpZGVyIHRvIGFuaW1hdGUgc21vb3RobHkgaW4gaG9yaXpvbnRhbCBtb2RlXG4gICAgc3RhcnRBdDogMCwgICAgICAgICAgICAgICAgICAgICAvL0ludGVnZXI6IFRoZSBzbGlkZSB0aGF0IHRoZSBzbGlkZXIgc2hvdWxkIHN0YXJ0IG9uLiBBcnJheSBub3RhdGlvbiAoMCA9IGZpcnN0IHNsaWRlKVxuICAgIHNsaWRlc2hvdzogdHJ1ZSwgICAgICAgICAgICAgICAgLy9Cb29sZWFuOiBBbmltYXRlIHNsaWRlciBhdXRvbWF0aWNhbGx5XG4gICAgc2xpZGVzaG93U3BlZWQ6IDcwMDAsICAgICAgICAgICAvL0ludGVnZXI6IFNldCB0aGUgc3BlZWQgb2YgdGhlIHNsaWRlc2hvdyBjeWNsaW5nLCBpbiBtaWxsaXNlY29uZHNcbiAgICBhbmltYXRpb25TcGVlZDogNjAwLCAgICAgICAgICAgIC8vSW50ZWdlcjogU2V0IHRoZSBzcGVlZCBvZiBhbmltYXRpb25zLCBpbiBtaWxsaXNlY29uZHNcbiAgICBpbml0RGVsYXk6IDAsICAgICAgICAgICAgICAgICAgIC8ve05FV30gSW50ZWdlcjogU2V0IGFuIGluaXRpYWxpemF0aW9uIGRlbGF5LCBpbiBtaWxsaXNlY29uZHNcbiAgICByYW5kb21pemU6IGZhbHNlLCAgICAgICAgICAgICAgIC8vQm9vbGVhbjogUmFuZG9taXplIHNsaWRlIG9yZGVyXG4gICAgZmFkZUZpcnN0U2xpZGU6IHRydWUsICAgICAgICAgICAvL0Jvb2xlYW46IEZhZGUgaW4gdGhlIGZpcnN0IHNsaWRlIHdoZW4gYW5pbWF0aW9uIHR5cGUgaXMgXCJmYWRlXCJcbiAgICB0aHVtYkNhcHRpb25zOiBmYWxzZSwgICAgICAgICAgIC8vQm9vbGVhbjogV2hldGhlciBvciBub3QgdG8gcHV0IGNhcHRpb25zIG9uIHRodW1ibmFpbHMgd2hlbiB1c2luZyB0aGUgXCJ0aHVtYm5haWxzXCIgY29udHJvbE5hdi5cblxuICAgIC8vIFVzYWJpbGl0eSBmZWF0dXJlc1xuICAgIHBhdXNlT25BY3Rpb246IHRydWUsICAgICAgICAgICAgLy9Cb29sZWFuOiBQYXVzZSB0aGUgc2xpZGVzaG93IHdoZW4gaW50ZXJhY3Rpbmcgd2l0aCBjb250cm9sIGVsZW1lbnRzLCBoaWdobHkgcmVjb21tZW5kZWQuXG4gICAgcGF1c2VPbkhvdmVyOiBmYWxzZSwgICAgICAgICAgICAvL0Jvb2xlYW46IFBhdXNlIHRoZSBzbGlkZXNob3cgd2hlbiBob3ZlcmluZyBvdmVyIHNsaWRlciwgdGhlbiByZXN1bWUgd2hlbiBubyBsb25nZXIgaG92ZXJpbmdcbiAgICBwYXVzZUludmlzaWJsZTogdHJ1ZSwgICAgICAgLy97TkVXfSBCb29sZWFuOiBQYXVzZSB0aGUgc2xpZGVzaG93IHdoZW4gdGFiIGlzIGludmlzaWJsZSwgcmVzdW1lIHdoZW4gdmlzaWJsZS4gUHJvdmlkZXMgYmV0dGVyIFVYLCBsb3dlciBDUFUgdXNhZ2UuXG4gICAgdXNlQ1NTOiB0cnVlLCAgICAgICAgICAgICAgICAgICAvL3tORVd9IEJvb2xlYW46IFNsaWRlciB3aWxsIHVzZSBDU1MzIHRyYW5zaXRpb25zIGlmIGF2YWlsYWJsZVxuICAgIHRvdWNoOiB0cnVlLCAgICAgICAgICAgICAgICAgICAgLy97TkVXfSBCb29sZWFuOiBBbGxvdyB0b3VjaCBzd2lwZSBuYXZpZ2F0aW9uIG9mIHRoZSBzbGlkZXIgb24gdG91Y2gtZW5hYmxlZCBkZXZpY2VzXG4gICAgdmlkZW86IGZhbHNlLCAgICAgICAgICAgICAgICAgICAvL3tORVd9IEJvb2xlYW46IElmIHVzaW5nIHZpZGVvIGluIHRoZSBzbGlkZXIsIHdpbGwgcHJldmVudCBDU1MzIDNEIFRyYW5zZm9ybXMgdG8gYXZvaWQgZ3JhcGhpY2FsIGdsaXRjaGVzXG5cbiAgICAvLyBQcmltYXJ5IENvbnRyb2xzXG4gICAgY29udHJvbE5hdjogdHJ1ZSwgICAgICAgICAgICAgICAvL0Jvb2xlYW46IENyZWF0ZSBuYXZpZ2F0aW9uIGZvciBwYWdpbmcgY29udHJvbCBvZiBlYWNoIHNsaWRlPyBOb3RlOiBMZWF2ZSB0cnVlIGZvciBtYW51YWxDb250cm9scyB1c2FnZVxuICAgIGRpcmVjdGlvbk5hdjogdHJ1ZSwgICAgICAgICAgICAgLy9Cb29sZWFuOiBDcmVhdGUgbmF2aWdhdGlvbiBmb3IgcHJldmlvdXMvbmV4dCBuYXZpZ2F0aW9uPyAodHJ1ZS9mYWxzZSlcbiAgICBwcmV2VGV4dDogXCJQcmV2aW91c1wiLCAgICAgICAgICAgLy9TdHJpbmc6IFNldCB0aGUgdGV4dCBmb3IgdGhlIFwicHJldmlvdXNcIiBkaXJlY3Rpb25OYXYgaXRlbVxuICAgIG5leHRUZXh0OiBcIk5leHRcIiwgICAgICAgICAgICAgICAvL1N0cmluZzogU2V0IHRoZSB0ZXh0IGZvciB0aGUgXCJuZXh0XCIgZGlyZWN0aW9uTmF2IGl0ZW1cblxuICAgIC8vIFNlY29uZGFyeSBOYXZpZ2F0aW9uXG4gICAga2V5Ym9hcmQ6IHRydWUsICAgICAgICAgICAgICAgICAvL0Jvb2xlYW46IEFsbG93IHNsaWRlciBuYXZpZ2F0aW5nIHZpYSBrZXlib2FyZCBsZWZ0L3JpZ2h0IGtleXNcbiAgICBtdWx0aXBsZUtleWJvYXJkOiBmYWxzZSwgICAgICAgIC8ve05FV30gQm9vbGVhbjogQWxsb3cga2V5Ym9hcmQgbmF2aWdhdGlvbiB0byBhZmZlY3QgbXVsdGlwbGUgc2xpZGVycy4gRGVmYXVsdCBiZWhhdmlvciBjdXRzIG91dCBrZXlib2FyZCBuYXZpZ2F0aW9uIHdpdGggbW9yZSB0aGFuIG9uZSBzbGlkZXIgcHJlc2VudC5cbiAgICBtb3VzZXdoZWVsOiBmYWxzZSwgICAgICAgICAgICAgIC8ve1VQREFURUR9IEJvb2xlYW46IFJlcXVpcmVzIGpxdWVyeS5tb3VzZXdoZWVsLmpzIChodHRwczovL2dpdGh1Yi5jb20vYnJhbmRvbmFhcm9uL2pxdWVyeS1tb3VzZXdoZWVsKSAtIEFsbG93cyBzbGlkZXIgbmF2aWdhdGluZyB2aWEgbW91c2V3aGVlbFxuICAgIHBhdXNlUGxheTogZmFsc2UsICAgICAgICAgICAgICAgLy9Cb29sZWFuOiBDcmVhdGUgcGF1c2UvcGxheSBkeW5hbWljIGVsZW1lbnRcbiAgICBwYXVzZVRleHQ6IFwiUGF1c2VcIiwgICAgICAgICAgICAgLy9TdHJpbmc6IFNldCB0aGUgdGV4dCBmb3IgdGhlIFwicGF1c2VcIiBwYXVzZVBsYXkgaXRlbVxuICAgIHBsYXlUZXh0OiBcIlBsYXlcIiwgICAgICAgICAgICAgICAvL1N0cmluZzogU2V0IHRoZSB0ZXh0IGZvciB0aGUgXCJwbGF5XCIgcGF1c2VQbGF5IGl0ZW1cblxuICAgIC8vIFNwZWNpYWwgcHJvcGVydGllc1xuICAgIGNvbnRyb2xzQ29udGFpbmVyOiBcIlwiLCAgICAgICAgICAvL3tVUERBVEVEfSBqUXVlcnkgT2JqZWN0L1NlbGVjdG9yOiBEZWNsYXJlIHdoaWNoIGNvbnRhaW5lciB0aGUgbmF2aWdhdGlvbiBlbGVtZW50cyBzaG91bGQgYmUgYXBwZW5kZWQgdG9vLiBEZWZhdWx0IGNvbnRhaW5lciBpcyB0aGUgRmxleFNsaWRlciBlbGVtZW50LiBFeGFtcGxlIHVzZSB3b3VsZCBiZSAkKFwiLmZsZXhzbGlkZXItY29udGFpbmVyXCIpLiBQcm9wZXJ0eSBpcyBpZ25vcmVkIGlmIGdpdmVuIGVsZW1lbnQgaXMgbm90IGZvdW5kLlxuICAgIG1hbnVhbENvbnRyb2xzOiBcIlwiLCAgICAgICAgICAgICAvL3tVUERBVEVEfSBqUXVlcnkgT2JqZWN0L1NlbGVjdG9yOiBEZWNsYXJlIGN1c3RvbSBjb250cm9sIG5hdmlnYXRpb24uIEV4YW1wbGVzIHdvdWxkIGJlICQoXCIuZmxleC1jb250cm9sLW5hdiBsaVwiKSBvciBcIiN0YWJzLW5hdiBsaSBpbWdcIiwgZXRjLiBUaGUgbnVtYmVyIG9mIGVsZW1lbnRzIGluIHlvdXIgY29udHJvbE5hdiBzaG91bGQgbWF0Y2ggdGhlIG51bWJlciBvZiBzbGlkZXMvdGFicy5cbiAgICBjdXN0b21EaXJlY3Rpb25OYXY6IFwiXCIsICAgICAgICAgLy97TkVXfSBqUXVlcnkgT2JqZWN0L1NlbGVjdG9yOiBDdXN0b20gcHJldiAvIG5leHQgYnV0dG9uLiBNdXN0IGJlIHR3byBqUXVlcnkgZWxlbWVudHMuIEluIG9yZGVyIHRvIG1ha2UgdGhlIGV2ZW50cyB3b3JrIHRoZXkgaGF2ZSB0byBoYXZlIHRoZSBjbGFzc2VzIFwicHJldlwiIGFuZCBcIm5leHRcIiAocGx1cyBuYW1lc3BhY2UpXG4gICAgc3luYzogXCJcIiwgICAgICAgICAgICAgICAgICAgICAgIC8ve05FV30gU2VsZWN0b3I6IE1pcnJvciB0aGUgYWN0aW9ucyBwZXJmb3JtZWQgb24gdGhpcyBzbGlkZXIgd2l0aCBhbm90aGVyIHNsaWRlci4gVXNlIHdpdGggY2FyZS5cbiAgICBhc05hdkZvcjogXCJcIiwgICAgICAgICAgICAgICAgICAgLy97TkVXfSBTZWxlY3RvcjogSW50ZXJuYWwgcHJvcGVydHkgZXhwb3NlZCBmb3IgdHVybmluZyB0aGUgc2xpZGVyIGludG8gYSB0aHVtYm5haWwgbmF2aWdhdGlvbiBmb3IgYW5vdGhlciBzbGlkZXJcblxuICAgIC8vIENhcm91c2VsIE9wdGlvbnNcbiAgICBpdGVtV2lkdGg6IDAsICAgICAgICAgICAgICAgICAgIC8ve05FV30gSW50ZWdlcjogQm94LW1vZGVsIHdpZHRoIG9mIGluZGl2aWR1YWwgY2Fyb3VzZWwgaXRlbXMsIGluY2x1ZGluZyBob3Jpem9udGFsIGJvcmRlcnMgYW5kIHBhZGRpbmcuXG4gICAgaXRlbU1hcmdpbjogMCwgICAgICAgICAgICAgICAgICAvL3tORVd9IEludGVnZXI6IE1hcmdpbiBiZXR3ZWVuIGNhcm91c2VsIGl0ZW1zLlxuICAgIG1pbkl0ZW1zOiAxLCAgICAgICAgICAgICAgICAgICAgLy97TkVXfSBJbnRlZ2VyOiBNaW5pbXVtIG51bWJlciBvZiBjYXJvdXNlbCBpdGVtcyB0aGF0IHNob3VsZCBiZSB2aXNpYmxlLiBJdGVtcyB3aWxsIHJlc2l6ZSBmbHVpZGx5IHdoZW4gYmVsb3cgdGhpcy5cbiAgICBtYXhJdGVtczogMCwgICAgICAgICAgICAgICAgICAgIC8ve05FV30gSW50ZWdlcjogTWF4bWltdW0gbnVtYmVyIG9mIGNhcm91c2VsIGl0ZW1zIHRoYXQgc2hvdWxkIGJlIHZpc2libGUuIEl0ZW1zIHdpbGwgcmVzaXplIGZsdWlkbHkgd2hlbiBhYm92ZSB0aGlzIGxpbWl0LlxuICAgIG1vdmU6IDAsICAgICAgICAgICAgICAgICAgICAgICAgLy97TkVXfSBJbnRlZ2VyOiBOdW1iZXIgb2YgY2Fyb3VzZWwgaXRlbXMgdGhhdCBzaG91bGQgbW92ZSBvbiBhbmltYXRpb24uIElmIDAsIHNsaWRlciB3aWxsIG1vdmUgYWxsIHZpc2libGUgaXRlbXMuXG4gICAgYWxsb3dPbmVTbGlkZTogdHJ1ZSwgICAgICAgICAgIC8ve05FV30gQm9vbGVhbjogV2hldGhlciBvciBub3QgdG8gYWxsb3cgYSBzbGlkZXIgY29tcHJpc2VkIG9mIGEgc2luZ2xlIHNsaWRlXG5cbiAgICAvLyBCcm93c2VyIFNwZWNpZmljXG4gICAgaXNGaXJlZm94OiBmYWxzZSwgICAgICAgICAgICAgLy8ge05FV30gQm9vbGVhbjogU2V0IHRvIHRydWUgd2hlbiBGaXJlZm94IGlzIHRoZSBicm93c2VyIHVzZWQuXG5cbiAgICAvLyBDYWxsYmFjayBBUElcbiAgICBzdGFydDogZnVuY3Rpb24oKXt9LCAgICAgICAgICAgIC8vQ2FsbGJhY2s6IGZ1bmN0aW9uKHNsaWRlcikgLSBGaXJlcyB3aGVuIHRoZSBzbGlkZXIgbG9hZHMgdGhlIGZpcnN0IHNsaWRlXG4gICAgYmVmb3JlOiBmdW5jdGlvbigpe30sICAgICAgICAgICAvL0NhbGxiYWNrOiBmdW5jdGlvbihzbGlkZXIpIC0gRmlyZXMgYXN5bmNocm9ub3VzbHkgd2l0aCBlYWNoIHNsaWRlciBhbmltYXRpb25cbiAgICBhZnRlcjogZnVuY3Rpb24oKXt9LCAgICAgICAgICAgIC8vQ2FsbGJhY2s6IGZ1bmN0aW9uKHNsaWRlcikgLSBGaXJlcyBhZnRlciBlYWNoIHNsaWRlciBhbmltYXRpb24gY29tcGxldGVzXG4gICAgZW5kOiBmdW5jdGlvbigpe30sICAgICAgICAgICAgICAvL0NhbGxiYWNrOiBmdW5jdGlvbihzbGlkZXIpIC0gRmlyZXMgd2hlbiB0aGUgc2xpZGVyIHJlYWNoZXMgdGhlIGxhc3Qgc2xpZGUgKGFzeW5jaHJvbm91cylcbiAgICBhZGRlZDogZnVuY3Rpb24oKXt9LCAgICAgICAgICAgIC8ve05FV30gQ2FsbGJhY2s6IGZ1bmN0aW9uKHNsaWRlcikgLSBGaXJlcyBhZnRlciBhIHNsaWRlIGlzIGFkZGVkXG4gICAgcmVtb3ZlZDogZnVuY3Rpb24oKXt9LCAgICAgICAgICAgLy97TkVXfSBDYWxsYmFjazogZnVuY3Rpb24oc2xpZGVyKSAtIEZpcmVzIGFmdGVyIGEgc2xpZGUgaXMgcmVtb3ZlZFxuICAgIGluaXQ6IGZ1bmN0aW9uKCkge30sICAgICAgICAgICAgIC8ve05FV30gQ2FsbGJhY2s6IGZ1bmN0aW9uKHNsaWRlcikgLSBGaXJlcyBhZnRlciB0aGUgc2xpZGVyIGlzIGluaXRpYWxseSBzZXR1cFxuICBydGw6IGZhbHNlICAgICAgICAgICAgIC8ve05FV30gQm9vbGVhbjogV2hldGhlciBvciBub3QgdG8gZW5hYmxlIFJUTCBtb2RlXG4gIH07XG5cbiAgLy9GbGV4U2xpZGVyOiBQbHVnaW4gRnVuY3Rpb25cbiAgJC5mbi5mbGV4c2xpZGVyID0gZnVuY3Rpb24ob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpIHsgb3B0aW9ucyA9IHt9OyB9XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgICBzZWxlY3RvciA9IChvcHRpb25zLnNlbGVjdG9yKSA/IG9wdGlvbnMuc2VsZWN0b3IgOiBcIi5zbGlkZXMgPiBsaVwiLFxuICAgICAgICAgICAgJHNsaWRlcyA9ICR0aGlzLmZpbmQoc2VsZWN0b3IpO1xuXG4gICAgICBpZiAoICggJHNsaWRlcy5sZW5ndGggPT09IDEgJiYgb3B0aW9ucy5hbGxvd09uZVNsaWRlID09PSBmYWxzZSApIHx8ICRzbGlkZXMubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICRzbGlkZXMuZmFkZUluKDQwMCk7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuc3RhcnQpIHsgb3B0aW9ucy5zdGFydCgkdGhpcyk7IH1cbiAgICAgICAgfSBlbHNlIGlmICgkdGhpcy5kYXRhKCdmbGV4c2xpZGVyJykgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIG5ldyAkLmZsZXhzbGlkZXIodGhpcywgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBIZWxwZXIgc3RyaW5ncyB0byBxdWlja2x5IHBlcmZvcm0gZnVuY3Rpb25zIG9uIHRoZSBzbGlkZXJcbiAgICAgIHZhciAkc2xpZGVyID0gJCh0aGlzKS5kYXRhKCdmbGV4c2xpZGVyJyk7XG4gICAgICBzd2l0Y2ggKG9wdGlvbnMpIHtcbiAgICAgICAgY2FzZSBcInBsYXlcIjogJHNsaWRlci5wbGF5KCk7IGJyZWFrO1xuICAgICAgICBjYXNlIFwicGF1c2VcIjogJHNsaWRlci5wYXVzZSgpOyBicmVhaztcbiAgICAgICAgY2FzZSBcInN0b3BcIjogJHNsaWRlci5zdG9wKCk7IGJyZWFrO1xuICAgICAgICBjYXNlIFwibmV4dFwiOiAkc2xpZGVyLmZsZXhBbmltYXRlKCRzbGlkZXIuZ2V0VGFyZ2V0KFwibmV4dFwiKSwgdHJ1ZSk7IGJyZWFrO1xuICAgICAgICBjYXNlIFwicHJldlwiOlxuICAgICAgICBjYXNlIFwicHJldmlvdXNcIjogJHNsaWRlci5mbGV4QW5pbWF0ZSgkc2xpZGVyLmdldFRhcmdldChcInByZXZcIiksIHRydWUpOyBicmVhaztcbiAgICAgICAgZGVmYXVsdDogaWYgKHR5cGVvZiBvcHRpb25zID09PSBcIm51bWJlclwiKSB7ICRzbGlkZXIuZmxleEFuaW1hdGUob3B0aW9ucywgdHJ1ZSk7IH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59KShqUXVlcnkpO1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsInZhciBuZXh0VGljayA9IHJlcXVpcmUoJ3Byb2Nlc3MvYnJvd3Nlci5qcycpLm5leHRUaWNrO1xudmFyIGFwcGx5ID0gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5O1xudmFyIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIGltbWVkaWF0ZUlkcyA9IHt9O1xudmFyIG5leHRJbW1lZGlhdGVJZCA9IDA7XG5cbi8vIERPTSBBUElzLCBmb3IgY29tcGxldGVuZXNzXG5cbmV4cG9ydHMuc2V0VGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRUaW1lb3V0LCB3aW5kb3csIGFyZ3VtZW50cyksIGNsZWFyVGltZW91dCk7XG59O1xuZXhwb3J0cy5zZXRJbnRlcnZhbCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFRpbWVvdXQoYXBwbHkuY2FsbChzZXRJbnRlcnZhbCwgd2luZG93LCBhcmd1bWVudHMpLCBjbGVhckludGVydmFsKTtcbn07XG5leHBvcnRzLmNsZWFyVGltZW91dCA9XG5leHBvcnRzLmNsZWFySW50ZXJ2YWwgPSBmdW5jdGlvbih0aW1lb3V0KSB7IHRpbWVvdXQuY2xvc2UoKTsgfTtcblxuZnVuY3Rpb24gVGltZW91dChpZCwgY2xlYXJGbikge1xuICB0aGlzLl9pZCA9IGlkO1xuICB0aGlzLl9jbGVhckZuID0gY2xlYXJGbjtcbn1cblRpbWVvdXQucHJvdG90eXBlLnVucmVmID0gVGltZW91dC5wcm90b3R5cGUucmVmID0gZnVuY3Rpb24oKSB7fTtcblRpbWVvdXQucHJvdG90eXBlLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuX2NsZWFyRm4uY2FsbCh3aW5kb3csIHRoaXMuX2lkKTtcbn07XG5cbi8vIERvZXMgbm90IHN0YXJ0IHRoZSB0aW1lLCBqdXN0IHNldHMgdXAgdGhlIG1lbWJlcnMgbmVlZGVkLlxuZXhwb3J0cy5lbnJvbGwgPSBmdW5jdGlvbihpdGVtLCBtc2Vjcykge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gbXNlY3M7XG59O1xuXG5leHBvcnRzLnVuZW5yb2xsID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG4gIGl0ZW0uX2lkbGVUaW1lb3V0ID0gLTE7XG59O1xuXG5leHBvcnRzLl91bnJlZkFjdGl2ZSA9IGV4cG9ydHMuYWN0aXZlID0gZnVuY3Rpb24oaXRlbSkge1xuICBjbGVhclRpbWVvdXQoaXRlbS5faWRsZVRpbWVvdXRJZCk7XG5cbiAgdmFyIG1zZWNzID0gaXRlbS5faWRsZVRpbWVvdXQ7XG4gIGlmIChtc2VjcyA+PSAwKSB7XG4gICAgaXRlbS5faWRsZVRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gb25UaW1lb3V0KCkge1xuICAgICAgaWYgKGl0ZW0uX29uVGltZW91dClcbiAgICAgICAgaXRlbS5fb25UaW1lb3V0KCk7XG4gICAgfSwgbXNlY3MpO1xuICB9XG59O1xuXG4vLyBUaGF0J3Mgbm90IGhvdyBub2RlLmpzIGltcGxlbWVudHMgaXQgYnV0IHRoZSBleHBvc2VkIGFwaSBpcyB0aGUgc2FtZS5cbmV4cG9ydHMuc2V0SW1tZWRpYXRlID0gdHlwZW9mIHNldEltbWVkaWF0ZSA9PT0gXCJmdW5jdGlvblwiID8gc2V0SW1tZWRpYXRlIDogZnVuY3Rpb24oZm4pIHtcbiAgdmFyIGlkID0gbmV4dEltbWVkaWF0ZUlkKys7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA8IDIgPyBmYWxzZSA6IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICBpbW1lZGlhdGVJZHNbaWRdID0gdHJ1ZTtcblxuICBuZXh0VGljayhmdW5jdGlvbiBvbk5leHRUaWNrKCkge1xuICAgIGlmIChpbW1lZGlhdGVJZHNbaWRdKSB7XG4gICAgICAvLyBmbi5jYWxsKCkgaXMgZmFzdGVyIHNvIHdlIG9wdGltaXplIGZvciB0aGUgY29tbW9uIHVzZS1jYXNlXG4gICAgICAvLyBAc2VlIGh0dHA6Ly9qc3BlcmYuY29tL2NhbGwtYXBwbHktc2VndVxuICAgICAgaWYgKGFyZ3MpIHtcbiAgICAgICAgZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmbi5jYWxsKG51bGwpO1xuICAgICAgfVxuICAgICAgLy8gUHJldmVudCBpZHMgZnJvbSBsZWFraW5nXG4gICAgICBleHBvcnRzLmNsZWFySW1tZWRpYXRlKGlkKTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBpZDtcbn07XG5cbmV4cG9ydHMuY2xlYXJJbW1lZGlhdGUgPSB0eXBlb2YgY2xlYXJJbW1lZGlhdGUgPT09IFwiZnVuY3Rpb25cIiA/IGNsZWFySW1tZWRpYXRlIDogZnVuY3Rpb24oaWQpIHtcbiAgZGVsZXRlIGltbWVkaWF0ZUlkc1tpZF07XG59OyJdfQ==
