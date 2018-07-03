/**
 * Created by Jerry on 2018/7/2.
 */
/*module.exports = {
    mysql: {
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database:'project_management', // 前面建的user表位于这个数据库中
        port: 3306
    }
};*/

const Sequelize = require('sequelize');
const sequelize = new Sequelize('project_management', 'root', 'root', {
    host: '127.0.0.1',
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
    console.log("数据库连接成功");
}).catch(function(err) {
    //数据库连接失败时打印输出
    console.error(err);
    throw err;
});

exports.sequelize = sequelize;
exports.Sequelize = Sequelize;