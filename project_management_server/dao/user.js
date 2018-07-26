var userModel=require('../model/user')

var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: '操作失败'
        });
    } else {
    	ret.code=0;
        res.json(ret);
    }
};

/*exports.queryList=function (req, res, next) {
	userModel.findAndCountAll().then(function (result) {
		var resultData=undefined;
		if(result!=null){
            resultData={
            	userList:result.rows,
				count:result.count
			}
		}
        jsonWrite(res, resultData);
    })
}*/

module.exports = {
    queryList:function (req, res, next) {
        var params = req.query;
        console.log(params.currentPage);
        userModel.findAndCountAll({offset:(params.currentPage-1)*10,limit:10}).then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    userList:result.rows,
                    count:result.count
                }
            }
            jsonWrite(res, resultData);
        })
    },
    login:function(req, res, next){
        var params = req.body;
        userModel.findOne({where:{user_name:params.user_name,user_password:params.user_password}}).then(function(result){
            var resultData=undefined;
            if(result!=null){
                // req.session.userObj = result.dataValues;
                resultData= {
                    user: result
                }
                console.log(req.session);
            }
            jsonWrite(res, resultData);
        })
    },
    register:function(req, res, next){
        var params = req.body;
        userModel.create({user_name:params.user_name,user_phone:params.user_phone,user_email:params.user_email,user_password:params.user_password}).then(function(result){
            var resultData=undefined;
            if(result!=null){
                resultData={
                    userList:result.rows,
                    count:result.count
                }
            }
            jsonWrite(res, resultData);
        })
    },
    updateUser:function (req, res, next) {
        var params = req.body;
        userModel.update(params,{where:{user_id:params.user_id}}).then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    userList:result.rows,
                    count:result.count
                }
            }
            jsonWrite(res, resultData);
        })
    },
    deleteUser:function (req, res, next) {
        var params = req.body;
        userModel.destroy({where:{user_id:params.user_id}}).then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    userList:result.rows,
                    count:result.count
                }
            }
            jsonWrite(res, resultData);
        })
    },
    logOut:function (req, res, next) {
        // delete req.session.userObj;
        var resultData = {
            value:1
        };
        jsonWrite(res, resultData);
    }
}





