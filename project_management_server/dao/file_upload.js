
var fileUploadModel=require('../model/file_upload')
var systemConfig=require('../conf/config')
var fs= require('fs');

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
 * 删除项目网址
 * @param req
 * @param res
 * @param next
 */
exports.deleteFile=function (req, res, next) {
    var fileUpload=req.body;
    fileUploadModel.destroy({where:{file_upload_id:fileUpload.file_upload_id}})
        .then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    fileUpload:result
                }
            }
            if(resultData!=null){
                var fileUrl=systemConfig.fileUploadUrl + fileUpload.file_upload_url
                fs.exists(fileUrl,function(exists){
                    if(exists){
                        fs.unlink(fileUrl)
                    }else{
                        console.log("文件不存在")
                    }
                })
            }
            jsonWrite(res, resultData);
        }).catch(function (err) {
        console.log('project/deleteFileUpload error:' + err)
    })

}
/**
 * 新增附件
 * @param req
 * @param res
 * @param next
 */
exports.addFile=function (req, res, next) {

    var fileData=req.body;
    var resultData=null;
    if(req.files!=null&&req.files.length>0){
        var uploadList=[];
        req.files.forEach(function (defile) {

            var fupload={
                file_upload_name:defile.originalname,
                file_upload_type:fileData.file_type,
                file_upload_type_sub:fileData.file_type_sub,
                file_upload_type_id:fileData.file_type_id,
                file_upload_creator:req.session.user.full_name,
                file_upload_create_time:new Date(),
                file_upload_url:"uploads/"+defile.filename,
                project_id:fileData.project_id
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

exports.getFileListByProjectId=function (req, res, next) {
    var projectId=req.query.project_id;
    if(projectId!=null&&projectId.length>0){
        fileUploadModel.findAndCountAll({where:{project_id:projectId},offset:(req.query.currentPage-1)*10,limit:10}).then(function (result) {
            var resultData=undefined;
            if(result!=null){
                resultData={
                    fileList:result.rows,
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