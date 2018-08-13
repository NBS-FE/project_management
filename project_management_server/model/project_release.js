/**
 * Created by Jerry on 2018/7/2.
 */

var Sequelize = require('sequelize');
var sequelize=require('../conf/db')
var ProjectRelease = sequelize.define('ProjectRelease', {
    release_id : {type : Sequelize.INTEGER, autoIncrement : true, primaryKey : true, unique : true},
    release_type : {type : Sequelize.STRING},
    release_creator : {type : Sequelize.INTEGER},
    release_create_time : {type : Sequelize.STRING},
    release_time : {type : Sequelize.STRING},
    release_content : {type : Sequelize.STRING},
    release_project_name : {type : Sequelize.STRING},
    release_url : {type : Sequelize.STRING},
    release_is_backup : {type : Sequelize.STRING},
    release_verifier : {type : Sequelize.INTEGER},
    release_status : {type : Sequelize.STRING},
    project_id : {type : Sequelize.INTEGER}
},{
    timestamps: false,
    underscored: true,
    paranoid: true,
    freezeTableName: true,
    tableName: 'tb_project_release',
    charset: 'utf8',
    collate: 'utf8_general_ci'
});
//ProjectBug.belongsTo(User, { foreignKey: 'bug_creator'})
//ProjectBug.belongsTo(Users, { foreignKey: 'bug_handler'})
module.exports=ProjectRelease;