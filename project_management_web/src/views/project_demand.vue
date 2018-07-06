<template>
   <div>
     项目需求正在开发中....
   </div>


</template>
<script>
  export default {
    data() {
      return {
        projectList: [],
        projectFormVisible: false,
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
      }
    },
    created(){
      this.getProjectList()
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
      projectSubmit:function () {
        var vm=this;
        vm.$refs['projectForm'].validate((valid) => {
          if (valid) {
            var projectInfo = this.projectForm;
            if(projectInfo.project_period!=null&&projectInfo.project_period.length>1){
              projectInfo.project_begin=vm.$moment(projectInfo.project_period[0]).format("YYYY-MM-DD");
              projectInfo.project_end=vm.$moment(projectInfo.project_period[1]).format("YYYY-MM-DD");

            }
            console.log(projectInfo)
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
  }
  .add-project .el-dialog__body{
    padding:10px 20px;
  }
</style>
