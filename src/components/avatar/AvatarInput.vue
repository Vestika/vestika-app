<template>
  <div style="position: relative; display: inline-block; overflow: hidden;">
    <input
      type="file"
      accept="image/*"
      style="display: none"
      ref="file"
      @change="change"
    />
    <div style="height: 100%; width: 100%; border-color: black; ">
      <img
        :src="src"
        style="height: 100%; width: 100%; object-fit: cover"
        alt="Avatar"
        @error="imageLoadError"
      />
      <v-btn
        icon
        style="position:absolute; height: 100%; width: 100%; left: 0"
        @click="browse()"
      >
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: File,
    defaultSrc: String,
  },
  watch: {
    value(file) {
      if (!file) {
        this.src = this.defaultSrc;
        this.$refs.file.value = "";
      } else {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = e => {
          this.src = e.target.result;
        };
      }
    },
    defaultSrc() {
      this.src = this.defaultSrc;
    },
  },

  methods: {
    imageLoadError() {
      console.log("image error");
      this.$emit("error-loading-image");
    },
    browse() {
      this.$refs.file.click();
    },
    change(e) {
      this.$emit("input", e.target.files[0]);
    },
  },
  data() {
    return {
      src: this.defaultSrc,
    };
  },
};
</script>
