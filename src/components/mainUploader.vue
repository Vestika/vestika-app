<template>
  <div id="uploader" v-if="shouldDisplayUploader">
    <filepondUploader @file-uploaded="handleFileUploaded"></filepondUploader>
  </div>
</template>

<script>
import filepondUploader from "@/components/filepondUploader.vue";
import { growthbook } from "../utils/featureFlag";

export default {
  name: "mainUploader",
  components: {
    filepondUploader,
  },
  emits: ["file-uploaded"],

  data: function() {
    return {};
  },
  computed: {
    shouldDisplayUploader() {
      return growthbook.isOn("upload_enabled");
    },
  },
  methods: {
    handleFileUploaded() {
      // keep propagating the event upwards to the main component
      this.$emit("file-uploaded");
    },
  },
};
</script>

<style>
#uploader {
  width: 50%;
  height: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 0.5px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 30px !important;
  overflow: hidden;
}
</style>
