var express = require('express');
var router = express.Router();
var userDao=require('../dao/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//获取用户列表
router.get('/getUserList', function(req, res, next) {
    userDao.queryList(req, res, next);
});

router.get('/register', function(req, res, next) {
    userDao.queryList(req, res, next);
});


module.exports = router;
