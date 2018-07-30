<template>
    <el-container style="height: 100%">
      <el-header class="p-header">
        <span style="cursor: pointer" class="header-title" >研发部项目管理系统</span>
        <el-button size="small" @click="returnPage" class="" type="info" style="float: right;margin-top:15px " round><i class="fa fa-mail-reply margin-right-5"></i>返回</el-button>
        <div class="header-right">
          <div class="header-user-con">
            <router-link v-if="loginUser==null" class="fs16 warning" style="color:aliceblue" :to="'/login'">登录</router-link>
            <el-dropdown v-if="loginUser!=null" trigger="click" class="user-name" style="color:aliceblue;height: 60px;line-height: 60px">
              <span class="el-dropdown-link user-avator " style="height: 60px;display: block" >
                <img src="../assets/img/user.png">{{loginUser.full_name}}<i class=" el-icon--right"></i>
              </span>
              <el-dropdown-menu  slot="dropdown">
                <el-dropdown-item></el-dropdown-item>
                <el-dropdown-item @click.native="jumpUser"><i class="fa fa-user margin-right-5 info"></i>系统管理</el-dropdown-item>
                <el-dropdown-item @click.native="jumpPassword"><i class="fa fa-lock margin-right-5 success"></i>修改密码</el-dropdown-item>
                <el-dropdown-item @click.native="jumpLogin"><i class="fa fa-power-off margin-right-5 danger"></i>用户注销</el-dropdown-item>

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
            <el-menu-item :index="'/common/userList'">
              <i class="el-icon-location"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <el-menu-item :index="'/common/weekReport'">
              <i class="el-icon-menu"></i>
              <span slot="title">周报管理</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.user.checkPass !== '') {
            this.$refs.user.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.user.user_password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };
      return {
        loginUser:sessionStorage.getItem('user'),
        userList:[],
        dialogTableVisible:false,
        dialogDeleteVisible:false,
        dialogPassVisible:false,
        activeRouter:this.$route.fullPath,
        delId:'',
        pageSize:10,
        currentPage:1,
        totalCount:0,
        dialogTitle:'新增用户',
        user:{
          user_name:'',
          user_phone:'',
          user_email:'',
          user_duty:'',
          user_password:'',
          checkPass:''
        },
        pass:{
          user_password:'',
          checkPass:''
        },
        rules:{
          user_name:[
            {required: true, message: '请输入姓名', trigger: 'change'},
          ],
          user_password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          user_email: [
            {type: 'email',message: '请输入正确的邮箱地址',trigger:['blur', 'change']}
          ],
          user_phone: [
            {validator:checkPhone, trigger: 'blur'}
          ]

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
      this.getUserList(this.currentPage);
      if(this.loginUser!=null){
        this.loginUser=JSON.parse(this.loginUser)
      }
    },
    methods:{
      userFormOpen:function(type,obj){
        this.dialogTableVisible = true;
        this.objType = type;
        if(type=='add'){
          this.dialogTitle = '新增用户';
          this.$refs['user'].resetFields();
        }else{
          this.dialogTitle = '修改用户';
          this.user=obj;
        }
      },
      getUserList:function(currentPage){
        var vm=this;
        vm.$http({
          method: 'get',
          params:{currentPage:parseInt(currentPage)},
          url: vm.config.baseUrl+'user/getUserList'
        }).then(function(response) {
          var data=response.data;
          vm.userList=data.userList;
          vm.totalCount=data.count;
        }).catch(function(response){
          console.log(response)
        })
      },
      userDeleteOpen:function(deleteId){
        this.dialogDeleteVisible = true;
        this.delId = deleteId;
      },
      jumpUser:function () {
        this.$router.push({ path: '/common/userList' })
      },
      userSubmit: function () {
        var vm=this;
        this.$refs['user'].validate((valid) => {
          if(valid){
            var url='';
            if(vm.objType=='add'){
              url='user/register';
            }else{
              url='user/updateUser';
            }
            var userInfo = vm.user;
            vm.$http({
              method: 'POST',
              url: vm.config.baseUrl + url,
              data: userInfo
            }).then(function (data) {
              var result = data.data;
              var response = result.code;
              if (response == 0) {
                vm.dialogTableVisible = false;
                vm.getUserList(vm.currentPage);
                vm.$message({message: '提交成功！！', type: 'success'});
              } else {
                vm.$message.error('提交失败！！');
              }
            })
          }
        })
      },
      deleteSubmit: function () {
        var vm=this;
        vm.$http({
          method: 'POST',
          url: vm.config.baseUrl + 'user/deleteUser',
          data: {user_id:vm.delId}
        }).then(function (data) {
          var result = data.data;
          var response = result.code;
          if (response == 0) {
            vm.dialogDeleteVisible = false;
            vm.getUserList(vm.currentPage);
            vm.$message({message: '提交成功！！', type: 'success'});
          } else {
            vm.$message.error('提交失败！！');
          }
        })
      },
      jumpPassword:function () {
        this.dialogPassVisible = true;
        this.$refs['pass'].resetFields();
      },
      passSubmit:function () {
        var vm=this;
        this.$refs['pass'].validate((valid) => {
          if(valid){
            var userInfo = JSON.parse(localStorage.getItem('user'));
            userInfo.user_password = vm.pass;
            vm.$http({
              method: 'POST',
              url: vm.config.baseUrl + 'user/logOut',
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
      handleCurrentChange:function (val) {
        var vm=this;
        vm.currentPage = val;
        vm.getUserList(vm.currentPage);
      },
      indexMethod:function(index) {
        var vm=this;
        return (vm.currentPage-1)*10+index+1;
      },
      jumpLogin:function () {
        var vm=this;
        vm.$http({
          method: 'get',
          params:{},
          url: vm.config.baseUrl + 'user/logOut'
        }).then(function (data) {
          var result = data.data;
          var response = result.code;
          if (response == 0) {
            vm.$router.push({ path: '/projectlist' });
            sessionStorage.removeItem('user');
          }
        })
      },
      returnPage:function () {
        this.$router.push({ path: '/projectlist' })
      },
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
  .el-menu-left.el-menu {
    height: 100%;
  }
  .el-aside{
    background-color: #fff;
    -webkit-box-shadow: 0 0 10px 0 rgba(0,0,0,.2);
    -moz-box-shadow: 0 0 10px 0 rgba(0,0,0,.2);
    box-shadow: 0 0 10px 0 rgba(0,0,0,.2);
  }
</style>
