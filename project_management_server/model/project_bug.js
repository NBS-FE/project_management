/**
 * Created by Jerry on 2018/7/2.
 */

var Sequelize = require('sequelize');
var sequelize=require('../conf/db')
var ProjectBug = sequelize.define('ProjectBug', {
    bug_id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},
    bug_title : {type : Sequelize.STRING},
    bug_level : {type : Sequelize.STRING},
    bug_priority : {type : Sequelize.STRING},
    bug_content : {type : Sequelize.STRING},
    bug_handler : {type : Sequelize.STRING},
    bug_creator : {type : Sequelize.STRING},
    bug_create_time : {type : Sequelize.STRING},
    bug_status : {type : Sequelize.STRING},
    project_id : {type : Sequelize.INTEGER}
},{
    timestamps: false,
    underscored: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'tb_project_bug',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});
module.exports=ProjectBug;