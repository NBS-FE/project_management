/**
 * Created by qing on 2018/7/23.
 */
var express = require('express');
var router = express.Router();
var multer = require('multer')
var fs=require('fs')
var projectConferenceDao = require('../dao/project_conference')
var systemCofig=require('../conf/config')
var uploadFolder = systemCofig.fileUploadUrl+"uploads/conference/";

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});


// 创建文件夹
var createFolder = function(folder){
    try{
        // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
        // 如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder);
    }catch(e){
        // 文件夹不存在，以同步的方式创建文件目录。
        fs.mkdirSync(folder);
    }
};

createFolder(systemCofig.fileUploadUrl+"uploads/");
createFolder(uploadFolder);

var upload = multer({ storage: storage });
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a project');
});


//新增需求
router.post('/addProjectConference',upload.array('conferenceFile', 10), function(req, res, next) {
    projectConferenceDao.insertProjectConference(req, res, next);
});
//查询需求列表
router.get('/getProjectConferenceList', function(req, res, next) {
    projectConferenceDao.getProjectConferenceList(req, res, next);
});
router.post('/updateProjectConference',upload.array('conferenceFile', 10), function(req, res, next) {
    projectConferenceDao.updateProjectConference(req, res, next);
});
//删除需求
router.post('/deleteProjectConference', function(req, res, next) {
    projectConferenceDao.deleteProjectConferenece(req, res, next);
});
//获取需求详情
router.get('/getProjectConferenceInfo', function(req, res, next) {
    projectConferenceDao.getProjectConferenceInfo(req, res, next);
});


module.exports = router;
