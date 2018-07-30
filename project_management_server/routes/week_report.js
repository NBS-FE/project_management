/**
 * Created by qing on 2018/7/23.
 */
var express = require('express');
var router = express.Router();
var weekReportDao = require('../dao/week_report')

router.post('/addWeek',function (req, res, next) {
    weekReportDao.addWeek(req, res, next)
})

router.post('/updateWeek',function (req, res, next) {
    weekReportDao.updateWeek(req, res, next)
})

router.get('/queryWeekList',function (req, res, next) {
    weekReportDao.queryWeekList(req, res, next)
})

router.post('/weekDetail',function (req, res, next) {
    weekReportDao.weekDetail(req, res, next)
})

router.post('/addWeekRecord',function (req, res, next) {
    weekReportDao.addWeekRecord(req, res, next)
})
router.post('/deleteWeekReport',function (req, res, next) {
    weekReportDao.deleteWeekReport(req, res, next)
})
router.post('/getRecordList',function (req, res, next) {
    weekReportDao.getRecordList(req, res, next)
})

router.post('/updateRecord',function (req, res, next) {
    weekReportDao.updateRecord(req, res, next)
})

router.post('/deleteRecord',function (req, res, next) {
    weekReportDao.deleteRecord(req, res, next)
})


module.exports = router;
