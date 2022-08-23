import { createApp } from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css"
import '@simonwep/pickr/dist/themes/monolith.min.css';
import "bootstrap"

// import { ipcRenderer } from 'electron'
// window.ipcRenderer = ipcRenderer
createApp(App).mount('#app')
