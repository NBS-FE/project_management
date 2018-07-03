/**
 * Created by Jerry on 2018/7/2.
 */

var Sequelize = require('sequelize');
var sequelize=require('../conf/db')
var Project = sequelize.define('Project', {
    project_id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},
    project_name : {type : Sequelize.STRING},
    project_company : {type : Sequelize.STRING},
    project_begin : {type : Sequelize.STRING},
    project_end : {type : Sequelize.STRING},
    project_version : {type : Sequelize.STRING},
    project_developer : {type : Sequelize.STRING},
    project_status : {type : Sequelize.STRING},
    project_desc : {type : Sequelize.STRING}
},{
    timestamps: false,
    underscored: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'tb_project',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});
module.exports=Project;