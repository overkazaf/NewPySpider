from flask import Flask, request, render_template
import spider.spider as Spider

app = Flask(__name__)

#主页
@app.route('/')
def home():
    return render_template('home.html')

#显示结果
@app.route('/showResult')
def showResult():
    return render_template('home.html')

#爬虫配置
@app.route('crawler/config')
def spiderConfig():
	return Spider.test()


if __name__ == '__main__':
    app.run()