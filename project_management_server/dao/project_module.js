/**
 * Created by qing on 2018/7/9.
 */
var projectModuleModel = require('../model/project_module')

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

exports.insertModule = function(req, res, next){
    var urlData=req.body;
    projectModuleModel.create(urlData).then(function(result){
        var resultData=undefined;
        if(result!=null){
            resultData={
                projectList:result.rows,
                count:result.count
            }
            jsonWrite(res, resultData);
        }
    })
}

exports.queryList = function(req, res, next){
    projectModuleModel.findAndCountAll().then(function(result){
        var resultData=undefined;
        if(result!=null){
            resultData={
                projectList:result.rows,
                count:result.count
            }
            jsonWrite(res, resultData);
        }
    })
}

exports.updateModel = function(req, res, next){
    var urlData=req.body;
    projectModuleModel.update(urlData,
        {where:{module_id:urlData.module_id}}).then(function(result){
        var resultData=undefined;
        if(result!=null){
            resultData={
                projectList:result.rows,
                count:result.count
            }
            jsonWrite(res, resultData);
        }

    })
}

exports.deleteModel = function(req, res, next){
    var module_id = req.body.module_id;
    projectModuleModel.destroy({where:{module_id:module_id}}).then(function(result){
        var resultData=undefined;
        if(result!=null){
            resultData={
                projectList:result.rows,
                count:result.count
            }
            jsonWrite(res, resultData);
        }
    })
}

exports.parentProjectList = function(req, res, next){
    projectModuleModel.findAll({where:{parent_id:0}}).then(function(result){
        var resultData=undefined;
        if(result!=null){
            resultData={
                parentList:result
            }
            jsonWrite(res, resultData);
        }
    })
}

