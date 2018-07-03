// dao/userDao.js
// 实现与MySQL交互
var mysql = require('mysql');
var sequelize = require('../conf/db');
var $util = require('../util/util');
var $sql = require('./userSqlMapping');
var userModel=require('../model/user')

// 使用连接池，提升性能
var pool  = mysql.createPool($util.extend({}, $conf.mysql));

// 向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code:'1',
			msg: '操作失败'
		});
	} else {
		res.json(ret);
	}
};

module.exports = {
	queryList:function (req, res, next) {

    },
	add: function (req, res, next) {
		pool.getConnection(function(err, connection) {
			// 获取前台页面传过来的参数
			var param = req.query || req.params;

			// 建立连接，向表中插入值
			// 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
			connection.query($sql.insert, [param.name, param.age], function(err, result) {
				if(result) {
					result = {
						code: 0,
						msg:'增加成功'
					};    
				}

				// 以json形式，把操作结果返回给前台页面
				jsonWrite(res, result);

				// 释放连接 
				connection.release();
			});
		});
	},
	delete: function (req, res, next) {
		// delete by Id
		pool.getConnection(function(err, connection) {
			var id = +req.query.id;
			connection.query($sql.delete, id, function(err, result) {
				if(result.affectedRows > 0) {
					result = {
						code: 0,
						msg:'删除成功'
					};
				} else {
					result = void 0;
				}
				jsonWrite(res, result);
				connection.release();
			});
		});
	},
	update: function (req, res, next) {
		// update by id
		// 为了简单，要求同时传name和age两个参数
		var param = req.body;
		if(param.name == null || param.age == null || param.id == null) {
			jsonWrite(res, undefined);
			return;
		}

		pool.getConnection(function(err, connection) {
			connection.query($sql.update, [param.name, param.age, +param.id], function(err, result) {
				// 使用页面进行跳转提示
				if(result.affectedRows > 0) {
					res.render('suc', {
						result: result
					}); // 第二个参数可以直接在jade中使用
				} else {
					res.render('fail',  {
						result: result
					});
				}

				connection.release();
			});
		});
	},
    updatePass: function (req, res, next) {
        // update by id
        // 为了简单，要求同时传name和age两个参数
        var param = req.body;
        pool.getConnection(function(err, connection) {
            connection.query($sql.updatePass, [param.user_password,param.user_id], function(err, result) {
                if(result) {
                    result = {
                        code: 0,
                        msg:'修改成功'
                    };
                }

                // 以json形式，把操作结果返回给前台页面
                jsonWrite(res, result);

                // 释放连接
                connection.release();
            });
        });
    },
	queryById: function (req, res, next) {
		var user_id = +req.query.id; // 为了拼凑正确的sql语句，这里要转下整数
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryById, user_id, function(err, result) {
				jsonWrite(res, result);
				connection.release();

			});
		});
	},
	queryAll: function (req, res, next) {
		pool.getConnection(function(err, connection) {
			connection.query($sql.queryAll, function(err, result) {
				jsonWrite(res, result);
				connection.release();
			});
		});
	},
	login:function (req,res,next) {
        var param = req.body;
        if(param.user_name!=null&&param.user_password!=null)
		{
            pool.getConnection(function(err, connection) {
                connection.query($sql.login,[param.user_name,param.user_password], function(err, result) {
                    var resultData=result;
                    if(result!==undefined){
                        resultData= {
                            isLogin:result[0].count>0?true:false,
                            code: 0,
                            user:result[0]
                        }
                        if(result[0].count>0){
                            req.session.user = result[0];
						}
                    }
                    jsonWrite(res, resultData);
                    connection.release();
                });
            });
		}else {
            jsonWrite(res, undefined);
		}
    },
    register: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            // 获取前台页面传过来的参数
            var param = req.body ;

            // 建立连接，向表中插入值
            // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
            connection.query($sql.insert, [param.user_name, param.user_age,param.user_phone,param.user_email,param.user_password], function(err, result) {
                if(result) {
                    result = {
                        code: 0,
                        msg:'注册成功'
                    };
                }

                // 以json形式，把操作结果返回给前台页面
                jsonWrite(res, result);

                // 释放连接
                connection.release();
            });
        });
    },


};