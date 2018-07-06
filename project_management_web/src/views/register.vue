<template>
    <div style="width: 500px;margin: 200px auto">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input type="text" v-model="user.user_name"></el-input>
        </el-form-item>
        <el-form-item label="手机">
          <el-input type="text" v-model="user.user_phone"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input type="email" v-model="user.user_email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="user.user_password"></el-input>
        </el-form-item>
        <el-col style="text-align: center;margin-top:10px;">
          <el-button id="register" @click="registerUser"  type="primary">注册</el-button>
        </el-col>
      </el-form>
    </div>
</template>

<script>
 export default {
    name: 'register',
    data(){
        return {
          user:{
            user_name:'',
            user_phone:'',
            user_email:'',
            user_password:''
          }
        }
    },
   methods:{
     registerUser(){
       this.$http.post('http://127.0.0.1:3000/user/register',{

       },{}).then((response) => {

       })
     }
   }
 }
</script>

<style>

</style>
