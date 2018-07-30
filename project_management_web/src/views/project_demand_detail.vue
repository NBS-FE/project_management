<template>
  <div>
    <div style="height:50px;background: #eee;margin: -20px;line-height: 50px" class="margin-bottom-10">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block">
        <el-breadcrumb-item class="margin-left-20" :to="{ path: '/project/demand/'+projectId }">项目需求</el-breadcrumb-item>
        <el-breadcrumb-item>需求详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="width: 1000px;padding:  10px 20px">
      <div class="itme-title">需求基本信息
        <el-button type="primary"  style="float: right;margin-top: -5px"  size="small" plain @click="demandFormOpen"><i class="fa fa-edit margin-right-5"></i>修改需求</el-button>
      </div>
      <div class="padding-10">
        <table class="table table-bordered  fs14 home-table" >
          <tbody>
          <tr>
            <td width="150" class="info-title">需求标题</td>
            <td colspan="3">{{projectDemandInfo.demand_title}}</td>
          </tr>
          <tr>
            <td width="150" class="info-title">创建时间</td>
            <td width="320">{{projectDemandInfo.demand_create_time | dateFormat('YYYY-MM-DD')}}</td>
            <td width="150" class="info-title">需求状态</td>
            <td >{{projectDemandInfo.demand_status}}</td>
          </tr>


          <tr>
            <td colspan="4" class="info-title">需求内容</td>

          </tr>
          <tr>
            <td colspan="4"><div  style="min-height: 100px" class="demand-content" v-html="projectDemandInfo.demand_content"></div></td>
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
      <el-dialog class="demand-panel" width="900px" title="修改需求" :visible.sync="demandFormVisible" :close-on-click-modal="false"  >
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
              :before-upload="beforeUpload"
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
        projectDemandInfo:"",
        projectId:this.$route.params.projectId,
        demandId:this.$route.params.demandId,
        demandFormVisible: false,
        demandStatusOptions:[
          '进行中','已完成'
        ],
        demandForm: {
          demand_title: ''
        },
        demandRules: {
          demand_title: [
            {required: true, message: '请输入需求标题', trigger: 'change'},
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
        fileList: []
      }
    },
    created(){
      this.getProjectDemandInfo()
    },
    methods :{
      getProjectDemandInfo:function () {
        var vm=this;
        vm.$http({
          method: 'get',
          url: vm.config.baseUrl+'project/getProjectDemandInfo',
          params:{
            demand_id:vm.demandId
          }
        }).then(function(response) {
          var data=response.data
          var code=data.code;
          if(code==0){
            vm.projectDemandInfo=data.projectDemandInfo
            vm.demandForm=JSON.parse(JSON.stringify(data.projectDemandInfo));
            vm.uecontent=vm.demandForm.demand_content;
          }else {
            console.log(data.msg)
          }
        }).catch(function(response){
          console.log(response)
        })
      },
      demandFormOpen:function () {
        this.demandFormVisible = true;
        this.demandForm=JSON.parse(JSON.stringify( this.projectDemandInfo));
      },
      demandSubmit:function () {
        var vm=this;
        vm.$refs['demandForm'].validate((valid) => {
          if (valid) {
            var demandInfo = this.demandForm;
            if(demandInfo.demand_create_time!=null&&demandInfo.demand_create_time.length>1){
              demandInfo.demand_create_time=vm.$moment(demandInfo.demand_create_time).format("YYYY-MM-DD");
            }
            demandInfo.demand_content=vm.$refs.ue.getUEContent();
            demandInfo.project_id=vm.projectId;
            var formData = new FormData();
            for(var variable  in demandInfo){
              formData.append(variable,demandInfo[variable])
            }
            if(vm.fileList.length>0){
                vm.fileList.forEach(function (filedata,index) {
                  formData.append('file'+index,filedata.raws)
                })
            }
            vm.$http({
              method: 'POST',
              url: this.config.baseUrl + 'project/updateProjectDemand',
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
                vm.getProjectDemandInfo()
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
      beforeUpload(file,fileList) {
        console.log(fileList)

        return false;
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
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
    padding: 12px!important;
  }
  .demand-editor {
    line-height: 20px;
  }
  .demand-content table td{
    border: 1px solid #ddd;
  }
</style>
