$(function() {
    var host = 'http://127.0.0.1';
    var port = 5000;
    var prefix = host + ':' + port + '/';

    var getThanksInterface = 'thanks';
    var getThanksUrl = prefix + getThanksInterface;


    var CHART_CONTAINER_ID = 'main';
    var GIF_PATH = prefix + 'static/css/loading.jpg';
    var cache = {
    	chartData : {
    		//volNo : thanks
    	}
    };

    $('.dropdown-menu').on('click', 'li', function (ev) {
    	var $target = $(ev.currentTarget);
    	var $container = $target.closest('.btn-group');
    	$target.addClass('active').siblings().removeClass('active');
    	var chartType = $target.text();

    	$container.find('.chart-type').text(chartType);

    });

    $('.dropdown-range').on('click', 'li', function(ev) {
        var $target = $(ev.currentTarget);
        var $dropdown = $target.closest('.dropdown');
        var $targetSpan = $dropdown.find('span');
        var targetText = $target.text();
        var $inputs = $target.find('input');
        if ($inputs.length) {
        	var ret = true;
        	$inputs.each(function () {
        		if ($.trim($(this).val()) == '') {
        			ret = false;
        		}

        		if ($inputs.length == 2 && isNaN($.trim($(this).val()))) {
        			ret = false;
        		}
        	});
        	if (!ret) return;
        }

        $target.addClass('active').siblings().removeClass('active');


        if ($inputs.length == 2) {
    		var range = $target.find('input').map(function () {
    			return $(this).val();
    		});
    		targetText = range[0] + ' 期 到 ' + range[1] + ' 期';
    	} else if ($inputs.length == 1) {
    		var range = $inputs.val();
    		targetText = '第 ' + range + ' 期';
    	}
        $targetSpan.text(targetText);
    });

    function ChartModel () {};
    ChartModel.prototype = {
    	constructor : ChartModel,
    	getChartRange : function () {
    		var $range = $('#chartRange');
    		var $inputs = $range.find('.active').find('input');
    		var ranges = [];
    		if ($inputs.length == 2) {
    			var s , e;
    			s = $inputs[0].value;
    			e = $inputs[1].value;
    			for (var i = s; i <= e; i++) {
    				ranges.push(parseInt(i));
    			}
    		} else {
    			var values = $inputs.val();
    			var SEPERATOR = values.indexOf(',') >= 0 ? ',' : ' ';
    			var temp = values.split(SEPERATOR);
    			for (var i = 0, l = temp.length; i < l; i++) {
    				ranges.push(parseInt(temp[i]));
    			}

    		}


    		return ranges || [4,5,6,7,8,9];
    	},
    	getChartType : function () {
    		var $type = $('#chartType');
    		var chartType = $type.find('.active').attr('data-type');

    		return chartType || 'pie';
    	}
    }
    var Model = new ChartModel();

    var ready = true;
    $('#genChart').on('click', function () {
    	if (!ready) return;
    	setLoadingGif(CHART_CONTAINER_ID);
    	var range = Model.getChartRange();
    	var type = Model.getChartType();
    	ready = false;
    	requestDataAndBuildChart(range, type);
    });



    // var demo = [];
    // for (var i = 700; i < 800; i++) {
    // 	demo.push(i);
    // }
    // 
    var demo = [100, 200, 300, 400];

    //requestDataAndBuildChart(demo, 'pie');


   //  function testGetDict() {
   //      var list = [700, 702]
   //      var data = {
   //          'data': list.join(',')
   //      }

   //      $.getJSON(getThanksUrl, data, function(ret) {
			// // var template = new ChartTemplate('main');
			// // template.buildChart(ret['data']);
   //      });
   //  }


    /**
     * [cacheChartData 缓存图表数据]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    function cacheChartData (data) {
    	var ccd = cache['chartData'];
    	for (var vol in data) {
    		ccd[vol] = data[vol];
    	}
    }
    
    /**
     * [mergeChartData 将请求的数据与缓存数据进行合并]
     * @param  {[type]} sourceList [description]
     * @param  {[type]} data       [description]
     * @return {[type]}            [description]
     */
    function mergeChartData (sourceList, data) {
    	var ccd = cache['chartData'];
    	var ret = {};
    	console.log('data', data);
    	for (var i = 0, l = sourceList.length; i < l; i++) {
    		var vol = sourceList[i];
    		if (vol in data) {
    			ret[vol] = data[vol];
    		} else {
    			ret[vol] = ccd[vol];
    		}
    	}

    	return ret;
    }

    function requestChartData (list, chartType, callback) {
        if (list.length == 0) {
        	callback({});
        } else {
        	var data = {
	            'data': list.join(',')
	        };

	        $.getJSON(getThanksUrl, data, function(ret) {
				if (ret.success === true || ret.success === 'true') {
					callback(ret.data);
				}
	        });
        }
    }

    function setLoadingGif (containerId) {
    	var $gif = $('<img>').attr({
    		src : GIF_PATH,
    		width: '100%',
    		height: '100%'
    	});
    	$('#' + containerId).html('<h2>Waiting</h2>').html($gif);
    	$gif.on('load', function () {
    		$(this).fadeIn('slow');
    	});
    }

    /**
     * [requestDataAndBuildChart 请求数据并绘制echarts]
     * @param  {[type]} volList  [期刊列表]
     * @param  {[type]} chartType [图表类型]
     * @return {[type]}          [description]
     */
    function requestDataAndBuildChart (volList, chartType) {
    	var ccd = cache['chartData'];
    	var clonedList = clone(volList);

    	// filter duplicated cached data
    	for (var i = volList.length-1; i >=0; i--) {
    		if (volList[i] in ccd) {
    			volList.splice(i, 1);
    		}
    	}

    	requestChartData(volList, chartType, function (data) {

    		// 1. cache data
    		cacheChartData(data);

    		// 2. compose data
    		var mergedData = mergeChartData(clonedList, data);
    		console.log('mergedData', mergedData);

    		// 3. buildChart
    		var template;
    		if (!ccd[chartType]) {
    			ccd[chartType] = new ChartTemplate(CHART_CONTAINER_ID, chartType);
    		}

    		template = ccd[chartType];
            console.log('template', template);
    		setTimeout(function () {
    			template.buildChart(mergedData);
    			ready = true;
    		}, 2000);
    		
    	})
    }

    function setButtonEnabled (flag) {
    	$('#genChart').prop('readonly', flag);
    }

    /**
     * [constructChartOption 图表配置顶的新增]
     * @type {Object}
     */
    var constructChartOption = {
    	'pie' : function (ret) {
    		var legendData = [];
	    	var seriesData = [];

	    	for (var vol in ret) {
	    		var name = '期刊' + vol;
	    		var value = ret[vol];
	    		legendData.push(name);
	    		seriesData.push({
	    			name : name,
	    			value : value
	    		});
	    	}

	        var option = {
	            title: {
	                text: '落网期刊点赞数分析',
	                x: 'center',
	                y: 120
	            },
	            tooltip: {
	                trigger: 'item',
	                formatter: "{a} <br/>{b} : {c} ({d}%)"
	            },
	            legend: {
	                orient: 'vertical',
	                x: 'right',
	                y: 100,
	                data: legendData
	            },
	            toolbox: {
	                show: true,
	                feature: {
	                    mark: { show: true },
	                    dataView: { show: true, readOnly: false },
	                    magicType: {
	                        show: true,
	                        type: ['pie', 'funnel'],
	                        option: {
	                            funnel: {
	                                x: '25%',
	                                width: '50%',
	                                funnelAlign: 'left',
	                                max: 1548
	                            }
	                        }
	                    },
	                    restore: { show: true },
	                    saveAsImage: { show: true }
	                }
	            },
	            series: [{
	                name: '数据来源',
	                type: 'pie',
	                radius: '55%',
	                center: ['50%', '60%'],
	                data: seriesData,
	                itemStyle: {
	                    emphasis: {
	                        shadowBlur: 10,
	                        shadowOffsetX: 0,
	                        shadowColor: 'rgba(0, 0, 0, 0.5)'
	                    }
	                }
	            }]
	        };
	        return option;
    	},
    	'bar' : function (ret) {
    		var legendData = [];
	    	var seriesData = [];

	    	for (var vol in ret) {
	    		var name = '期刊' + vol;
	    		var value = ret[vol];
	    		legendData.push(name);
	    		seriesData.push({
	    			name : name,
	    			value : value
	    		});
	    	}


    		var option = {
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        orient : 'vertical',
			        x : 'left',
			        data:legendData
			    },
			    toolbox: {
			        show : true,
			        feature : {
			            mark : {show: true},
			            dataView : {show: true, readOnly: false},
			            magicType : {
			                show: true, 
			                type: ['pie', 'funnel'],
			                option: {
			                    funnel: {
			                        x: '25%',
			                        width: '50%',
			                        funnelAlign: 'center',
			                        max: 1548
			                    }
			                }
			            },
			            restore : {show: true},
			            saveAsImage : {show: true}
			        }
			    },
			    calculable : true,
			    series : [
			        {
			            name:'点赞数统计',
			            type:'pie',
			            radius : ['50%', '70%'],
			            itemStyle : {
			                normal : {
			                    label : {
			                        show : false
			                    },
			                    labelLine : {
			                        show : false
			                    }
			                },
			                emphasis : {
			                    label : {
			                        show : true,
			                        position : 'center',
			                        textStyle : {
			                            fontSize : '30',
			                            fontWeight : 'bold'
			                        }
			                    }
			                }
			            },
			            data:seriesData
			        }
			    ]
			};
			                    
			                    
    	}
    };

    function domTpl () {
    	var tpl = '<div id="main" style="margin-top: 80px;width: 600px; height: 500px;"></div>';

            return tpl;
    }

    /**
     * [ChartTemplate 生成图的模板]
     * @param {[type]} id [图表容器的id]
     */
    function ChartTemplate(id, type) {
    	this.containerId = id;
    	this.chartType = type || 'pie';
    	this.instance = null;
    };

    ChartTemplate.prototype = {
    	constructor : ChartTemplate,
		constructOption : function (ret) {
			return constructChartOption[this.chartType](ret);
		},
		setOption : function (option) {
			var dom = document.getElementById(this.containerId);
			var that = this;
			$(dom).replaceWith(domTpl());

			setTimeout(function () {
				var myChart = echarts.init(document.getElementById(that.containerId));
        		myChart.setOption(option);

        		that.setChartInstance(myChart);
			}, 500);
		},
		buildChart : function (data) {
			var option = this.constructOption(data);
    		this.setOption(option);
		},
		setChartInstance: function (instance){
			this.instance = instance;
		},
		getChartInstance: function () {
			return this.instance;
		}
    }

    function clone (obj) {
    	if (typeof obj !== 'object' || obj === null || obj === undefined) return obj;

    	var ret = new obj.constructor();
    	for (var attr in obj) {
    		if (obj.hasOwnProperty(attr)) {
    			ret[attr] = clone(obj[attr]);
    		}
    	}

    	return ret;
    }
});
