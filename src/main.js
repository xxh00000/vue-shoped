import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入样式文件
import './assets/css/global.css'
// 引入阿里图标
import './assets/fonts/iconfont.css'
//axios
import axios from 'axios'
//接口基准地址
axios.defaults.baseURL = 'http://www.tangxiaoyang.vip:8888/api/v2/'
//axios拦截所有请求，为请求头添加token认证
axios.interceptors.request.use(config => {
  //console.log(config)
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  config.headers.Authorization = userInfo ? userInfo.token : ''
  return config
})
Vue.prototype.$http = axios
//全局注册第三方表格组件
import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)
Vue.config.productionTip = false

//工具库
import utils from './libs/utils'
Vue.prototype.$utils = utils

//编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' 
import 'quill/dist/quill.snow.css' 
import 'quill/dist/quill.bubble.css' 

Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')