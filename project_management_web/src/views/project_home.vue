<template>
  <div>
    <div style="height:50px;background: #eee;margin: -20px;line-height: 50px" class="margin-bottom-20">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block">
        <el-breadcrumb-item class="margin-left-20">项目首页</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="width: 1000px;padding:  10px 20px">
      <div class="itme-title">项目基本信息
        <el-button type="primary"  style="float: right;margin-top: -5px"  size="small" plain @click="projectFormOpen"><i class="fa fa-edit margin-right-5"></i>修改项目</el-button>
      </div>
      <div class="padding-10">
        <table class="table table-bordered  fs14 home-table" >
          <tbody>
          <tr>
            <td width="150" class="info-title">项目名称</td>
            <td colspan="3">{{projectInfo.project_name}}</td>
          </tr>
          <tr>
            <td width="150" class="info-title">公司名称</td>
            <td colspan="3">{{projectInfo.project_company}}</td>
          </tr>
          <tr>
            <td width="150" class="info-title">项目周期</td>
            <td colspan="3">{{projectInfo.project_begin}} 至 {{projectInfo.project_end}}</td>
          </tr>
          <tr>
            <td width="150" class="info-title">项目版本</td>
            <td width="320">{{projectInfo.project_version}}</td>
            <td width="150" class="info-title">项目状态</td>
            <td><span v-bind:class="{warning:projectInfo.project_status=='进行中',success:projectInfo.project_status=='已完成'}">{{projectInfo.project_status}}</span></td>

          </tr>
          <tr>
            <td width="150" class="info-title">开发人员</td>
            <td colspan="3"><span v-if="developerList.length>0" v-for="(dev,index) in developerList">{{dev.full_name}}<i v-show="index<developerList.length-1">，</i></span></td>
          </tr>
          <tr>
            <td width="150" class="info-title">项目描述</td>
            <td colspan="3">{{projectInfo.project_desc}}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="itme-title margin-top-20">项目网址列表
        <el-button type="success"  style="float: right;margin-top: -5px"  size="small" plain @click="urlFormOpen('add')"><i class="fa fa-plus margin-right-5"></i>新增网址</el-button>

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
      </div>
      <el-dialog class="add-project" width="700px" title="修改项目" :visible.sync="projectFormVisible" :close-on-click-modal="false"  >
        <el-form :model="projectForm" :rules="projectRules" label-width="80px"  ref="projectForm"  style="padding: 0 20px">
          <el-form-item label="项目名称" prop="project_name" >
            <el-input  placeholder="请输入项目名称" v-model="projectForm.project_name">
            </el-input>
          </el-form-item>
          <el-form-item label="公司名称" prop="project_company" >
            <el-input  placeholder="请输入公司名称" v-model="projectForm.project_company">
            </el-input>
          </el-form-item>
          <el-form-item label="项目周期" prop="project_period" >
            <el-date-picker style="width: 100%"
                            v-model="projectForm.project_period"
                            type="daterange"
                            align="right"
                            unlink-panels
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="项目版本" prop="project_version" >
            <el-input  placeholder="请输入项目版本" v-model="projectForm.project_version">
            </el-input>
          </el-form-item>
          <el-form-item label="开发人员" prop="project_developer" >
            <el-select v-model="projectForm.project_developer" multiple style="width: 100%"  placeholder="请选择">
              <el-option
                v-for="item in userList"
                :key="item.user_id"
                :label="item.full_name"
                :value="item.user_id">
              </el-option>
            </el-select>
            <!--<el-input  placeholder="请输入开发人员" v-model="projectForm.project_developer">-->
            </el-input>
          </el-form-item>
          <el-form-item label="项目状态" prop="project_status" >
            <el-select v-model="projectForm.project_status" style="width: 100%" placeholder="请选择项目状态">
              <el-option
                v-for="item in projectStatusOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目介绍" prop="project_desc">
            <el-input type="textarea" rows="3" placeholder="请输入项目介绍" v-model="projectForm.project_desc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="projectFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="projectSubmit" >提交</el-button>
        </div>
      </el-dialog>
      <el-dialog class="url-panel" width="700px" title="修改网址" :visible.sync="urlFormVisible" :close-on-click-modal="false"  >
        <el-form :model="urlForm" :rules="urlRules" label-width="80px"  ref="urlForm"  style="padding: 0 20px">
          <el-form-item label="网址名称" prop="project_url_name" >
            <el-input  placeholder="请输入网址名称" v-model="urlForm.project_url_name">
            </el-input>
          </el-form-item>
          <el-form-item label="URL" prop="project_url" >
            <el-input  placeholder="请输入URL" v-model="urlForm.project_url">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="urlFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="urlSubmit" >提交</el-button>
        </div>
      </el-dialog>
      <el-dialog class="delete-panel" width="400px" title="删除网址" :visible.sync="urlDeleteVisible" :close-on-click-modal="false"  >
        <div class="fs16 danger">
          确定要删除该网址吗？
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="urlDeleteVisible = false">取消</el-button>
          <el-button type="primary" @click.native="urlDelete" >提交</el-button>
        </div>
      </el-dialog>
    </div>
  </div>



