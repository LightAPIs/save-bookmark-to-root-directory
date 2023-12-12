import Vue from 'vue';
import App from './App/App.vue';
import { ConfigProvider, Space, Switch } from 'ant-design-vue';
import ui from '../commons/ui';

Vue.config.productionTip = false;
Vue.use(ConfigProvider);
Vue.use(Space);
Vue.use(Switch);
Vue.prototype.$ui = ui;

new Vue({
  el: '#options-app',
  components: {
    App,
  },
  render(h) {
    return h(App);
  },
});
