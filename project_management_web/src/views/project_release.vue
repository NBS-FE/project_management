<template>
  <div class="margin-bottom-50">
    <div style="height:50px;background: #eee;margin: -20px;line-height: 50px" class="margin-bottom-20">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block">
        <el-breadcrumb-item class="margin-left-20">发布记录</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="success" class="margin-top-10 margin-right-20" size="small" style="float: right;" @click="releaseFormOpen"  icon="el-icon-plus">新增发布</el-button>
    </div>

    <el-table
      :data="projectReleaseList"
      border
      style="width: 100%;">
      <el-table-column
        label="序号"
        width="60"
        type="index"
        :index="indexMethod"
      >
      </el-table-column>
      <el-table-column
        prop="release_time"
        label="发布时间"
      >
        <template slot-scope="scope" >
          {{scope.row.release_time | dateFormat('YYYY-MM-DD')}}
        </template>
      </el-table-column>
      <el-table-column
        prop="releaseCreator.full_name"
        width="150"
        label="发布人">
      </el-table-column>
      <el-table-column
        prop="release_type"
        width="150"
        label="发布类型">
      </el-table-column>
      <el-table-column
        prop="release_project_name"
        width="150"
        label="项目名称">
      </el-table-column>
      <el-table-column
        prop="release_is_backup"
        label="是否备份"
      >
      </el-table-column>
      <el-table-column
        prop="releaseVerifier.full_name"
        label="验证人"
      >
      </el-table-column>
      <el-table-column
        width="100"
        label="操作">
        <template slot-scope="scope" >
          <router-link :to="{ path: '/project/releasedetail/'+projectId+'/'+scope.row.release_id}">

            <el-button icon="el-icon-search" size="small" type="primary" title="查看详情"  circle></el-button>
          </router-link>
          <!--<el-button type="primary" size="small" :to="{ path: '/project/demanddetail/'+scope.row.demand_id }" icon="el-icon-search">详情</el-button>-->
          <el-button type="danger" size="small" v-show="scope.row.release_creator==loginUser.user_id" @click="releaseDeleteOpen(scope.row.release_id)" title="删除缺陷" icon="el-icon-delete" circle></el-button>
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
    <el-dialog class="release-panel" width="900px" title="新增发布记录" :visible.sync="releaseFormVisible" :close-on-click-modal="false"  >
      <el-form :model="releaseForm" :rules="releaseRules" label-width="80px"  ref="releaseForm"  style="padding: 0 20px">

        <el-form-item label="发布时间" prop="bug_level" >
          <el-col :span="10">
            <el-date-picker style="width: 100%"
                            v-model="releaseForm.release_time"
                            type="date"
                            placeholder="请选择发布时间">
            </el-date-picker>
          </el-col>
          <el-col   class="line text-right padding-right-10" :span="4">发布类型</el-col>
          <el-col :span="10">
            <el-select v-model="releaseForm.release_type" clearable style="width: 100%" placeholder="请选择发布类型">
              <el-option
                v-for="item in releaseTypeOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="项目名称" prop="bug_title" >
          <el-input  placeholder="请输入发布的项目或版本名称" v-model="releaseForm.release_project_name">
          </el-input>
        </el-form-item>
        <el-form-item label="发布地址" prop="bug_title" >
          <el-input  placeholder="请输入发布地址" v-model="releaseForm.release_url">
          </el-input>
        </el-form-item>
        <el-form-item label="是否备份" prop="bug_handler" >
          <el-col :span="10">
            <el-select v-model="releaseForm.release_is_backup" style="width: 100%" placeholder="请选择是否备份">
              <el-option
                v-for="item in isBackup"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
            <!--<el-input  placeholder="请输入处理人" v-model="bugForm.bug_handler"></el-input>-->
          </el-col>
          <el-col  class="line text-right padding-right-10" :span="4">验证人</el-col>
          <el-col :span="10">
            <el-select v-model="releaseForm.release_verifier" style="width: 100%" placeholder="请选择验证人">
              <el-option
                v-for="item in userList"
                :key="item.user_id"
                :label="item.full_name"
                :value="item.user_id">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="发布内容"  prop="release_content">
          <div class="demand-editor">
            <!--<ueditor :content=uetest :config=ueconfig :id="ue1"></ueditor>-->
            <UE :defaultMsg='uetest' :config=ueconfig ref="ue" ></UE>
            <!--<quill-editor
              style="height: 100px"
              v-model="bugForm.bug_content"
              ref="myQuillEditor"
              :options="editorOption">
            </quill-editor>-->
          </div>

        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="releaseFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="releaseSubmit" >提交</el-button>
      </div>
    </el-dialog>
    <el-dialog class="delete-panel" width="400px" title="删除发布记录" :visible.sync="releaseDeleteVisible" :close-on-click-modal="false"  >
      <div class="fs16 danger">
        确定要删除该发布记录吗？
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="releaseDeleteVisible = false">取消</el-button>
        <el-button type="primary" @click.native="releaseDelete" >提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import UE from '@/components/ue.vue';
  export default {
    components: {UE},
    data() {
      return {
        uetest:"",
        ueconfig: {
          initialFrameWidth: null,
          initialFrameHeight: 200,
          wordCount: false,
          toolbars: this.config.ueditorToolbar
        },
        loginUser:JSON.parse(sessionStorage.getItem('user')),
        currentPage:1,
        totalCount:0,
        projectReleaseList: [],
        releaseFormVisible: false,
        releaseDeleteVisible: false,
        projectId:this.$route.params.projectId,
        releaseDeleteId:"",
        releaseTypeOptions:['版本更新','功能变更','数据修改','修复bug'],
        isBackup:['是','否'],
        releaseForm: {
          release_type: ''
        },
        releaseRules: {
          release_type: [
            {required: true, message: '请输入需求标题', trigger: 'change'},
          ]
        },
        releaseOpenNum:0,
        editorOption:{
          placeholder: '请输入项目内容',
          modules:{
            toolbar:[
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': [] }],
              [{ 'align': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ]
          }
        },
        userList:[]
      }
    },
    created(){
      this.getProjectReleaseList();
      this.getUserList()
    },
    methods :{
      getProjectReleaseList:function (cPage) {
        var vm=this;
        if(cPage==null){
          cPage=1;
          vm.currentPage=1;
        }
        vm.$http({
          method: 'get',
          url: vm.config.baseUrl+'release/getProjectReleaseList',
          params:{
            project_id:vm.projectId,
            currentPage:cPage
          }
        }).then(function(response) {
          var data = response.data
          var statusCode=data.code;
          if(statusCode==0) {

            vm.projectReleaseList = data.projectReleaseList
            vm.totalCount=data.count

          }

        }).catch(function(response){
          console.log(response)
        })
      },
      handleCurrentChange:function (val) {
        var vm=this;
        vm.currentPage = val;
        vm.getProjectBugList(val);
      },
      releaseFormOpen:function () {
        this.releaseFormVisible = true;
        this.releaseOpenNum++;
        if(this.releaseOpenNum>1){
          this.$refs['bugForm'].resetFields();
        }
        this.bugForm= {
          bug_title: null,
          bug_create_time: null,
          bug_status: null,
          bug_content: ""
        };

      },
      releaseSubmit:function () {
        var vm=this;
        vm.$refs['releaseForm'].validate((valid) => {
          if (valid) {
            var releaseInfo = this.releaseForm;
            releaseInfo.release_content=vm.$refs.ue.getUEContent();
            if(releaseInfo.release_time!=null&&releaseInfo.release_time.length>1){
              releaseInfo.release_time=vm.$moment(releaseInfo.release_time).format("YYYY-MM-DD");
            }
            releaseInfo.project_id=vm.projectId;
            vm.$http({
              method: 'POST',
              url: this.config.baseUrl + 'release/addProjectRelease',
              data: releaseInfo
            }).then(function (data) {
              var result = data.data;
              var response = result.code;
              if (response == 0) {
                vm.releaseFormVisible = false;
                vm.$message({message: '提交成功！！', type: 'success'});
                vm.getProjectReleaseList()
              } else {
                vm.$message.error('提交失败！！');
              }
            })
          }
        })
      },
      releaseDeleteOpen:function (delId) {
        this.releaseDeleteId=delId;
        this.releaseDeleteVisible = true;
      },
      releaseDelete:function () {
        var vm=this;
        vm.$http({
          method: 'POST',
          url: this.config.baseUrl + 'release/deleteProjectRelease',
          data: {
            release_id:vm.releaseDeleteId
          }
        }).then(function (data) {
          var result = data.data;
          var response = result.code;
          if (response == 0) {
            vm.releaseDeleteVisible = false;
            vm.$message({message: '删除成功！！', type: 'success'});
            vm.getProjectReleaseList()
          } else {
            vm.$message.error('提交失败！！');
          }
        })
      },
      indexMethod(index) {
        return ((this.currentPage-1)*10+1)+index;
      },
      getUserList:function(){
        var vm=this;
        vm.$http({
          method: 'get',
          url: vm.config.baseUrl+'user/getUserList'
        }).then(function(response) {
          var data=response.data;
          vm.userList=data.userList;
        }).catch(function(response){
          console.log(response)
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
  .demand-editor {
    line-height: 20px;
  }
  .edui-editor{
    z-index: 9999!important;
  }
</style>