</template>
<script>
  export default {
    data() {
      return {
        projectInfo:"",
        projectId:this.$route.params.projectId,
        projectFormVisible: false,
        urlFormVisible: false,
        urlDeleteVisible: false,
        urlOptionType:"",
        urlDeleteId:"",
        projectStatusOptions:[
          '进行中','已完成'
        ],
        projectForm: {
          project_name: ''
        },
        projectRules: {
          project_name: [
            {required: true, message: '请输入项目名称', trigger: 'change'},
          ]
        },
        urlForm: {
          project_url_name: '',
          project_url: ''
        },
        urlRules: {
          project_url_name: [
            {required: true, message: '请输入网址名称', trigger: 'change'}
          ],
          project_url: [
            {required: true, message: '请输入网址URL', trigger: 'change'}
          ]
        },
        urlOpenNum:0,
        developerList:[],
        userList:[]
      }
    },
    created(){
      this.getProjectInfo()
      this.getUserList()
    },
    methods :{
      getProjectInfo:function () {
        var vm=this;
        vm.$http({
          method: 'get',
          url: vm.config.baseUrl+'project/getProjectInfo',
          params:{
            project_id:vm.projectId
          }
        }).then(function(response) {
          var data=response.data
          var code=data.code;
          if(code==0){
            vm.projectInfo=data.projectInfo;
            vm.developerList=data.developerList;

          }else {
            console.log(data.msg)
          }
        }).catch(function(response){
          console.log(response)
        })
      },
      projectFormOpen:function () {
          var vm=this;
        vm.projectFormVisible = true;
        vm.projectForm=JSON.parse(JSON.stringify(vm.projectInfo));
        if(vm.projectForm.project_developer!=null&&vm.projectForm.project_developer.length>0){
          vm.projectForm.project_developer=vm.projectForm.project_developer.split(',')
          vm.projectForm.project_developer.forEach(function (developerId,devindex) {
            vm.projectForm.project_developer[devindex]=parseInt(developerId)
          })
        }else {
          vm.projectForm.project_developer=[]
        }
        vm.projectForm.project_period=[new Date(vm.projectForm.project_begin),new Date(vm.projectForm.project_end)];
      },
      projectSubmit:function () {
        var vm=this;
        vm.$refs['projectForm'].validate((valid) => {
          if (valid) {
            var projectInfo = JSON.parse(JSON.stringify(this.projectForm));
            projectInfo.ProjectUrls=null;
            if(projectInfo.project_period!=null&&projectInfo.project_period.length>1){
              projectInfo.project_begin=vm.$moment(projectInfo.project_period[0]).format("YYYY-MM-DD");
              projectInfo.project_end=vm.$moment(projectInfo.project_period[1]).format("YYYY-MM-DD");
            }
            if(projectInfo.project_developer!=null&&projectInfo.project_developer.length>1) {
              projectInfo.project_developer = projectInfo.project_developer.toString();
            }
            console.log(projectInfo)
            vm.$http({
              method: 'POST',
              url: this.config.baseUrl + 'project/updateProject',
              data: projectInfo
            }).then(function (data) {
              var result = data.data;
              var response = result.code;
              if (response == 0) {
                vm.projectFormVisible = false;
                vm.$message({message: '提交成功！！', type: 'success'});
                vm.getProjectInfo()
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
</style>
