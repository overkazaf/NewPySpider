#!/usr/bin/env python
# -*- coding: utf-8 -*-

' HttpClient module '

__author__ = 'XSunny'
import urllib2, urllib, fileUtil  

#id = openList

def getMethod(url,values):
	#values = {"user":"XXX","pass":"XXX"}
	if values:
		data = urllib.urlencode(values) 
		geturl = url + "?"+data
		request = urllib2.Request(geturl)
		response = urllib2.urlopen(request)
	else:
		response = urllib2.urlopen(url)

	return response.read()


def postMethod(url,values):
	#values = {"user":"XXX","pass":"XXX"}
	if values:
		data = urllib.urlencode(values) 
		request = urllib2.Request(url,data)
		response = urllib2.urlopen(request)
	else:
		response = urllib2.urlopen(url)
	
	return response.read()

def crawlerResource(url, method, values):
	print values
	if method == 'POST':
		postMethod(url, values)
	else:
		getMethod(url, values)