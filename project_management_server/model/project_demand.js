/**
 * Created by Jerry on 2018/7/2.
 */

var Sequelize = require('sequelize');
var sequelize=require('../conf/db')
var ProjectDemand = sequelize.define('ProjectDemand', {
    demand_id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},
    demand_title : {type : Sequelize.STRING},
    demand_content : {type : Sequelize.STRING},
    demand_creator : {type : Sequelize.STRING},
    demand_create_time : {type : Sequelize.STRING},
    demand_status : {type : Sequelize.STRING},
    project_id : {type : Sequelize.INTEGER}
},{
    timestamps: false,
    underscored: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'tb_project_demand',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});
module.exports=ProjectDemand;