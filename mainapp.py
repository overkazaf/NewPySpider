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

MAX_RES_COUNT = 16


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

@app.route('/showResult')
def showResult():
	res = Controller.getLocalResources()
	volumns = Controller.getVolumnList()
	mp3s = res['mp3']
	pics = res['pic']
	return render_template('listResultWithTab.html', mp3s = mp3s[0:MAX_RES_COUNT], pics = pics[0:MAX_RES_COUNT], volumns=volumns)

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

	print 'mp3 Counting starts'
	mp3Dict = Controller.getTaskCompletion(resType, rangeType, start, end)
	print 'mp3 Counting ends ', mp3Dict
	return jsonify({'success': True, 'message': 'success', 'total' : {'mp3':mp3Dict['total']}, 'done' : {'mp3':mp3Dict['done']}})

@app.route('/musicDone')
def musicDone():
	resType = request.args.get('type')
	interval = request.args.get('interval')
	rangeType = request.args.get('rangeType')
	start = request.args.get('start')
	end = request.args.get('end')

	print 'mp3 Counting starts'
	mp3Dict = Controller.getDoneFiles(resType, rangeType, start, end)
	print 'mp3 Counting ends ', mp3Dict
	return jsonify({'done' : {'mp3': mp3Dict['mp3']}})



@app.route('/test')
def getTaskCompletion():
	resType = request.args.get('type')
	interval = request.args.get('interval')
	rangeType = request.args.get('rangeType')
	start = request.args.get('start')
	end = request.args.get('end')

	return Controller.getTaskCompletion(resType, rangeType, start, end)

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
		schedule.cancel(schedule.event)
		print 'cancel last event in scheduler'


	# start scheduler at each interval
	timming_exe(intervalFn, int(interval))

	status = True
	message = 'Successful call scheduler'
	
	print '#retrun at crawler'

	return jsonify({'success': status, 'message': message, 'total' : 100})
	#return jsonify({'success': status, 'message': message, 'total' : {'mp3':Spider.getMaxMusicCount(resType, rangeType, start, end)}, 'done':{'mp3': Controller.getDoneFiles(resType, rangeType, start, end)['mp3']}})


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

