
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
                try {
                    fs.unlink(systemConfig.fileUploadUrl + fileUpload.file_upload_url)
                }catch (e){
                    console.log(e)
                }
            }
            jsonWrite(res, resultData);
        }).catch(function (err) {
        console.log('project/deleteFileUpload error:' + err)
    })

}
