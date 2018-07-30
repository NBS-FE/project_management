<template>
  <!--<el-container style="height: 100%">
    <el-header class="p-header">
      <span class="header-title">研发部项目管理系统</span>
      <div class="header-right">
        <div class="header-user-con">
          &lt;!&ndash;<div class="user-avator"><img src="../assets/img/user.png"></div>&ndash;&gt;
          <el-dropdown trigger="click" class="user-name" style="color:aliceblue;height: 60px;line-height: 60px">
              <span class="el-dropdown-link user-avator " style="height: 60px;display: block" >
                <img src="../assets/img/user.png">系统管理员<i class=" el-icon&#45;&#45;right"></i>
              </span>
            <el-dropdown-menu  slot="dropdown">
              <el-dropdown-item></el-dropdown-item>
              <el-dropdown-item @click.native="jumpUser"><i class="fa fa-user margin-right-5 info"></i>用户管理</el-dropdown-item>
              <el-dropdown-item @click.native="jumpPassword"><i class="fa fa-lock margin-right-5 success"></i>修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="jumpLogin"><i class="fa fa-power-off margin-right-5 danger"></i>用户注销</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </el-header>
  </el-container>-->
  <!--<el-container>
    <el-aside width="200px">
      <el-menu default-active="1"
               class="el-menu-left">
        <el-menu-item index="1">
          <i class="el-icon-location"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
    </el-main>
  </el-container>-->
  <div>
    <div style="background: #eee;height:50px;line-height:50px;margin:-20px;" class="margin-bottom-20">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block">
        <el-breadcrumb-item class="margin-left-20">用户管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button style="float:right" class="margin-top-10 margin-right-20" size="small" type="success" icon="el-icon-plus" @click="userFormOpen('add')" >新增用户</el-button>
    </div>
    <el-table :data="userList" border style="width: 100%;margin-top:10px;">
      <el-table-column label="序号" width="60" type="index" :index="indexMethod" ></el-table-column>
      <el-table-column prop="full_name" label="用户姓名"></el-table-column>
      <el-table-column prop="user_phone" label="电话"></el-table-column>
      <el-table-column prop="user_email" label="邮箱"></el-table-column>
      <el-table-column prop="user_duty" label="职责"></el-table-column>
      <el-table-column label="操作"  width="100">
        <template slot-scope="scope">
          <el-button type="primary" title="编辑" size="small" @click="userFormOpen('edit',scope.row)" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="userDeleteOpen(scope.row.user_id)" circle></el-button>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogTableVisible">
      <el-form :model="user"  :rules="rules" ref="user" label-width="80px">
        <el-form-item label="账户名称" prop="user_name">
          <el-input  placeholder="请输入账户名称" v-model="user.user_name"></el-input>
        </el-form-item>
        <el-form-item label="用户姓名" prop="full_name">
          <el-input  placeholder="请输入用户姓名" v-model="user.full_name"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="user_phone">
          <el-input  placeholder="请输入电话" v-model="user.user_phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="user_email">
          <el-input  placeholder="请输入邮箱" v-model="user.user_email"></el-input>
        </el-form-item>
        <el-form-item label="职责" prop="user_duty">
          <el-input  placeholder="请输入职责" v-model="user.user_duty"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="user_password">
          <el-input type="password" placeholder="请输入密码" v-model="user.user_password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password"  placeholder="请输入确认密码" v-model="user.checkPass" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取消</el-button>
        <el-button type="primary" @click="userSubmit">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除用户" :visible.sync="dialogDeleteVisible">
      <div class="fs16 danger">
        确定要删除该用户吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeleteVisible = false">取消</el-button>
        <el-button type="primary" @click="deleteSubmit">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改密码" :visible.sync="dialogPassVisible">
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
  </div>
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
        if(value!=null){
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
        userList:[],
        dialogTableVisible:false,
        dialogDeleteVisible:false,
        dialogPassVisible:false,
        delId:'',
        pageSize:10,
        currentPage:1,
        totalCount:0,
        dialogTitle:'新增用户',
        user:{
          user_name:'',
          full_name:'',
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
            {required: true, message: '请输入账号名称', trigger: 'change'},
          ],
          full_name:[
            {required: true, message: '请输入用户姓名', trigger: 'change'},
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
            {required: true, message: '请输入手机号', trigger: 'change'},
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
    },
    methods:{
      userFormOpen:function(type,obj){
        this.dialogTableVisible = true;
        this.objType = type;
        if(type=='add'){
          this.user={
              user_name:null
          }
          this.dialogTitle = '新增用户';
          this.$refs['user'].resetFields();
        }else{
          this.dialogTitle = '修改用户';
          this.user=JSON.parse(JSON.stringify(obj));
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
        this.$router.push({ path: '/common' })
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
            vm.$router.push({ path: '/login' });
            localStorage.removeItem('user');
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
