<template>
    <el-container>
      <el-header class="p-header"><span class="header-title">项目管理系统</span></el-header>
      <el-main>
        <div class="widget" style="width: 1000px;margin: 20px auto">
          <div class="widget-header" style="height: 45px">
            <span class="widget-caption fs16 warning" style="line-height: 45px;"><i class="fa fa-bar-chart"></i> 项目列表</span>
          </div><!--Widget Header-->
          <div class="widget-body project-list" style="min-height: 360px">
            <el-table
              :data="projectList"
              style="width: 100%">
              <el-table-column type="expand" >
                <template slot-scope="props" >
                 <div style="text-align: left">网站入口：
                 <a class="btn btn-default margin-left-10 info" v-for="(projectUrl,index) in props.row.ProjectUrls" target="_blank" v-bind:href="projectUrl.project_url">{{projectUrl.project_url_name}}<i class="margin-left-5 el-icon-d-arrow-right"></i></a>
                 </div>
                </template>
              </el-table-column>
              <el-table-column
                header-align="center"
                label="项目名称"
                prop="project_name"
                class-name="fs15" label-class-name="fs14">
              <!--  <template slot-scope="scope">
                  <span class="fs16">{{scope.row.project_name}}</span>
                </template>-->
              </el-table-column>
              <el-table-column
                width="150"
                header-align="center"
                label="状态"
                prop="project_status">
                <template slot-scope="scope">
                  <el-tag
                    :type="scope.row.project_status === '进行中' ? 'warning' : 'success'"
                    disable-transitions>{{scope.row.project_status}}</el-tag>
                </template>
              </el-table-column>

            </el-table>
          </div>
        </div>

      </el-main>
    </el-container>


</template>
<script>
  export default {
    data() {
      return {
        projectList: []
      }
    },
    created(){
        var vm=this;
      this.$axios({
        method: 'get',
        url: 'http://127.0.0.1:3000/project/getProjectList'
      }).then(function(response) {
        var data=response.data
        vm.projectList=data.projectList

      }).catch(function(response){
        console.log(response)
      })
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
  }
</style>
