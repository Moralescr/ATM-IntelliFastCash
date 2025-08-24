import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

Vue.config.productionTip = false;
Vue.prototype.$axios = axios; //Global axios

// Set tab "title"
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
});

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
