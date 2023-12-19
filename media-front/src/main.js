import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import './plugins/element'
import './plugins/clipboard'
import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
