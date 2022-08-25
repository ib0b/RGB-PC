<template>
  <div class="container mt-4">
    <h1 class="text-center rainbow rainbow_text_animated">RGB-PC</h1>

    <img id="screenshot-image" src="" alt="" width="" height="" />
    <img id="cropped-image" src="" alt="" width="" height="" />
   
   
    <div class="help">
      <p>This software has been tested on H619E, your mileage may vary. This is not the offical control software and is no way associated with Govee. This software is provided as is with no gurantees and using it may void your warranty, please proceed with caution.
         <ul>
            <li>This software requires bluetooth connectivity and your PC should be in close range with the strip controller.</li>
            <li>Click scan to connect to your LED strip.</li>
            <li>Note that the LED strip controller can only connect to one device via Bluetooth. You may have to turn off bluetooth on your phone so as to disconnect you phone from the led controller and make the controller discoverable on PC.</li>
         </ul>
         <button @click="openHelp" class="float-end btn btn-dark">Help</button>
      </p>
    </div>
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
            <button class="btn btn-primary" :class="{disabled:connected}" @click="connect(device)">
              Connect
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <LightControls v-if="strip" :strip="strip"></LightControls>
    <LightSync v-if="strip" :strip="strip"></LightSync>
  </div>
</template>

<script>
import LightControls from "./components/LightControls.vue";
import LightSync from "./components/LightSync.vue";
import Strip from "./models/Strip";
import state from "./state";

//import ipcrender
const ipcRenderer = require("electron").ipcRenderer;
const shell = require("electron").shell;
window.ipcRenderer = ipcRenderer;

export default {
  name: "App",
  components: {
    LightControls,
    LightSync,
  },
  data: () => {
    return {
      devices: [],
      isOn: false,
      chooseDeviceCallback: null,
      strip: null,
      connected: false,
    };
  },
  methods: {
    openHelp() {
      shell.openExternal("https://github.com/ib0b/RGB-PC");
    },
    async connect(device) {
      if (this.connected) return;
      state.device = device;
      this.connected = true;
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
      this.devices = devices;
    });
  },
};
</script>

<style>
.color-box {
  display: inline-block;
  height: 30px;
  width: 30px;
}

.rainbow {
  text-align: center;
}
.rainbow_text_animated {
  background: linear-gradient(
    to right,
    #6666ff,
    #0099ff,
    #00ff00,
    #ff3399,
    #6666ff
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: rainbow_animation 3s ease-in-out infinite;
  background-size: 400% 100%;
}

@keyframes rainbow_animation {
  0%,
  100% {
    background-position: 0 0;
  }

  50% {
    background-position: 100% 0;
  }
}
</style>
