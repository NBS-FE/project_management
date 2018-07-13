<template>
   <div>
     <div style="background: #eee;height:50px;line-height:50px;margin:-20px;" class="margin-bottom-20">
       <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block">
         <el-breadcrumb-item class="margin-left-20">项目模块</el-breadcrumb-item>
       </el-breadcrumb>
       <el-button style="float:right" class="margin-top-10 margin-right-20" size="small" type="primary" @click="moduleFormOpen('add')"  round>新增模块</el-button>
     </div>
     <!--<el-row>
       <el-button style="float:right"  type="primary" @click="moduleFormOpen('add')"  round>新增模块</el-button>
     </el-row>-->
     <tree-table  :data="projectList"  :columns="columns" border>
       <el-table-column label="操作">
         <template slot-scope="scope">
           <el-button type="primary" title="编辑" size="small" @click="moduleFormOpen('edit',scope.row)" icon="el-icon-edit" circle></el-button>
           <el-button type="danger" size="small" icon="el-icon-delete" @click="moduleDeleteOpen(scope.row.module_id)" circle></el-button>
           <el-button type="success" size="small" icon="el-icon-plus" @click="sonModuleFormOpen(scope.row.module_id)" circle></el-button>
         </template>
       </el-table-column>
     </tree-table>
     <el-table :data="projectList" border style="width: 100%;margin-top:10px;">
       <el-table-column label="序号" width="60" type="index"></el-table-column>
       <el-table-column prop="module_name" label="模块名称"></el-table-column>
       <el-table-column prop="module_developer" label="开发人员"></el-table-column>
       <el-table-column label="操作">
         <template slot-scope="scope">
           <el-button type="primary" title="编辑" size="small" @click="moduleFormOpen('edit',scope.row)" icon="el-icon-edit" circle></el-button>
           <el-button type="danger" size="small" icon="el-icon-delete" @click="moduleDeleteOpen(scope.row.module_id)" circle></el-button>
         </template>
       </el-table-column>
     </el-table>
     <el-dialog :title="dialogTitle" :visible.sync="dialogTableVisible">
       <el-form :model="modular"  :rules="rules" ref="modular" label-width="80px">
         <el-form-item label="模块名称">
           <el-input  placeholder="请输入模块名称" v-model="modular.module_name"></el-input>
         </el-form-item>
         <el-form-item label="模块名称">
           <el-select v-model="modular.parent_id" placeholder="请选择父模块名称">
             <el-option
               v-for="item in parentList"
               :key="item.module_id"
               :label="item.module_name"
               :value="item.module_id">
             </el-option>
           </el-select>
         </el-form-item>
         <el-form-item label="开发人员">
           <el-input  placeholder="请输入开发人员" v-model="modular.module_developer"></el-input>
         </el-form-item>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="dialogTableVisible = false">取消</el-button>
         <el-button type="primary" @click="projectSubmit">确定</el-button>
       </div>
     </el-dialog>
     <el-dialog title="删除项目模块" :visible.sync="dialogDeleteVisible">
       <div class="fs16 danger">
         确定要删除该项目模块吗？
       </div>
       <div slot="footer" class="dialog-footer">
         <el-button @click="dialogDeleteVisible = false">取消</el-button>
         <el-button type="primary" @click="deleteSubmit">确定</el-button>
       </div>
     </el-dialog>
     <el-dialog title="添加子模块" :visible.sync="dialogSonVisible">
       <el-form :model="sonmodular">
         <el-form-item label="子模块名称">
           <el-input  placeholder="请输入子模块名称" v-model="sonmodular.module_name"></el-input>
         </el-form-item>
         <el-form-item label="开发人员">
           <el-input  placeholder="请输入开发人员" v-model="sonmodular.module_developer"></el-input>
         </el-form-item>
       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click="dialogSonVisible = false">取消</el-button>
         <el-button type="primary" @click="projectSubmit('son')">确定</el-button>
       </div>
     </el-dialog>
   </div>


