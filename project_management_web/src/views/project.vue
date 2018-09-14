<template>
    <el-container style="height: 100%">
      <el-header class="p-header">

        <span style="cursor: pointer" class="header-title" @click="returnHomePage">{{projectInfo.project_name}}</span>

        <el-button size="small" @click="returnPage" class="" type="info" style="float: right;margin-top:15px " round><i class="fa fa-mail-reply margin-right-5"></i>返回</el-button>
        <div class="header-right">
          <div class="header-user-con">
            <!--<div class="user-avator"><img src="../assets/img/user.png"></div>-->
            <router-link v-if="loginUser==null" class="fs16 warning" style="color:aliceblue" :to="'/login'">登录</router-link>
            <el-dropdown v-if="loginUser!=null" trigger="click" class="user-name" style="color:aliceblue;height: 60px;line-height: 60px">
              <span class="el-dropdown-link user-avator " style="height: 60px;display: block" >
                <img src="../assets/img/user.png">{{loginUser.full_name}}<i class=" el-icon--right"></i>
              </span>
              <el-dropdown-menu  slot="dropdown">
                <el-dropdown-item></el-dropdown-item>
                <el-dropdown-item @click.native="jumpUser"><i class="fa fa-user margin-right-5 info"></i>系统管理</el-dropdown-item>
                <el-dropdown-item @click.native="jumpPassword"><i class="fa fa-lock margin-right-5 success"></i>修改密码</el-dropdown-item>
                <el-dropdown-item @click.native="userLogout"><i class="fa fa-power-off margin-right-5 danger"></i>用户注销</el-dropdown-item>

              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>

      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            :default-active="activeRouter" router
            class="el-menu-left">
              <el-menu-item :index="'/project/home/'+projectId">
                <i class="el-icon-location"></i>
                <span slot="title">项目首页</span>
              </el-menu-item>
              <el-menu-item :index="'/project/module/'+projectId">
                <i class="el-icon-menu"></i>
                <span slot="title">项目模块</span>
              </el-menu-item>
              <el-menu-item :index="'/project/demand/'+projectId">
                <i class="el-icon-location-outline"></i>
                <span slot="title">项目需求</span>
              </el-menu-item>
            <el-menu-item :index="'/project/bug/'+projectId">
              <i class="el-icon-view"></i>
              <span slot="title">缺陷记录</span>
            </el-menu-item>
            <el-menu-item :index="'/project/release/'+projectId">
              <i class="el-icon-share"></i>
              <span slot="title">发布记录</span>
            </el-menu-item>
            <el-menu-item :index="'/project/conference/'+projectId">
              <i class="el-icon-phone-outline"></i>
              <span slot="title">会议记录</span>
            </el-menu-item>
            <el-menu-item :index="'/project/file/'+projectId">
              <i class="el-icon-document"></i>
              <span slot="title">项目文档</span>
            </el-menu-item>

          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
      <el-dialog title="修改密码" :visible.sync="dialogPassVisible"  width="600px">
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
      </el-dialog>
    </el-container>


</template>
<script>
  export default {
<<<<<<< Updated upstream
    data() {
=======
    data()  {
>>>>>>> Stashed changes
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
        projectInfo:"",
        projectId:this.$route.params.projectId,
        activeRouter:this.$route.fullPath,
        dialogPassVisible:false,
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
        this.getProjectInfo();
      if(this.loginUser!=null){
        this.loginUser=JSON.parse(this.loginUser)
      }
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
          var data=response.data;
          var code=data.code;
          if(code==0){
            vm.projectInfo=data.projectInfo
          }else {
              console.log(data.msg)
          }
        }).catch(function(response){
          console.log(response)
        })
      },
      jumpUser:function () {
        this.$router.push({ path: '/common/userList' })
      },
      returnPage:function () {
        this.$router.push({ path: '/projectlist' })
      },
      jumpPassword:function () {
        this.dialogPassVisible = true;
        if(this.$refs['pass']!=undefined){
          this.$refs['pass'].resetFields();
        }
      },
      passSubmit:function () {
        var vm=this;
        this.$refs['pass'].validate((valid) => {
          if(valid){
            var userInfo = JSON.parse(sessionStorage.getItem('user'));
            userInfo.user_password = vm.pass.user_password;
            vm.$http({
              method: 'POST',
              url: vm.config.baseUrl + 'user/updateUser',
              data: userInfo
            }).then(function (data) {
              var result = data.data;
              var response = result.code;
              if (response == 0) {
                vm.dialogPassVisible = false;
                vm.$message({message: '提交成功！！', type: 'success'});
              } else {
                vm.$message.error('提交失败！！');
              }
            })
          }
        })
      },
      userLogout:function () {
          var vm=this;
        vm.$http({
          method: 'GET',
          url: vm.config.baseUrl + 'user/logOut',
        }).then(function (data) {
          var result = data.data;
          var response = result.code;
          if (response == 0) {
            vm.$router.push({ path: '/projectlist' });
            sessionStorage.removeItem('user');
            this.loginUser=null;
          } else {
            vm.$message.error("退出失败！！");
          }
        })

      },
      returnHomePage:function () {
          var homePath='/project/home/'+this.projectId;
        this.$router.push({ path: homePath });
        this.activeRouter=homePath
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      jumpPassword:function () {
        this.dialogPassVisible = true;
        if(this.$refs['pass']!=undefined){
          this.$refs['pass'].resetFields();
        }
      },
      passSubmit:function () {
        var vm=this;
        this.$refs['pass'].validate((valid) => {
          if(valid){
            var userInfo = JSON.parse(sessionStorage.getItem('user'));
            userInfo.user_password = vm.pass.user_password;
            vm.$http({
              method: 'POST',
              url: vm.config.baseUrl + 'user/updateUser',
              data: userInfo
            }).then(function (data) {
              var result = data.data;
              var response = result.code;
              if (response == 0) {
                vm.dialogPassVisible = false;
                vm.$message({message: '提交成功！！', type: 'success'});
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
  .header-title:hover,.header-title:focus{
    color: aliceblue;
  }
   .el-menu-left.el-menu {
    height: 100%;
  }
  .el-aside{
    background-color: #fff;
    -webkit-box-shadow: 0 0 10px 0 rgba(0,0,0,.2);
    -moz-box-shadow: 0 0 10px 0 rgba(0,0,0,.2);
    box-shadow: 0 0 10px 0 rgba(0,0,0,.2);
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
