var express = require('express');
var multer = require('multer')
var fs=require('fs')
var router = express.Router();
var fileUploadDao=require('../dao/file_upload')
var systemCofig=require('../conf/config')

var uploadFolder=systemCofig.fileUploadUrl+"uploads/";
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

createFolder(uploadFolder);

var upload = multer({ storage: storage });
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//删除附件
router.post('/deleteFile', function(req, res, next) {
    fileUploadDao.deleteFile(req, res, next);
});
//新增附件
router.post('/addFile',upload.array('projectFile', 10), function(req, res, next) {
    fileUploadDao.addFile(req, res, next);
});
router.get('/getFileListByProjectId', function(req, res, next) {
    fileUploadDao.getFileListByProjectId(req, res, next);
});

module.exports = router;
