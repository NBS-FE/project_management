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

exports.treeProjectList = function(req, res, next){
    var allMenu= [];
    function treeNode(module_id, parent_id, module_name, module_developer, project_id, children) {
        this.module_id = module_id;
        this.parent_id = parent_id;
        this.module_name = module_name;
        this.project_id = project_id;
        this.module_developer = module_developer;
        this.children = children;
    }
    function getDFSTree(data, pid) {
        var treelist = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].parent_id == pid) {
                var tree = new treeNode(data[i].module_id,
                    data[i].parent_id,
                    data[i].module_name,
                    data[i].module_developer,
                    data[i].project_id,
                    getDFSTree(data, data[i].module_id));
                treelist.push(tree);
            }
        }
        return treelist;
    }
    projectModuleModel.findAndCountAll().then(function(result){
        if(result!=null){
            allMenu = result.rows;
            var tree = getDFSTree(allMenu, 0);
            var resultData = {
                treeList: tree
            }
            jsonWrite(res, resultData);
        }
    })

}