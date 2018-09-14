/**
 * Created by Jerry on 2018/7/2.
 */

var Sequelize = require('sequelize');
var sequelize=require('../conf/db');
var fileUploadModel=require('../model/file_upload');
var ConferenceDemand = sequelize.define('ConferenceDemand', {
    conference_id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},
    conference_title : {type : Sequelize.STRING},
    conference_content : {type : Sequelize.STRING},
    conference_creator : {type : Sequelize.STRING},
    conference_create_time : {type : Sequelize.STRING},
    conference_time : {type : Sequelize.STRING},
    conference_member : {type : Sequelize.STRING},
    project_id : {type : Sequelize.INTEGER}
},{
    timestamps: false,
    underscored: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'tb_project_conference',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});
ConferenceDemand.hasMany(fileUploadModel, {foreignKey:'file_upload_type_id', targetKey:'conference_id'});
module.exports=ConferenceDemand;