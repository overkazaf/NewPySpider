from flask import Flask, request, render_template
import spider.spider as Spider
from flask.ext.bootstrap import Bootstrap

app = Flask(__name__)

@app.route('/')
def home():
	bootstrap = Bootstrap(app)
	return render_template('base.html')

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


#test
@app.route('/user/<name>')
def user(name):
	return '<h1>Hello, %s!</h1>' % name


@app.route('/user/userAgent')
def userAgent():
	user_agent = request.headers.get('User-Agent')
	return '<h3>UserAgent: %s!</h3>' % user_agent

if __name__ == '__main__':
    app.run(debug=True)