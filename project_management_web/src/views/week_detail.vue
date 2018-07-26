<template>
    <div>
      <div style="height:50px;background: #eee;margin: -20px;line-height: 50px" class="margin-bottom-10">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block">
          <el-breadcrumb-item class="margin-left-20" :to="{ path: '/common/weekReport' }">周报管理</el-breadcrumb-item>
          <el-breadcrumb-item>周报详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div style="width: 1000px;padding:  10px 20px">
        <div class="itme-title">周报基本信息
        </div>
        <div class="padding-10">
          <table class="table table-bordered  fs14 home-table" >
            <tbody>
            <tr>
              <td width="150" class="info-title">标题</td>
              <td colspan="3">{{weekInfo.report_title}}</td>
            </tr>
            <tr>
              <td width="150" class="info-title">时间</td>
              <td colspan="3">{{weekInfo.report_time}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="itme-title margin-top-20">列表
          <el-button type="success"  style="float: right;margin-top: -5px"  size="small" plain @click="peopleFormOpen"><i class="fa fa-plus margin-right-5"></i>新增</el-button>
        </div>
        <div class="padding-10">
          <el-table :data="weekPeopleList" border style="width: 100%;margin-top:10px;">
            <el-table-column label="序号" width="60" type="index" :index="indexMethod" ></el-table-column>
            <el-table-column prop="user_name" width="100" label="姓名"></el-table-column>
            <el-table-column  label="工作内容">
              <template slot-scope="scope">
                <div v-html="scope.row.content"></div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="60">
              <template slot-scope="scope">
                <el-button type="primary" title="编辑" size="small" @click="peopleFormOpen('edit',scope.row)" icon="el-icon-edit" circle></el-button>
                <!--<el-button type="danger" size="small" icon="el-icon-delete" @click="userDeleteOpen(scope.row.user_id)" circle></el-button>-->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog class="bug-record-panel" width="900px" :title="title" :visible.sync="bugRecordFormVisible" :close-on-click-modal="false"  >
          <el-form :model="peopleRecordForm" :rules="bugRecordRules" label-width="80px"  ref="peopleRecordForm"  style="padding: 0 20px">
            <el-form-item label="姓名" prop="user_name" >
              <el-input  placeholder="请输入创建人" v-model="peopleRecordForm.user_name"></el-input>
            </el-form-item>
            <el-form-item label="工作内容"  prop="content">
              <UE :defaultMsg='uecontent' :config=ueconfig ref="ue"></UE>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click.native="bugRecordFormVisible = false">取消</el-button>
            <el-button type="primary" @click.native="peopleRecordSubmit" >提交</el-button>
          </div>
        </el-dialog>

      </div>
    </div>
</template>

<script>
  import UE from '@/components/ue.vue';
  export default {
    components: {UE},
    data(){
        return {
          weekPeopleList:[],
          weekInfo:{
            report_title:'',
            report_time:''
          },
          currentPage:1,
          weekType:'add',
          weekId:this.$route.params.week_report_id,
          uecontent:"",
          ueconfig: {
            initialFrameWidth: null,
            initialFrameHeight: 200,
            wordCount: false,
            toolbars:this.config.ueditorToolbar
          },
          title:'新增',
          bugRecordFormVisible:false,
          bugRecordRules:{
            user_name:[
                {required:true,message:'请输入姓名',trigger:'blur'}
            ]
          },
          peopleRecordForm:{
            user_name:'',
            content:''
          }
        }
    },
    created(){
      this.getWeekBasic();
      this.getRecordList();
    },
    methods:{
      getWeekBasic:function() {
          var vm = this;
          vm.$http({
            method: 'post',
            data:{week_report_id:vm.$route.params.week_report_id},
            url: vm.config.baseUrl+'week/weekDetail'
          }).then(function (result) {
            var data = result.data;
            var response = data.code;
            if(response==0){
                vm.weekInfo = data.week;
            }
          })
      },
      peopleFormOpen:function (type,obj) {
        this.weekType = type;
        this.bugRecordFormVisible=true;
        if(type=='add'){
          this.title = '新增';
          if(this.$refs['peopleRecordForm']!=undefined){
            this.$refs['peopleRecordForm'].resetFields();
          }
        }else{
          this.title = '修改';
          this.uecontent = obj.content;
          this.peopleRecordForm=obj;
        }
      },
      indexMethod:function (index) {
        var vm=this;
        return (vm.currentPage-1)*10+index+1;
      },
      peopleRecordSubmit:function(){
          var vm = this;
          vm.$refs['peopleRecordForm'].validate((valid) => {
              if(valid){
                var peopleInfo = this.peopleRecordForm;
                peopleInfo.content = vm.$refs.ue.getUEContent();
                peopleInfo.week_id = vm.weekId;
                var url = '';
                if(vm.weekType=='add'){
                  url = 'week/addWeekRecord'
                }else{
                  url = 'week/updateRecord'
                }
                vm.$http({
                    method:'post',
                    url:this.config.baseUrl + url ,
                    data:peopleInfo
                }).then(function (result) {
                  var data = result.data;
                  var status = data.code;
                  if(status==0){
                      vm.bugRecordFormVisible=false;
                      vm.$message({message:'提交成功！',type:'success'});
                      vm.getRecordList();
                  }
                })
              }
          })
      },
      getRecordList: function () {
        var vm = this;
        vm.$http({
          method: 'post',
          data:{week_id:vm.weekId},
          url: vm.config.baseUrl+'week/getRecordList'
        }).then(function (result) {
          var data = result.data;
          var response = data.code;
          if(response==0){
            vm.weekPeopleList = data.recordList;
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
  .add-project .el-dialog__body{
    padding:10px 20px;
  }
  .itme-title{
    padding: 12px 20px;
    background-color: #e9e9e9;
    font-size: 15px;
    border-radius: 5px;
    font-weight: 600;
  }
  .info-title{
    text-align: center;
    background-color: #f9f9f9;
    font-weight: 600;

  }
  .home-table tbody td{
    padding: 12px!important;
  }
  .demand-editor {
    line-height: 20px;
  }
  .bug-content table td{
    border: 1px solid #ddd;
  }
</style>
