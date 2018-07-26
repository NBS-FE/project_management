<template>
    <div class="login-box" id="hello">
      <el-form :model="user" ref="user" :rules="rules" label-width="40px">
        <el-form-item label="账号" prop="name">
          <el-input id="name" auto-complete="off" v-model="user.user_name" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input id="password" type="password" auto-complete="off" v-model="user.user_password" clearable></el-input>
        </el-form-item>
        <el-form-item style="text-align: center;">
          <el-button type="primary" @click="submitForm()">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        user:{
          user_name:'',
          user_password:''
        },
        rules: {
          user_name: [
            {required: true, message: '请输入账号', trigger: 'change'},
          ],
          user_password: [
            {required: true, message: '请输入密码', trigger: 'change'}
          ]
        },
      }
    },
    methods: {
      submitForm(){
        var vm =this;
        vm.$refs['user'].validate((valid) => {
            if(valid){
              vm.$http.post('http://127.0.0.1:3000/user/login', {
                user_name: vm.user.user_name,
                user_password: vm.user.user_password,
              }, {}).then((response) => {
                var data = response.data;
                var status = data.code;
                if(status==0){
                  var user = data.user;
                  if(user){
                    localStorage.setItem('user',JSON.stringify(user));
                    vm.$router.push({path: '/projectlist'});
                  }
                }else{
                  vm.$message.error('登录失败！！');
                }
              })
            }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login-box {
    margin-top:15%;
    margin-left:30%;
    background-image:url(../assets/back.png);
    width:500px;
    height:260px;
    padding:60px 50px;
  }
</style>
