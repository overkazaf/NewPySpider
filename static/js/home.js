$(function() {
    var 
    	host = 'http://127.0.0.1',
        port = 5000,
        prefix = host + ':' + port + '/',
        pageSize = 8,

        showChartInterface = 'showChart',
        showResultUrl = 'showResult?pageNo=1&pageSize=' + pageSize,
        crawlerUrl = 'crawler',
        musicCountInterface = 'musicCount',
        musicDoneInterface = 'musicDone',
        taskCompletionInterface = 'taskCompletion',
        cancelScheduleInterface = 'cancelSchedule',

        showChartUrl = prefix + showChartInterface,
        showResultUrl = prefix + showResultUrl,
        doCrawlerUrl = prefix + crawlerUrl,
        musicCountUrl = prefix + musicCountInterface,
        musicDoneUrl = prefix + musicDoneInterface,
        taskCompletionUrl = prefix + taskCompletionInterface,
        cancelScheduleUrl = prefix + cancelScheduleInterface,

        testUrl = prefix + 'test',
        interval,
        DONE = false;

    function fnCrawlerTaskDone() {
        interval = null;
        clearInterval(interval);
        $('.label-label-info').text('已经完成本次爬虫任务!');
        $('#crawlText').text('开始抓取');
        $('#startCrawl').removeClass('disabled');
        DONE = true;
        $('#stopCrawl').hide();
    }

    function fnCrawlerTaskStart() {
        $('#stopCrawl').show();
        $('#crawlText').text('正在抓取资源...');
        $('#percentage').text(0);
        $('.label-label-info').html('正在进行爬虫任务，请耐心等待....');
        DONE = false;
        $('#startCrawl').addClass('disabled');
    }


    /**
     * [bindEvents 绑定页面中的事件]
     * @return {[type]} [description]
     */
    function bindEvents() {
        // 为停止按钮绑定停止本次爬虫任务的事件
        $('#stopCrawl').on('click', function() {
            $.getJSON(cancelScheduleUrl, {}, function(result) {
                if (result.success) {
                    fnCrawlerTaskDone();
                }
            });
        });


        // 为开始按钮绑定开始本次爬虫任务的事件
        $('#startCrawl').on('click', function() {
            // 清理状态轮询的计时器
            if (interval) clearInterval(interval);

            // 爬虫参数检测，暂不细做
            if (!validateCrawlParam()) {
                alert('请检查参数');
                return;
            }


            var
            	crawlerParam = getParamEntity(),
                counter = 0, // 限制间歇调用的计数器
                COUNTER_LIMIT = 100,
                INTERVAL = 10000, // 每十秒请求查看文件下载的状态
                TEMP_TOTAL_MP3 = 0, // 需要完成的音乐总数
                TEMP_TOTAL_PIC = 0, // 需要完成的图片总数
                TEMP_DONE_MP3 = 0, // 已经完成的音乐总数
                TEMP_DONE_PIC = 0; // 已经完成的图片总数

            // 初始化爬虫的状态
            fnCrawlerTaskStart();

            var updateStatus = function(result, type) {
                counter++;

                var total,
                    done,
                    mp3t,
                    pict,
                    mp3d,
                    picd,
                    percent,
                    WEIGHT_MP3 = 10, // 定义权重，一个音乐文件大约为一个图片文件的10倍
                    WEIGHT_PIC = 1; // 将图片大小的权重定为1

                total = result['total'];
                done = result['done'];
                mp3t = Math.max(total['mp3'], TEMP_TOTAL_MP3);
                pict = Math.max(total['pic'], TEMP_TOTAL_PIC);
                mp3d = done['mp3'];
                picd = done['pic'];

                // 处理因网络异常可能导致的获取文件完成情况数变化的bug
                TEMP_TOTAL_MP3 = Math.max(TEMP_TOTAL_MP3, mp3t);
                TEMP_TOTAL_PIC = Math.max(TEMP_TOTAL_PIC, pict);
                TEMP_DONE_MP3 = Math.max(TEMP_DONE_MP3, mp3d);
                TEMP_DONE_PIC = Math.max(TEMP_DONE_PIC, picd);

                if (type == 'pic') {
                    mp3d = 0;
                    TEMP_TOTAL_MP3 = 0;
                }
                if (type == 'mp3') {
                    picd = 0;
                    TEMP_TOTAL_PIC = 0;
                }

                var oldPercent = parseFloat($('#percentage').text());
                if (WEIGHT_PIC * TEMP_TOTAL_PIC + WEIGHT_MP3 * TEMP_TOTAL_MP3 == 0) {
                    // 无下载的资源，立即完成任务
                    percent = 100.00;
                    fnCrawlerTaskDone();
                } else {
                    // 基于权重的完成比例生成算法
                    percent = new Number((WEIGHT_PIC * TEMP_DONE_PIC + WEIGHT_MP3 * TEMP_DONE_MP3) / (WEIGHT_PIC * TEMP_TOTAL_PIC + WEIGHT_MP3 * TEMP_TOTAL_MP3) * 100).toFixed(2);
                }

                percent = Math.max(oldPercent, percent);
                percent = Math.min(100, percent);


                // 更新提示的状态
                var statusText = '<h3>正在进行爬虫任务，请耐心等待...</h3>';
                if (type == 'all' || type == 'pic') {
                    statusText += '<h4>正在完成 ' + picd + ' / ' + pict + ' 个图片资源的下载</h4>';

                    if (type == 'pic') percent = new Number(picd / pict * 100).toFixed(2);
                }

                if (type == 'all' || type == 'mp3') {
                    statusText += '<h4>正在完成 ' + mp3d + ' / ' + mp3t + ' 个音乐资源的下载</h4>';

                    if (type == 'mp3') percent = new Number(mp3d / mp3t * 100).toFixed(2);
                }

                $('#percentage').text(percent);

                $('.label-label-info').html(statusText);

                if (percent >= 100 || counter == 100) {
                    fnCrawlerTaskDone();
                }
            };

            // 间歇轮询任务完成情况
            interval = setInterval(function() {
                if (!DONE) {
                    $.getJSON(taskCompletionUrl, {
                        type: crawlerParam.type,
                        interval: crawlerParam.interval,
                        rangeType: crawlerParam.rangeType,
                        start: crawlerParam.start,
                        end: crawlerParam.end
                    }, function(result) {
                        // 更新爬虫任务的状态
                        updateStatus(result, crawlerParam.type);
                    }).error(errorHandler = function(jqXHR, textStatus, errorThrown) {});
                } else {
                    fnCrawlerTaskDone();
                }

            }, INTERVAL);

            $.getJSON(doCrawlerUrl, {
                type: crawlerParam.type,
                interval: crawlerParam.interval,
                rangeType: crawlerParam.rangeType,
                start: crawlerParam.start,
                end: crawlerParam.end,
            }, function(result) {
                // 更新爬虫任务的状态
                updateStatus(result, crawlerParam.type);
            });

        });

        $('#showResult').on('click', function() {
            window.open(showResultUrl)
        });

        $('#showChart').on('click', function() {
            window.open(showChartUrl)
        });

        // 下拉事件的绑定
        $('.dropdown-menu').on('click', 'li', function(ev) {
            var $target = $(ev.currentTarget),
                $dropdown = $target.closest('.dropdown'),
                $targetSpan = $dropdown.find('span'),
                targetText = $target.text(),
                $container = $target.closest('.navbar-nav'),
                paramType = $container.attr('data-type'),
                $inputs = $target.find('input');

            if ($inputs.length) {
                var ret = true;
                $inputs.each(function() {
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

            if (paramType === 'range') {
                if ($inputs.length) {
                    var range = $inputs.map(function() {
                        return $(this).val();
                    });
                    targetText = range[0] + ' 期 到 ' + range[1] + ' 期';
                }
            } else if (paramType === 'interval') {
                var interval = 30;
                if ($inputs.length) {
                    try {
                        interval = eval($inputs.val()) + ' s';
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
    }

    // 初始化事件绑定
    bindEvents();

    /**
     * [validateCrawlParam 校验爬虫参数的逻辑放在这里]
     * @return {[type]} [description]
     */
    function validateCrawlParam() {
        var
            crawlerParam = getParamEntity(),
            cType = crawlerParam.getType();

        if ((cType == 'all' || cType == 'mp3') && crawlerParam.getEnd() - crawlerParam.getStart() > 4) {
            alert('出于系统性能考虑，音乐资源暂不支持超过5个期刊的爬取');
            return false;
        }
        return true;
    }

    // 爬虫参数实体
    var Entity = new paramEntity();

    // 爬虫参数的收集策略
    var collectParam = {
        'type': function($container) {
            var resType = $container.find('.active').attr('data-restype');
            Entity.setType(resType);
        },
        'interval': function($container) {
            var interval = $container.find('.active').attr('data-interval');
            Entity.setInterval(interval);
        },
        'range': function($container) {
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
                    Entity.setRangeType('normal');
                    Entity.setStart($('#' + ranges[0]).val());
                    Entity.setEnd($('#' + ranges[1]).val());
            }
        }
    };

    /**
     * [paramEntity 爬虫参数的实体类]
     * @param  {[type]} type      [资源类型]
     * @param  {[type]} interval  [下一次爬虫时间间隔]
     * @param  {[type]} rangeType [期刊范围的类型
     *                              1. normal : 基本类型， [start, end]的形式
     *                              2. backward : 向后类型，[offset, MIN(volumns)]的形式，从当前已下载的最小期刊号向前枚举offset+1个
     *                              3. forward : 向前类型， [MAX(volumns), offset]的形式，从当前已下载的最大期刊号向后枚举offset+1个
     * 							  ]
     * @param  {[type]} start     [开始的期刊号]
     * @param  {[type]} end       [结束的期刊号]
     * @return {[type]}           [description]
     */
    function paramEntity(type, interval, rangeType, start, end) {
        this.type = type || 'all';
        this.interval = interval || 24 * 60 * 60;
        this.rangeType = rangeType || 'normal';
        this.start = start || 700;
        this.end = end || 701;


        this.getType = function() {
            return this.type;
        }

        this.setType = function(type) {
            this.type = type;
        }

        this.getInterval = function() {
            return this.interval;
        }

        this.setInterval = function(interval) {
            this.interval = interval;
        }

        this.setRangeType = function(rangeType) {
            this.rangeType = rangeType;
        }

        this.getRangeType = function() {
            return this.rangeType;
        }

        this.getStart = function() {
            return this.start;
        }

        this.setStart = function(start) {
            this.start = start;
        }

        this.getEnd = function() {
            return this.end;
        }

        this.setEnd = function(end) {
            this.end = end;
        }
    }

    function getParamEntity() {
        return Entity;
    }
});
