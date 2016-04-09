$(function () {
	var PAGE_SIZE = 8;

	function bindEvents(){
		$('.nav').on('click', 'li', function () {
			var index = $(this).index();
			var $wells = $('.result-container').find('.well');
			$(this).addClass('active').siblings().removeClass('active');
			$wells.eq(index).show().siblings('.well').hide();
		});

		$('.pagination').on('click', '.page-item', function (){
			var pageNo = parseInt($(this).text());
			var pageSize = PAGE_SIZE;

			window.location.href = 'http://127.0.0.1:5000/showResult?pageNo=' + pageNo +'&pageSize=' + pageSize;
		});


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
	}
	bindEvents();


	$('.result-container').find('.well').last().hide();

	$('.thumb').each(function (index) {
		var src = $(this).attr('data-src');
		var that = this;
		setTimeout(function () {
			$(that).hide().attr({
				src : src
			}).fadeIn('slow');
		}, index * 10 + 50);
	});	

	function initPagination() {
		var $page = $('.pagination');
		var total = parseInt($page.attr('data-total'));
			totalPages = Math.ceil(total / PAGE_SIZE);
			totalPages = Math.max(totalPages, 1);

		var template = '';
		for (var page = 1; page <= totalPages; page++) {
			var tpl = pageBtnTpl();
			tpl = tpl.replace('{{PAGENO}}', page);
			template += tpl;
		}

		$page.html(template);

		var pageNo = getQueryString('pageNo') || 1;
		$page.find('.page-item').eq(pageNo-1).addClass('active');
	}

	initPagination();

	function getQueryString(name) {  
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
	    var r = window.location.search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
	    var context = "";  
	    if (r != null)  
	         context = r[2];  
	    reg = null;  
	    r = null;  
	    return context == null || context == "" || context == "undefined" ? "" : context;  
	}




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

	function pageBtnTpl () {
		var tpl = '<li class="page-item"><a class="page-link" href="#">{{PAGENO}}</a></li>';
		return tpl;
	}

	function mp3Tpl () {
		var tpl = '<div class="col-xs-6 col-md-4">\
	                    <div class="mp3-item">\
	                    	<span class="glyphicon glyphicon-music"></span>\
							<a href="{{HREF}}" target="blank">{{TITLE}}</a>\
						</div>\
	                </div>';


        return tpl;
	}


	function picTpl () {
		var tpl = '<div class="col-xs-6 col-md-3">\
	                    <a href="#" class="thumbnail">\
							<img src="{{SRC}}"/>\
	                    </a>\
	                </div>';


        return tpl;
	}
});