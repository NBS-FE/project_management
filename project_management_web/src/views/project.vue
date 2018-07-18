<template>
    <el-container style="height: 100%">
      <el-header class="p-header">

        <span style="cursor: pointer" class="header-title" @click="returnHomePage">{{projectInfo.project_name}}</span>

        <el-button size="small" @click="returnPage" class="" type="info" style="float: right;margin-top:15px " round><i class="fa fa-mail-reply margin-right-5"></i>返回</el-button>
        <div class="header-right">
          <div class="header-user-con">
            <!--<div class="user-avator"><img src="../assets/img/user.png"></div>-->
            <el-dropdown trigger="click" class="user-name" style="color:aliceblue;height: 60px;line-height: 60px">
              <span class="el-dropdown-link user-avator " style="height: 60px;display: block" >
                <img src="../assets/img/user.png">系统管理员<i class=" el-icon--right"></i>
              </span>
              <el-dropdown-menu  slot="dropdown">
                <el-dropdown-item></el-dropdown-item>
                <el-dropdown-item @click.native="jumpUser"><i class="fa fa-user margin-right-5 info"></i>用户管理</el-dropdown-item>
                <el-dropdown-item><i class="fa fa-lock margin-right-5 success"></i>修改密码</el-dropdown-item>
                <el-dropdown-item><i class="fa fa-power-off margin-right-5 danger"></i>用户注销</el-dropdown-item>

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
              <i class="el-icon-document"></i>
              <span slot="title">发布记录</span>
            </el-menu-item>
            <el-menu-item :index="'/project/conference/'+projectId">
              <i class="el-icon-phone-outline"></i>
              <span slot="title">会议记录</span>
            </el-menu-item>
            <el-menu-item :index="'/project/setting/'+projectId">
              <i class="el-icon-setting"></i>
              <span slot="title">项目设置</span>
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
      return {
        projectInfo:"",
        projectId:this.$route.params.projectId,
        activeRouter:this.$route.fullPath
      }
    },
    created(){
        this.getProjectInfo()
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
            vm.projectInfo=data.projectInfo
          }else {
              console.log(data.msg)
          }
        }).catch(function(response){
          console.log(response)
        })
      },
      jumpUser:function () {
        this.$router.push({ path: '/userList' })
      },
      returnPage:function () {
        this.$router.push({ path: '/projectlist' })
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
