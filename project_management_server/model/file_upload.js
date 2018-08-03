/**
 * Created by Jerry on 2018/7/2.
 */

var Sequelize = require('sequelize');
var sequelize=require('../conf/db')
var FileUpload = sequelize.define('FileUpload', {
    file_upload_id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},
    file_upload_name : {type : Sequelize.STRING},
    file_upload_type : {type : Sequelize.STRING},
    file_upload_type_id : {type : Sequelize.STRING},
    file_upload_creator : {type : Sequelize.STRING},
    file_upload_create_time : {type : Sequelize.STRING},
    file_upload_url : {type : Sequelize.STRING},

},{
    timestamps: false,
    underscored: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'tb_file_upload',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});
module.exports=FileUpload;