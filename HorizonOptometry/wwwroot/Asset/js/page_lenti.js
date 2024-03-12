(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
var page_lenti_loaded = 1;
global.page_lenti_loaded = page_lenti_loaded;

page_lenti = {
	load: function () {
		this.movingLenses();
		this.videoManage();
		this.videoPlay();
	},
	videoManage: function () {
		var video = $('.specContent__video');
		$('.specContent__video , .specContent__playIcon').on('click', function () {
			if ($(video)[0].paused) {
				$(video)[0].play();
				$('.specContent__playIcon').fadeOut();
			} else {
				$(video)[0].pause();
				$('.specContent__playIcon').fadeIn();
			}
		});
	},
	videoPlay: function () {
		if ($('video').length) {
			$('video').get(0).play();
		}
	},
	movingLenses: function () {
		$('.specContent__lensWrap').each(function () {
			/* Per far partire le due animazioni delle colonne insieme devo creare due tween e anticipare il secondo con ultimo parametro negativo */
			var children_el_left = $(this).find('.lens__level'),
			    controller = new smInit.Controller(),
			    tl = new tmInit(),
			    tween = tl.staggerTo(children_el_left, .35, { y: 0, opacity: 1 }, .1);
			scene = new smInit.Scene({ triggerElement: $(this)[0] }).setTween(tween).addTo(controller);
		});
	}
};

$(window).on('load', function () {
	page_lenti.load();
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc2NyaXB0cy9mdW5jdGlvbnMvcGFnZV9sZW50aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUNBQSxJQUFJLG9CQUFvQixDQUF4QjtBQUNBLE9BQU8saUJBQVAsR0FBMkIsaUJBQTNCOztBQUVBLGFBQWE7QUFDWixPQUFNLFlBQVU7QUFDZixPQUFLLFlBQUw7QUFDQSxPQUFLLFdBQUw7QUFDQSxPQUFLLFNBQUw7QUFDQSxFQUxXO0FBTVosY0FBYSxZQUFVO0FBQ3RCLE1BQUksUUFBUSxFQUFFLHFCQUFGLENBQVo7QUFDQSxJQUFFLDhDQUFGLEVBQWtELEVBQWxELENBQXFELE9BQXJELEVBQThELFlBQVU7QUFDdkUsT0FBSSxFQUFFLEtBQUYsRUFBUyxDQUFULEVBQVksTUFBaEIsRUFBd0I7QUFDdkIsTUFBRSxLQUFGLEVBQVMsQ0FBVCxFQUFZLElBQVo7QUFDQSxNQUFFLHdCQUFGLEVBQTRCLE9BQTVCO0FBQ0EsSUFIRCxNQUdPO0FBQ04sTUFBRSxLQUFGLEVBQVMsQ0FBVCxFQUFZLEtBQVo7QUFDQSxNQUFFLHdCQUFGLEVBQTRCLE1BQTVCO0FBQ0E7QUFDRCxHQVJEO0FBU0EsRUFqQlc7QUFrQlosWUFBVyxZQUFVO0FBQ3BCLE1BQUksRUFBRSxPQUFGLEVBQVcsTUFBZixFQUF1QjtBQUN0QixLQUFFLE9BQUYsRUFBVyxHQUFYLENBQWUsQ0FBZixFQUFrQixJQUFsQjtBQUNBO0FBQ0QsRUF0Qlc7QUF1QlosZUFBYyxZQUFVO0FBQ3ZCLElBQUUsd0JBQUYsRUFBNEIsSUFBNUIsQ0FBaUMsWUFBVTtBQUMxQztBQUNBLE9BQUksbUJBQW1CLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxjQUFiLENBQXZCO0FBQUEsT0FDQyxhQUFhLElBQUksT0FBTyxVQUFYLEVBRGQ7QUFBQSxPQUVDLEtBQUssSUFBSSxNQUFKLEVBRk47QUFBQSxPQUdDLFFBQVEsR0FBRyxTQUFILENBQWEsZ0JBQWIsRUFBK0IsR0FBL0IsRUFBb0MsRUFBQyxHQUFFLENBQUgsRUFBTSxTQUFRLENBQWQsRUFBcEMsRUFBc0QsRUFBdEQsQ0FIVDtBQUlDLFdBQVEsSUFBSSxPQUFPLEtBQVgsQ0FBaUIsRUFBQyxnQkFBZ0IsRUFBRSxJQUFGLEVBQVEsQ0FBUixDQUFqQixFQUFqQixFQUErQyxRQUEvQyxDQUF3RCxLQUF4RCxFQUErRCxLQUEvRCxDQUFxRSxVQUFyRSxDQUFSO0FBQ0QsR0FQRDtBQVFBO0FBaENXLENBQWI7O0FBbUNBLEVBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxNQUFiLEVBQXFCLFlBQVU7QUFDOUIsWUFBVyxJQUFYO0FBQ0EsQ0FGRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsInZhciBwYWdlX2xlbnRpX2xvYWRlZCA9IDE7XHJcbmdsb2JhbC5wYWdlX2xlbnRpX2xvYWRlZCA9IHBhZ2VfbGVudGlfbG9hZGVkO1xyXG5cclxucGFnZV9sZW50aSA9IHtcclxuXHRsb2FkOiBmdW5jdGlvbigpe1xyXG5cdFx0dGhpcy5tb3ZpbmdMZW5zZXMoKTtcclxuXHRcdHRoaXMudmlkZW9NYW5hZ2UoKTtcclxuXHRcdHRoaXMudmlkZW9QbGF5KCk7XHJcblx0fSxcclxuXHR2aWRlb01hbmFnZTogZnVuY3Rpb24oKXtcclxuXHRcdHZhciB2aWRlbyA9ICQoJy5zcGVjQ29udGVudF9fdmlkZW8nKTtcclxuXHRcdCQoJy5zcGVjQ29udGVudF9fdmlkZW8gLCAuc3BlY0NvbnRlbnRfX3BsYXlJY29uJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYgKCQodmlkZW8pWzBdLnBhdXNlZCkge1xyXG5cdFx0XHRcdCQodmlkZW8pWzBdLnBsYXkoKVxyXG5cdFx0XHRcdCQoJy5zcGVjQ29udGVudF9fcGxheUljb24nKS5mYWRlT3V0KCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JCh2aWRlbylbMF0ucGF1c2UoKTtcclxuXHRcdFx0XHQkKCcuc3BlY0NvbnRlbnRfX3BsYXlJY29uJykuZmFkZUluKCk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fSxcclxuXHR2aWRlb1BsYXk6IGZ1bmN0aW9uKCl7XHJcblx0XHRpZiAoJCgndmlkZW8nKS5sZW5ndGgpIHtcclxuXHRcdFx0JCgndmlkZW8nKS5nZXQoMCkucGxheSgpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0bW92aW5nTGVuc2VzOiBmdW5jdGlvbigpe1xyXG5cdFx0JCgnLnNwZWNDb250ZW50X19sZW5zV3JhcCcpLmVhY2goZnVuY3Rpb24oKXtcclxuXHRcdFx0LyogUGVyIGZhciBwYXJ0aXJlIGxlIGR1ZSBhbmltYXppb25pIGRlbGxlIGNvbG9ubmUgaW5zaWVtZSBkZXZvIGNyZWFyZSBkdWUgdHdlZW4gZSBhbnRpY2lwYXJlIGlsIHNlY29uZG8gY29uIHVsdGltbyBwYXJhbWV0cm8gbmVnYXRpdm8gKi9cclxuXHRcdFx0dmFyIGNoaWxkcmVuX2VsX2xlZnQgPSAkKHRoaXMpLmZpbmQoJy5sZW5zX19sZXZlbCcpLFxyXG5cdFx0XHRcdGNvbnRyb2xsZXIgPSBuZXcgc21Jbml0LkNvbnRyb2xsZXIoKSxcclxuXHRcdFx0XHR0bCA9IG5ldyB0bUluaXQoKSxcclxuXHRcdFx0XHR0d2VlbiA9IHRsLnN0YWdnZXJUbyhjaGlsZHJlbl9lbF9sZWZ0LCAuMzUsIHt5OjAsIG9wYWNpdHk6MX0sIC4xKTtcclxuXHRcdFx0XHRzY2VuZSA9IG5ldyBzbUluaXQuU2NlbmUoe3RyaWdnZXJFbGVtZW50OiAkKHRoaXMpWzBdfSkuc2V0VHdlZW4odHdlZW4pLmFkZFRvKGNvbnRyb2xsZXIpO1xyXG5cdFx0fSlcclxuXHR9LFxyXG59XHJcblxyXG4kKHdpbmRvdykub24oJ2xvYWQnLCBmdW5jdGlvbigpe1xyXG5cdHBhZ2VfbGVudGkubG9hZCgpO1xyXG59KSJdfQ==
