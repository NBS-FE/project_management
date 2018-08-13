var express = require('express');
var router = express.Router();
var fileUploadDao=require('../dao/file_upload')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//删除附件
router.post('/deleteFile', function(req, res, next) {
    fileUploadDao.deleteFile(req, res, next);
});
//新增附件
router.post('/addFile', function(req, res, next) {
    fileUploadDao.addFile(req, res, next);
});

module.exports = router;
