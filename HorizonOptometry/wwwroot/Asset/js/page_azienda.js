(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){
var page_azienda_loaded = 1;
global.page_azienda_loaded = page_azienda_loaded;

page_azienda = {
	load: function () {
		this.mapInteraction();
		this.numbersComposition();
		this.videoPlay();
		this.videoManage();
	},
	mapInteraction: function () {
		var maps_points = $('#mapWrap svg g path'),
		    controller = new smInit.Controller(),
		    tl = new tmInit(),
		    tween = tl.staggerTo(maps_points, .15, { opacity: 1 }, .05);
		scene = new smInit.Scene({ triggerElement: '#mapWrap' }).setTween(tween).addTo(controller);

		if ($('.no-touch').length) {
			$('.aziendaMap__mapWrapper .hover-container').on('mouseover', function () {
				var region_name = $(this).data('region');
				$('#dots-map .dots[data-region="' + region_name + '"]').addClass('selected');
				$('[data-region-block="' + region_name + '"]').fadeIn(200);
			}).on('mouseleave', function () {
				var region_name = $(this).data('region');
				$('#dots-map .dots[data-region="' + region_name + '"]').removeClass('selected');
				$('[data-region-block="' + region_name + '"]').fadeOut(200);
			});
		} else if ($('.touch').length) {
			$('.aziendaMap__mapWrapper .hover-container').on('click', function () {
				var region_name = $(this).data('region');
				$('#dots-map .dots[data-region="' + region_name + '"]').toggleClass('selected');
				$('[data-region-block="' + region_name + '"]').fadeToggle();
			});
		}
		$('.close_map').on('click', function () {
			$('.selected').removeClass('selected');
			$(this).parent().fadeToggle();
		});
	},
	numbersComposition: function () {
		var num_blocks = $('.nums__block'),
		    controller = new smInit.Controller(),
		    tl = new tmInit(),
		    tween = tl.staggerTo(num_blocks, .35, { y: 0, opacity: 1 }, .1);
		scene = new smInit.Scene({ triggerElement: '#nums__trigger' }).setTween(tween).addTo(controller);
	},
	videoPlay: function () {
		if ($('video').length) {
			$('video').get(0).play();
		}
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
	}
};

$(window).on('load', function () {
	page_azienda.load();
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc2NyaXB0cy9mdW5jdGlvbnMvcGFnZV9hemllbmRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBLElBQUksc0JBQXNCLENBQTFCO0FBQ0EsT0FBTyxtQkFBUCxHQUE2QixtQkFBN0I7O0FBRUEsZUFBZTtBQUNkLE9BQU0sWUFBVTtBQUNmLE9BQUssY0FBTDtBQUNBLE9BQUssa0JBQUw7QUFDQSxPQUFLLFNBQUw7QUFDQSxPQUFLLFdBQUw7QUFDQSxFQU5hO0FBT2QsaUJBQWdCLFlBQVU7QUFDekIsTUFBSSxjQUFjLEVBQUUscUJBQUYsQ0FBbEI7QUFBQSxNQUNDLGFBQWEsSUFBSSxPQUFPLFVBQVgsRUFEZDtBQUFBLE1BRUMsS0FBSyxJQUFJLE1BQUosRUFGTjtBQUFBLE1BR0MsUUFBUSxHQUFHLFNBQUgsQ0FBYSxXQUFiLEVBQTBCLEdBQTFCLEVBQStCLEVBQUMsU0FBUSxDQUFULEVBQS9CLEVBQTRDLEdBQTVDLENBSFQ7QUFJQyxVQUFRLElBQUksT0FBTyxLQUFYLENBQWlCLEVBQUMsZ0JBQWdCLFVBQWpCLEVBQWpCLEVBQStDLFFBQS9DLENBQXdELEtBQXhELEVBQStELEtBQS9ELENBQXFFLFVBQXJFLENBQVI7O0FBRUQsTUFBSSxFQUFFLFdBQUYsRUFBZSxNQUFuQixFQUEyQjtBQUMxQixLQUFFLDBDQUFGLEVBQ0MsRUFERCxDQUNJLFdBREosRUFDaUIsWUFBVTtBQUMxQixRQUFJLGNBQWMsRUFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLFFBQWIsQ0FBbEI7QUFDQSxNQUFFLGtDQUFnQyxXQUFoQyxHQUE0QyxJQUE5QyxFQUFvRCxRQUFwRCxDQUE2RCxVQUE3RDtBQUNBLE1BQUUseUJBQXVCLFdBQXZCLEdBQW1DLElBQXJDLEVBQTJDLE1BQTNDLENBQWtELEdBQWxEO0FBQ0EsSUFMRCxFQUtHLEVBTEgsQ0FLTSxZQUxOLEVBS29CLFlBQVU7QUFDN0IsUUFBSSxjQUFjLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxRQUFiLENBQWxCO0FBQ0EsTUFBRSxrQ0FBZ0MsV0FBaEMsR0FBNEMsSUFBOUMsRUFBb0QsV0FBcEQsQ0FBZ0UsVUFBaEU7QUFDQSxNQUFFLHlCQUF1QixXQUF2QixHQUFtQyxJQUFyQyxFQUEyQyxPQUEzQyxDQUFtRCxHQUFuRDtBQUNBLElBVEQ7QUFVQSxHQVhELE1BV08sSUFBSSxFQUFFLFFBQUYsRUFBWSxNQUFoQixFQUF3QjtBQUM5QixLQUFFLDBDQUFGLEVBQThDLEVBQTlDLENBQWlELE9BQWpELEVBQTBELFlBQVU7QUFDbkUsUUFBSSxjQUFjLEVBQUUsSUFBRixFQUFRLElBQVIsQ0FBYSxRQUFiLENBQWxCO0FBQ0EsTUFBRSxrQ0FBZ0MsV0FBaEMsR0FBNEMsSUFBOUMsRUFBb0QsV0FBcEQsQ0FBZ0UsVUFBaEU7QUFDQSxNQUFFLHlCQUF1QixXQUF2QixHQUFtQyxJQUFyQyxFQUEyQyxVQUEzQztBQUNBLElBSkQ7QUFLQTtBQUNELElBQUUsWUFBRixFQUFnQixFQUFoQixDQUFtQixPQUFuQixFQUE0QixZQUFVO0FBQ3JDLEtBQUUsV0FBRixFQUFlLFdBQWYsQ0FBMkIsVUFBM0I7QUFDQSxLQUFFLElBQUYsRUFBUSxNQUFSLEdBQWlCLFVBQWpCO0FBQ0EsR0FIRDtBQUlBLEVBcENhO0FBcUNkLHFCQUFvQixZQUFVO0FBQzdCLE1BQUksYUFBYSxFQUFFLGNBQUYsQ0FBakI7QUFBQSxNQUNDLGFBQWEsSUFBSSxPQUFPLFVBQVgsRUFEZDtBQUFBLE1BRUMsS0FBSyxJQUFJLE1BQUosRUFGTjtBQUFBLE1BR0MsUUFBUSxHQUFHLFNBQUgsQ0FBYSxVQUFiLEVBQXlCLEdBQXpCLEVBQThCLEVBQUMsR0FBRSxDQUFILEVBQU0sU0FBUSxDQUFkLEVBQTlCLEVBQWdELEVBQWhELENBSFQ7QUFJQyxVQUFRLElBQUksT0FBTyxLQUFYLENBQWlCLEVBQUMsZ0JBQWdCLGdCQUFqQixFQUFqQixFQUFxRCxRQUFyRCxDQUE4RCxLQUE5RCxFQUFxRSxLQUFyRSxDQUEyRSxVQUEzRSxDQUFSO0FBQ0QsRUEzQ2E7QUE0Q2QsWUFBVyxZQUFVO0FBQ3BCLE1BQUksRUFBRSxPQUFGLEVBQVcsTUFBZixFQUF1QjtBQUN0QixLQUFFLE9BQUYsRUFBVyxHQUFYLENBQWUsQ0FBZixFQUFrQixJQUFsQjtBQUNBO0FBQ0QsRUFoRGE7QUFpRGQsY0FBYSxZQUFZO0FBQ3hCLE1BQUksUUFBUSxFQUFFLHFCQUFGLENBQVo7QUFDQSxJQUFFLDhDQUFGLEVBQWtELEVBQWxELENBQXFELE9BQXJELEVBQThELFlBQVk7QUFDekUsT0FBSSxFQUFFLEtBQUYsRUFBUyxDQUFULEVBQVksTUFBaEIsRUFBd0I7QUFDdkIsTUFBRSxLQUFGLEVBQVMsQ0FBVCxFQUFZLElBQVo7QUFDQSxNQUFFLHdCQUFGLEVBQTRCLE9BQTVCO0FBQ0EsSUFIRCxNQUdPO0FBQ04sTUFBRSxLQUFGLEVBQVMsQ0FBVCxFQUFZLEtBQVo7QUFDQSxNQUFFLHdCQUFGLEVBQTRCLE1BQTVCO0FBQ0E7QUFDRCxHQVJEO0FBU0E7QUE1RGEsQ0FBZjs7QUErREEsRUFBRSxNQUFGLEVBQVUsRUFBVixDQUFhLE1BQWIsRUFBcUIsWUFBVTtBQUM5QixjQUFhLElBQWI7QUFDQSxDQUZEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwidmFyIHBhZ2VfYXppZW5kYV9sb2FkZWQgPSAxO1xyXG5nbG9iYWwucGFnZV9hemllbmRhX2xvYWRlZCA9IHBhZ2VfYXppZW5kYV9sb2FkZWQ7XHJcblxyXG5wYWdlX2F6aWVuZGEgPSB7XHJcblx0bG9hZDogZnVuY3Rpb24oKXtcclxuXHRcdHRoaXMubWFwSW50ZXJhY3Rpb24oKTtcclxuXHRcdHRoaXMubnVtYmVyc0NvbXBvc2l0aW9uKCk7XHJcblx0XHR0aGlzLnZpZGVvUGxheSgpO1xyXG5cdFx0dGhpcy52aWRlb01hbmFnZSgpO1xyXG5cdH0sXHJcblx0bWFwSW50ZXJhY3Rpb246IGZ1bmN0aW9uKCl7XHJcblx0XHR2YXIgbWFwc19wb2ludHMgPSAkKCcjbWFwV3JhcCBzdmcgZyBwYXRoJyksXHJcblx0XHRcdGNvbnRyb2xsZXIgPSBuZXcgc21Jbml0LkNvbnRyb2xsZXIoKSxcclxuXHRcdFx0dGwgPSBuZXcgdG1Jbml0KCksXHJcblx0XHRcdHR3ZWVuID0gdGwuc3RhZ2dlclRvKG1hcHNfcG9pbnRzLCAuMTUsIHtvcGFjaXR5OjF9LCAuMDUpO1xyXG5cdFx0XHRzY2VuZSA9IG5ldyBzbUluaXQuU2NlbmUoe3RyaWdnZXJFbGVtZW50OiAnI21hcFdyYXAnfSkuc2V0VHdlZW4odHdlZW4pLmFkZFRvKGNvbnRyb2xsZXIpO1xyXG5cclxuXHRcdGlmICgkKCcubm8tdG91Y2gnKS5sZW5ndGgpIHtcclxuXHRcdFx0JCgnLmF6aWVuZGFNYXBfX21hcFdyYXBwZXIgLmhvdmVyLWNvbnRhaW5lcicpXHJcblx0XHRcdC5vbignbW91c2VvdmVyJywgZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgcmVnaW9uX25hbWUgPSAkKHRoaXMpLmRhdGEoJ3JlZ2lvbicpO1xyXG5cdFx0XHRcdCQoJyNkb3RzLW1hcCAuZG90c1tkYXRhLXJlZ2lvbj1cIicrcmVnaW9uX25hbWUrJ1wiXScpLmFkZENsYXNzKCdzZWxlY3RlZCcpO1xyXG5cdFx0XHRcdCQoJ1tkYXRhLXJlZ2lvbi1ibG9jaz1cIicrcmVnaW9uX25hbWUrJ1wiXScpLmZhZGVJbigyMDApO1xyXG5cdFx0XHR9KS5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIHJlZ2lvbl9uYW1lID0gJCh0aGlzKS5kYXRhKCdyZWdpb24nKTtcclxuXHRcdFx0XHQkKCcjZG90cy1tYXAgLmRvdHNbZGF0YS1yZWdpb249XCInK3JlZ2lvbl9uYW1lKydcIl0nKS5yZW1vdmVDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHRcdFx0XHQkKCdbZGF0YS1yZWdpb24tYmxvY2s9XCInK3JlZ2lvbl9uYW1lKydcIl0nKS5mYWRlT3V0KDIwMCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIGlmICgkKCcudG91Y2gnKS5sZW5ndGgpIHtcclxuXHRcdFx0JCgnLmF6aWVuZGFNYXBfX21hcFdyYXBwZXIgLmhvdmVyLWNvbnRhaW5lcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIHJlZ2lvbl9uYW1lID0gJCh0aGlzKS5kYXRhKCdyZWdpb24nKTtcclxuXHRcdFx0XHQkKCcjZG90cy1tYXAgLmRvdHNbZGF0YS1yZWdpb249XCInK3JlZ2lvbl9uYW1lKydcIl0nKS50b2dnbGVDbGFzcygnc2VsZWN0ZWQnKTtcclxuXHRcdFx0XHQkKCdbZGF0YS1yZWdpb24tYmxvY2s9XCInK3JlZ2lvbl9uYW1lKydcIl0nKS5mYWRlVG9nZ2xlKCk7XHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblx0XHQkKCcuY2xvc2VfbWFwJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuXHRcdFx0JCgnLnNlbGVjdGVkJykucmVtb3ZlQ2xhc3MoJ3NlbGVjdGVkJyk7XHJcblx0XHRcdCQodGhpcykucGFyZW50KCkuZmFkZVRvZ2dsZSgpO1xyXG5cdFx0fSlcclxuXHR9LFxyXG5cdG51bWJlcnNDb21wb3NpdGlvbjogZnVuY3Rpb24oKXtcclxuXHRcdHZhciBudW1fYmxvY2tzID0gJCgnLm51bXNfX2Jsb2NrJyksXHJcblx0XHRcdGNvbnRyb2xsZXIgPSBuZXcgc21Jbml0LkNvbnRyb2xsZXIoKSxcclxuXHRcdFx0dGwgPSBuZXcgdG1Jbml0KCksXHJcblx0XHRcdHR3ZWVuID0gdGwuc3RhZ2dlclRvKG51bV9ibG9ja3MsIC4zNSwge3k6MCwgb3BhY2l0eToxfSwgLjEpO1xyXG5cdFx0XHRzY2VuZSA9IG5ldyBzbUluaXQuU2NlbmUoe3RyaWdnZXJFbGVtZW50OiAnI251bXNfX3RyaWdnZXInfSkuc2V0VHdlZW4odHdlZW4pLmFkZFRvKGNvbnRyb2xsZXIpO1xyXG5cdH0sXHJcblx0dmlkZW9QbGF5OiBmdW5jdGlvbigpe1xyXG5cdFx0aWYgKCQoJ3ZpZGVvJykubGVuZ3RoKSB7XHJcblx0XHRcdCQoJ3ZpZGVvJykuZ2V0KDApLnBsYXkoKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHZpZGVvTWFuYWdlOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgdmlkZW8gPSAkKCcuc3BlY0NvbnRlbnRfX3ZpZGVvJyk7XHJcblx0XHQkKCcuc3BlY0NvbnRlbnRfX3ZpZGVvICwgLnNwZWNDb250ZW50X19wbGF5SWNvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKCQodmlkZW8pWzBdLnBhdXNlZCkge1xyXG5cdFx0XHRcdCQodmlkZW8pWzBdLnBsYXkoKTtcclxuXHRcdFx0XHQkKCcuc3BlY0NvbnRlbnRfX3BsYXlJY29uJykuZmFkZU91dCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCQodmlkZW8pWzBdLnBhdXNlKCk7XHJcblx0XHRcdFx0JCgnLnNwZWNDb250ZW50X19wbGF5SWNvbicpLmZhZGVJbigpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxuXHJcbiQod2luZG93KS5vbignbG9hZCcsIGZ1bmN0aW9uKCl7XHJcblx0cGFnZV9hemllbmRhLmxvYWQoKTtcclxufSkiXX0=
