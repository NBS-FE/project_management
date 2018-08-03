<template>
   <div >
     <div style="height:50px;background: #eee;margin: -20px;line-height: 50px" class="margin-bottom-20">
       <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block">
         <el-breadcrumb-item class="margin-left-20">项目需求</el-breadcrumb-item>
       </el-breadcrumb>
       <el-button type="success" class="margin-top-10 margin-right-20" size="small" style="float: right;" @click="demandFormOpen"  icon="el-icon-plus">新增需求</el-button>
     </div>
    <!-- <tree-table :data="data" :columns="columns" border>

       <el-table-column label="操作" width="200">
         <template slot-scope="scope">
           <el-button type="text" @click="demandFormOpen">点击</el-button>
         </template>
       </el-table-column>
     </tree-table>-->

     <el-table
         :data="projectDemandList"
         border
         style="width: 100%">
         <el-table-column
           label="序号"
           width="60"
           type="index"
           :index="indexMethod"
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
           width="100"
           label="操作">
           <template slot-scope="scope" >
             <router-link :to="{ path: '/project/demanddetail/'+projectId+'/'+scope.row.demand_id}">
               <el-button icon="el-icon-search" size="small" type="primary" title="查看详情" circle></el-button>
             </router-link>
             <!--<el-button type="primary" size="small" :to="{ path: '/project/demanddetail/'+scope.row.demand_id }" icon="el-icon-search">详情</el-button>-->
             <el-button type="danger" size="small" @click="demandDeleteOpen(scope.row.demand_id)" title="删除需求" icon="el-icon-delete" circle></el-button>
           </template>
         </el-table-column>
       </el-table>
     <el-pagination style="float:right;margin-top:20px;"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="10" :page-sizes="[10]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount">
     </el-pagination>

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
             <UE :defaultMsg='uecontent' :config=ueconfig ref="ue" ></UE>
             <!--<quill-editor
               style="height: 200px"
               v-model="demandForm.demand_content"
               ref="myQuillEditor"
               :options="editorOption"
               @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
               @change="onEditorChange($event)">
             </quill-editor>-->
           </div>

         </el-form-item>
         <el-form-item label="附件上传">
           <el-upload
             class="upload-demo"
             ref="upload"
             action="000"
             :on-preview="handlePreview"
             :on-remove="handleRemove"
             :on-change="beforeUpload"
             :file-list="fileList"
             :auto-upload="false">
             <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
           </el-upload>
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
  import UE from '@/components/ue.vue';
  export default {
    components: {UE},
    data() {
      return {
        uecontent:"",
        ueconfig: {
          initialFrameWidth: null,
          initialFrameHeight: 200,
          wordCount: false,
          toolbars: this.config.ueditorToolbar
        },
        currentPage:1,
        totalCount:0,
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
        },
        fileList: [],
        uploadFileList: [],
      }
    },
    created(){
      this.getProjectDemandList()
    },
    methods :{
      getProjectDemandList:function (cPage) {
        var vm=this;
        if(cPage==null){
          cPage=1;
          vm.currentPage=1
        }
        vm.$http({
          method: 'get',
          url: vm.config.baseUrl+'project/getProjectDemandList',
          params:{
            project_id:vm.projectId,
            currentPage:cPage
          }
        }).then(function(response) {
          var data=response.data
          if(data.code==0){
            vm.projectDemandList=data.projectDemandList
            vm.totalCount=data.count
          }

        }).catch(function(response){
          console.log(response)
        })
      },
      handleCurrentChange:function (val) {
        var vm=this;
        vm.currentPage = val;
        vm.getProjectDemandList(val);
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
            demandInfo.demand_content=vm.$refs.ue.getUEContent();;
            if(demandInfo.demand_create_time!=null&&demandInfo.demand_create_time>1){
              demandInfo.demand_create_time=vm.$moment(demandInfo.demand_create_time).format("YYYY-MM-DD");
            }
            demandInfo.project_id=vm.projectId;

            var formData = new FormData();
            for(var variable  in demandInfo){
              formData.append(variable,demandInfo[variable])
            }
            if(vm.uploadFileList.length>0){
              vm.uploadFileList.forEach(function (filedata,index) {
                formData.append('demandFile',filedata)
              })
            }

            vm.$http({
              method: 'POST',
              url: this.config.baseUrl + 'project/addProjectDemand',
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              data: formData
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
      },
      indexMethod(index) {
        return (this.currentPage-1)*10+1+index;
      },
      beforeUpload(file,fileList) {
        var vm=this;
        vm.uploadFileList=[]
        if(fileList!=null&&fileList.length>0){
          fileList.forEach(function (ufile) {
            vm.uploadFileList.push(ufile.raw)
          })
        }

      },
      handleRemove(file, fileList) {
        var vm=this;
        vm.uploadFileList=[]
        if(fileList!=null&&fileList.length>0){
          fileList.forEach(function (ufile) {
            vm.uploadFileList.push(ufile.raw)
          })
        }
      },
      handlePreview(file) {
        console.log(file);
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
