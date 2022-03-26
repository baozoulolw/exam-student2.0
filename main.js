import App from './App'
import {get,post} from 'static/utils/https.js';
import Notify from 'wxcomponents/vant/notify/notify';
import Toast from 'wxcomponents/vant/toast/toast';
import Dialog from 'wxcomponents/vant/dialog/dialog';
import FormData from 'static/formdata/formData.js'
import {router,RouterMount} from 'static/utils/router.js' 

// #ifndef VUE3
import Vue from 'vue'
Vue.use(router)
Vue.config.productionTip = false
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$toast = Toast;
Vue.prototype.$dialog = Dialog;
Vue.prototype.$notify = Notify;
Vue.prototype.$fromData = () => new FormData();
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif