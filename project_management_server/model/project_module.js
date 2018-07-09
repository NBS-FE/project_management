/**
 * Created by qing on 2018/7/9.
 */
var Sequelize = require('sequelize');
var sequelize = require('../conf/db');
var project = require('../model/project');
var projectModule = sequelize.define('projectModule',{
    module_id : {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true,unique : true},
    module_name: {type: Sequelize.STRING},
    module_developer: {type: Sequelize.STRING}
},{
    timestamps: false,
    underscored: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'tb_project_module',
    charset: 'utf8',
    collate: 'utf8_general_ci'
})

projectModule.belongsTo(project,{foreignKey: 'project_id'});

module.exports=projectModule;