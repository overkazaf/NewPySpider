$(function () {
	$('.nav').on('click', 'li', function () {
		var index = $(this).index();
		var $wells = $('.result-container').find('.well');
		$(this).addClass('active').siblings().removeClass('active');
		$wells.eq(index).show().siblings('.well').hide();
	});

	$('.result-container').find('.well').last().hide();

	$('.thumb').each(function (index) {
		var src = $(this).attr('data-src');
		var that = this;
		setTimeout(function () {
			$(that).attr({
				src : src
			});
		}, (index % 2) * 300 + 200);
	});

	$('.dropdown-toggle').dropdown()
});