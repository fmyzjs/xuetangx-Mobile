/*
* Course 
*/
var fs = require('fs');
var respon = function(res, str, code){
	res.writeHead(code, {"Content-Type":"application/json"});
	res.write(JSON.stringify(str));
	res.end();
};
var checkKey = function(req, res){
}
exports.enrollment = function(req, res) {
	var key = req.headers['x-edx-api-key'];
	var access = req.headers['authorization'];
	console.log(access);
	if(key != '1234567890' || access .length < 10){
		console.log('fail');
		res.writeHead(403, {"Content-Type":"application/json"});
		res.end();
		return;
	}
	var coursename = req.params.username;
	fs.readFile('coursedata', 'utf-8', function(err,data){
		var datas = data.split(/\n/);
		for(var item in datas){
			console.log(item);
			if(datas[item] == coursename) {
				fs.readFile('data/' + access, 'utf-8', function(err,data){
					if (err) {
						console.log(err);
						respon(res,"", 500);
					}else{
						var allcourse = data.split(/\n/);
						for(var i in allcourse){
							if (allcourse[i] == coursename){
								res.writeHead(200, {"Content-Type:":"application/json"});
								res.end();
								return;
							}
						}
						fs.appendFile('data/' + access, coursename+"\n", "utf-8", function(err){
							if(err){
								console.log(err);
							respon(res,"", 500);
							}else{
								res.writeHead(200, {"Content-Type:":"application/json"});
								res.end();
							}
						});
					}
				});
				
				return;
			}
		}
		var back = {
			err_type: 'CourseDoesNotExist',
			err_msg: 'Couse does not exist'
		};
		console.log(JSON.stringify(back));
		respon(res, back, 400);
		return;
		
		
	});
};
exports.unenroll = function(req, res) {
	var key = req.headers['x-edx-api-key'];
	var access = req.headers['authorization'];
	if(key != '1234567890' || access .length < 10){
		res.writeHead(403, {"Content-Type":"application/json"});
		res.end();
		return;
	}
	var coursename = req.params.username;
	fs.readFile('data/'+access, 'utf-8', function(err, data) {
		var datas = data.split(/\n/);
		for(var i = datas.length; i --; ) {
			if(datas[i] == coursename) {
				var backContent = '';
				for(var j = datas.length; j --;){
					if(j != i && datas[j] != '' && datas[j] != '\n'){
						backContent = backContent + datas[j] + '\n';
					}
				}
				fs.writeFile('data/' + access, backContent, "utf-8", function(err) {
					if(err){
						console.log(err);
						respon(res, "",500);
					}else{
						res.writeHead(200, {"Content-Type:":"application/json"});
						res.end();
					}
				});
				return;
			}
		}
		var back = {
			err_type: 'UserNotEnrolled',
			err_msg: 'User is  not enrolled in course'
		};
		respon(res, back, 403);
		return ;
	});
};
