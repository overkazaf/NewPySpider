import urllib2, urllib, fileUtil, httpClient  

_default_parms  = {"User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36", "Referer":"http://www.luoo.net/music/800"}


def getMusic(volNumber):
	#如果出现异常，则退出循环
	goon = 1
	while (goon):
		try:
			data = httpClient.crawlerResource("http://luoo-mp3.kssws.ks-cdn.com/low/luoo/radio"+volNumber+"/"+mnumber+".mp3", "GET", None)
			fileUtil.saveByteFile("./"+volNumber+"/mp3/"+mnumber+".mp3", data)
		except Exception, e:
			goon = 0
		else:
			pass
		finally:
			pass
		

def getThanks(url):
	pass


def getPic(url):
	pass


#print html 