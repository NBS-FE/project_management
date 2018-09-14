
var projectDemandModel=require('../model/project_demand')
var fileUploadModel=require('../model/file_upload')

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
    demandData.demand_creator=req.session.user.user_id;
    projectDemandModel.create(demandData)
        .then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    projectList:result.rows,
                    count:result.count
                }
            }
            if(req.files!=null&&req.files.length>0){
                var uploadList=[];
                req.files.forEach(function (defile) {

                    var fupload={
                        file_upload_name:defile.originalname,
                        file_upload_type:3,
                        file_upload_type_id:result.demand_id,
                        file_upload_creator:req.session.user.full_name,
                        file_upload_create_time:new Date(),
                        file_upload_url:"uploads/"+defile.filename,
                        project_id:result.project_id
                    }
                    uploadList.push(fupload)

                })

                fileUploadModel.bulkCreate(uploadList).then(function (fileResult) {
                    jsonWrite(res, resultData);
                })
            }else {
                jsonWrite(res, resultData);
            }

            //jsonWrite(res, resultData);
        }).catch(function (err) {
        console.log('project/insertProjectDemand error:' + err)
    })

}
exports.getProjectDemandList=function (req, res, next) {
    var projectId=req.query.project_id;
    if(projectId!=null&&projectId.length>0){
    projectDemandModel.findAndCountAll({where:{project_id:projectId},offset:(req.query.currentPage-1)*10,limit:10}).then(function (result) {
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
exports.updateProjectDemand=function (req, res, next) {

    var demandData=req.body;
    projectDemandModel.update(demandData,{where:{demand_id:demandData.demand_id}})
        .then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    projectList:result.rows,
                    count:result.count
                }
            }
            if(req.files!=null&&req.files.length>0){
                var uploadList=[];
                req.files.forEach(function (defile) {

                    var fupload={
                        file_upload_name:defile.originalname,
                        file_upload_type:3,
                        file_upload_type_id:demandData.demand_id,
                        file_upload_creator:req.session.user.full_name,
                        file_upload_create_time:new Date(),
                        file_upload_url:"uploads/"+defile.filename,
                        project_id:demandData.project_id
                    }
                    uploadList.push(fupload)

                })

                fileUploadModel.bulkCreate(uploadList).then(function (fileResult) {
                    jsonWrite(res, resultData);
                })
            }else {
                jsonWrite(res, resultData);
            }

        }).catch(function (err) {
        console.log('project/updateProjectDemand error:' + err)
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
        projectDemandModel.findOne({include: [{
            model: fileUploadModel,
             where:{file_upload_type:3},
            required: false
        }],where:{demand_id:demandId}}).then(function (result) {
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