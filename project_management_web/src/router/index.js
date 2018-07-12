import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', component: resolve => require(['../views/project_list.vue'], resolve)},
    { path: '/projectlist', component: resolve => require(['../views/project_list.vue'], resolve)},
    { path: '/project', component: resolve => require(['../views/project.vue'], resolve),
      children:[
        { path: 'home/:projectId', component: resolve => require(['../views/project_home.vue'], resolve) },
        { path: 'module/:projectId', component: resolve => require(['../views/project_module.vue'], resolve) },
        { path: 'demand/:projectId', component: resolve => require(['../views/project_demand.vue'], resolve) },
        { path: 'demanddetail/:projectId/:demandId', component: resolve => require(['../views/project_demand_detail.vue'], resolve) },
        { path: 'release/:projectId', component: resolve => require(['../views/project_release.vue'], resolve) },
        { path: 'conference/:projectId', component: resolve => require(['../views/project_conference.vue'], resolve) },
        { path: 'setting/:projectId', component: resolve => require(['../views/project_setting.vue'], resolve) },
        { path: 'bug/:projectId', component: resolve => require(['../views/project_bug.vue'], resolve) }
      ]
    },
    { path: '/userList', component: resolve => require(['../views/user_list.vue'], resolve)},
    { path: '/register', component: resolve => require(['../views/register.vue'], resolve)}

  ]
})
