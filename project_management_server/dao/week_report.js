/**
 * Created by qing on 2018/7/23.
 */
var weekReportModel = require('../model/week_report')
var weekDetail = require('../model/week_detail')

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
    weekReportModel.findAndCountAll().then(function (result) {
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

exports.getRecordList = function (req, res, next) {
    var params = req.body;
    weekDetail.findAndCountAll({where:{week_id:params.week_id}}).then(function (result) {
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
    weekDetail.update({where:{wd_id:params.wd_id}}).then(function (result) {
        var resultData=undefined;
        if(result!=null){
            resultData={
                count:result.count
            }
            jsonWrite(res, resultData);
        }
    })
}


