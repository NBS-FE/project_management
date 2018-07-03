/**
 * Created by Jerry on 2018/7/2.
 */
const Sequelize = require('sequelize');
var sequelize = new Sequelize('project_management', 'root', '123456', {
    host: '192.168.1.227',
    port : '3306',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});


//测试数据库链接
sequelize.authenticate().then(function() {
    console.log("Database connection successful");
}).catch(function(err) {
    //数据库连接失败时打印输出
    console.error(err);
    throw err;
});

 module.exports = sequelize;


