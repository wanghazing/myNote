//用户已登陆时，不能通过输入url访问登陆和注册页面
function login(req,res,next){
	if(req.session.user){
		console.log('您已经登陆！');
		return res.redirect('back');
	}
	next();
}
//用户未登录时，不能通过输入url访问笔记列表页、笔记详情页和发布笔记页
function noLogin(req,res,next){
	if(!req.session.user){
		console.log('抱歉，你还没有登陆');
		return res.redirect('/login');
	}
	next();
}
exports.login = login;
exports.noLogin = noLogin;