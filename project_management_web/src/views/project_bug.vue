<template>
   <div class="margin-bottom-50">
     <div style="height:50px;background: #eee;margin: -20px;line-height: 50px" class="margin-bottom-20">
       <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block">
         <el-breadcrumb-item class="margin-left-20">缺陷记录</el-breadcrumb-item>
       </el-breadcrumb>
       <el-button type="success" class="margin-top-10 margin-right-20" size="small" style="float: right;" @click="bugFormOpen"  icon="el-icon-plus">新增缺陷</el-button>
     </div>

     <el-table
         :data="projectBugList"
         border
         style="width: 100%;">
         <el-table-column
           label="序号"
           width="60"
           type="index"
         >
         </el-table-column>
         <el-table-column
           prop="bug_title"
           label="标题"
           >
         </el-table-column>
         <el-table-column
           prop="bug_level"
           width="150"
           label="严重程度">
         </el-table-column>
         <el-table-column
           prop="bug_priority"
           width="150"
           label="优先级">
         </el-table-column>
       <el-table-column
         prop="bug_status"
         label="状态"
       >
       </el-table-column>
       <el-table-column
         prop="bug_handler"
         label="处理人"
       >
       </el-table-column>
       <el-table-column
         prop="bug_creator"
         label="创建人"
       >
       </el-table-column>
       <el-table-column
         prop="bug_create_time"
         label="创建时间"
       >
         <template slot-scope="scope" >
           {{scope.row.bug_create_time | dateFormat('YYYY-MM-DD')}}
         </template>
       </el-table-column>
         <el-table-column
           width="100"
           label="操作">
           <template slot-scope="scope" >
             <router-link :to="{ path: '/project/bugdetail/'+projectId+'/'+scope.row.bug_id}">

               <el-button icon="el-icon-search" size="small" type="primary" title="查看详情"  circle></el-button>
             </router-link>
             <!--<el-button type="primary" size="small" :to="{ path: '/project/demanddetail/'+scope.row.demand_id }" icon="el-icon-search">详情</el-button>-->
             <el-button type="danger" size="small" @click="bugDeleteOpen(scope.row.bug_id)" title="删除缺陷" icon="el-icon-delete" circle></el-button>
           </template>
         </el-table-column>
       </el-table>
     <el-dialog class="bug-panel" width="900px" title="新增缺陷" :visible.sync="bugFormVisible" :close-on-click-modal="false"  >
       <el-form :model="bugForm" :rules="bugRules" label-width="80px"  ref="bugForm"  style="padding: 0 20px">
         <el-form-item label="标题" prop="bug_title" >
           <el-input  placeholder="请输入标题" v-model="bugForm.bug_title">
           </el-input>
         </el-form-item>
         <el-form-item label="严重程度" prop="bug_level" >
           <el-col :span="10">
             <el-select v-model="bugForm.bug_level" clearable style="width: 100%" placeholder="请选择严重程度">
               <el-option
                 v-for="item in bugLevelOptions"
                 :key="item"
                 :label="item"
                 :value="item">
               </el-option>
             </el-select>
           </el-col>
           <el-col   class="line text-right padding-right-10" :span="4">优先级</el-col>
           <el-col :span="10">
             <el-select v-model="bugForm.bug_priority" clearable style="width: 100%" placeholder="请选择优先级">
               <el-option
                 v-for="item in bugPriorityOptions"
                 :key="item"
                 :label="item"
                 :value="item">
               </el-option>
             </el-select>
           </el-col>
         </el-form-item>
         <el-form-item label="创建人" prop="bug_creator" >
           <el-col :span="10">
             <el-input  placeholder="请输入创建人" v-model="bugForm.bug_creator"></el-input>
           </el-col>
           <el-col   class="line text-right padding-right-10" :span="4">处理人</el-col>
           <el-col :span="10">
             <el-input  placeholder="请输入处理人" v-model="bugForm.bug_handler"></el-input>
           </el-col>
         </el-form-item>
         <el-form-item label="创建时间" prop="bug_create_time" >
           <el-col :span="10">
             <el-date-picker style="width: 100%"
               v-model="bugForm.bug_create_time"
               type="date"
               placeholder="请选择创建时间">
             </el-date-picker>
           </el-col>
           <el-col  class="line text-right padding-right-10" :span="4">缺陷状态</el-col>
           <el-col :span="10">
             <el-select v-model="bugForm.bug_status" style="width: 100%" placeholder="请选择缺陷状态">
               <el-option
                 v-for="item in bugStatusOptions"
                 :key="item"
                 :label="item"
                 :value="item">
               </el-option>
             </el-select>
           </el-col>
         </el-form-item>
         <el-form-item label="缺陷内容"  prop="bug_content">
           <div class="demand-editor">
             <!--<ueditor :content=uetest :config=ueconfig :id="ue1"></ueditor>-->
             <UE :defaultMsg='uetest' :config=ueconfig ref="ue" ></UE>
             <!--<quill-editor
               style="height: 100px"
               v-model="bugForm.bug_content"
               ref="myQuillEditor"
               :options="editorOption">
             </quill-editor>-->
           </div>

         </el-form-item>

       </el-form>
       <div slot="footer" class="dialog-footer">
         <el-button @click.native="bugFormVisible = false">取消</el-button>
         <el-button type="primary" @click.native="bugSubmit" >提交</el-button>
       </div>
     </el-dialog>
     <el-dialog class="delete-panel" width="400px" title="删除项目需求" :visible.sync="bugDeleteVisible" :close-on-click-modal="false"  >
       <div class="fs16 danger">
         确定要删除该缺陷吗？
       </div>
       <div slot="footer" class="dialog-footer">
         <el-button @click.native="bugDeleteVisible = false">取消</el-button>
         <el-button type="primary" @click.native="bugDelete" >提交</el-button>
       </div>
     </el-dialog>
   </div>
