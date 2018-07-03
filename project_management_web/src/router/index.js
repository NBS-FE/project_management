import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', component: resolve => require(['../components/HelloWorld.vue'], resolve)},
    { path: '/project', component: resolve => require(['../components/project_list.vue'], resolve)}
  ]
})
