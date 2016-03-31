#skeleton
##Framework
*  Flask        基于python的web框架
*  Bootstrap    Twitter开发的前端CSS框架
*  echarts      百度开发的基于canvas的图表库

##views    视图
*templates
  +  base.html       基础视图，用于被其它视图继承
  +  home.html       主页
  +  listMusic.html  单独列出音乐
  +  listPic.html    单独列出图片
  +  listResultWithTab.html   列出所抓取的资料列表
  +  chart.html     图表页面

##controller 控制器，用于控制模型与视图间的交互
* mainapp.py   ----    路由模块， 用于转发请求
  +  spiderConfig    设置爬虫规则
  +  showResult      显示爬取结果
  +  showChart       显示图表
  +  showMusic       显示音乐列表
  +  showPic         显示图片列表

* __init__.py   ----  初始化模块， 用于全局初始化

* fileUtil.py  ----  文件相关的工具模块，用于文件读写、模拟数据库等功能
  +  saveByteFile    写字节流文件，如mp3
  +  saveTextFile    写字符流文件，如txt
  +  saveDBFile      写数据库文件，目前用JSON模拟
  +  readDBFile      读数据库文件，目前用JSON模拟

*  httpClient.py    ----  HTTP处理模块
  +  crawlerResource    按请求分发的请求处理模块
  +  getMethod          处理GET请求
  +  postMethod         处理POST请求

*  Parser.py        ----  解析模块
  +  getElements        获取元素dom集合
  +  getElementText     获取元素的文本
  +  getElementAttr     获取元素的属性

* spider.py -- 爬虫模块
  +  initdir         初始化本地目录
  +  getMusic        爬取音乐
  +  getThanks       爬取感谢数
  +  getPic          爬取图片

##model  数据模型，数据实体类定义, 用于辅助功能扩展
*  resource
  +  id              资源ID
  +  type            资源类型
  +  path            资源路径
  +  date            爬取日期



