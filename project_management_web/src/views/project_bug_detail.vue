<template>
  <div>
    <div style="height:50px;background: #eee;margin: -20px;line-height: 50px" class="margin-bottom-10">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="display: inline-block">
        <el-breadcrumb-item class="margin-left-20" :to="{ path: '/project/bug/'+projectId }">缺陷记录</el-breadcrumb-item>
        <el-breadcrumb-item>缺陷详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div style="width: 1000px;padding:  10px 20px">
      <div class="itme-title">缺陷基本信息
        <el-button type="primary"  style="float: right;margin-top: -5px"  size="small" plain @click="bugFormOpen"><i class="fa fa-edit margin-right-5"></i>修改缺陷</el-button>
      </div>
      <div class="padding-10">
        <table class="table table-bordered  fs14 home-table" >
          <tbody>
          <tr>
            <td width="150" class="info-title">标题</td>
            <td colspan="3">{{projectBugInfo.bug_title}}</td>
          </tr>
          <tr>
            <td width="150" class="info-title">严重程度</td>
            <td width="320">{{projectBugInfo.bug_level }}</td>
            <td width="150" class="info-title">优先级</td>
            <td >{{projectBugInfo.bug_priority}}</td>
          </tr>
          <tr>

            <td width="150" class="info-title">处理人</td>
            <td >{{projectBugInfo.bug_handler}}</td>
            <td width="150" class="info-title">缺陷状态</td>
            <td >{{projectBugInfo.bug_status}}</td>

          </tr>
          <tr>
            <td width="150" class="info-title">创建人</td>
            <td width="320">{{projectBugInfo.bug_creator}}</td>
            <td width="150" class="info-title">创建时间</td>
            <td width="320">{{projectBugInfo.bug_create_time | dateFormat('YYYY-MM-DD')}}</td>

          </tr>


          <tr>
            <td colspan="4" class="info-title">缺陷内容</td>

          </tr>
          <tr>
            <td colspan="4"><div  style="min-height: 100px" class="bug-content" v-html="projectBugInfo.bug_content"></div></td>

          </tr>

          </tbody>
        </table>
      </div>
      <div class="itme-title margin-top-20">缺陷处理
        <el-button type="success"  style="float: right;margin-top: -5px"  size="small" plain @click="bugRecordFormOpen"><i class="fa fa-plus margin-right-5"></i>新增处理</el-button>
      </div>
      <div class="padding-10">
        <div style="border: 1px solid #ddd;min-height: 100px">
          <light-timeline :items='recordItems'></light-timeline>
        </div>

      </div>

      <el-dialog class="bug-panel" width="900px" title="修改缺陷" :visible.sync="bugFormVisible" :close-on-click-modal="false"  >
        <el-form :model="bugForm" :rules="bugRules" label-width="80px"  ref="bugForm"  style="padding: 0 20px">
          <el-form-item label="标题" prop="bug_title" >
            <el-input  placeholder="请输入标题" v-model="bugForm.bug_title">
            </el-input>
          </el-form-item>
          <el-form-item label="严重程度" prop="bug_level" >
            <el-col :span="10">
              <el-select v-model="bugForm.bug_level" clearable style="width: 100%" placeholder="请选择严重程度">
                <el-option
                  v-for="item in bugLevelOptions"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col   class="line text-right padding-right-10" :span="4">优先级</el-col>
            <el-col :span="10">
              <el-select v-model="bugForm.bug_priority" clearable style="width: 100%" placeholder="请选择优先级">
                <el-option
                  v-for="item in bugPriorityOptions"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="处理人" prop="bug_handler" >
            <el-col :span="10">
              <el-input  placeholder="请输入处理人" v-model="bugForm.bug_handler"></el-input>
            </el-col>
            <el-col  class="line text-right padding-right-10" :span="4">缺陷状态</el-col>
            <el-col :span="10">
              <el-select v-model="bugForm.bug_status" style="width: 100%" placeholder="请选择缺陷状态">
                <el-option
                  v-for="item in bugStatusOptions"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="创建人" prop="bug_creator" >
            <el-col :span="10">
              <el-input  placeholder="请输入创建人" v-model="bugForm.bug_creator"></el-input>
            </el-col>
            <el-col   class="line text-right padding-right-10" :span="4">创建时间</el-col>
            <el-col :span="10">
            <el-date-picker style="width: 100%"
                            v-model="bugForm.bug_create_time"
                            type="date"
                            placeholder="请选择创建时间">
            </el-date-picker>
            </el-col>
          </el-form-item>

          <el-form-item label="缺陷内容" prop="bug_content" >
            <div class="demand-editor">
              <UE :defaultMsg='uecontent' :config=ueconfig ref="ue" ></UE>
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
          <el-button @click.native="bugFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="bugSubmit" >提交</el-button>
        </div>
      </el-dialog>

      <el-dialog class="bug-record-panel" width="900px" title="修改缺陷" :visible.sync="bugRecordFormVisible" :close-on-click-modal="false"  >
        <el-form :model="bugRecordForm" :rules="bugRecordRules" label-width="80px"  ref="bugRecordForm"  style="padding: 0 20px">



          <el-form-item label="创建人" prop="bug_record_creator" >
            <el-col :span="10">
              <el-input  placeholder="请输入创建人" v-model="bugRecordForm.bug_record_creator"></el-input>
            </el-col>
            <el-col   class="line text-right padding-right-10" :span="4">创建时间</el-col>
            <el-col :span="10">
              <el-date-picker style="width: 100%"
                              v-model="bugRecordForm.bug_record_create_time"
                              type="date"
                              placeholder="请选择创建时间">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="缺陷状态" prop="bug_record_status" >
            <el-col :span="10">
              <el-select v-model="bugRecordForm.bug_record_status" style="width: 100%" placeholder="请选择缺陷状态">
                <el-option
                  v-for="item in bugRecordStatusOptions"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-col>
            <el-col v-if="bugRecordForm.bug_record_status=='转发'" class="line text-right padding-right-10" :span="4">接收人</el-col>
            <el-col :span="10" v-if="bugRecordForm.bug_record_status=='转发'">
              <el-input  placeholder="请输入接收人" v-model="bugRecordForm.bug_record_receiver"></el-input>
            </el-col>

          </el-form-item>

          <el-form-item label="处理内容"  prop="bug_record_content">

              <el-input type="textarea" rows="5" v-model="bugRecordForm.bug_record_content" placeholder="请选择处理内容"></el-input>


          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="bugRecordFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="bugRecordSubmit" >提交</el-button>
        </div>
      </el-dialog>

    </div>
  </div>