</template>
<script>
  import UE from '@/components/ue.vue';
  export default {
    components: {UE},
    data() {
      return {
        uetest:"",
        ueconfig: {
          initialFrameWidth: null,
          initialFrameHeight: 200,
          wordCount: false,
          toolbars: this.config.ueditorToolbar
        },
        projectBugList: [],
        bugFormVisible: false,
        bugDeleteVisible: false,
        projectId:this.$route.params.projectId,
        bugDeleteId:"",
        bugStatusOptions:['待修复','已修复','已验证','已驳回','已关闭'],
        bugPriorityOptions:['紧急','高','中','低','无关紧要'],
        bugLevelOptions:['致命','严重','一般','提示','建议'],
        bugForm: {
          bug_title: ''
        },
        bugRules: {
          bug_title: [
            {required: true, message: '请输入需求标题', trigger: 'change'},
          ]
        },
        bugOpenNum:0,
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
      this.getProjectBugList()
    },
    methods :{
      getProjectBugList:function () {
        var vm=this;
        vm.$http({
          method: 'get',
          url: vm.config.baseUrl+'project/getProjectBugList',
          params:{
            project_id:vm.projectId
          }
        }).then(function(response) {
          var data=response.data
          vm.projectBugList=data.projectBugList

        }).catch(function(response){
          console.log(response)
        })
      },
      bugFormOpen:function () {
        this.bugFormVisible = true;
        this.bugOpenNum++;
        if(this.bugOpenNum>1){
          this.$refs['bugForm'].resetFields();
        }
        this.bugForm= {
          bug_title: null,
          bug_create_time: null,
          bug_status: null,
          bug_content: ""
        };

      },
      bugSubmit:function () {
        var vm=this;
        vm.$refs['bugForm'].validate((valid) => {
          if (valid) {
            var bugInfo = this.bugForm;
            bugInfo.bug_content=vm.$refs.ue.getUEContent();
            if(bugInfo.bug_create_time!=null&&bugInfo.bug_create_time>1){
              bugInfo.bug_create_time=vm.$moment(bugInfo.bug_create_time).format("YYYY-MM-DD");
            }
            bugInfo.project_id=vm.projectId;
            vm.$http({
              method: 'POST',
              url: this.config.baseUrl + 'project/addProjectBug',
              data: bugInfo
            }).then(function (data) {
              var result = data.data;
              var response = result.code;
              if (response == 0) {
                vm.bugFormVisible = false;
                vm.$message({message: '提交成功！！', type: 'success'});
                vm.getProjectBugList()
              } else {
                vm.$message.error('提交失败！！');
              }
            })
          }
        })
      },
      bugDeleteOpen:function (delId) {
        this.bugDeleteId=delId;
        this.bugDeleteVisible = true;
      },
      bugDelete:function () {
        var vm=this;
        vm.$http({
          method: 'POST',
          url: this.config.baseUrl + 'project/deleteProjectBug',
          data: {
            bug_id:vm.bugDeleteId
          }
        }).then(function (data) {
          var result = data.data;
          var response = result.code;
          if (response == 0) {
            vm.bugDeleteVisible = false;
            vm.$message({message: '删除成功！！', type: 'success'});
            vm.getProjectBugList()
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
  .edui-editor{
    z-index: 9999!important;
  }
</style>
