<template>
  <div >
    <div style="height:50px;background: #eee;margin: -20px;line-height: 50px" class="margin-bottom-20">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block">
        <el-breadcrumb-item class="margin-left-20">会议记录</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="success" class="margin-top-10 margin-right-20" size="small" style="float: right;" @click="conferenceFormOpen"  icon="el-icon-plus">新增会议</el-button>
    </div>
    <!-- <tree-table :data="data" :columns="columns" border>

       <el-table-column label="操作" width="200">
         <template slot-scope="scope">
           <el-button type="text" @click="conferenceFormOpen">点击</el-button>
         </template>
       </el-table-column>
     </tree-table>-->

    <el-table
      :data="projectConferenceList"
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
        prop="conference_title"
        label="会议标题"
      >
      </el-table-column>

      <el-table-column
        prop="conference_member"
        width="200"
        label="会议成员">

      </el-table-column>
      <el-table-column
        prop="conference_time"
        width="150"
        label="会议时间">
        <template slot-scope="scope" >
          {{scope.row.conference_time | dateFormat('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column
        width="100"
        label="操作">
        <template slot-scope="scope" >
          <router-link :to="{ path: '/project/conferencedetail/'+projectId+'/'+scope.row.conference_id}">
            <el-button icon="el-icon-search" size="small" type="primary" title="查看详情" circle></el-button>
          </router-link>
          <!--<el-button type="primary" size="small" :to="{ path: '/project/conferencedetail/'+scope.row.conference_id }" icon="el-icon-search">详情</el-button>-->
          <el-button type="danger" size="small" @click="conferenceDeleteOpen(scope.row.conference_id)" title="删除需求" icon="el-icon-delete" circle></el-button>
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

    <el-dialog class="conference-panel" width="900px" title="新增会议" :visible.sync="conferenceFormVisible" :close-on-click-modal="false"  >
      <el-form :model="conferenceForm" :rules="conferenceRules" label-width="80px"  ref="conferenceForm"  style="padding: 0 20px">
        <el-form-item label="会议标题" prop="conference_title" >
          <el-input  placeholder="请输入会议标题" v-model="conferenceForm.conference_title">
          </el-input>
        </el-form-item>

        <el-form-item label="会议时间" prop="conference_time" >
          <el-col :span="10">
            <el-date-picker style="width: 100%"
                            v-model="conferenceForm.conference_time"
                            type="date"
                            placeholder="请选择会议时间">
            </el-date-picker>
          </el-col>
          <el-col  class="line text-right padding-right-10" :span="4">参会人员</el-col>
          <el-col :span="10">
            <el-input  placeholder="请输入参会人员" v-model="conferenceForm.conference_member">
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="会议内容"  prop="conference_content">
          <div class="conference-editor">
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
        <el-button @click.native="conferenceFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="conferenceSubmit" >提交</el-button>
      </div>
    </el-dialog>
    <el-dialog class="delete-panel" width="400px" title="删除会议记录" :visible.sync="conferenceDeleteVisible" :close-on-click-modal="false"  >
      <div class="fs16 danger">
        确定要删除该会议记录吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="conferenceDeleteVisible = false">取消</el-button>
        <el-button type="primary" @click.native="conferenceDelete" >提交</el-button>
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
        projectConferenceList: [],
        conferenceFormVisible: false,
        conferenceDeleteVisible: false,
        projectId:this.$route.params.projectId,
        conferenceDeleteId:"",
        conferenceStatusOptions:[
          '进行中','已完成','已取消'
        ],
        conferenceForm: {
          conference_title: '',
          conference_time: '',
          conference_content: '',
        },
        conferenceRules: {
          conference_title: [
            {required: true, message: '请输入会议标题', trigger: 'change'},
          ],
          conference_time: [
            {required: true, message: '请输入会议时间', trigger: 'change'},
          ],
          conference_content: [
            {required: true, message: '请输入会议内容', trigger: 'change'},
          ]
        },
        conferenceOpenNum:0,
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
      this.getProjectConferenceList()
    },
    methods :{
      getProjectConferenceList:function (cPage) {
        var vm=this;
        if(cPage==null){
          cPage=1;
          vm.currentPage=1
        }
        vm.$http({
          method: 'get',
          url: vm.config.baseUrl+'conference/getProjectConferenceList',
          params:{
            project_id:vm.projectId,
            currentPage:cPage
          }
        }).then(function(response) {
          var data=response.data
          if(data.code==0){
            vm.projectConferenceList=data.projectConferenceList
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
      conferenceFormOpen:function () {
        this.conferenceFormVisible = true;
        this.conferenceOpenNum++;
        if(this.conferenceOpenNum>1){
          this.$refs['conferenceForm'].resetFields();
        }
        this.fileList=[];
        this.uecontent="";
        this.conferenceForm={
          conference_title:null,
          conference_time:null,
          conference_content:null
        };

      },
      conferenceSubmit:function () {
        var vm=this;
        this.conferenceForm.conference_content=vm.$refs.ue.getUEContent();;
        vm.$refs['conferenceForm'].validate((valid) => {
          if (valid) {
            var conferenceInfo = this.conferenceForm;
            conferenceInfo.conference_content=vm.$refs.ue.getUEContent();
            if(conferenceInfo.conference_time!=null){
              conferenceInfo.conference_time=vm.$moment(conferenceInfo.conference_time).format("YYYY-MM-DD");
            }
            conferenceInfo.project_id=vm.projectId;

            var formData = new FormData();
            for(var variable  in conferenceInfo){
              formData.append(variable,conferenceInfo[variable])
            }
            if(vm.uploadFileList.length>0){
              vm.uploadFileList.forEach(function (filedata,index) {
                formData.append('conferenceFile',filedata)
              })
            }

            vm.$http({
              method: 'POST',
              url: this.config.baseUrl + 'conference/addProjectConference',
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              data: formData
            }).then(function (data) {
              var result = data.data;
              var response = result.code;
              if (response == 0) {
                vm.conferenceFormVisible = false;
                vm.$message({message: '提交成功！！', type: 'success'});
                vm.getProjectConferenceList()
              } else {
                vm.$message.error('提交失败！！');
              }
            })
          }
        })
      },
      conferenceDeleteOpen:function (delId) {
        this.conferenceDeleteId=delId;
        this.conferenceDeleteVisible = true;
      },
      conferenceDelete:function () {
        var vm=this;
        vm.$http({
          method: 'POST',
          url: this.config.baseUrl + 'conference/deleteProjectConference',
          data: {
            conference_id:vm.conferenceDeleteId
          }
        }).then(function (data) {
          var result = data.data;
          var response = result.code;
          if (response == 0) {
            vm.conferenceDeleteVisible = false;
            vm.$message({message: '删除成功！！', type: 'success'});
            vm.getProjectConferenceList()
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
  .conference-editor {
    line-height: 20px;
  }

</style>