</template>
<script>
  import UE from '@/components/ue.vue';
  export default {
    components: {UE},
    data() {
      return {
        uecontent:"",
        ueconfig: {
          initialFrameWidth: null,
          initialFrameHeight: 200,
          wordCount: false,
          toolbars:this.config.ueditorToolbar
        },
        projectBugInfo:"",
        projectId:this.$route.params.projectId,
        bugId:this.$route.params.bugId,
        bugFormVisible: false,
        bugRecordFormVisible: false,
        bugStatusOptions:['待修复','已修复','已验证','已驳回','已关闭'],
        bugRecordStatusOptions:['待修复','转发','已修复','已验证','已驳回','已关闭'],
        bugPriorityOptions:['紧急','高','中','低','无关紧要'],
        bugLevelOptions:['致命','严重','一般','提示','建议'],
        bugForm: {
          bug_title: ''
        },
        bugRecordForm: {
          bug_record_status: ''
        },
        bugRecordRules: {
          bug_record_status: [
            {required: true, message: '请选择状态', trigger: 'change'},
          ],
          bug_record_content: [
            {required: true, message: '请输入处理内容', trigger: 'change'},
          ],
        },
        bugRules: {
          bug_title: [
            {required: true, message: '请输入标题', trigger: 'change'},
          ]
        },
        editorOption:{
          placeholder: '请输入缺陷内容',
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
        bugOpenNum:0,
        recordItems: []
      }
    },
    created(){
      this.getProjectBugInfo();
      this. getProjectBugRecordList();
    },
    methods :{
      getProjectBugInfo:function () {
        var vm=this;
        vm.$http({
          method: 'get',
          url: vm.config.baseUrl+'project/getProjectBugInfo',
          params:{
            bug_id:vm.bugId
          }
        }).then(function(response) {
          var data=response.data
          var code=data.code;
          if(code==0){
            vm.projectBugInfo=data.projectBugInfo
            vm.bugForm=JSON.parse(JSON.stringify(data.projectBugInfo));
            vm.uecontent=vm.bugForm.bug_content;
          }else {
            console.log(data.msg)
          }
        }).catch(function(response){
          console.log(response)
        })
      },
      getProjectBugRecordList:function () {
        var vm=this;
        vm.$http({
          method: 'get',
          url: vm.config.baseUrl+'project/getProjectBugRecordList',
          params:{
            bug_id:vm.bugId
          }
        }).then(function(response) {
          var data=response.data
          var code=data.code;
          if(code==0){
            var projectBugRecordList=data.projectBugRecordList;
            if(projectBugRecordList!=null&&projectBugRecordList.length>0){
                var bugRecordShowList=[]
                projectBugRecordList.forEach(function (brecord,index) {
                  var bugRecord = {
                    tag: vm.$moment(brecord.bug_record_create_time).format('YYYY-MM-DD'),
                    type: 'circle',
                    color: 'green',
                    content: brecord.bug_record_creator + "【" + brecord.bug_record_status + "】" +(brecord.bug_record_receiver ? brecord.bug_record_receiver : "")+ (brecord.bug_record_content ? "：" + brecord.bug_record_content : "")
                  }
                  if (index == 0) {
                    bugRecord.type = 'star';
                    bugRecord.color = 'yellow';
                  }
                  bugRecordShowList.push(bugRecord)
                })
              vm.recordItems=bugRecordShowList;
            }
          }else {
            console.log(data.msg)
          }
        }).catch(function(response){
          console.log(response)
        })
      },
      bugFormOpen:function () {
        this.bugFormVisible = true;
        this.bugForm=JSON.parse(JSON.stringify( this.projectBugInfo));
      },
      bugSubmit:function () {
        var vm=this;
        vm.$refs['bugForm'].validate((valid) => {
          if (valid) {
            var bugInfo = this.bugForm;
            bugInfo.bug_content=vm.$refs.ue.getUEContent();
            if(bugInfo.bug_create_time!=null&&bugInfo.bug_create_time.length>1){
              bugInfo.bug_create_time=vm.$moment(bugInfo.bug_create_time).format("YYYY-MM-DD HH:mm:ss");
            }
            bugInfo.project_id=vm.projectId;
            vm.$http({
              method: 'POST',
              url: this.config.baseUrl + 'project/updateProjectBug',
              data: bugInfo
            }).then(function (data) {
              var result = data.data;
              var response = result.code;
              if (response == 0) {
                vm.bugFormVisible = false;
                vm.$message({message: '提交成功！！', type: 'success'});
                vm.getProjectBugInfo()
              } else {
                vm.$message.error('提交失败！！');
              }
            })
          }
        })
      },
      bugRecordFormOpen:function () {
        this.bugRecordFormVisible = true;

        this.bugOpenNum++;
        if(this.bugOpenNum>1){
          this.$refs['bugRecordForm'].resetFields();
        }
        this.bugRecordForm={
          bug_record_status:null,
          bug_record_create_time:null,
          bug_record_creator:null,
          bug_record_receiver:null,
        };
      },
      bugRecordSubmit:function () {
        var vm=this;
        vm.$refs['bugRecordForm'].validate((valid) => {
          if (valid) {
            var bugRecordInfo = this.bugRecordForm;
            if(bugRecordInfo.bug_record_create_time!=null){
              bugRecordInfo.bug_record_create_time=vm.$moment(bugRecordInfo.bug_record_create_time).format("YYYY-MM-DD");
            }
            bugRecordInfo.bug_id=vm.bugId;
            vm.$http({
              method: 'POST',
              url: this.config.baseUrl + 'project/addProjectBugRecord',
              data: bugRecordInfo
            }).then(function (data) {
              var result = data.data;
              var response = result.code;
              if (response == 0) {
                vm.bugRecordFormVisible = false;
                vm.$message({message: '提交成功！！', type: 'success'});
                vm.getProjectBugRecordList();
                vm.getProjectBugInfo();
              } else {
                vm.$message.error('提交失败！！');
              }
            })
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
