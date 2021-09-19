import Vue from 'vue';
import App from './App/App.vue';
import { Row, Col, ConfigProvider, Space, Button, message, Input, Switch } from 'ant-design-vue';
import ui from '../commons/ui';

Vue.config.productionTip = false;
Vue.use(Row);
Vue.use(Col);
Vue.use(ConfigProvider);
Vue.use(Space);
Vue.use(Button);
Vue.use(Input);
Vue.use(Switch);
Vue.prototype.$ui = ui;
Vue.prototype.$message = message;

new Vue({
  el: '#popup-app',
  components: {
    App,
  },
  render(h) {
    return h(App);
  },
});
