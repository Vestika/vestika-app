<template>
  <div style="padding-top: 15px">
    <mainUploader
      v-if="!isFileUploaded && !isLoading"
      @status="handleFileUploaded"
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
  emits: ["app-loading"],
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
      this.isLoading = true;

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
      ws.onmessage = async function(event) {// ######
        console.log("WebSocket: Received:", event);
        self.portfolios = JSON.parse(event.data);
        self.isLoading = false;
        self.isFileUploaded = true;
        self.$emit("app-loading", self.isLoading);

        localStorageManager.set(PORTFOLIO_DATA, self.portfolios);
        console.log("Portfolio data saved to LocalStorage.");
      };
    },

    finalizeDataFetch() {
      this.isFileUploaded = !!this.portfolios;
      this.isLoading = false;
      this.$emit("app-loading", this.isLoading);
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

    handleFileUploaded() {
      this.isLoading = true;
      this.$emit("app-loading", this.isLoading);
      this.isFileUploaded = true;
    },
  },
};
</script>
