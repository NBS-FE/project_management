var projectModel=require('../model/project')
var projectUrlModel=require('../model/project_url')

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

exports.queryList=function (req, res, next) {
    projectModel.findAndCountAll({include: [{
        model: projectUrlModel
    }]}).then(function (result) {
		var resultData=undefined;
		if(result!=null){
            resultData={
                projectList:result.rows,
				count:result.count
			}
		}
        jsonWrite(res, resultData);
    })


}

