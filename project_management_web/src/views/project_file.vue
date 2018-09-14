<template>
   <div>
     <div style="height:50px;background: #eee;margin: -20px;line-height: 50px" class="margin-bottom-20">
       <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block">
         <el-breadcrumb-item class="margin-left-20">项目文档</el-breadcrumb-item>
       </el-breadcrumb>

       <el-upload
         class="upload-demo  margin-right-20"
         :action="uploadUrl"
         name="projectFile"
         :data="uploadParams"
         multiple
         :limit="3"
         ref="upload"
         :on-success="fileUploadSuccess"
         style="float: right;" >
         <el-button size="small" type="success" icon="el-icon-upload">上传项目文档</el-button>
         <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
       </el-upload>

       <!--<el-button type="success" class="margin-top-10 margin-right-20" size="small" style="float: right;"   icon="el-icon-plus">新增项目文档</el-button>-->
     </div>

     <el-table
       :data="projectFileList"
       border
       style="width: 100%">
       <el-table-column
         label="序号"
         width="60"
         type="index"
         :index="indexMethod"
       >
       </el-table-column>
       <el-table-column
         prop="file_upload_name"
         label="文档名称"
       >
       </el-table-column>
       <el-table-column
         prop="file_upload_type"
         label="模块"
         width="150"
       >
         <template slot-scope="scope" >
           <span v-if="scope.row.file_upload_type==2">项目模块</span>
           <span v-else-if="scope.row.file_upload_type==3">项目需求</span>
           <span v-else-if="scope.row.file_upload_type==4">缺陷记录</span>
           <span v-else-if="scope.row.file_upload_type==5">发布记录</span>
           <span v-else-if="scope.row.file_upload_type==6">会议记录</span>
         </template>
       </el-table-column>
       <el-table-column
         prop="file_upload_creator"
         label="创建人"
         width="150"
       >
       </el-table-column>
       <el-table-column
         prop="file_upload_create_time"
         width="150"
         label="创建时间">
         <template slot-scope="scope" >

           <span v-show="scope.row.file_upload_create_time!=null">{{scope.row.file_upload_create_time | dateFormat('YYYY-MM-DD')}}</span>
         </template>
       </el-table-column>
       <el-table-column
         width="100"
         label="操作">
         <template slot-scope="scope" >

           <a target="_blank" :href="config.baseUrl+scope.row.file_upload_url"><el-button type="primary" size="small"  title="文档下载" icon="el-icon-download" circle></el-button></a>
           <el-button type="danger" size="small" @click="fileDeleteOpen(scope.row)" title="删除文档" icon="el-icon-delete" circle></el-button>
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
     <el-dialog class="delete-panel" width="400px" title="附件删除" :visible.sync="fileDeleteVisible" :close-on-click-modal="false"  >
       <div class="fs16 danger">
         确定要删除该文档吗？
       </div>
       <div slot="footer" class="dialog-footer">
         <el-button @click.native="fileDeleteVisible = false">取消</el-button>
         <el-button type="primary" @click.native="fileDelete" >提交</el-button>
       </div>
     </el-dialog>
   </div>


</template>
<script>
  export default {
    data() {
      return {
        currentPage:1,
        totalCount:0,
        uploadUrl:this.config.baseUrl+'file/addFile',
        projectFileList: [],
        projectId:this.$route.params.projectId,
        uploadParams:{project_id:this.$route.params.projectId},
        fileList: [],
        uploadFileList: [],
        delFileData:"",
        fileDeleteVisible : false,
      }
    },
    created(){
      this.getProjectFileList()
    },
    methods :{
      getProjectFileList:function (cPage) {
        var vm=this;
        if(cPage==null){
          cPage=1;
          vm.currentPage=1
        }
        vm.$http({
          method: 'get',
          url: vm.config.baseUrl+'file/getFileListByProjectId',
          params:{
              project_id:vm.projectId,
            currentPage:cPage
          }
        }).then(function(response) {
          var data=response.data
          var code=data.code;
          if(code==0){
            vm.projectFileList=data.fileList;
            vm.totalCount=data.count
          }else {
            console.log(data.msg)
          }

        }).catch(function(response){
          console.log(response)
        })
      },
      handleCurrentChange:function (val) {
        var vm=this;
        vm.currentPage = val;
        vm.getProjectFileList(val);
      },
      indexMethod(index) {
        return (this.currentPage-1)*10+1+index;
      },
      fileDeleteOpen:function (fileData) {
        this.delFileData=fileData;
        this.fileDeleteVisible = true;
      },
      fileUploadSuccess:function () {
        this.$refs.upload.clearFiles();
        this.$message({message: '上传成功！！', type: 'success'});
        this.getProjectFileList()
      },
      fileDelete:function () {
        var vm=this;
        vm.$http({
          method: 'POST',
          url: this.config.baseUrl + 'file/deleteFile',
          data: vm.delFileData
        }).then(function (data) {
          var result = data.data;
          var response = result.code;
          if (response == 0) {
            vm.fileDeleteVisible = false;
            vm.$message({message: '删除成功！！', type: 'success'});
            vm.getProjectFileList()
          } else {
            vm.$message.error('提交失败！！');
          }
        })
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
