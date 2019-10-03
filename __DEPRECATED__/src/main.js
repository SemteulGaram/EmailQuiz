import Vue from 'vue';
import App from './App.vue';
import socketio from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
import store from './store.js';

Vue.use(new VueSocketIO({
  debug: true,
  connection: socketio('ws://localhost:7102/'),
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  }
}), socketio);

window.store = store;

new Vue({
  el: '#app',
  store,
  render: h => h(App)
}).$mount('#app');
