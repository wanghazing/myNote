使用Node.js制作个人记事本

这是并不太严谨的说明书！

食用方法：

1，确保你的电脑安装了node.js、npm、mongodb,如果没有，请百度搜索下载并安装配置好
2，启动mongodb服务
3，使用cmd或gitbash或其他终端，进入项目目录
4，在终端中启动node app.js启动服务器
5，打开你的浏览器，在地址栏输入localhost:8088打开主页

接下来是关于制作本项目的一些心得

基本步骤是：
1，使用npm init创建项目
2，创建其他必要的目录和文件
3，下载安装必要的模块组件
4，安装bower，设置bower组件的目录（.bowerrc文件）使用bower安装下载bootstrap和jquery
5，创建几个主要页面的模板
6，设计数据模型，写在models/models.js中
7，编写入口文件
8，编写相应的模板，留好接口
9，表单处理相关逻辑：
	a) 使用req.body.property获取提交的数据内容
	b) 表单验证的逻辑写在post处理路由上
	c) 使用return res.redirect(前面的路径) 返回之前的页面
