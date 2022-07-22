<template>
  <file-pond
    ref="pond"
    name="data"
    label-idle="drag and drop or click to upload"
    accepted-file-types="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/json"
    file-validate-type-label-expected-types="Expects (.xls, .xlsx, .json) files"
    max-file-size="10MB"
    style-item-panel-aspect-ratio="0.3"
    :allow-drop="this.isUploadEnabled"
    :allow-browse="this.isUploadEnabled"
    :allow-multiple="false"
    :server="{ process }"
    :files="myFiles"
    credits="false"
  />
</template>

<script>
import vueFilePond from "vue-filepond";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import api from "@/utils/api";
import { messages } from "./messages.json";

import "filepond/dist/filepond.min.css";

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
);

export default {
  name: "filepondUploader",
  components: {
    FilePond,
  },
  emits: ["status"],
  props: {
    isLocked: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    isUploadEnabled() {
      return this.isLocked;
    },
  },

  data: function() {
    return {
      myFiles: [],
      messages,
    };
  },

  methods: {
    async process(fieldName, file) {
      const formData = new FormData();
      formData.append("file", file);
      console.log(file);
      let res;
      try {
        res = await api.post(
          `${process.env.VUE_APP_BASE_URL}/users/uploadfile/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } catch (error) {
        console.log(error);
        return false;
      }
      console.log(res);
      this.$emit("status", true);
    },
  },
};
</script>

<style>
.filepond--wrapper {
  /*height: calc(100vh - 40px);*/
  /*margin: 20px;*/
  /*padding: 15%;*/
  height: 100% !important;
}

.filepond--root {
  /*height: 100%;*/
  margin-bottom: 0px;
  height: 100% !important;
}

.filepond--drop-label {
  font-size: 24px !important;
  color: rgba(255, 255, 255, 0.2);
  border: 1px solid #292929;
  height: 100% !important;
  /*height: 100%;*/

  background: repeating-linear-gradient(
    -45deg,
    transparent,
    rgba(255, 255, 255, 0.02) 20px,
    rgba(255, 255, 255, 0.02) 10px
  );

  /* override the parent component being hidden when a file is uploading */
  transform: none !important;
  opacity: 1 !important;
  visibility: visible !important;
  pointer-events: auto !important;
}

.filepond--drop-label:hover {
  color: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);

  cursor: pointer;

  background: repeating-linear-gradient(
    -45deg,
    transparent,
    rgba(255, 255, 255, 0.02) 20px,
    rgba(255, 255, 255, 0.02) 10px
  );
}

.filepond--item {
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='15' ry='15' stroke='grey' stroke-width='6' stroke-dasharray='9%2c 20' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
}

/* the border radius of the file item */
.filepond--item-panel {
  border-radius: 0.5em;
}

/* the background color of the file and file panel (used when dropping an image) */
.filepond--item-panel {
}

/* the background color of the drop circle */
.filepond--drip-blob {
  background-color: red;
}

/* the background color of the black action buttons */
.filepond--file-action-button {
  background-color: #999999;
}

/* the icon color of the black action buttons */
.filepond--file-action-button {
  color: white;
}

/* the color of the focus ring */
.filepond--file-action-button:hover,
.filepond--file-action-button:focus {
  box-shadow: 0 0 0 0.125em rgba(255, 255, 255, 0.9);
}

.filepond--file {
  color: white;
  font-size: 24px !important;
}

[data-filepond-item-state*="error"] .filepond--item-panel,
[data-filepond-item-state*="invalid"] .filepond--item-panel {
  background-color: darkred;
}

[data-filepond-item-state="processing-complete"] .filepond--item-panel {
  background-color: green;
}

.filepond--panel-root {
  background-color: transparent;
}
</style>
