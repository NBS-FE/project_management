/**
 * Created by qing on 2018/7/23.
 */
var express = require('express');
var router = express.Router();
var multer = require('multer')
var fs=require('fs')
var projectReleaseDao = require('../dao/project_release')
var systemCofig=require('../conf/config')
var uploadFolder = systemCofig.fileUploadUrl+"uploads/release/";

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

//新增发布
router.post('/addProjectRelease', function(req, res, next) {
    projectReleaseDao.insertProjectRelease(req, res, next);
});
//查询发布列表
router.get('/getProjectReleaseList', function(req, res, next) {
    projectReleaseDao.getProjectReleaseList(req, res, next);
});
router.post('/updateProjectRelease', function(req, res, next) {
    projectReleaseDao.updateProjectRelease(req, res, next);
});
//删除发布
router.post('/deleteProjectRelease', function(req, res, next) {
    projectReleaseDao.deleteProjectRelease(req, res, next);
});
//获取发布详情
router.get('/getProjectReleaseInfo', function(req, res, next) {
    projectReleaseDao.getProjectReleaseInfo(req, res, next);
});
//获取文件类别
router.get('/getProjectReleaseFileList', function(req, res, next) {
    projectReleaseDao.getProjectReleaseFileList(req, res, next);
});
router.post('/addProjectReleaseFile',upload.array('releaseFile', 10), function(req, res, next) {
    projectReleaseDao.addProjectReleaseFile(req, res, next);
});

module.exports = router;
