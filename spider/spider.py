import urllib2, urllib, fileUtil, httpClient  

_default_parms  = {"User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36", "Referer":"http://www.luoo.net/music/800"}

data  = httpClient.crawlerResource("http://luoo-mp3.kssws.ks-cdn.com/low/luoo/radio800/01.mp3", "GET", None)

fileUtil.saveByteFile("./mp3/1.mp3", data)
#print html 