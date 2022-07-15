<template>
  <div id="uploader">
    <filepondUploader @status="sendUploadStatusToParent"></filepondUploader>
  </div>
</template>

<script>
import filepondUploader from "./filepondUploader";

export default {
  name: "mainUploader",
  components: {
    filepondUploader,
  },
  emits: ["status"],

  data: function() {
    return {};
  },
  methods: {
    sendUploadStatusToParent(status) {
      this.$emit("status", status);
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
