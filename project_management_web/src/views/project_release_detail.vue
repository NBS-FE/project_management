<template>
  <div>
    <div style="height:50px;background: #eee;margin: -20px;line-height: 50px" class="margin-bottom-10">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block">
        <el-breadcrumb-item class="margin-left-20" :to="{ path: '/project/bug/'+projectId }">发布记录</el-breadcrumb-item>
        <el-breadcrumb-item>发布详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="width: 1000px;padding:  10px 20px">
      <div class="itme-title">发布记录基本信息
        <el-button type="primary"  style="float: right;margin-top: -5px"  size="small" plain @click="releaseFormOpen"><i class="fa fa-edit margin-right-5"></i>修改发布记录</el-button>
      </div>
      <div class="padding-10">
        <table class="table table-bordered  fs14 home-table" >
          <tbody>
          <tr>
            <td width="150" class="info-title">发布人</td>
            <td width="320">{{releaseCreator.full_name }}</td>
            <td width="150" class="info-title">发布时间</td>
            <td >{{projectReleaseInfo.release_time | dateFormat('YYYY-MM-DD')}}</td>
          </tr>
          <tr>
            <td width="150" class="info-title">发布类型</td>
            <td width="320">{{projectReleaseInfo.release_type }}</td>
            <td width="150" class="info-title">创建时间</td>
            <td >{{projectReleaseInfo.release_create_time | dateFormat('YYYY-MM-DD')}}</td>
          </tr>
          <tr>
            <td width="150" class="info-title">是否备份</td>
            <td width="320">{{projectReleaseInfo.release_is_backup }}</td>
            <td width="150" class="info-title">验证人</td>
            <td >{{releaseVerifier.full_name}}</td>
          </tr>
          <tr>
            <td width="150" class="info-title">项目名称</td>
            <td colspan="3">{{projectReleaseInfo.release_project_name }}</td>
          </tr>
          <tr>
            <td width="150" class="info-title">发布地址</td>
            <td colspan="3">{{projectReleaseInfo.release_url }}</td>
          </tr>


          <tr>
            <td colspan="4" class="info-title">发布内容</td>

          </tr>
          <tr>
            <td colspan="4"><div  style="min-height: 100px" class="bug-content" v-html="projectReleaseInfo.release_content"></div></td>

          </tr>

          </tbody>
        </table>
      </div>
      <!--<div class="itme-title margin-top-20">缺陷处理
        <el-button type="success"  style="float: right;margin-top: -5px"  size="small" plain @click="releaseRecordFormOpen"><i class="fa fa-plus margin-right-5"></i>新增处理</el-button>
      </div>
      <div class="padding-10">
        <div style="border: 1px solid #ddd;min-height: 100px">
          <light-timeline :items='recordItems'></light-timeline>
        </div>

      </div>-->
      <div class="itme-title margin-top-20">发布记录附件
        <el-button type="success"  style="float: right;margin-top: -5px"  size="small" plain @click="fileFormOpen"><i class="fa fa-plus margin-right-5"></i>新增附件</el-button>
      </div>
      <div class="padding-10">
        <table class="table table-bordered  fs14 home-table" >
          <tbody>

          <tr>
            <td width="150" style="vertical-align: middle" class="info-title">原始附件</td>
            <td colspan="3">
              <table class="table table-bordered  fs14 home-table" >
                <tbody>
                <tr v-for="originalFile in originalFileList">
                  <td><a target="_blank" :href="config.baseUrl+originalFile.file_upload_url">{{originalFile.file_upload_name}}</a></td>
                  <td width="60"> <el-button type="danger" size="mini" icon="el-icon-delete" @click="fileDeleteOpen(originalFile)" circle></el-button></td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td width="150" style="vertical-align: middle" class="info-title">更新附件</td>
            <td colspan="3">
              <table class="table table-bordered  fs14 home-table" >
                <tbody>
                <tr v-for="latestFile in latestFileList">
                  <td><a target="_blank" :href="config.baseUrl+latestFile.file_upload_url">{{latestFile.file_upload_name}}</a></td>
                  <td width="60"> <el-button type="danger" size="mini" icon="el-icon-delete" @click="fileDeleteOpen(latestFile)" circle></el-button></td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
          </tbody>
        </table>

      </div>

      <el-dialog class="release-panel" width="900px" title="修改发布记录" :visible.sync="releaseFormVisible" :close-on-click-modal="false"  >
        <el-form :model="releaseForm" :rules="releaseRules" label-width="80px"  ref="releaseForm"  style="padding: 0 20px">

          <el-form-item label="发布时间" prop="release_time" >
            <el-col :span="10">
              <el-date-picker style="width: 100%"
                              v-model="releaseForm.release_time"
                              type="date"
                              placeholder="请选择发布时间">
              </el-date-picker>
            </el-col>
            <el-col   class="line text-right padding-right-10" :span="4">发布类型</el-col>
            <el-col :span="10">
              <el-select v-model="releaseForm.release_type" clearable style="width: 100%" placeholder="请选择发布类型">
                <el-option
                  v-for="item in releaseTypeOptions"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="项目名称" prop="release_project_name" >
            <el-input  placeholder="请输入发布的项目或版本名称" v-model="releaseForm.release_project_name">
            </el-input>
          </el-form-item>
          <el-form-item label="发布地址" prop="release_url" >
            <el-input  placeholder="请输入发布地址" v-model="releaseForm.release_url">
            </el-input>
          </el-form-item>
          <el-form-item label="是否备份" prop="release_is_backup" >
            <el-col :span="10">
              <el-select v-model="releaseForm.release_is_backup" style="width: 100%" placeholder="请选择是否备份">
                <el-option
                  v-for="item in isBackup"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
              <!--<el-input  placeholder="请输入处理人" v-model="bugForm.bug_handler"></el-input>-->
            </el-col>
            <el-col  class="line text-right padding-right-10" :span="4">验证人</el-col>
            <el-col :span="10">
              <el-select v-model="releaseForm.release_verifier" style="width: 100%" placeholder="请选择验证人">
                <el-option
                  v-for="item in userList"
                  :key="item.user_id"
                  :label="item.full_name"
                  :value="item.user_id">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>

          <el-form-item label="发布内容"  prop="release_content">
            <div class="demand-editor">
              <!--<ueditor :content=uetest :config=ueconfig :id="ue1"></ueditor>-->
              <UE :defaultMsg='uecontent' :config=ueconfig ref="ue" ></UE>
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
          <el-button @click.native="releaseFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="releaseSubmit" >提交</el-button>
        </div>
      </el-dialog>

      <el-dialog class="file-panel" width="700px" title="新增附件" :visible.sync="fileFormVisible" :close-on-click-modal="false"  >
        <el-form :model="fileForm"  label-width="80px" :rules="fileRules" ref="fileForm"  style="padding: 0 20px">
          <el-form-item label="文件类型" prop="fileType" >

            <el-select v-model="fileForm.fileType" clearable style="width: 100%" placeholder="请选择文件类型">
              <el-option
                v-for="item in fileTypes"
                :key="item.typeValue"
                :label="item.typeName"
                :value="item.typeValue">
              </el-option>
            </el-select>
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
          <el-button @click.native="fileFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addFileSubmit" >提交</el-button>
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
        projectReleaseInfo:"",
        projectId:this.$route.params.projectId,
        releaseId:this.$route.params.releaseId,
        releaseFormVisible: false,
        fileFormVisible: false,
        fileDeleteVisible:false,
        releaseTypeOptions:['版本更新','功能变更','数据修改','修复bug'],
        isBackup:['是','否'],
        fileTypes:[{typeValue:1,typeName:'原始附件'},{typeValue:2,typeName:'更新附件'}],
        releaseForm: {
          release_type: ''
        },
        fileForm: {
          fileType: ''
        },
        fileRules: {
          fileType: [
            {required: true, message: '请选择文件类型', trigger: 'change'},
          ]
        },
        releaseRules: {
          release_type: [
            {required: true, message: '请选择发布类型', trigger: 'change'},
          ]
        },
        editorOption:{
          placeholder: '请输入缺陷内容',
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
        bugOpenNum:0,
        recordItems: [],
        userList:[],
        releaseCreator:"",
        releaseVerifier:"",
        uploadFileList:[],
        fileList:[],
        originalFileList:[],
        latestFileList:[],
        delFileData:""
      }
    },
    created(){
      this.getUserList();
      this.getProjectReleaseInfo();
      this.getFileList();
    },
    methods :{
      getProjectReleaseInfo:function () {
        var vm=this;
        vm.$http({
          method: 'get',
          url: vm.config.baseUrl+'release/getProjectReleaseInfo',
          params:{
            release_id:vm.releaseId
          }
        }).then(function(response) {
          var data=response.data
          var code=data.code;
          if(code==0){
            vm.projectReleaseInfo=data.projectRelease;
            vm.releaseVerifier=data.projectRelease.releaseVerifier;
            vm.releaseCreator=data.projectRelease.releaseCreator;
          }else {
            console.log(data.msg)
          }
        }).catch(function(response){
          console.log(response)
        })
      },

      releaseFormOpen:function () {
        this.releaseFormVisible = true;
        this.releaseForm=JSON.parse(JSON.stringify( this.projectReleaseInfo));
        this.uecontent=this.releaseForm.release_content;
      },
      fileFormOpen:function () {
        this.fileFormVisible = true;
        this.$refs['fileForm'].resetFields();
        this.fileForm={
          fileType:null
        }
        this.fileList=[]

      },
      addFileSubmit:function () {
        var vm=this;
        vm.$refs['fileForm'].validate((valid) => {
          if (valid) {
         var fileParams={
             file_type:5,
             file_type_sub:vm.fileForm.fileType,
             file_type_id:vm.releaseId,
             project_id:vm.projectId
         }
            var formData = new FormData();
            for(var variable  in fileParams){
              formData.append(variable,fileParams[variable])
            }
            if(vm.uploadFileList.length>0){
              vm.uploadFileList.forEach(function (filedata,index) {
                formData.append('releaseFile',filedata)
              })
            }
            vm.$http({
              method: 'POST',
              url: this.config.baseUrl + 'release/addProjectReleaseFile',
              headers: {
                'Content-Type': 'multipart/form-data'
              },
              data: formData
            }).then(function (data) {
              var result = data.data;
              var response = result.code;
              if (response == 0) {
                vm.fileFormVisible = false;
                vm.$message({message: '提交成功！！', type: 'success'});
                vm.getFileList()
              } else {
                vm.$message.error('提交失败！！');
              }
            })
          }
        })
      },
      releaseSubmit:function () {
        var vm=this;
        vm.$refs['releaseForm'].validate((valid) => {
          if (valid) {
            var releaseInfo = this.releaseForm;
            releaseInfo.release_content=vm.$refs.ue.getUEContent();
            if(releaseInfo.release_time!=null&&releaseInfo.release_time.length>1){
              releaseInfo.release_time=vm.$moment(releaseInfo.release_time).format("YYYY-MM-DD");
            }
            releaseInfo.project_id=vm.projectId;
            vm.$http({
              method: 'POST',
              url: this.config.baseUrl + 'release/updateProjectRelease',
              data: releaseInfo
            }).then(function (data) {
              var result = data.data;
              var response = result.code;
              if (response == 0) {
                vm.releaseFormVisible = false;
                vm.$message({message: '提交成功！！', type: 'success'});
                vm.getProjectReleaseInfo()
              } else {
                vm.$message.error('提交失败！！');
              }
            })
          }
        })
      },

      getUserList:function(){
        var vm=this;
        vm.$http({
          method: 'get',
          url: vm.config.baseUrl+'user/getUserList'
        }).then(function(response) {
          var data=response.data;
          vm.userList=data.userList;
        }).catch(function(response){
          console.log(response)
        })
      },
      getFileList:function(){
        var vm=this;
        vm.$http({
          method: 'get',
          url: vm.config.baseUrl+'release/getProjectReleaseFileList',
          params:{
            release_id:vm.releaseId
          }
        }).then(function(response) {
          var data=response.data;
          var response = data.code;
          if (response == 0) {
              vm.latestFileList=data.latestFileList
              vm.originalFileList=data.originalFileList
          }
        }).catch(function(response){
          console.log(response)
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
            vm.getFileList()
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
  .demand-editor {
    line-height: 20px;
  }
  .bug-content table td{
    border: 1px solid #ddd;
  }
</style>
