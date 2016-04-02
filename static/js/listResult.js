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

	//$('.dropdown-toggle').dropdown()


	$('.thumbnail').on('click', function (ev) {
		var $ctx = $(this).closest('.well');
		var type = $ctx.attr('data-type');
		var volNo = $(this).find('h4').text();
		var data = [];

		switch(type){
			case 'pic':
				data = $(this).find('img').map(function () {
					return $(this).attr('data-src');
				});
				break;
			case 'mp3':
				data = $(this).find('li').map(function () {
					return $(this).text();
				});
				break;
		}
		console.log('data', data);
		showResultDetail(volNo, type, $(this), data);
	});


	var buildList = {
		'pic' : function (data) {
			var list = [];
			for (var i = 0, src; src=data[i++];) {
				var tpl = picTpl();
				tpl = tpl.replace('{{SRC}}', src);
				list.push(tpl);
			}
			return list;
		},
		'mp3' : function (data) {
			var list = [];
			for (var i = 0, href; href=data[i++];) {
				var tpl = mp3Tpl();
				var title = getMp3Title(href);
				tpl = tpl.replace('{{HREF}}', href);
				tpl = tpl.replace('{{TITLE}}', title);
				list.push(tpl);
			}
			return list;
		}
	}

	function getMp3Title (href) {
		return href.substring(href.lastIndexOf('/')+1);
	}

	function showResultDetail (volNo, type, $target, data) {
		var $modal = $('#viewModal');
		var $modalTitle = $modal.find('#modalTitle');
		var $modalBody = $modal.find('#modalBody');
		
		$modal.modal('show');
		$modalTitle.text(volNo);
		
		list = buildList[type](data);
		$modalBody.html(list.join(''));
	}


	function mp3Tpl () {
		var tpl = '<div class="col-xs-6 col-md-3">\
	                    <div class="mp3-item">\
	                    	<span class="glyphicon glyphicon-music"></span>\
							<a href="{{HREF}}" target="blank">{{TITLE}}</a>\
						</div>\
	                </div>';


        return tpl;
	}


	function picTpl () {
		var tpl = '<div class="col-xs-6 col-md-4">\
	                    <a href="#" class="thumbnail">\
							<img src="{{SRC}}"/>\
	                    </a>\
	                </div>';


        return tpl;
	}
});