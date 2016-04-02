from flask import Flask, request, render_template
import spider.spider as Spider
from flask.ext.bootstrap import Bootstrap
import spider.controller as Controller

__author__ = 'overkazaf'

app = Flask(__name__)
bootstrap = Bootstrap(app)

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




if __name__ == '__main__':
    app.run(debug=True)

