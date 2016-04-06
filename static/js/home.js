$(function() {
    var host = 'http://127.0.0.1';
    var port = 5000;
    var prefix = host + ':' + port + '/';

    var showChartInterface = 'showChart';
    var showResultUrl = 'showResult';
    var crawlerUrl = 'crawler';
    var showChartUrl = prefix + showChartInterface;
    var showResultUrl = prefix + showResultUrl;
    var doCrawlerUrl = prefix + crawlerUrl;

    $('#startCrawl').on('click', function() {
        if (!validateCrawlParam()) {
        	alert('请检查参数');
        	return;
        }


        var crawlerParam = getParamEntity();
        $.getJSON(crawlerUrl, {
            type : crawlerParam.type,
            interval : crawlerParam.interval,
            rangeType : crawlerParam.rangeType,
            start : crawlerParam.start,
            end : crawlerParam.end,
        }, function(result) {
            console.log('result', result);
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
    		console.log(Entity);
    	},
    	'interval' : function ($container) {
    		var interval = $container.find('.active').attr('data-interval');
    		Entity.setInterval(interval);
    	},
    	'range' : function ($container) {
    		var range = $container.find('.active').attr('data-range');
    		var ranges = range.split(':');
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
    			alert($('#'+ranges[0]).val() + '::' + $('#'+ranges[1]).val());
    				Entity.setRangeType('normal');
    				Entity.setStart($('#'+ranges[0]).val());
    				Entity.setEnd($('#'+ranges[1]).val());
    		}

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
