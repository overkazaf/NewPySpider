from flask import Flask, request, render_template
import spider.spider as Spider

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/user/crawler/config')
def spiderConfig():
	Spider.test()
	return 'config crawler!'


if __name__ == '__main__':
    app.run()