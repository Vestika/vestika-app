<template>
  <div style="padding-top: 15px">
    <mainUploader
      v-if="!isFileUploaded && !isLoading"
      @status="checkUploadStatus"
    />
    <dashboard v-if="isFileUploaded && !isLoading" :portfolios="portfolios" />
  </div>
</template>

<script>
import dashboard from "@/components/dashboard";
import mainUploader from "@/components/mainUploader";
import { FireGetUser } from "@/utils/firebase";
import api from "@/utils/api";

const localStorageManager = require("../utils/localStorage");

const PORTFOLIO_DATA = "portfoliosData";

export default {
  name: "ViewDashboard",
  components: {
    dashboard,
    mainUploader,
  },
  emits: ["on-loading"],
  data() {
    return {
      isFileUploaded: false,
      portfolios: undefined,
      isLoading: true,
    };
  },

  created() {
    this.createWebSocket();

    if (!localStorageManager.has(PORTFOLIO_DATA)) {
      console.log("Getting data.");
      this.getPortfolioData();
      return;
    }

    try {
      console.log("Using LocalStorage.");
      this.portfolios = localStorageManager.get(PORTFOLIO_DATA);
      this.finalizeDataFetch();
    } catch (e) {
      console.error("Failed parsing, clearing storage.");
      localStorageManager.clear();
      this.getPortfolioData();
    }
  },

  methods: {
    async createWebSocket() {
      const user = await FireGetUser();

      var ws_url = process.env.VUE_APP_WS_URL + user.uid;
      console.log("Creating WebSocket on: %s", ws_url);

      try {
        var ws = new WebSocket(ws_url);
        console.log("WebSocket connected successfully.");
      } catch (error) {
        console.log("WebSocket creation failed:", error);
        return;
      }

      console.log("Registering message handler for WebSocket.");
      const self = this;
      ws.onmessage = async function(event) {
        console.log("WebSocket: Received:", event);
        self.portfolios = JSON.parse(event.data);
        self.isLoading = false;
        self.$emit("on-loading", self.isLoading);

        localStorageManager.set(PORTFOLIO_DATA, self.portfolios);
        console.log("Portfolio data saved to LocalStorage.");
      };
    },

    finalizeDataFetch() {
      if (this.portfolios) {
        this.isFileUploaded = true;
      } else {
        this.isFileUploaded = false;
      }
      this.isLoading = false;
      this.$emit("on-loading", this.isLoading);
    },

    async getPortfolioData() {
      try {
        this.portfolios = await api.get("/portfolios");
        localStorageManager.set(PORTFOLIO_DATA, this.portfolios);
      } catch (error) {
        localStorageManager.delete(PORTFOLIO_DATA);
      }
      this.finalizeDataFetch();
    },

    checkUploadStatus(status) {
      if (status) {
        this.isLoading = true;
        this.$emit("on-loading", this.isLoading);
        this.isFileUploaded = true;
      }
    },
  },
};
</script>
