$(function () {
	var host = 'http://127.0.0.1';
	var port = 5000;
	var showChartInterface = 'showChart';
	var showResultUrl = 'showResult';
	var showChartUrl = host + ':' + port +'/' + showChartInterface;
	var showResultUrl = host + ':' + port +'/' + showResultUrl;

	$('#startCrawl').on('click', function () {
		startCrawl();
	});

	$('#showResult').on('click', function () {
		window.open(showResultUrl)
	});

	$('#showChart').on('click', function () {
		window.open(showChartUrl)
	});


	function doNothing () {
		return undefined;
	}


	function startCrawl () {
		doNothing();
	}

});