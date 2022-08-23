<template>
  <div class="container mt-4">
    <button @click="scan" class="btn btn-danger">SCAN</button>
    <table class="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Id</th>
          <th scope="col">Connect</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(device, index) in devices" :key="index">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ device.deviceName }}</td>
          <td>{{ device.deviceId }}</td>
          <td>
            <button class="btn btn-primary" @click="connect(device)">
              Connect
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <LightControls :strip="strip"></LightControls>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import LightControls from "./components/LightControls.vue";
import Strip from "./models/Strip";

//import ipcrender
const ipcRenderer = require("electron").ipcRenderer;

window.ipcRenderer = ipcRenderer;

export default {
  name: "App",
  components: {
    LightControls,
  },
  data: () => {
    return {
      devices: [],
      isOn: false,
      chooseDeviceCallback: null,
      strip: null,
    };
  },
  methods: {
    async connect(device) {
      ipcRenderer.send("deviceSelected", device.deviceId);
      // this.chooseDeviceCallback(device.deviceId);
    },
    async scan() {
      let device = await navigator.bluetooth.requestDevice({
        // filters: [{ service: ["f000ffc0-0451-4000-b000-000000000000", "00010203-0405-0607-0809-0a0b0c0d1910", "00001800-0000-1000-8000-00805f9b34fb"] }]
        optionalServices: [
          "f000ffc0-0451-4000-b000-000000000000",
          "00010203-0405-0607-0809-0a0b0c0d1910",
          "00001800-0000-1000-8000-00805f9b34fb",
        ],
        acceptAllDevices: true,
      });
      console.log("chosen", device);
      let strip = new Strip(device);
      window.strip = strip;
      this.strip = strip;
      //create devices
      return;
    },
  },
  async mounted() {
    ipcRenderer.on("deviceList", (event, devices) => {
      console.log("devices", devices);
      this.devices = devices;
    });
    console.log("created");
  },
};
</script>

<style>
</style>
