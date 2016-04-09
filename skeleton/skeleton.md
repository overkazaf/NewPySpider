#skeleton
##Framework
*  Flask        基于python的web框架
*  Bootstrap    Twitter开发的前端CSS框架
*  echarts      百度开发的基于canvas的图表库

##views    视图
*templates
  +  home.html       主页
  +  listResultWithTab.html   列出所抓取的资料列表
  +  chart_analize.html     图表页面

#Python 模块
##controller 控制器，用于控制模型与视图间的交互
* mainapp.py   ----    路由模块， 用于转发请求
  +  crawler         抓虫任务，将任务分发到另一个进程中去处理, 使用multiprocessing模块处理
  +  showResult      显示爬取结果
  +  showChart       显示图表
  +  home            主页入口
  +  taskCompletion      获取爬虫任务的完成情况
  +  thanks              获取点赞数


* controller.py ----   控制器模块，用于分发操作
  +  filterPath        过滤无关的资源文件夹
  +  getVolumnList     获取已经抓取过的期刊数
  +  getDownloadedMusicList    获取已经下载的音乐资源列表
  +  getLocalResources    获取本地已经下载的资源
  +  getTotalFolderCounts  获取资源文件夹的数量
  +  getVolRange        获取目前已下载的期刊所在的区间
  +  runScheduler       运行调度器， 用于分发任务
  +  getMp3FilesByVol   获取给定期刊下的mp3文件列表
  +  getPicFilesByVol   获取给定期刊下的图片文件列表
  +  getTaskCompletion  获取当前任务的完成情况
  +  getPictureCompletion  获取当前任务中图片文件的完成情况
  +  getMusicCompletion  获取当前任务中mp3文件的完成情况
  +  startScheduler      开始调度定时任务，分发不同类型的请求
  +  getThanksDict       获取点赞数

* __init__.py   ----  初始化模块， 用于全局初始化

* fileUtil.py  ----  文件相关的工具模块，用于文件读写等功能
  +  saveByteFile    写字节流文件，如mp3
  +  saveTextFile    写字符流文件，如txt

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
  +  getThanksByVolumns  爬取给定期刊列表的感谢数
  +  getPic          爬取图片
  +  getPicByRange   获取给定范围内的图片
  +  getMaxPictureCount  获取当前任务需要下载的图片文件总数
  +  getMaxMusicCount  获取当前任务需要下载的mp3文件总数


#js 模块
##home  ----    home.html视图对应的入口模块
*  home.js  ----    入口模块
  +  paramEntity  ----    爬虫参数的实体类，方便配置项的管理
  +  bindEvents   ----    按钮事件的绑定， 对下拉、开始/停止任务，页面转换等操作做统一处理
  +  collectParam  ----    爬虫参数的收集策略，写入到当前应用的参数实体中，方便管理
  +  validateCrawlParam  ----    校验爬虫参数
  +  fnCrawlerTaskStart  ----    初始化爬虫任务的界面状态
  +  fnCrawlerTaskDone  ----     完成爬虫任务后的界面状态

##listResult  ----    资源展示模块
*  listResult.js    --  入口模块
  +  bindEvents  ----  绑定按钮事件
  +  initPagination ---- 初始化分页的功能
  +  buildList ---- 构建展示在页面的资源列表
  +  showResultDetail  --  显示资源详情
  +  pageBtnTpl，mp3Tpl，picTpl    ----  工具类

##chart_analize  ----  图表分析模块
*  chart_analize.js
  +  ChartModel  --  图表模型类，用于根据不同的类型生成echarts
  +  requestDataAndBuildChart  --  请求并构建图表
  +  requestChartData  --  根据期刊列表请求点赞数  
  +  constructChartOption  --  构建不同的图表参数
  +  ChartTemplate  --  生成图的模板方法类