</template>
<script>
  import treeTable from '@/components/TreeTable'
  export default {
    components: { treeTable },
    data() {
      return {
        projectList: [],
        parentList: [],
        dialogDeleteVisible: false,
        dialogTableVisible: false,
        dialogSonVisible: false,
        dialogTitle:'添加项目模块',
        delId:'',
        modular: {
          module_name: '',
          module_developer:'',
          parent_id:''
        },
        sonmodular:{
          module_name: '',
          module_developer:''
        },
        rules: {
          module_name: [
            {required: true, message: '请输入项目名称', trigger: 'change'},
          ],
          module_developer: [
            {required: true, message: '请输入开发人员', trigger: 'change'}
          ]
        },
        columns:[
          {
              text:'模块名称',
              value:'module_name'
          },
          {
              text:'开发人员',
              value:'module_developer'
          }
        ]
      }
    },
    created(){
      this.getProjectList();
      this.getParentList();
    },
    methods :{
      getProjectList:function () {
        var vm=this;
        vm.$http({
          method: 'get',
          url: vm.config.baseUrl+'project/projectModuelList'
        }).then(function(response) {
          var data=response.data;
          vm.projectList=data.projectList
        }).catch(function(response){
          console.log(response)
        })
      },
      getParentList: function(){
          var vm=this;
          vm.$http({
            method: 'get',
            url: vm.config.baseUrl+'project/parentProjectList'
          }).then((response) => {
            var data=response.data;
            var status = data.code;
            console.log(this.parentList);
            if(status==0){
              this.parentList=data.parentList;
            }
          }).catch(function(response){
            console.log(response)
          })
      },
      moduleFormOpen:function (type,obj) {
        this.dialogTableVisible = true;
        this.objType = type;
        if(type=='edit'){
          this.modular = obj;
          this.dialogTitle = '修改项目模块';
        }else{
          this.modular = {
            module_name:'',
            module_developer:''
          };
          this.dialogTitle = '添加项目模块';
        }

      },
      sonModuleFormOpen:function(){
        this.dialogSonVisible = true;
        this.sonmodular = {
          module_name:'',
          module_developer:''
        };
      },
      moduleDeleteOpen:function(deleteId){
        this.dialogDeleteVisible = true;
        this.delId = deleteId;
      },
      projectSubmit:function (type) {
        var vm=this;
        vm.$refs['modular'].validate((valid) => {
          if (valid) {
           var projectInfo;
           /*if(type=='son'){
             projectInfo = this.sonmodular;
           }else{
             projectInfo = this.modular;
           }*/
            projectInfo = this.modular;
            projectInfo.project_id = this.$route.params.projectId;
            if(!projectInfo.parent_id){
              projectInfo.parent_id = 0;
            }
            console.log(projectInfo);
            var url = '';
            if(this.objType=='edit'){
              url = 'project/updateProjectModuel';
            }else{
              url = 'project/addProjectModuel';
            }
            vm.$http({
              method: 'POST',
              url: this.config.baseUrl + url,
              data: projectInfo
            }).then(function (data) {
              var result = data.data;
              var response = result.code;
              if (response == 0) {
                vm.dialogTableVisible = false;
                vm.$message({message: '提交成功！！', type: 'success'});
                vm.getProjectList()
              } else {
                vm.$message.error('提交失败！！');
              }
            })
          }
        })
      },
      deleteSubmit:function(){
        var vm=this;
        vm.$http({
          method: 'POST',
          url: this.config.baseUrl + 'project/deleteProjectModuel',
          data: {module_id:this.delId}
        }).then(function (data) {
          var result = data.data;
          var response = result.code;
          if (response == 0) {
            vm.dialogDeleteVisible = false;
            vm.$message({message: '删除成功！！', type: 'success'});
            vm.getProjectList()
          } else {
            vm.$message.error('删除失败！！');
          }
        })
      }
    }
  }
</script>
<style>
  .p-header{
    background-color: #324157;
    text-align: left;
  }
  .header-title{
    color: aliceblue;
    height: 60px;
    line-height: 60px;
    font-size: 23px;
    margin-left: 10px;
    letter-spacing:8px;
  }
 .project-list .el-table th{
    background-color: #efefef;
  }
  .project-list .el-table__expanded-cell{
    padding: 20px;
  }
  .add-project .el-dialog__body{
    padding:10px 20px;
  }
</style>
