<template>
  <!-- create bootstrap card with -->
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">
        Light Strip Controls For: <em>{{ strip.device.name }}</em>
      </h5>

      <button v-if="!isOn" @click="turnOn" class="float-end btn btn-primary">
        Turn On
      </button>
      <button v-if="isOn" @click="turnOff" class="float-end btn btn-danger">
        Turn Off
      </button>

      <div class="form-group">
        <label for="color">Choose Color:</label>
        <input type="input" class="color-picker" value="#FF0000" name="color" />
      </div>

      <div class="form-group">
        <label for="color">Brightness :</label>
        <vue-slider @change="brightnessChange" v-model="brightness" />
      </div>

      <div class="m-3">
        Music:
        <div class="btn-group" role="group" aria-label="Scenes">
          <button
            v-for="(music, index) in musicColors"
            :key="index"
            @click="setMusic(music)"
            type="button"
            class="btn btn-secondary"
          >
            {{ music }}
          </button>
        </div>
      </div>
      <div class="m-3">
        Scenes:
        <div class="btn-group" role="group" aria-label="Scenes">
          <button
            v-for="(scene, index) in scenes"
            :key="index"
            @click="setScene(scene)"
            type="button"
            class="btn btn-secondary"
          >
            {{ scene }}
          </button>
        </div>
      </div>
      <!-- custom commands -->

      <div class="row">
        <div class="col-4">
          <small>
            Send Custom Commands eg:
            <b> 3301000000000000000000000000000000000032 </b>(Turn Off)
          </small>
        </div>
        <div class="col-auto">
          <label for="inputPassword2" class="visually-hidden"
            >Custom Commad</label
          >
          <input
            type="text"
            v-model="customCommand"
            class="form-control"
            id="inputPassword2"
            placeholder="Hex Code Command"
          />
        </div>
        <div class="col-auto">
          <button @click="sendCustomCommand" class="btn btn-primary mb-3">
            Send Command
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueSlider from "vue-slider-component";
import { createPicker } from "../models/Picker.js";
export default {
  props: {
    strip: {
      type: Object,
      required: true,
    },
  },
  components: {
    VueSlider,
  },
  data: () => {
    return {
      isOn: false,
      brightness: 100,
      musicColors: ["energetic", "spectrum", "rythm", "separation", "rolling"],
      customCommand: "",
      scenes: [
        "sunrise",
        "sunset",
        "movie",
        "dating",
        "romantic",
        "blinking",
        "candlelight",
        "snowflake",
        "rainbow",
      ],
      picker: null,
    };
  },
  methods: {
    async turnOn() {
      this.isOn = true;
      await this.strip.turnOn();
    },
    async turnOff() {
      this.isOn = false;
      await this.strip.turnOff();
    },
    setScene(scene) {
      this.strip.setScene(scene);
    },
    setMusic(scene) {
      this.strip.setScene(scene);
    },
    brightnessChange(value) {
      console.log("value", value);
      this.strip.setBrightness(value);
    },
    onChangeHandler(color) {
      let hexColor = color.toHEXA().toString();
      this.strip.setColor(hexColor);
      this.picker.setColor(hexColor);
    },
    sendCustomCommand() {
      this.strip.runStringCommand(this.customCommand);
    },
  },
  mounted() {
    this.picker = createPicker(this.onChangeHandler);
  },
};
</script>

<style>
.pcr-button {
  box-shadow: 1px 1px 4px 1px #4b4b4b;
}
.pickr {
  display: inline;
}
</style>