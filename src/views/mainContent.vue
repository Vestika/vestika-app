<template>
  <div style="padding-top: 15px">
    <mainUploader
      @file-uploaded="handleFileUploaded"
    />
    <dashboard v-if="shouldDisplayDashbaord" :portfolios="portfolios" />
  </div>
</template>

<script>
import { bus } from "@/bus.js";
import dashboard from "@/components/dashboard.vue";
import mainUploader from "@/components/mainUploader.vue";
import { FireGetUser } from "@/utils/firebase.js";
import api from "@/utils/api.js";
import {growthbook} from "../utils/featureFlag";

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
      portfolios: undefined,
      hasData: false,
    };
  },

  mounted() {
    bus.$on("data-cleared", () =>
      this.$nextTick((this.portfolios = undefined)),
    );
  },

  created() {
    this.createWebSocket();
    this.setFeatures();

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

  computed: {
    shouldDisplayDashbaord() {
      return this.hasData;
    },
  },

  methods: {
    async setFeatures() {
      const user = await FireGetUser();
      growthbook.setAttributes({
      id: user.id,
      });
      console.log(growthbook.getFeatures());
    },
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
        self.hasData = true;
        self.$emit("app-loading", false);

        localStorageManager.set(PORTFOLIO_DATA, self.portfolios);
        console.log("Portfolio data saved to LocalStorage.");
      };
    },

    finalizeDataFetch() {
      this.hasData = !!this.portfolios;
      this.$emit("app-loading", false);
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
      this.$emit("app-loading", true);
    },
  },
};
</script>
