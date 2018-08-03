var projectModel=require('../model/project')
var userModel=require('../model/user')
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
/**
 * 查询项目列表
 * @param req
 * @param res
 * @param next
 */
exports.queryList=function (req, res, next) {
    projectModel.findAndCountAll({include: [{
        model: projectUrlModel
    }],order: [['project_status', 'DESC']]}).then(function (result) {
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

/**
 * 新增项目
 * @param req
 * @param res
 * @param next
 */
exports.insertProject=function (req, res, next) {
    var projectData=req.body;
    projectModel.create(projectData)
        .then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    projectList:result.rows,
                    count:result.count
                }
            }
            jsonWrite(res, resultData);
        }).catch(function (err) {
        console.log('project/addProject error:' + err)
    })

}

/**
 * 新增项目
 * @param req
 * @param res
 * @param next
 */
exports.updateProject=function (req, res, next) {
    var projectData=req.body;
    projectModel.update(projectData,
        {where:{project_id:projectData.project_id}})
        .then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    projectList:result.rows,
                    count:result.count
                }
            }
            jsonWrite(res, resultData);
        }).catch(function (err) {
        console.log('project/addProject error:' + err)
    })

}

/**
 * 获取项目基本信息
 * @param req
 * @param res
 * @param next
 */

exports.getProjectInfo=function (req, res, next) {
    var projectId=req.query.project_id;
    if(projectId!=null&&projectId.length>0){
        projectModel.findOne({include: [{
            model: projectUrlModel
        }],where:{project_id:projectId}}).then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    projectInfo:result
                }
            }
            var pdeveloper=result.project_developer;
            if(pdeveloper!=null&&pdeveloper.length>0){
               var pdeveloperList=pdeveloper.split(',');
                userModel.findAll({where:{user_id:{
                    $in:pdeveloperList
                }}}).then(function (dresult) {
                    resultData.developerList=dresult;
                    jsonWrite(res, resultData);
                })
            }else {
                jsonWrite(res, resultData);
            }



        })
    }else {
        res.json({
            code:'1',
            msg: '参数project_id不能为空！！'
        });
    }

}