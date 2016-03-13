#!/usr/bin/env python
# -*- coding: utf-8 -*-

' parser module '

__author__ = 'XSunny'

from pyquery import PyQuery as pquery
from lxml import etree

#获得某个元素的内容（TEXT）
def getElementText(input, queryString):
	query = pquery(input)
	text = query(queryString)
	return text.text()

#获得某个元素的属性
def getElementAttr(input, queryString, attrName):
	query = pquery(input)
	text = query(queryString)
	return text.attr(attrName)

#复合查询
def getElements(input, queryString, findStr):
	query = pquery(input)
	elements = query(queryString).find(findStr)
	return elements