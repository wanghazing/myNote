var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var mongoose = require('mongoose');
var models = require('./models/models');
var User = models.User;
var Note = models.Note;
var app = express();

//引入登录检测文件
var checkLogin = require('./checkLogin.js');

//body-parser中间件
app.use(bodyParser.urlencoded({extended:true}));

//session机制
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//设置视图文件目录
app.set('views',path.join(__dirname,'views'));
app.set('view engine','jade');

//设置静态资源目录
app.use(express.static(path.join(__dirname,'public')));
//使用mongoose服务
mongoose.connect('mongodb://localhost:27017/notes');
mongoose.connection.on('error',console.error.bind(console,'数据库连接失败'));
//建立session模型
app.use(session({
	key:'session',
	secret : 'Keboard cat',
	cokkie : {maxAge : 1000 *60 *60 *24},
	store : new MongoStore({
		db : 'notes',
		mongooseConnection : mongoose.connection
	}),
	resave : false,
	saveUninitialized : true
}));




//登陆判断
app.get('/',checkLogin.noLogin);
//解析urlcoded请求体
app.get('/',function(req,res){
	Note.find({author:req.session.user.username}).exec(function(err,arts){
		if(err){
			console.log(err);
			return res.redirect('/');
		}
		res.render('index',{title:'笔记列表',user:req.session.user,arts:arts/*,moment:moment*/});
	})
});
//登陆判断
app.get('/',checkLogin.login);
//获取注册表单提交数据
app.get('/reg',function(req,res){
	res.render('register',{title:'注册',user:req.session.user,page:'reg'});
});
//表单处理逻辑
app.post('/reg',function(req,res){
	var username = req.body.username,password = req.body.password,passwordRepeat = req.body.passwordRepeat;
	if(password != passwordRepeat){
		console.log('两次输入密码不一致！');
		return res.redirect('/reg');
	}
	User.findOne({username:username},function(err,user){
		if(err){
			console.log(err);
			return res.redirect('/reg');
		}
		if(user){
			console.log('用户名已经存在');
			return res.redirect('/reg');
		}
		var md5 = crypto.createHash('md5'),md5password = md5.update(password).digest('hex');
		var newUser = new User({
			username : username,
			password : md5password
		});
		newUser.save(function(err,doc){
			if(err){
				console.log(err);
				return res.redirect('/reg');
			}
			console.log('注册成功');
			newUser.password = null;
			delete newUser.password;
			req.session.user = newUser;
			return res.redirect('/');
		})
	})
});


//登陆判断
app.get('/',checkLogin.login);
//登陆
app.get('/login',function(req,res){
	res.render('login',{title:'登陆',user:req.session.user,page:'login'});
});
app.post('/login',function(req,res){
	var username = req.body.username,password = req.body.password;
	User.findOne({username:username},function(err,user){
		if(err){
			console.log(err);
			return next(err);
		}
		if(!user){
			console.log('用户名不存在!');
			return res.redirect('/login');
		}
		//对密码进行md5加密
		var md5 = crypto.createHash('md5'),md5password = md5.update(password).digest('hex');
		if(user.password !== md5password){
			console.log('密码错误！');
			return res.redirect('/login');
		}
		console.log('登陆成功！');
		user.password = null;
		delete user.password;
		req.session.user = user;
		return res.redirect('/');
	})
})

app.get('/quit',function(req,res){
	console.log('退出成功');
	req.session.destroy();//删除登陆信息
	return res.redirect('/login');
});

//登陆判断
app.get('/',checkLogin.noLogin);
app.get('/post',function(req,res){
	res.render('post',{title:'发布',user:req.session.user});
});


//发布笔记
app.post('/post',function(req,res){
	var note = new Note({
		title : req.body.title,
		author : req.session.user.username,
		tag : req.body.tag,
		content : req.body.content
	});
	note.save(function(err,doc){
		if(err){
			console.log(err);
			return res.redirect('/post');
		}
		console.log('文章发表成功!');
		return res.redirect('/');
	})
});


//登陆判断
app.get('/',checkLogin.noLogin);
//笔记详情页
app.get('/detail/:_id',function(req,res){
	Note.findOne({_id : req.params._id}).exec(function(err,art){
		if(err){
			console.log(err);
			return res.redirect('/');
		}
		if(art){
			res.render('detail',{title:'笔记详情',user:req.session.user,art:art,/*moment:moment*/});

		}
	})
});



 app.get('*',function(req,res){
	res.render('404');
}) 
//添加端口监听
app.listen(8088,function(req,res){
	console.log('app is running at port 8088');
});
