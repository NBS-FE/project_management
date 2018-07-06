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
    },
    login:function(req, res, next){
        var params = req.body;
        userModel.findAll({where:{user_name:params.user_name,user_password:params.user_password}}).then(function(result){
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
    }

}





