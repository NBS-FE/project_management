/**
 * Created by qing on 2018/7/23.
 */
var Sequelize = require('sequelize');
var sequelize=require('../conf/db');
var weekDetail = sequelize.define('weekDetail', {
    wd_id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},
    user_name : {type : Sequelize.STRING},
    content : {type : Sequelize.STRING},
    week_id: {type :Sequelize.INTEGER}
},{
    timestamps: false,
    underscored: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'tb_week_detail',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});

module.exports=weekDetail;