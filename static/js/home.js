$(function() {
    var host = 'http://127.0.0.1';
    var port = 5000;
    var prefix = host + ':' + port + '/';
    var pageSize = 8;

    var showChartInterface = 'showChart';
    var showResultUrl = 'showResult?pageNo=1&pageSize=' + pageSize;
    var crawlerUrl = 'crawler';
    var musicCountInterface = 'musicCount';
    var musicDoneInterface = 'musicDone';
    var taskCompletionInterface = 'taskCompletion';

    var showChartUrl = prefix + showChartInterface;
    var showResultUrl = prefix + showResultUrl;
    var doCrawlerUrl = prefix + crawlerUrl;
    var musicCountUrl = prefix + musicCountInterface;
    var musicDoneUrl = prefix + musicDoneInterface;
    var taskCompletionUrl = prefix + taskCompletionInterface;

    var testUrl = prefix + 'test'

    var interval;

    $('#startCrawl').on('click', function() {
    	if(interval) clearInterval(interval);

        if (!validateCrawlParam()) {
        	alert('请检查参数');
        	return;
        }

        

        var crawlerParam = getParamEntity();
        var counter = 0; // 限制间歇调用的计数器
        var COUNTER_LIMIT = 100;
        var INTERVAL = 10000; // 每十秒请求查看文件下载的状态
        var TEMP_TOTAL_MP3 = 0;
        var TEMP_TOTAL_PIC = 0;
        var TEMP_DONE_MP3 = 0;
        var TEMP_DONE_PIC = 0;
        var cType = crawlerParam.getType();

        if ((cType == 'all' || cType == 'mp3') && crawlerParam.getEnd() - crawlerParam.getStart() > 4) {
        	alert('出于系统性能考虑，音乐资源暂不支持超过5个期刊的爬取');
        	return;
        }

        $('#crawlText').text('正在抓取资源...');
        $('#percentage').text(0);
        $('.label-label-info').html('正在进行爬虫任务，请耐心等待....');
        $(this).addClass('disabled');
        var updateStatus = function (result, type) {
        	counter++;

        	var total,
	    		done,
	    		mp3t,
	    		pict,
	    		mp3d,
	    		picd,
				percent,
				WEIGHT_MP3 = 5,
				WEIGHT_PIC = 1;

			total = result['total'];
    		done = result['done'];
    		mp3t = Math.max(total['mp3'], TEMP_TOTAL_MP3);
    		pict = Math.max(total['pic'], TEMP_TOTAL_PIC);
    		mp3d = done['mp3'];
    		picd = done['pic'];


    		TEMP_TOTAL_MP3 = Math.max(TEMP_TOTAL_MP3, mp3t);
    		TEMP_TOTAL_PIC = Math.max(TEMP_TOTAL_PIC, pict);
    		TEMP_DONE_MP3 = Math.max(TEMP_DONE_MP3, mp3d);
    		TEMP_DONE_PIC = Math.max(TEMP_DONE_PIC, picd);

    		function fnDone(){
    			interval = null;
    			clearInterval(interval);
    			$('.label-label-info').text('已经完成本次爬虫任务!');
    			$('#crawlText').text('开始抓取');
    			$('#startCrawl').removeClass('disabled');
    		}
    		
    		if (type == 'pic') {
    			mp3d = 0;
    			TEMP_TOTAL_MP3 = 0;
    		}
    		if (type == 'mp3') {
    			picd = 0;
    			TEMP_TOTAL_PIC = 0;
    		}

    		console.log('mp3d', mp3d)
    		console.log('mp3t', mp3t)

    		var oldPercent = parseFloat($('#percentage').text());
    		if (WEIGHT_PIC * TEMP_TOTAL_PIC + WEIGHT_MP3 * TEMP_TOTAL_MP3 == 0){
    			percent = 100;
    			fnDone();
    		} else {
    			// 基于权重的完成比例生成算法
    			percent = Math.round((WEIGHT_PIC * TEMP_DONE_PIC + WEIGHT_MP3 * TEMP_DONE_MP3) / (WEIGHT_PIC * TEMP_TOTAL_PIC + WEIGHT_MP3 * TEMP_TOTAL_MP3) * 10000) / 100
    		}

    		var statusText = '<h3>正在进行爬虫任务，请耐心等待...</h3>';
    		
    		if (type == 'all' || type == 'pic') {
    			statusText += '<h4>正在完成 '+ picd +' / '+ pict +' 个图片资源的下载</h4>';
    		}

    		if (type == 'all' || type == 'mp3') {
    			statusText += '<h4>正在完成 '+ mp3d +' / '+ mp3t +' 个音乐资源的下载</h4>';
    		}

    		percent = Math.max(oldPercent, percent);

    		$('#percentage').text(percent);

    		$('.label-label-info').html(statusText);

    		if (percent >= 100 || counter == 100) {
    			fnDone();
    		}
        };

        interval = setInterval(function () {
        	$.ajax({
        		url : taskCompletionUrl, 
        		type : 'get',
        		data : {
		            type : crawlerParam.type,
		            interval : crawlerParam.interval,
		            rangeType : crawlerParam.rangeType,
		            start : crawlerParam.start,
		            end : crawlerParam.end,
		        },
		        dataType : 'JSON'
        	}, function(result) {
	        	updateStatus(result, crawlerParam.type);
	        }).error(errorHandler=function(jqXHR, textStatus, errorThrown){});

        }, INTERVAL);

        $.ajax({
        	url : doCrawlerUrl,
        	type : 'get',
        	data : {
	            type : crawlerParam.type,
	            interval : crawlerParam.interval,
	            rangeType : crawlerParam.rangeType,
	            start : crawlerParam.start,
	            end : crawlerParam.end,
	        },
	        dataType : 'JSON'
        }, function(result) {
        	updateStatus(result, crawlerParam.type);
        });

    });

    $('#showResult').on('click', function() {
        window.open(showResultUrl)
    });

    $('#showChart').on('click', function() {
        window.open(showChartUrl)
    });    

    function validateCrawlParam () {
    	return true;
    }

    function doNothing() {
        return undefined;
    }

    // 爬虫参数实体
    var Entity = new paramEntity();

    var collectParam = {
    	'type' : function ($container) {
    		var resType = $container.find('.active').attr('data-restype');
    		Entity.setType(resType);
    	},
    	'interval' : function ($container) {
    		var interval = $container.find('.active').attr('data-interval');
    		Entity.setInterval(interval);
    	},
    	'range' : function ($container) {
    		var range = $container.find('.active').attr('data-range');
    		var ranges = range.split(':');
    		console.log('ranges[0]', ranges[0]);
    		switch (ranges[0]) {
    			case 'forward':
    				Entity.setRangeType('forward');
    				Entity.setEnd(ranges[1]);
    				break;
    			case 'backward':
    				Entity.setRangeType('backward');
    				Entity.setStart(ranges[1]);
    				break;
    			default:
    				Entity.setRangeType('normal');
    				Entity.setStart($('#'+ranges[0]).val());
    				Entity.setEnd($('#'+ranges[1]).val());
    		}

    		console.log(Entity);

    	}
    };


    $('.dropdown-menu').on('click', 'li', function(ev) {
        var $target = $(ev.currentTarget);
        var $dropdown = $target.closest('.dropdown');
        var $targetSpan = $dropdown.find('span');
        var targetText = $target.text();
        if ($target.find('input').length) {
        	var $inputs = $target.find('input');
        	var ret = true;
        	$inputs.each(function () {
        		if ($.trim($(this).val()) == '') {
        			ret = false;
        		}

        		if (isNaN($.trim($(this).val()))) {
        			ret = false;
        		}
        	});
        	if (!ret) return;
        }
        
        $target.addClass('active').siblings().removeClass('active');
        $targetSpan.text(targetText);

        var $container = $target.closest('.navbar-nav');
        var paramType = $container.attr('data-type');

        if (paramType ==='range') {
        	if ($target.find('input').length) {
        		var range = $target.find('input').map(function () {
        			return $(this).val();
        		});
        		targetText = range[0] + ' 期 到 ' + range[1] + ' 期';
        	}
        } else if (paramType === 'interval') {
        	var interval = 30;
        	if ($target.find('input').length) {
        		try {
        			interval = eval($target.find('input').val()) + ' s';
        		} catch (exception) {
        			console.log('exception', exception);
        		}

        	} else {
        		interval = $target.text();
        	}
        	targetText = interval;
        }


        $targetSpan.text(targetText);

        collectParam[paramType]($container);
    });





    /**
     * 爬虫参数的实体类
     */

    function paramEntity (type, interval, rangeType, start, end) {
    	this.type = type || 'all';
    	this.interval = interval || 24 * 60 * 60;
    	this.rangeType = rangeType || 'normal';
    	this.start = start || 700;
    	this.end = end || 701;


    	this.getType = function () {
    		return this.type;
    	}

    	this.setType = function (type) {
    		this.type = type;
    	}

    	this.getInterval = function () {
    		return this.interval;
    	}

    	this.setInterval = function (interval) {
    		this.interval = interval;
    	}

    	this.setRangeType = function (rangeType) {
    		this.rangeType = rangeType;
    	}

    	this.getRangeType = function () {
    		return this.rangeType;
    	}

    	this.getStart = function () {
    		return this.start;
    	}

    	this.setStart = function (start) {
    		this.start = start;
    	}

    	this.getEnd = function () {
    		return this.end;
    	}

    	this.setEnd = function (end) {
    		this.end = end;
    	}

    }


    function getParamEntity () {
    	return Entity;
    }
});
