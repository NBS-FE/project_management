var express = require('express');
var router = express.Router();
var projectDao=require('../dao/project')
var projectUrlDao=require('../dao/project_url')
var projectModuleDao = require('../dao/project_module')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a project');
});

//获取项目列表
router.get('/getProjectList', function(req, res, next) {
    projectDao.queryList(req, res, next);
});
//新增项目
router.post('/addProject', function(req, res, next) {
    projectDao.insertProject(req, res, next);
});
//修改项目
router.post('/updateProject', function(req, res, next) {
    projectDao.updateProject(req, res, next);
});
//获取项目详情
router.get('/getProjectInfo', function(req, res, next) {
    projectDao.getProjectInfo(req, res, next);
});
//新增URL
router.post('/addProjectUrl', function(req, res, next) {
    projectUrlDao.insertProjectUrl(req, res, next);
});
//修改URL
router.post('/updateProjectUrl', function(req, res, next) {
    projectUrlDao.updateProjectUrl(req, res, next);
});
//修改URL
router.post('/deleteProjectUrl', function(req, res, next) {
    projectUrlDao.deleteProjectUrl(req, res, next);
});
//添加项目模块
router.post('/addProjectModuel', function(req, res, next) {
    projectModuleDao.insertModule(req, res, next);
});

router.get('/projectModuelList', function(req, res, next) {
    projectModuleDao.queryList(req, res, next);
});

router.post('/updateProjectModuel', function(req, res, next) {
    projectModuleDao.updateModel(req, res, next);
});

router.post('/deleteProjectModuel', function(req, res, next) {
    projectModuleDao.deleteModel(req, res, next);
});






module.exports = router;
