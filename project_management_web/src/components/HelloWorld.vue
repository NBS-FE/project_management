<template>
  <!--<div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li>
        <a
          href="https://vuejs.org"
          target="_blank"
        >
          Core Docs
        </a>
      </li>
      <li>
        <a
          href="https://forum.vuejs.org"
          target="_blank"
        >
          Forum
        </a>
      </li>
      <li>
        <a
          href="https://chat.vuejs.org"
          target="_blank"
        >
          Community Chat
        </a>
      </li>
      <li>
        <a
          href="https://twitter.com/vuejs"
          target="_blank"
        >
          Twitter
        </a>
      </li>
      <br>
      <li>
        <a
          href="http://vuejs-templates.github.io/webpack/"
          target="_blank"
        >
          Docs for This Template
        </a>
      </li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li>
        <a
          href="http://router.vuejs.org/"
          target="_blank"
        >
          vue-router
        </a>
      </li>
      <li>
        <a
          href="http://vuex.vuejs.org/"
          target="_blank"
        >
          vuex
        </a>
      </li>
      <li>
        <a
          href="http://vue-loader.vuejs.org/"
          target="_blank"
        >
          vue-loader
        </a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
        >
          awesome-vue
        </a>
      </li>
    </ul>
    <el-button type="primary">主要按钮</el-button>
  </div>-->
  <div class="login-box" id="hello">
    <el-row>
      <el-col>
        <el-input id="name" auto-complete="off" v-model="name" placeholder="请输入账号" clearable>
          <template slot="prepend">账号</template>
        </el-input>
      </el-col>
    </el-row>
    <el-row style="margin-top:10px;">
      <el-col >
        <el-input id="password" auto-complete="off" v-model="password" type="password" placeholder="请输入密码" clearable>
          <template slot="prepend">密码</template>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-col style="text-align: center;margin-top:10px;">
        <el-button id="login" @click="check"  type="primary">登录</el-button><router-link tag='a' :to="'/register'" >注册</router-link>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      name:'',
      password:''
    }
  },
  methods: {
    check(){
      this.$http.post('http://127.0.0.1:3000/user/login', {
        name:this.name,
        password: this.password,
      }, {}).then((response) => {
        var result = response.data;
        var response = result.code;
        if (response == 0) {
            this.$router.push({path:'/project'});
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login-box {
    margin-top:15%;
    margin-left:40%;
    background-image:url(../assets/back.png);
    width:350px;
    height:250px;
    padding:60px 50px;
  }
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
