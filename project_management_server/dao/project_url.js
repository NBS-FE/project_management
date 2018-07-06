
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
 * 新增项目
 * @param req
 * @param res
 * @param next
 */
exports.insertProjectUrl=function (req, res, next) {
    var urlData=req.body;
    projectUrlModel.create(urlData)
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
exports.deleteProjectUrl=function (req, res, next) {
    var urlId=req.body.project_url_id;
    projectUrlModel.destroy({where:{project_url_id:urlId}})
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
