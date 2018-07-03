/**
 * Created by Jerry on 2018/7/2.
 */

var Sequelize = require('sequelize');
var sequelize=require('../conf/db')
var User = sequelize.define('User', {
    user_id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},
    user_password : {type : Sequelize.STRING},
    user_name : {type : Sequelize.STRING},
    user_phone : {type : Sequelize.STRING},
    user_email : {type : Sequelize.STRING},
    user_duty : {type : Sequelize.STRING}
},{
    timestamps: false,
    underscored: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'tb_user',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});
module.exports=User;