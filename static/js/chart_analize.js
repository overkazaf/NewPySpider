$(function () {
	var myChart = echarts.init(document.getElementById('main'));

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
                data: ['期刊001', '期刊002', '期刊003', '期刊004', '期刊005']
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
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
            series: [{
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [{
                    value: 335,
                    name: '期刊001'
                }, {
                    value: 310,
                    name: '期刊002'
                }, {
                    value: 234,
                    name: '期刊003'
                }, {
                    value: 135,
                    name: '期刊004'
                }, {
                    value: 1548,
                    name: '期刊005'
                }],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };

        myChart.setOption(option);
});