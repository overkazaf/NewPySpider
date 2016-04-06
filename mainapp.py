from flask import Flask, request, jsonify, render_template
import spider.spider as Spider
from flask.ext.bootstrap import Bootstrap
import spider.controller as Controller
import time, os, sched 


#global job scheduler
schedule = sched.scheduler(time.time, time.sleep)
schedule.event = None


__author__ = 'overkazaf'

app = Flask(__name__)
bootstrap = Bootstrap(app)


def NoneFn():
	pass

def timming_exe(fn = NoneFn, inc = 60): 
	
	print 'Calling scheduler after :', str(inc), ' seconds'
	
	fn()

	scheduler.event = schedule.enter(inc, 0, timming_exe, (fn, inc)) 

	schedule.run() 


@app.route('/')
def home():
	return render_template('home.html')

@app.route('/showResult')
def showResult():
	res = Controller.getLocalResources()
	volumns = Controller.getVolumnList()
	mp3s = res['mp3']
	pics = res['pic']
	return render_template('listResultWithTab.html', mp3s = mp3s[0:8], pics = pics[0:8], volumns=volumns)

@app.route('/showChart')
def showChart():
	return render_template('chart_analize.html')

@app.route('/crawler/config')
def spiderConfig():
	#Spider.test(700)
	return "Crawler Start!"

@app.route('/crawler')
def crawler():
	resType = request.args.get('type')
	interval = request.args.get('interval')
	rangeType = request.args.get('rangeType')
	start = request.args.get('start')
	end = request.args.get('end')
	# print resType
	# print interval
	# print rangeType
	# print start
	# print end

	def intervalFn ():
		Controller.startScheduler(resType, rangeType, start, end)

	if schedule.event:
		schedule.cancel(scheduler.event)
		print 'cancel last event in scheduler'


	# start scheduler at each interval
	timming_exe(intervalFn, int(interval))

	status = True
	result = False
	message = 'Successful call scheduler'
	if status : 
		result = True
		message = 'Failed to call scheduler'
	return jsonify({'success': status, 'message': message})


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

