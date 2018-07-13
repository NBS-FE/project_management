/**
 * Created by Jerry on 2018/7/2.
 */

var Sequelize = require('sequelize');
var sequelize=require('../conf/db')
var ProjectBugRecord = sequelize.define('ProjectBugRecord', {
    bug_record_id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},
    bug_record_content : {type : Sequelize.STRING},
    bug_record_creator : {type : Sequelize.STRING},
    bug_record_create_time : {type : Sequelize.STRING},
    bug_record_status : {type : Sequelize.STRING},
    bug_record_receiver : {type : Sequelize.STRING},
    bug_id : {type : Sequelize.INTEGER}
},{
    timestamps: false,
    underscored: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'tb_project_bug_record',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});
module.exports=ProjectBugRecord;