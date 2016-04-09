from flask import Flask, request, jsonify, render_template
import spider.spider as Spider
from flask.ext.bootstrap import Bootstrap
import spider.controller as Controller
import time, os, sched, threading, thread, multiprocessing, math

__author__ = 'overkazaf'
__email__ = 'overkazaf@gmail.com'

#global job scheduler
schedule = sched.scheduler(time.time, time.sleep)
schedule.event = None

app = Flask(__name__)
bootstrap = Bootstrap(app)

#define a const page_size var
PAGE_SIZE = 8


#Nil function only for testing
def NoneFn():
	pass


def timming_exe(fn = NoneFn, inc = 60): 
	print 'Calling scheduler after :', str(inc), ' seconds'
	fn()
	#save this as a property in case of next cancel operation
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


#check the status of current crawler task
@app.route('/taskCompletion')
def taskCompletion():
	resType = request.args.get('type')
	interval = request.args.get('interval')
	rangeType = request.args.get('rangeType')
	start = request.args.get('start')
	end = request.args.get('end')

	return jsonify(Controller.getTaskCompletion(resType, rangeType, start, end))


def timeoutFn(fn, resType, rangeType, start, end, interval):
	def f():
		fn(resType, rangeType, start, end)
	#dispatch timeout task by calling this function
	timming_exe(f, int(interval))


#cancel the last schedule by calling this router below
@app.route('/cancelSchedule')
def cancelSchedule():
	if schedule.event:
		schedule.cancel(schedule.event)
		print 'schedule has been canceled'
	return jsonify({'success':True, 'message': 'schedule canceled'})


#crawler module, will dispatch the actual task
@app.route('/crawler')
def crawler():
	resType = request.args.get('type')
	interval = request.args.get('interval')
	rangeType = request.args.get('rangeType')
	start = request.args.get('start')
	end = request.args.get('end')

	#cancel last task to prevent system resource being stucked
	if schedule.event:
		schedule.cancel(schedule.event)

	#create a new process to tackle this task
	p = multiprocessing.Process(target = timeoutFn, args = (Controller.startScheduler, resType, rangeType, start, end, interval))
	p.start()
	
	#return json immediatly
	return jsonify(Controller.getTaskCompletion(resType, rangeType, start, end))

#get thanks by a given volumn list
@app.route('/thanks')
def thanks():
	list = request.args.get('data')
	dict = Controller.getThanksDict(list.split(','))
	return jsonify({'success': True, 'data': dict})

if __name__ == '__main__':
    app.run(debug=True)

