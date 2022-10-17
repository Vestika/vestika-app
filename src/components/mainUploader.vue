<template>
  <div id="uploader">
    <filepondUploader @file-uploaded="handleFileUploaded"></filepondUploader>
  </div>
</template>

<script>
import filepondUploader from "@/components/filepondUploader.vue";

export default {
  name: "mainUploader",
  components: {
    filepondUploader,
  },
  emits: ["file-uploaded"],

  data: function() {
    return {};
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
