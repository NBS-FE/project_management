<template>
  <div>
    <div style="height:50px;background: #eee;margin: -20px;line-height: 50px" class="margin-bottom-10">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block">
        <el-breadcrumb-item class="margin-left-20" :to="{ path: '/project/conference/'+projectId }">会议记录</el-breadcrumb-item>
        <el-breadcrumb-item>会议详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="width: 1000px;padding:  10px 20px">
      <div class="itme-title">会议基本信息
        <el-button type="primary"  style="float: right;margin-top: -5px"  size="small" plain @click="conferenceFormOpen"><i class="fa fa-edit margin-right-5"></i>修改会议</el-button>
      </div>
      <div class="padding-10">
        <table class="table table-bordered  fs14 home-table" >
          <tbody>
          <tr>
            <td width="150" class="info-title">会议标题</td>
            <td colspan="3">{{projectConferenceInfo.conference_title}}</td>
          </tr>

          <tr>
            <td width="150" class="info-title">会议时间</td>
            <td width="320">{{projectConferenceInfo.conference_time | dateFormat('YYYY-MM-DD')}}</td>
            <td width="150" class="info-title">参会成员</td>
            <td >{{projectConferenceInfo.conference_member}}</td>
          </tr>


          <tr>
            <td width="150" class="info-title" style="vertical-align: middle">需求附件</td>
            <td colspan="3">
              <table class="table table-bordered  fs14 home-table" >
                <tbody>
                <tr v-for="fileupload in projectConferenceInfo.FileUploads">
                  <td><a target="_blank" :href="config.baseUrl+fileupload.file_upload_url">{{fileupload.file_upload_name}}</a></td>
                  <td width="60"> <el-button type="danger" size="mini" icon="el-icon-delete" @click="fileDeleteOpen(fileupload)" circle></el-button></td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr> <td colspan="4" class="info-title">会议内容</td></tr>
          <tr>
            <td colspan="4"><div  style="min-height: 100px" class="conference-content" v-html="projectConferenceInfo.conference_content"></div></td>
          </tr>
          </tbody>
        </table>
      </div>

     <!-- <div class="itme-title margin-top-20">项目网址列表
        <el-button type="success"  style="float: right;margin-top: -5px" class=" margin-right-10" size="small" plain @click="urlFormOpen('add')"><i class="fa fa-plus margin-right-5"></i>新增网址</el-button>

      </div>
      <div class="padding-10">
        <el-table
          :data="projectInfo.ProjectUrls"
          border
          style="width: 100%">
          <el-table-column
            type="index"
          >
          </el-table-column>
          <el-table-column
            width="150"
            label="网址名称"
            prop="project_url_name" >

          </el-table-column>
          <el-table-column
            header-align="center"
            label="URL"
            prop="project_url">
            <template slot-scope="scope" >
              <a class="info" target="_blank" v-bind:href="scope.row.project_url">{{scope.row.project_url}}</a>
            </template>
          </el-table-column>
          <el-table-column
            width="100"
            header-align="center"
            class-name="text-center"
            label="操作"
            prop="project_status">
            <template slot-scope="scope" >
              <el-button type="primary" title="编辑" size="small" @click="urlFormOpen('edit',scope.row)" icon="el-icon-edit" circle></el-button>
              <el-button type="danger" size="small" icon="el-icon-delete" @click="urlDeleteOpen(scope.row.project_url_id)" circle></el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>-->
      <el-dialog class="conference-panel" width="900px" title="修改会议记录" :visible.sync="conferenceFormVisible" :close-on-click-modal="false"  >
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
          <el-form-item label="需求内容"  prop="conference_content">
            <div class="conference-editor">
              <UE :defaultMsg='uecontent' :config=ueconfig ref="ue" ></UE>
              <!--<quill-editor
                style="height: 200px"
                v-model="conferenceForm.conference_content"
                ref="myQuillEditor"
                :options="editorOption"
                >
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
      <el-dialog class="delete-panel" width="400px" title="附件删除" :visible.sync="fileDeleteVisible" :close-on-click-modal="false"  >
        <div class="fs16 danger">
          确定要删除该附件吗？
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="fileDeleteVisible = false">取消</el-button>
          <el-button type="primary" @click.native="fileDelete" >提交</el-button>
        </div>
      </el-dialog>
    </div>
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
          toolbars:this.config.ueditorToolbar
        },
        projectConferenceInfo:"",
        projectId:this.$route.params.projectId,
        conferenceId:this.$route.params.conferenceId,
        conferenceFormVisible: false,
        delFileData:"",
        fileDeleteVisible : false,
        conferenceForm: {
          conference_title: '',
          conference_time: '',
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
        urlOpenNum:0,
        fileList: [],
        uploadFileList: [],
      }
    },
    created(){
      this.getProjectConferenceInfo()
    },
    methods :{
      getProjectConferenceInfo:function () {
        var vm=this;
        vm.$http({
          method: 'get',
          url: vm.config.baseUrl+'conference/getProjectConferenceInfo',
          params:{
            conference_id:vm.conferenceId
          }
        }).then(function(response) {
          var data=response.data
          var code=data.code;
          if(code==0){
            vm.projectConferenceInfo=data.projectConferenceInfo
            vm.conferenceForm=JSON.parse(JSON.stringify(data.projectConferenceInfo));
            vm.uecontent=vm.conferenceForm.conference_content;
          }else {
            console.log(data.msg)
          }
        }).catch(function(response){
          console.log(response)
        })
      },
      conferenceFormOpen:function () {
        this.conferenceFormVisible = true;
        this.fileList=[];
        this.uploadFileList=[];
        if( this.projectConferenceInfo.conference_content==null){
          this.projectConferenceInfo.conference_content=" ";
        }
        this.conferenceForm=JSON.parse(JSON.stringify( this.projectConferenceInfo));

      },
      conferenceSubmit:function () {
        var vm=this;
        this.conferenceForm.conference_content=vm.$refs.ue.getUEContent();
        vm.$refs['conferenceForm'].validate((valid) => {
          if (valid) {
            var conferenceInfo = this.conferenceForm;
            if(conferenceInfo.conference_time!=null){
              conferenceInfo.conference_time=vm.$moment(conferenceInfo.conference_time).format("YYYY-MM-DD");
            }
            conferenceInfo.conference_content=vm.$refs.ue.getUEContent();
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
              url: this.config.baseUrl + 'conference/updateProjectConference',
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
                vm.getProjectConferenceInfo()
              } else {
                vm.$message.error('提交失败！！');
              }
            })
          }
        })
      },
      urlFormOpen:function (optionType,urlData) {
        this.urlOptionType = optionType;
        this.urlFormVisible = true;
        if (urlData != null) {
          this.urlForm = JSON.parse(JSON.stringify(urlData));
        } else {
          this.$refs['urlForm'].resetFields();
          this.urlForm = {
            project_url_name: '',
            project_url: ''
          }
        }
      },
      urlSubmit:function () {
        var vm = this;
        vm.$refs['urlForm'].validate((valid) => {
          if (valid) {
            var url="",urlInfo = this.urlForm;
            if(vm.urlOptionType=='add'){
              url='project/addProjectUrl';
              urlInfo.project_id=vm.projectId;
            }else if(vm.urlOptionType=='edit'){
              url='project/updateProjectUrl';
            }


            vm.$http({
              method: 'POST',
              url: this.config.baseUrl + url,
              data: urlInfo
            }).then(function (data) {
              var result = data.data;
              var response = result.code;
              if (response == 0) {
                vm.urlFormVisible = false;
                vm.$message({message: '提交成功！！', type: 'success'});
                vm.getProjectInfo()
              } else {
                vm.$message.error('提交失败！！');
              }
            })
          }
        })
      },
      urlDeleteOpen:function (delId) {
        this.urlDeleteId=delId;
        this.urlDeleteVisible = true;
      },
      urlDelete:function () {
          var vm=this;
        vm.$http({
          method: 'POST',
          url: this.config.baseUrl + 'project/deleteProjectUrl',
          data: {
              project_url_id:vm.urlDeleteId
          }
        }).then(function (data) {
          var result = data.data;
          var response = result.code;
          if (response == 0) {
            vm.urlDeleteVisible = false;
            vm.$message({message: '删除成功！！', type: 'success'});
            vm.getProjectInfo()
          } else {
            vm.$message.error('提交失败！！');
          }
        })
      },
      fileDeleteOpen:function (fileData) {
        this.delFileData=fileData;
        this.fileDeleteVisible = true;
      },
      fileDelete:function () {
        var vm=this;
        vm.$http({
          method: 'POST',
          url: this.config.baseUrl + 'file/deleteFile',
          data: vm.delFileData
        }).then(function (data) {
          var result = data.data;
          var response = result.code;
          if (response == 0) {
            vm.fileDeleteVisible = false;
            vm.$message({message: '删除成功！！', type: 'success'});
            vm.getProjectConferenceInfo()
          } else {
            vm.$message.error('提交失败！！');
          }
        })
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
  .add-project .el-dialog__body{
    padding:10px 20px;
  }
  .itme-title{
    padding: 12px 20px;
    background-color: #e9e9e9;
    font-size: 15px;
    border-radius: 5px;
    font-weight: 600;
  }
  .info-title{
    text-align: center;
    background-color: #f9f9f9;
    font-weight: 600;

  }
  .home-table tbody td{
    padding: 8px!important;
    vertical-align: middle!important;
  }
  .conference-editor {
    line-height: 20px;
  }
  .conference-content table td{
    border: 1px solid #ddd;
  }
</style>
