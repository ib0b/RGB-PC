<template>
  <!-- create bootstrap card with -->
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">Light Strip Controls</h5>
      <p class="card-text">Choose color</p>
      <div class="color-picker"></div>
      <button v-if="!isOn" @click="turnOn" class="btn btn-primary">
        Turn On
      </button>
      <button v-if="isOn" @click="turnOff" class="btn btn-danger">
        Turn Off
      </button>
    </div>
  </div>
</template>

<script>
//import prop strip
import { createPicker } from "../models/Picker.js";
export default {
  props: {
    strip: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    return {
      isOn: false,
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
    onChangeHandler(color) {
      let hexColor = color.toHEXA().toString();
      console.log(`changed color is`, hexColor);
      this.strip.setColor(hexColor);
      //
    },
  },
  mounted() {
    createPicker(this.onChangeHandler);
  },
};
</script>

<style>
</style>