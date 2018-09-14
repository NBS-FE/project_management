var moment = require('moment');
var projectConferenceModel=require('../model/project_conference')
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
exports.insertProjectConference=function (req, res, next) {
    var conferenceData=req.body;
    conferenceData.conference_creator=req.session.user.user_id;
    conferenceData.conference_create_time=moment().format('YYYY-MM-DD HH:mm:ss');
    projectConferenceModel.create(conferenceData)
        .then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    conference:result,
                    count:result.count
                }
            }
            if(req.files!=null&&req.files.length>0){
                var uploadList=[];
                req.files.forEach(function (defile) {

                    var fupload={
                        file_upload_name:defile.originalname,
                        file_upload_type:6,
                        file_upload_type_id:result.conference_id,
                        file_upload_creator:req.session.user.full_name,
                        file_upload_create_time:new Date(),
                        file_upload_url:"uploads/conference/"+defile.filename,
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
        console.log('project/insertProjectConference error:' + err)
    })

}
exports.getProjectConferenceList=function (req, res, next) {
    var projectId=req.query.project_id;
    if(projectId!=null&&projectId.length>0){
    projectConferenceModel.findAndCountAll({where:{project_id:projectId},offset:(req.query.currentPage-1)*10,limit:10}).then(function (result) {
        var resultData=undefined;
        if(result!=null){
            resultData={
                projectConferenceList:result.rows,
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
exports.updateProjectConference=function (req, res, next) {

    var conferenceData=req.body;
    if(conferenceData.conference_create_time!=null){
        conferenceData.conference_create_time=moment(conferenceData.conference_create_time).format('YYYY-MM-DD HH:mm:ss')
    }else {
        conferenceData.conference_create_time=moment().format('YYYY-MM-DD HH:mm:ss')
    }
    conferenceData.conference_time=moment(conferenceData.conference_time).format('YYYY-MM-DD HH:mm:ss')
    projectConferenceModel.update(conferenceData,{where:{conference_id:conferenceData.conference_id}})
        .then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    conference:result,
                }
            }
            if(req.files!=null&&req.files.length>0){
                var uploadList=[];
                req.files.forEach(function (defile) {

                    var fupload={
                        file_upload_name:defile.originalname,
                        file_upload_type:6,
                        file_upload_type_id:conferenceData.conference_id,
                        file_upload_creator:req.session.user.full_name,
                        file_upload_create_time:new Date(),
                        file_upload_url:"uploads/conference/"+defile.filename,
                        project_id:conferenceData.project_id
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
exports.deleteProjectConferenece=function (req, res, next) {
    var conferenceId=req.body.conference_id;
    projectConferenceModel.destroy({where:{conference_id:conferenceId}})
        .then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    conference:result,
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
exports.getProjectConferenceInfo=function (req, res, next) {
    var conferenceId=req.query.conference_id;
    if(conferenceId!=null&&conferenceId.length>0){
        projectConferenceModel.findOne({include: [{
            model: fileUploadModel,
             where:{file_upload_type:6,file_upload_type_id:conferenceId},
            required: false
        }],where:{conference_id:conferenceId}}).then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    projectConferenceInfo:result
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