<template>
  <div class="card mt-3 mb-3">
    <h5 class="card-header">
      <div
        class="collapsed d-block"
        data-bs-toggle="collapse"
        data-bs-target="#collapse-collapsed"
        id="heading-collapsed"
      >
        <i class="fa fa-chevron-down pull-right"></i>
        Video Sync Controls
      </div>
    </h5>
    <div
      id="collapse-collapsed"
      class="collapse show"
      aria-labelledby="heading-collapsed"
    >
      <div class="card-body">
        <video class="float-end" src=""></video>
        <div class="m-3">
          <p>Use this to identify strip segments</p>
          <div class="btn-group" role="group" aria-label="Scenes">
            <button
              v-for="(segment, index) in segments"
              :key="index"
              @click="toggleSegment(segment)"
              type="button"
              class="btn btn-secondary"
            >
              {{ segment }}
            </button>
          </div>
        </div>

        <select class="m-3" v-model="screenId">
          <option value="null">Select Screen</option>
          <option v-for="screen in screens" :key="screen.id" :value="screen.id">
            {{ screen.name }}
          </option>
        </select>
        <button
          v-if="!strip.syncMode"
          @click="syncColors"
          class="btn btn-primary"
        >
          Sync Colors
        </button>
        <button v-if="strip.syncMode" @click="stopSync" class="btn btn-danger">
          Stop Sync
        </button>

        <p>Here is a preview of the averaged colors</p>
        <div id="color-viewer" class="m-2">
          <small>Click sync to see preview</small>
        </div>

        <div class="sync">
          <p>Segments formart: 1,2,3,4</p>
          <div class="row g-3 align-items-center">
            <div class="col-2">
              <label for="top" class="col-form-label">Top</label>
            </div>
            <div class="col-auto">
              <input
                type="text"
                id="top"
                v-model="top"
                class="form-control"
                aria-describedby="passwordHelpInline"
              />
            </div>
            <div class="col-auto">
              <span id="passwordHelpInline" class="form-text">
                Enter Top segments, from left to right
              </span>
            </div>
          </div>

          <div class="row g-3 align-items-center">
            <div class="col-2">
              <label for="Bottom" class="col-form-label">Bottom</label>
            </div>
            <div class="col-auto">
              <input
                type="text"
                id="Bottom"
                v-model="bottom"
                class="form-control"
                aria-describedby="passwordHelpInline"
              />
            </div>
            <div class="col-auto">
              <span id="passwordHelpInline" class="form-text">
                Enter Bottom segments from left to right
              </span>
            </div>
          </div>

          <div class="row g-3 align-items-center">
            <div class="col-2">
              <label for="Left" class="col-form-label">Left</label>
            </div>
            <div class="col-auto">
              <input
                type="text"
                id="Left"
                v-model="left"
                class="form-control"
                aria-describedby="passwordHelpInline"
              />
            </div>
            <div class="col-auto">
              <span id="passwordHelpInline" class="form-text">
                Enter Left segments from top to bottom
              </span>
            </div>
          </div>

          <div class="row g-3 align-items-center">
            <div class="col-2">
              <label for="Right" class="col-form-label">Right</label>
            </div>
            <div class="col-auto">
              <input
                type="text"
                id="Right"
                v-model="right"
                class="form-control"
                aria-describedby="passwordHelpInline"
              />
            </div>
            <div class="col-auto">
              <span id="passwordHelpInline" class="form-text">
                Enter Right segments from top to bottom
              </span>
            </div>
          </div>

          <button class="btn btn-primary" @click="save">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Capture from "../models/Capture";
import { desktopCapturer } from "electron";
export default {
  props: {
    strip: {
      type: Object,
      required: true,
    },
  },
  data: () => {
    return {
      segments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      left: "",
      right: "",
      top: "",
      bottom: "",
      cap: null,
      screens: [],
      screenId: null,
    };
  },
  methods: {
    async toggleSegment(segNum) {
      //set all to white
      await this.strip.setColor("#ffff00");
      await this.strip.setColor("#ffffff");
      //set segment to red
      await this.strip.setSegment(segNum, "#ff0000");
    },
    stopSync() {
      this.strip.stopSync();
      this.cap.stopStream();
    },

    async syncColors() {
      this.cap = new Capture(this.screenId);
      window.cap = this.cap;
      this.updateSegments();

      await this.strip.consumeSegData();
    },
    updateSegments() {
      if (this.cap == null) return;
      this.cap.segments.left = this.left.split(",");
      this.cap.segments.top = this.top.split(",");
      this.cap.segments.right = this.right.split(",");
      this.cap.segments.bottom = this.bottom.split(",");
    },
    save() {
      let segments = {
        left: this.left,
        right: this.right,
        top: this.top,
        bottom: this.bottom,
      };
      localStorage.setItem("segments", JSON.stringify(segments));
      this.updateSegments();
    },
    loadSegments() {
      if (localStorage.getItem("segments")) {
        let segments = JSON.parse(localStorage.getItem("segments"));
        this.left = segments.left;
        this.right = segments.right;
        this.top = segments.top;
        this.bottom = segments.bottom;
      }
    },
    async getScreens() {
      this.screens = await desktopCapturer.getSources({
        types: ["screen"],
        thumbnailSize: { width: 150, height: 150 },
      });
    },
  },
  mounted() {
    this.loadSegments();
    this.getScreens();
  },
};
</script>

<style scoped>
#heading-collapsed:hover {
  color: #0d6efd;
}
video {
  max-width: 200px;
}
</style>
