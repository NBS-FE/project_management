/**
 * Created by qing on 2018/7/23.
 */
var weekReportModel = require('../model/week_report')
var weekDetail = require('../model/week_detail')
var userModel = require('../model/user')
var user = {
    association:weekDetail.belongsTo(userModel,{foreignKey:'user_id',as:'user'})
}

var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: '操作失败'
        });
    } else {
        ret.code=0;
        res.json(ret);
    }
};

exports.addWeek=function (req, res, next) {
    var params = req.body;
    weekReportModel.create(params).then(function(result){
        var resultData=undefined;
        if(result!=null){
            resultData={
                count:result.count
            }
            jsonWrite(res, resultData);
        }
    })
}

exports.queryWeekList=function (req, res, next) {
    weekReportModel.findAndCountAll({order: [['report_time', 'DESC']],offset:(req.query.currentPage-1)*10,limit:10}).then(function (result) {
        var resultData=undefined;
        if(result!=null){
            resultData={
                weekList:result.rows,
                count:result.count
            }
        }
        jsonWrite(res, resultData);
    })
}

exports.updateWeek = function (req, res, next) {
    var params = req.body;
    weekReportModel.update(params,{where:{week_report_id:params.week_report_id}}).then(function (result) {
        var resultData=undefined;
        if(result!=null){
            resultData={
                count:result.count
            }
        }
        jsonWrite(res, resultData);
    })
}

exports.weekDetail = function (req, res, next) {
    var params = req.body;
    weekReportModel.findOne({where:{week_report_id:params.week_report_id}}).then(function(result){
        var resultData=undefined;
        if(result!=null){
            resultData={
                week:result
            }
        }
        jsonWrite(res, resultData);
    })
}

exports.addWeekRecord = function (req, res, next) {
    var params = req.body;
    weekDetail.create(params).then(function (result) {
        var resultData=undefined;
        if(result!=null){
            resultData={
                count:result.count
            }
            jsonWrite(res, resultData);
        }
    })
}
exports.deleteWeekReport = function(req, res, next){
    var week_report_id = req.body.week_report_id;
    weekReportModel.destroy({where:{week_report_id:week_report_id}}).then(function(result){
        var resultData=undefined;
        if(result!=null){
            resultData={
                projectList:result,
            }
            jsonWrite(res, resultData);
        }
    })
}
exports.getRecordList = function (req, res, next) {
    var params = req.query.week_id;
    weekDetail.findAndCountAll({include:user,where:{week_id:params}}).then(function (result) {
        var resultData=undefined;
        if(result!=null){
            resultData={
                recordList:result.rows,
                count:result.count
            }
            jsonWrite(res, resultData);
        }
    })

}

exports.updateRecord = function (req, res, next) {
    var params = req.body;
    weekDetail.update(params,{where:{wd_id:params.wd_id}}).then(function (result) {
        var resultData=undefined;
        if(result!=null){
            resultData={
                count:result.count
            }
            jsonWrite(res, resultData);
        }
    })
}
exports.deleteRecord = function(req, res, next){
    var wd_id = req.body.wd_id;
    weekDetail.destroy({where:{wd_id:wd_id}}).then(function(result){
        var resultData=undefined;
        if(result!=null){
            resultData={
                projectList:result,
            }
            jsonWrite(res, resultData);
        }
    })
}


