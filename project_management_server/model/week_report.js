/**
 * Created by qing on 2018/7/20.
 */
var Sequelize = require('sequelize');
var sequelize=require('../conf/db');
var weekReport = sequelize.define('weekReport', {
    week_report_id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},
    report_title : {type : Sequelize.STRING},
    report_time : {type : Sequelize.STRING},
},{
    timestamps: false,
    underscored: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'tb_week_report',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});
module.exports=weekReport;