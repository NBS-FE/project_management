<template>
    <el-container>
      <el-header class="p-header">
        <span class="header-title">研发部项目管理系统</span>
        <div class="header-right">
          <div class="header-user-con">
            <router-link v-if="loginUser==null" class="fs16 warning" style="color:aliceblue" :to="'/login'">登录</router-link>
            <!--<div class="user-avator"><img src="../assets/img/user.png"></div>-->
            <el-dropdown trigger="click" v-if="loginUser!=null" class="user-name" style="color:aliceblue;height: 60px;line-height: 60px">
              <span class="el-dropdown-link user-avator " style="height: 60px;display: block" >
                <img src="../assets/img/user.png">{{loginUser.full_name}}<i class=" el-icon--right"></i>
              </span>
              <el-dropdown-menu  slot="dropdown">
                <el-dropdown-item></el-dropdown-item>
                <el-dropdown-item @click.native="jumpUser"><i class="fa fa-user margin-right-5 info"></i>系统管理</el-dropdown-item>
                <el-dropdown-item><i class="fa fa-lock margin-right-5 success"></i>修改密码</el-dropdown-item>
                <el-dropdown-item @click.native="userLogout"><i class="fa fa-power-off margin-right-5 danger"></i>用户注销</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main>
        <div class="widget" style="width: 1000px;margin: 20px auto">
          <div class="widget-header" style="height: 45px">
            <span class="widget-caption fs16 warning" style="line-height: 45px;"><i class="fa fa-bar-chart"></i> 项目列表</span>
            <el-button type="primary"  class="margin-top-5 margin-right-10" size="small" plain @click="projectFormOpen"><i class="fa fa-plus margin-right-5"></i>新增项目</el-button>
          </div><!--Widget Header-->
          <div class="widget-body project-list" style="min-height: 360px">
            <el-table
              :data="projectList"
              style="width: 100%">
              <el-table-column type="expand" >
                <template slot-scope="props" >
                 <div style="text-align: left" v-show="props.row.ProjectUrls&&props.row.ProjectUrls.length>0">网站入口：
                    <a class="btn btn-default margin-left-10 info" v-for="(projectUrl,index) in props.row.ProjectUrls" target="_blank" v-bind:href="projectUrl.project_url">{{projectUrl.project_url_name}}<i class="margin-left-5 el-icon-d-arrow-right"></i></a>
                 </div>

                  <div style="text-align: left" class="danger" v-show="props.row.ProjectUrls==null||props.row.ProjectUrls.length==0">
                    该项目暂无网站入口
                  </div>
                </template>
              </el-table-column>
              <el-table-column

                label="项目名称"
                prop="project_name"
                class-name="fs15" label-class-name="fs14">
                <template slot-scope="scope">
                  <router-link class="fs16 " style="color:#606266" :to="'/project/home/'+scope.row.project_id">{{scope.row.project_name}}</router-link>
                </template>
              </el-table-column>
              <el-table-column
                width="150"
                header-align="center"
                class-name="text-center"
                label="状态"
                prop="project_status">
                <template slot-scope="scope" >
                  <el-tag
                    :type="scope.row.project_status === '进行中' ? 'warning' : 'success'"
                    disable-transitions>{{scope.row.project_status}}</el-tag>
                </template>
              </el-table-column>

            </el-table>
          </div>
        </div>
      </el-main>
      <el-dialog class="add-project" title="新增项目" :visible.sync="projectFormVisible" :close-on-click-modal="false"  >
        <el-form :model="projectForm" :rules="projectRules" label-width="80px"  ref="projectForm"  style="padding: 0 20px">
          <el-form-item label="项目名称" prop="project_name" >
            <el-input  placeholder="请输入项目名称" v-model="projectForm.project_name">
            </el-input>
          </el-form-item>
          <el-form-item label="公司名称" prop="company_name" >
            <el-input  placeholder="请输入公司名称" v-model="projectForm.company_name">
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
      <!--<el-dialog title="修改密码" :visible.sync="dialogPassVisible">
        <el-form :model="pass"  :rules="passRules" ref="pass" label-width="80px">
          <el-form-item label="新密码" prop="user_password">
            <el-input type="password" v-model="pass.user_password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="pass.checkPass" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogPassVisible = false">取消</el-button>
          <el-button type="primary" @click="passSubmit">确定</el-button>
        </div>
      </el-dialog>-->
    </el-container>


</template>
<script>
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.pass.checkPass !== '') {
            this.$refs.pass.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.pass.user_password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        loginUser:sessionStorage.getItem('user'),
        projectList: [],
        projectFormVisible: false,
        dialogPassVisible:false,
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
        projectOpenNum:0,
        pass:{
          user_password:'',
          checkPass:''
        },
        passRules:{
          user_password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        }

      }
    },
    created(){
      this.getProjectList();
      if(this.loginUser!=null){
          this.loginUser=JSON.parse(this.loginUser)
      }
    },
    methods :{
      getProjectList:function () {
        var vm=this;
        vm.$http({
          method: 'get',
          url: vm.config.baseUrl+'project/getProjectList'
        }).then(function(response) {
          var data=response.data
          vm.projectList=data.projectList

        }).catch(function(response){
          console.log(response)
        })
      },
      projectFormOpen:function () {
        this.projectFormVisible = true;
        this.projectOpenNum++;
        if(this.projectOpenNum>1){
          this.$refs['projectForm'].resetFields();
        }
        this.projectForm={
            project_name:null,
            company_name:null,
            project_period:null,
            project_status:null,
            project_desc:null
        };

      },
      jumpUser:function () {
        this.$router.push({ path: '/common/userList' })
      },
      userLogout:function () {
        var vm=this;
        vm.$http({
          method: 'GET',
          url: this.config.baseUrl + 'user/logOut',
        }).then(function (data) {
          var result = data.data;
          var response = result.code;
          if (response == 0) {
            vm.$router.push({ path: '/projectlist' });
            sessionStorage.removeItem('user');
            vm.loginUser=null;
          } else {
            vm.$message.error("退出失败！！");
          }
        })

      },
      projectSubmit:function () {
        var vm=this;
        vm.$refs['projectForm'].validate((valid) => {
          if (valid) {
            var projectInfo = this.projectForm;
            if(projectInfo.project_period!=null&&projectInfo.project_period.length>1){
              projectInfo.project_begin=vm.$moment(projectInfo.project_period[0]).format("YYYY-MM-DD");
              projectInfo.project_end=vm.$moment(projectInfo.project_period[1]).format("YYYY-MM-DD");

            }
            //console.log(projectInfo)
            vm.$http({
              method: 'POST',
              url: this.config.baseUrl + 'project/addProject',
              data: projectInfo
            }).then(function (data) {
              var result = data.data;
              var response = result.code;
              if (response == 0) {
                vm.projectFormVisible = false;
                vm.$message({message: '提交成功！！', type: 'success'});
                vm.getProjectList()
              } else {
                vm.$message.error('提交失败！！');
              }
            })
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
    background-color: #f9f9f9;
  }
  .add-project .el-dialog__body{
    padding:10px 20px;
  }

  .project-list .el-table__expanded-cell:hover {
    background-color: #f9f9f9!important;
  }
  .header-right{
    float: right;
    padding-right: 10px;
  }
  .header-user-con{
    display: flex;
    height: 60px;
    align-items: center;
  }
  .user-name{
    margin-left: 10px;
  }

  .user-avator img{
    margin-right: 5px;
    width:30px;
    height:30px;
    border-radius: 50%;
  }
</style>
