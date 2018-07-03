/**
 * Created by Jerry on 2018/7/2.
 */
var Sequelize = require('sequelize');
var User = sequelize.define('User', {
    // auto increment, primaryKey, unique
    user_id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},
    user_password : {type : Sequelize.STRING},
    user_name : {type : Sequelize.STRING},
    user_phone : {type : Sequelize.STRING},
    user_email : {type : Sequelize.STRING},
    user_duty : {type : Sequelize.STRING}
});
module.exports=User;