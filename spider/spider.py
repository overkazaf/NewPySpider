#!/usr/bin/env python
# -*- coding: utf-8 -*-

' spider module '

__author__ = 'XSunny'
__modifiedBy__ = 'overkazaf'

#爬虫模块

import urllib2, urllib, fileUtil, httpClient, Parser, os

_default_parms  = {"User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36", "Referer":"http://www.luoo.net/"}

#获得某个期数的所有音乐
def getMusic(volNumber):
	#如果出现异常，则退出循环
	goon = 1
	mnumber = 1
	prefix = "http://luoo-mp3.kssws.ks-cdn.com/low/luoo/radio"
	while (goon):
		try:
			surl = ''
			if mnumber < 10:
				surl = prefix + str(volNumber)+"/0"+str(mnumber)+".mp3"
			else:
				surl = prefix + str(volNumber)+"/"+str(mnumber)+".mp3"

			data = httpClient.crawlerResource(surl, "GET", None)

			fileUtil.saveByteFile("./static/vol."+str(volNumber)+"/mp3/"+str(mnumber)+".mp3", data)
			mnumber = mnumber+1
		except Exception, e:
			print e
			goon = 0
		else:
			pass
		finally:
			pass
		
#获得某个期数的所有感谢数 -import 
def getThanks(url):
	value = ''
	try:
		data = httpClient.crawlerResource(url, "GET", None)
		value = Parser.getElementText(data, "#openList")
	except Exception, e:
		raise
	else:
		pass
	finally:
		pass
	return value

#获得某个期数的所有专辑图片
def getPic(url, volNumber):
	pics = []
	try:
		data = httpClient.crawlerResource(url, "GET", None)
		imgs = Parser.getElements(data, "li.track-item", "a[data-img]")

		i = 1
		for img in imgs:
			imgurl = Parser.getElementAttr(img, 'a', "data-img")
			pic = httpClient.crawlerResource(imgurl, "GET", None)
			fileUtil.saveByteFile("./static/vol."+str(volNumber)+"/pic/"+str(i)+".jpg", pic)
			i= i +1
			#print i

		#print 'END'

	except Exception, e:
		raise
	else:
		pass
	finally:
		pass
	return

#初始化下载目录 - 下载资源前，需要建立目录结构
def initdir(volNumber):
	if not os.path.exists("./static/vol."+str(volNumber)+"/mp3/"):
		os.makedirs("./static/vol."+str(volNumber)+"/mp3/")
	if not os.path.exists("./static/vol."+str(volNumber)+"/pic/"):
		os.makedirs("./static/vol."+str(volNumber)+"/pic/")

	pass


#主页测试方法
def test(volNumber):
	srcurl ='http://www.luoo.net/music/'+str(volNumber)
	initdir(volNumber)#在调用下面两个方法下载资源时必须使用
	getPic(srcurl, volNumber)
	getMusic(volNumber)
	return getThanks(srcurl) 
	#print html 

#test(801)