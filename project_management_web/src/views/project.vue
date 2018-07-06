<template>
    <el-container style="height: 100%">
      <el-header class="p-header">
        <span class="header-title">{{projectInfo.project_name}}</span>
        <el-button size="small" @click="returnPage" type="info" style="float: right;margin-top:15px " round><i class="fa fa-mail-reply margin-right-5"></i>返回</el-button>
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
        activeRouter:'/project/home/'+this.$route.params.projectId
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
      returnPage:function () {
        this.$router.push({ path: '/projectlist' })
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
