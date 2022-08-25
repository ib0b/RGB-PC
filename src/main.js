import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import '@simonwep/pickr/dist/themes/monolith.min.css';
import 'vue-slider-component/theme/antd.css'
import "bootstrap"
import Pickr from '@simonwep/pickr';
// import { ipcRenderer } from 'electron'
// window.ipcRenderer = ipcRenderer
createApp(App).mount('#app')
