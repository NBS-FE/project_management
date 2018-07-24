<template>
    <div>
      <div>
        <div style="background: #eee;height:50px;line-height:50px;margin:-20px;" class="margin-bottom-20">
          <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block">
            <el-breadcrumb-item class="margin-left-20">周报管理</el-breadcrumb-item>
          </el-breadcrumb>
          <el-button style="float:right" class="margin-top-10 margin-right-20" size="small" type="primary" @click="userFormOpen('add')"  round>新增周报</el-button>
        </div>
        <el-table :data="weekList" border style="width: 100%;margin-top:10px;">
          <el-table-column label="序号" width="60" type="index" :index="indexMethod" ></el-table-column>
          <el-table-column prop="report_title" label="标题"></el-table-column>
          <el-table-column prop="report_time" label="时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" title="编辑" size="small" @click="userFormOpen('edit',scope.row)" icon="el-icon-edit" circle></el-button>
              <el-button type="danger" size="small" icon="el-icon-delete" @click="userDeleteOpen(scope.row.user_id)" circle></el-button>
              <router-link :to="{ path: '/common/weekDetail/'+scope.row.week_report_id}">
                <el-button icon="el-icon-search" size="small" type="primary" title="查看详情" style="margin-left:10px;"  circle></el-button>
              </router-link>
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
          <el-form :model="weekReport"  :rules="rules" ref="weekReport" label-width="80px">
            <el-form-item label="标题" prop="report_title">
              <el-input  placeholder="请输入标题" v-model="weekReport.report_title"></el-input>
            </el-form-item>
            <el-form-item label="时间" prop="report_time">
              <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择时间" v-model="weekReport.report_time"></el-date-picker>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTableVisible = false">取消</el-button>
            <el-button type="primary" @click="weekSubmit">确定</el-button>
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
        <hello-world></hello-world>
      </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        weekList:[],
        dialogTableVisible:false,
        dialogDeleteVisible:false,
        delId:'',
        pageSize:10,
        currentPage:1,
        totalCount:0,
        dialogTitle:'新增周报',
        weekReport:{
          report_title:'',
          report_time:''
        },
        rules:{
          report_title:[
            {required: true, message: '请输入标题', trigger: 'change'},
          ],
          report_time: [
            {required: true,message: '请输入时间',trigger:['blur', 'change']}
          ]
        }
      }
    },
    created(){
      this.getWeekList(this.currentPage);
    },
    methods:{
      userFormOpen:function(type,obj){
        var vm=this;
        vm.dialogTableVisible = true;
        vm.objType = type;
        if(type=='add'){
          vm.dialogTitle = '新增周报';
          if(vm.$refs['weekReport']!=undefined){
            vm.$refs['weekReport'].resetFields();
          }
        }else{
          vm.dialogTitle = '修改周报';
          vm.weekReport=obj;
        }
      },
      getWeekList:function(currentPage){
        var vm=this;
        vm.$http({
          method: 'get',
          params:{currentPage:parseInt(currentPage)},
          url: vm.config.baseUrl+'week/queryWeekList'
        }).then(function(response) {
          var data=response.data;
          vm.weekList=data.weekList;
          vm.totalCount=data.count;
        }).catch(function(response){
          console.log(response)
        })
      },
      userDeleteOpen:function(deleteId){
        this.dialogDeleteVisible = true;
        this.delId = deleteId;
      },
      weekSubmit: function () {
        var vm=this;
        this.$refs['weekReport'].validate((valid) => {
          if(valid){
            var url='';
            if(vm.objType=='add'){
              url='week/addWeek';
            }else{
              url='week/updateWeek';
            }
            var weekReport = vm.weekReport;
            vm.$http({
              method: 'POST',
              url: vm.config.baseUrl + url,
              data: weekReport
            }).then(function (data) {
              var result = data.data;
              var response = result.code;
              if (response == 0) {
                vm.dialogTableVisible = false;
                vm.getWeekList(vm.currentPage);
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
            vm.getWeekList(vm.currentPage);
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
        vm.getWeekList(vm.currentPage);
      },
      indexMethod:function(index) {
        var vm=this;
        return (vm.currentPage-1)*10+index+1;
      }
    }
  }
</script>

<style>
  .user-avator img{
    margin-right: 5px;
    width:30px;
    height:30px;
    border-radius: 50%;
  }
</style>
