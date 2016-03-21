from flask import Flask, request, render_template
import spider.spider as Spider

app = Flask(__name__)

@app.route('/')
def home():
	return render_template('home.html')

@app.route('/showResult')
def showResult():
	print request.args
	print request.form
	musics = range(30)
	return render_template('listMusic.html', items=musics[1:10])

@app.route('/crawler/config')
def spiderConfig():
	Spider.test(700)
	return "Crawler Start!"


if __name__ == '__main__':
    app.run()