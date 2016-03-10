#!/usr/bin/env python
# -*- coding: utf-8 -*-

' a FileIO module '

__author__ = 'XSunny'

def saveByteFile(fileName, data):
	try:
		f = open(fileName, "wb")
		f.write(data)
	except IOError, e:
		print "FileIO ERROR!"
	finally:
		if f:
			f.close()

def saveTextFile(fileName, data):
	try:
		f = open(fileName, "w")
		f.write(data)
	except IOError, e:
		print "FileIO ERROR!"
	finally:
		if f:
			f.close()

