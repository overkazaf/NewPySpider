from flask import Flask, request, jsonify, render_template
import spider.spider as Spider
from flask.ext.bootstrap import Bootstrap
import spider.controller as Controller
import time, os, sched, threading, thread, multiprocessing, math

from multiprocessing import Pool  

#global job scheduler
schedule = sched.scheduler(time.time, time.sleep)
schedule.event = None


__author__ = 'overkazaf'

app = Flask(__name__)
bootstrap = Bootstrap(app)

MAX_RES_COUNT = 16
PAGE_SIZE = 8


def NoneFn():
	pass

def timming_exe(fn = NoneFn, inc = 60): 
	
	print 'Calling scheduler after :', str(inc), ' seconds'
	
	fn()

	schedule.event = schedule.enter(inc, 0, timming_exe, (fn, inc)) 

	schedule.run() 


@app.route('/')
def home():
	return render_template('home.html')

@app.route('/test')
def testFn():
	resType = request.args.get('type')
	interval = request.args.get('interval')
	rangeType = request.args.get('rangeType')
	start = request.args.get('start')
	end = request.args.get('end')

	print 'Inside test function'
	return jsonify(Controller.getTaskCompletion(type, rangeType, start, end))


@app.route('/showResult')
def showResult():

	pageNo = request.args.get('pageNo')
	pageSize = request.args.get('pageSize')

	pageNo = int(pageNo)
	pageSize = int(pageSize)

	if not pageSize:
		pageSize = PAGE_SIZE

	
	total = Controller.getTotalFolderCounts()
	print 'tttttt, ', total

	totalPages = int(total / pageSize)

	if totalPages * pageSize < total:
		totalPages = totalPages + 1


	if totalPages == 0:
		totalPages = 1

	if not pageNo:
		pageNo = 1

	if pageNo <= 0:
		pageNo = 1

	if pageNo >= totalPages:
		pageNo = totalPages

	res = Controller.getLocalResources(pageNo, pageSize)

	mp3s = res['mp3']
	pics = res['pic']

	start = (pageNo - 1) * pageSize + 1
	end = pageNo * pageSize
	
	if end <= start:
		end = start + 1

	if end >= total:
		end = total
	print 'start:', start-1, ' end:', end
	print 'pics, ', pics

	return render_template('listResultWithTab.html', mp3s = mp3s[start-1:end], pics = pics[start-1:end], total=total)

@app.route('/showChart')
def showChart():
	return render_template('chart_analize.html')

@app.route('/crawler/config')
def spiderConfig():
	#Spider.test(700)
	return "Crawler Start!"

@app.route('/musicCount')
def musicCount():
	resType = request.args.get('type')
	interval = request.args.get('interval')
	rangeType = request.args.get('rangeType')
	start = request.args.get('start')
	end = request.args.get('end')

	mp3Dict = Controller.getTaskCompletion(resType, rangeType, start, end)
	return jsonify({'success': True, 'message': 'success', 'total' : {'mp3':mp3Dict['total']}, 'done' : {'mp3':mp3Dict['done']}})

@app.route('/taskCompletion')
def taskCompletion():
	resType = request.args.get('type')
	interval = request.args.get('interval')
	rangeType = request.args.get('rangeType')
	start = request.args.get('start')
	end = request.args.get('end')

	return jsonify(Controller.getTaskCompletion(resType, rangeType, start, end))

@app.route('/musicDone')
def musicDone():
	resType = request.args.get('type')
	interval = request.args.get('interval')
	rangeType = request.args.get('rangeType')
	start = request.args.get('start')
	end = request.args.get('end')

	return jsonify({'done':Controller.getDoneFiles(resType, rangeType, start, end)});


def timeoutFn(fn, resType, rangeType, start, end, interval):
	def f():
		fn(resType, rangeType, start, end)
	timming_exe(f, int(interval))



@app.route('/cancelSchedule')
def cancelSchedule():
	if schedule.event:
		schedule.cancel(schedule.event)
		print 'cancel schedule'
	return jsonify({'success':True, 'message': 'schedule canceled'})

@app.route('/crawler')
def crawler():
	resType = request.args.get('type')
	interval = request.args.get('interval')
	rangeType = request.args.get('rangeType')
	start = request.args.get('start')
	end = request.args.get('end')

	if schedule.event:
		schedule.cancel(schedule.event)

	p = multiprocessing.Process(target = timeoutFn, args = (Controller.startScheduler, resType, rangeType, start, end, interval))
	p.start()
	
	return jsonify(Controller.getTaskCompletion(resType, rangeType, start, end))


@app.route('/thanks')
def thanks():
	print 'in get thanks'
	list = request.args.get('data')
	print 'list ', list
	dict = Controller.getThanksDict(list.split(','))

	print 'dict ', dict
	return jsonify({'success': True, 'data': dict})

if __name__ == '__main__':
    app.run(debug=True)

