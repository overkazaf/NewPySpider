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
	resources = Controller.getLocalResources()
	mp3s = resources['mp3s']
	pics = resources['pics']
	return render_template('listResultWithTab.html', mp3s=mp3s[1:20], pics=pics[1:20])

@app.route('/showChart')
def showChart():
	return render_template('chart_analize.html')

@app.route('/crawler/config')
def spiderConfig():
	#Spider.test(700)
	return "Crawler Start!"




if __name__ == '__main__':
    app.run(debug=True)

