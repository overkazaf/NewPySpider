#!/usr/bin/env python
# -*- coding: utf-8 -*-

' spider module '

__author__ = 'XSunny'
__modifiedBy__ = 'overkazaf'
__resource__ = 'static'

#爬虫模块
import urllib2, urllib, fileUtil, httpClient, Parser, os

from multiprocessing import Process
import threading
import Queue
import re

q = Queue.Queue()

_default_parms  = {"User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36", "Referer":"http://www.luoo.net/"}


def getVolumnList():
	list = []
	dirs = os.listdir(__resource__)
	print 'dirs ', dirs
	for dir in dirs:
		if dir == 'css' or dir == 'js':
			continue
		
		list.append(dir)
	return {"volumns" : list.sort()}


#获得某个期数的所有音乐
def getMusic(volNumber):

	#初始化目录
	initdir(volNumber)

	#如果出现异常，则退出循环
	goon = 1
	mnumber = 1
	prefix = "http://luoo-mp3.kssws.ks-cdn.com/low/luoo/radio"
	tasks = []
	while (goon):
		try:
			surl = ''
			if mnumber < 10:
				surl = prefix + str(volNumber)+"/0"+str(mnumber)+".mp3"
			else:
				surl = prefix + str(volNumber)+"/"+str(mnumber)+".mp3"

			data = httpClient.crawlerResource(surl, "GET", None)

			filepath = "./static/vol."+str(volNumber)+"/mp3/"+str(mnumber)+".mp3"

			def t():
				fileUtil.saveByteFile(filepath, data)

			t = threading.Thread(target = t)
			t.start()
			t.join()
			print 'mp3 ', mnumber, ' has been written to the disk'

			mnumber = mnumber+1
		except Exception, e:
			print e
			goon = 0
		else:
			pass
		finally:
			pass


SEPERATOR = '$$$$'

def getThanksByVolumns (volumns):
	dict = {}
	for vol in volumns:
		def t(vol):
			print vol, ' in t()'
			q.put(vol+ SEPERATOR + getThanks(vol))
		task = threading.Thread(target = t, name=vol, args=(vol,))
		task.start()
		task.join()

	target = []
	while not q.empty():
		target = q.get().split(SEPERATOR)
		print 'target  ', target
		dict[int(target[0])] = int(target[1])

	print 'done...', target
	return dict


#获得某个期数的所有感谢数 -import 
def getThanks(volNumber):
	value = ''
	url = 'http://www.luoo.net/music/'+str(volNumber)
	try:
		data = httpClient.crawlerResource(url, "GET", None)
		value = Parser.getElementText(data, "#openList")
		m = re.search("(\d)+", value)
		value = m.group(1)
	except Exception, e:
		raise
	else:
		pass
	finally:
		pass
	return value


def getPicByRange (start, end):
	start = int(start)
	end = int(end)
	for vol in range(start, end+1):
		print 'calling getPic(', vol, ')'
		getPic(vol)


def getMusicByRange (start, end):
	start = int(start)
	end = int(end)
	for mp3 in range(start, end+1):
		getMusic(mp3)

#获得某个期数的所有专辑图片
def getPic(volNumber):
	#初始化目录
	initdir(volNumber)

	url = 'http://www.luoo.net/music/'+str(volNumber)
	pics = []
	tasks = []

	try:
		data = httpClient.crawlerResource(url, "GET", None)
		imgs = Parser.getElements(data, "li.track-item", "a[data-img]")
		title = Parser.getElementText(data, "span.vol-title").strip()

		print 'Album title:', title

		print 'There are ', len(imgs), ' pictures need to be downloaded'
		i = 1
		for img in imgs:
			imgurl = Parser.getElementAttr(img, 'a', "data-img")
			pic = httpClient.crawlerResource(imgurl, "GET", None)
			
			filepath = "./static/vol."+str(volNumber)+"/pic/"+str(i)+".jpg"

			def t():
				fileUtil.saveByteFile(filepath, pic)

			t = threading.Thread(target = t)

			print 'image ', i, ' has been written to the disk'
			t.start()
			t.join()
			i= i +1


		print 'END'

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
	initdir(volNumber)#在调用下面两个方法下载资源时必须使用
	
	def fn1():
		getPic(volNumber)

	def fn2():
		getMusic(volNumber)


	p1 = Process(target = fn1)
	p2 = Process(target = fn2)

	p1.start()
	p1.join()

	p2.start()
	p2.join()

	return getThanks(volNumber) 
	#print html 

for i in range(700, 704):
	pass
	#test(i)