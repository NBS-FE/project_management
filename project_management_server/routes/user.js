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

router.post('/register', function(req, res, next) {
    userDao.register(req, res, next);
});

router.post('/updateUser', function(req, res, next) {
    userDao.updateUser(req, res, next);
});

router.post('/deleteUser', function(req, res, next) {
    userDao.deleteUser(req, res, next);
});

router.post('/login', function(req, res, next) {
    userDao.login(req, res, next);
});

router.get('/logOut', function(req, res, next) {
    userDao.logOut(req, res, next);
});


module.exports = router;
