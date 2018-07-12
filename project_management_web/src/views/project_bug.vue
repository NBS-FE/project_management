<template>
   <div >
     <div style="height:50px;background: #eee;margin: -20px;line-height: 50px" class="margin-bottom-20">
       <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block">
         <el-breadcrumb-item class="margin-left-20">缺陷记录</el-breadcrumb-item>
       </el-breadcrumb>
       <el-button type="success" class="margin-top-10 margin-right-20" size="small" style="float: right;" @click="demandFormOpen"  icon="el-icon-plus">新增缺陷</el-button>
     </div>

     <el-table
         :data="projectDemandList"
         border
         style="width: 100%">
         <el-table-column
           label="序号"
           width="60"
           type="index"
         >
         </el-table-column>
         <el-table-column
           prop="demand_title"
           label="需求标题"
           >
         </el-table-column>
         <el-table-column
           prop="demand_create_time"
           width="150"
           label="创建时间">
           <template slot-scope="scope" >
              {{scope.row.demand_create_time | dateFormat('YYYY-MM-DD')}}
           </template>
         </el-table-column>
         <el-table-column
           prop="demand_status"
           width="150"
           label="需求状态">
           <template slot-scope="scope" >
             <span :class="{'warning':scope.row.demand_status=='进行中','success':scope.row.demand_status=='已完成','danger':scope.row.demand_status=='已取消'}" >{{scope.row.demand_status}}</span>

           </template>
         </el-table-column>
         <el-table-column
           width="160"
           label="操作">
           <template slot-scope="scope" >
             <router-link :to="{ path: '/project/demanddetail/'+projectId+'/'+scope.row.demand_id}">
               <el-button icon="el-icon-search" size="small" type="primary">详情</el-button>
             </router-link>
             <!--<el-button type="primary" size="small" :to="{ path: '/project/demanddetail/'+scope.row.demand_id }" icon="el-icon-search">详情</el-button>-->
             <el-button type="danger" size="small" @click="demandDeleteOpen(scope.row.demand_id)" icon="el-icon-delete"></el-button>
           </template>
         </el-table-column>
       </el-table>
     <el-dialog class="demand-panel" width="900px" title="新增需求" :visible.sync="demandFormVisible" :close-on-click-modal="false"  >
       <el-form :model="demandForm" :rules="demandRules" label-width="80px"  ref="demandForm"  style="padding: 0 20px">
         <el-form-item label="需求标题" prop="demand_title" >
           <el-input  placeholder="请输入需求标题" v-model="demandForm.demand_title">
           </el-input>
         </el-form-item>

         <el-form-item label="创建时间" prop="demand_create_time" >
           <el-col :span="10">
             <el-date-picker style="width: 100%"
               v-model="demandForm.demand_create_time"
               type="date"
               placeholder="请选择创建时间">
             </el-date-picker>
           </el-col>
           <el-col  class="line text-right padding-right-10" :span="4">需求状态</el-col>
           <el-col :span="10">
             <el-select v-model="demandForm.demand_status" style="width: 100%" placeholder="请选择项目状态">
               <el-option
                 v-for="item in demandStatusOptions"
                 :key="item"
                 :label="item"
                 :value="item">
               </el-option>
             </el-select>
           </el-col>
         </el-form-item>
         <el-form-item label="需求内容"  prop="demand_content">
           <div class="demand-editor">
             <quill-editor
               style="height: 200px"
               v-model="demandForm.demand_content"
               ref="myQuillEditor"
               :options="editorOption"
               @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
               @change="onEditorChange($event)">
             </quill-editor>
           </div>

         </el-form-item>

       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click.native="demandFormVisible = false">取消</el-button>
         <el-button type="primary" @click.native="demandSubmit" >提交</el-button>
       </div>
     </el-dialog>
     <el-dialog class="delete-panel" width="400px" title="删除项目需求" :visible.sync="demandDeleteVisible" :close-on-click-modal="false"  >
       <div class="fs16 danger">
         确定要删除该项目需求吗？
       </div>
       <div slot="footer" class="dialog-footer">
         <el-button @click.native="demandDeleteVisible = false">取消</el-button>
         <el-button type="primary" @click.native="demandDelete" >提交</el-button>
       </div>
     </el-dialog>
   </div>
</template>
<script>

  export default {
    data() {
      return {
        projectDemandList: [],
        demandFormVisible: false,
        demandDeleteVisible: false,
        projectId:this.$route.params.projectId,
        demandDeleteId:"",
        demandStatusOptions:[
          '进行中','已完成','已取消'
        ],
        demandForm: {
          demand_title: ''
        },
        demandRules: {
          demand_title: [
            {required: true, message: '请输入需求标题', trigger: 'change'},
          ]
        },
        demandOpenNum:0,
        editorOption:{
          placeholder: '请输入项目内容',
          modules:{
            toolbar:[
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': [] }],
              [{ 'align': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ]
          }
        }
      }
    },
    created(){
      this.getProjectDemandList()
    },
    methods :{
      getProjectDemandList:function () {
        var vm=this;
        vm.$http({
          method: 'get',
          url: vm.config.baseUrl+'project/getProjectDemandList',
          params:{
            project_id:vm.projectId
          }
        }).then(function(response) {
          var data=response.data
          vm.projectDemandList=data.projectDemandList

        }).catch(function(response){
          console.log(response)
        })
      },
      demandFormOpen:function () {
        this.demandFormVisible = true;
        this.demandOpenNum++;
        if(this.demandOpenNum>1){
          this.$refs['demandForm'].resetFields();
        }
        this.demandForm={
            demand_title:null,
            demand_create_time:null,
            demand_status:null
        };

      },
      demandSubmit:function () {
        var vm=this;
        vm.$refs['demandForm'].validate((valid) => {
          if (valid) {
            var demandInfo = this.demandForm;
            if(demandInfo.demand_create_time!=null&&demandInfo.demand_create_time>1){
              demandInfo.demand_create_time=vm.$moment(demandInfo.demand_create_time).format("YYYY-MM-DD");
            }
            demandInfo.project_id=vm.projectId;
            vm.$http({
              method: 'POST',
              url: this.config.baseUrl + 'project/addProjectDemand',
              data: demandInfo
            }).then(function (data) {
              var result = data.data;
              var response = result.code;
              if (response == 0) {
                vm.demandFormVisible = false;
                vm.$message({message: '提交成功！！', type: 'success'});
                vm.getProjectDemandList()
              } else {
                vm.$message.error('提交失败！！');
              }
            })
          }
        })
      },
      demandDeleteOpen:function (delId) {
        this.demandDeleteId=delId;
        this.demandDeleteVisible = true;
      },
      demandDelete:function () {
        var vm=this;
        vm.$http({
          method: 'POST',
          url: this.config.baseUrl + 'project/deleteProjectDemand',
          data: {
            demand_id:vm.demandDeleteId
          }
        }).then(function (data) {
          var result = data.data;
          var response = result.code;
          if (response == 0) {
            vm.demandDeleteVisible = false;
            vm.$message({message: '删除成功！！', type: 'success'});
            vm.getProjectDemandList()
          } else {
            vm.$message.error('提交失败！！');
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
  .demand-editor {
    line-height: 20px;
  }
</style>
