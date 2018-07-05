import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', component: resolve => require(['../components/HelloWorld.vue'], resolve)},
    { path: '/projectlist', component: resolve => require(['../views/project_list.vue'], resolve)},
    { path: '/project', component: resolve => require(['../views/project.vue'], resolve),
      children:[
        { path: 'home', component: resolve => require(['../views/project_home.vue'], resolve) },
      ]
    }
  ]
})
