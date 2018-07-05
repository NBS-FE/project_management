var userModel=require('../model/user')

var jsonWrite = function (res, ret) {
    console.log(ret);
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
            jsonWrite(res, result);
        })
    },
    login:function(req, res, next){
        var params = req.body;
        userModel.findAll({where:{user_name:params.name,user_password:params.password}}).then(function (result){
            console.log(result);
            var resultData=undefined;
            if(result!=null){
                resultData={
                    projectList:result.rows,
                    count:result.count
                }
            }
            jsonWrite(res, resultData);
            // jsonWrite(res, result);
        })
    },

}

