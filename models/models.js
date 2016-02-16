var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//定义数据模型

//用户信息
var userSchema = new Schema({
	username : String,
	password  : String,
	email : String,
	createTime : {
		type : Date,
		default : Date.now
	}
});
exports.User = mongoose.model('User',userSchema);

//笔记数据
var noteSchema = new Schema({
	title : String,
	author : String,
	tag : String,
	content : String,
	createTime : {
		type : Date,
		default : Date.now
	}
});
exports.Note = mongoose.model('Note',noteSchema);