/**
 * Created by Jerry on 2018/7/2.
 */

var Sequelize = require('sequelize');
var sequelize=require('../conf/db')
var ProjectUrl = sequelize.define('ProjectUrl', {
    project_url_id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},
    project_url_name : {type : Sequelize.STRING},
    project_url : {type : Sequelize.STRING},
    project_id : {type : Sequelize.INTEGER}
},{
    timestamps: false,
    underscored: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'tb_project_url',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});
module.exports=ProjectUrl;