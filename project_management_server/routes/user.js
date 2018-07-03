var express = require('express');
var router = express.Router();
var userDao=require('./dao/user.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//获取用户列表
router.get('/getUserList', function(req, res, next) {
    userDao.add(req, res, next);
});

module.exports = router;
