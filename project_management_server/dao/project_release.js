var moment = require('moment');
var projectReleaseModel=require('../model/project_release')
var userModel=require('../model/user')
var fileUploadModel=require('../model/file_upload')
var releaseCreator={association: projectReleaseModel.belongsTo(userModel, { foreignKey: 'release_creator',as:'releaseCreator'})}
var releaseVerifier={association: projectReleaseModel.belongsTo(userModel, { foreignKey: 'release_verifier',as:'releaseVerifier'})}
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
exports.insertProjectRelease=function (req, res, next) {
    var releaseData=req.body;
    releaseData.release_creator=req.session.user.user_id;
    releaseData.release_create_time=moment().format('YYYY-MM-DD HH:mm:ss');
    var resultData=undefined;
    projectReleaseModel.create(releaseData)
        .then(function (result) {
            if(result!=null){
                resultData= {
                    projectRelease:result
                }
            }
            jsonWrite(res, resultData);
        }).catch(function (err) {
        console.log('project/insertProjectRelease error:' + err)
    })

}
exports.getProjectReleaseList=function (req, res, next) {
    var projectId=req.query.project_id;
    if(projectId!=null&&projectId.length>0){

        projectReleaseModel.findAndCountAll({include:[releaseCreator,releaseVerifier],where:{project_id:projectId},offset:(req.query.currentPage-1)*10,limit:10}).then(function (result) {
        var resultData=undefined;
        if(result!=null){
            resultData={
                projectReleaseList:result.rows,
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
exports.updateProjectRelease=function (req, res, next) {
    var releaseData=req.body;
    releaseData.release_create_time=moment(releaseData.release_create_time).format('YYYY-MM-DD HH:mm:ss')
    projectReleaseModel.update(releaseData,{where:{release_id:releaseData.release_id}})
        .then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    projectRelease:result,
                }
            }
            jsonWrite(res, resultData);
        }).catch(function (err) {
        console.log('project/updateProjectRelease error:' + err)
    })

}
/**
 * 删除项目网址
 * @param req
 * @param res
 * @param next
 */
exports.deleteProjectRelease=function (req, res, next) {
    var releaseId=req.body.release_id;
    projectReleaseModel.destroy({where:{release_id:releaseId}})
        .then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    projectRelease:result
                }
            }
            jsonWrite(res, resultData);
        }).catch(function (err) {
        console.log('project/deleteProjectRelease error:' + err)
    })
}
/**
 * 获取项目需求基本信息
 * @param req
 * @param res
 * @param next
 */
exports.getProjectReleaseInfo=function (req, res, next) {
    var releaseId=req.query.release_id;
    if(releaseId!=null&&releaseId.length>0){
        projectReleaseModel.findOne({include:[releaseCreator,releaseVerifier],where:{release_id:releaseId}}).then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    projectRelease:result
                }
            }
            jsonWrite(res, resultData);
        })
    }else {
        res.json({
            code:'1',
            msg: '参数bug_id不能为空！！'
        });
    }

}
/**
 * 新增发布附件
 * @param req
 * @param res
 * @param next
 */
exports.addProjectReleaseFile=function (req, res, next) {

    var releaseData=req.body;
    var resultData=null;
    if(req.files!=null&&req.files.length>0){
        var uploadList=[];
        req.files.forEach(function (defile) {

            var fupload={
                file_upload_name:defile.originalname,
                file_upload_type:releaseData.file_type,
                file_upload_type_sub:releaseData.file_type_sub,
                file_upload_type_id:releaseData.file_type_id,
                file_upload_creator:req.session.user.full_name,
                file_upload_create_time:new Date(),
                file_upload_url:"uploads/release/"+defile.filename,
                project_id:releaseData.project_id
            }
            uploadList.push(fupload)

        })

        fileUploadModel.bulkCreate(uploadList).then(function (fileResult) {

            if(fileResult!=null){
                resultData={
                    fileList:fileResult
                }
            }
            jsonWrite(res, resultData);
        })
    }else {
        jsonWrite(res, resultData);
    }
}
/**
 * 获取项目需求基本信息
 * @param req
 * @param res
 * @param next
 */
exports.getProjectReleaseFileList=function (req, res, next) {
    var releaseId=req.query.release_id;
    if(releaseId!=null&&releaseId.length>0){
        fileUploadModel.findAndCountAll({where:{file_upload_type_id:releaseId,file_upload_type:5}}).then(function (result) {
            var resultData=undefined;
            if(result!=null){
                var fList=result.rows;
                if(fList!=null&&fList.length>0){
                    var originalList=[],latestList=[];
                   fList.forEach(function (file) {
                       if(file.file_upload_type_sub==1){
                           originalList.push(file)
                       }else  if(file.file_upload_type_sub==2){
                           latestList.push(file)
                       }
                   })
                    resultData={
                        originalFileList:originalList,
                        latestFileList:latestList,
                        count:result.count
                    }
                }

            }
            jsonWrite(res, resultData);
        })
    }else {
        res.json({
            code:'1',
            msg: '参数bug_id不能为空！！'
        });
    }

}