
var projectDemandModel=require('../model/project_demand')

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
 * 新增项目
 * @param req
 * @param res
 * @param next
 */
exports.insertProjectDemand=function (req, res, next) {
    var demandData=req.body;
    projectDemandModel.create(demandData)
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
        console.log('project/insertProjectDemand error:' + err)
    })

}
exports.getProjectDemandList=function (req, res, next) {
    var projectId=req.query.project_id;
    if(projectId!=null&&projectId.length>0){
    projectDemandModel.findAndCountAll({where:{project_id:projectId}}).then(function (result) {
        var resultData=undefined;
        if(result!=null){
            resultData={
                projectDemandList:result.rows,
                count:result.count
            }
        }
        jsonWrite(res, resultData);
    })}else {
        res.json({
            code:'1',
            msg: '参数project_id不能为空！！'
        });
    }
}

/**
 * 修改项目基本信息
 * @param req
 * @param res
 * @param next
 */
exports.updateProjectUrl=function (req, res, next) {
    var urlData=req.body;
    projectUrlModel.update(urlData,{where:{project_url_id:urlData.project_url_id}})
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
        console.log('project/updateProjectUrl error:' + err)
    })

}
/**
 * 删除项目网址
 * @param req
 * @param res
 * @param next
 */
exports.deleteProjectDemand=function (req, res, next) {
    var demandId=req.body.demand_id;
    projectDemandModel.destroy({where:{demand_id:demandId}})
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
        console.log('project/deleteProjectUrl error:' + err)
    })

}
/**
 * 获取项目需求基本信息
 * @param req
 * @param res
 * @param next
 */
exports.getProjectDemandInfo=function (req, res, next) {
    var demandId=req.query.demand_id;
    if(demandId!=null&&demandId.length>0){
        projectDemandModel.findOne({
            where:{demand_id:demandId}}).then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    projectDemandInfo:result
                }
            }
            jsonWrite(res, resultData);
        })
    }else {
        res.json({
            code:'1',
            msg: '参数demand_id不能为空！！'
        });
    }

}