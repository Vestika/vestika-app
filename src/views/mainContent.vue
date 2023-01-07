<template>
  <div style="padding-top: 15px">
    <mainUploader @file-uploaded="handleFileUploaded" />
    <dashboard :portfolios="portfolios" />
  </div>
</template>

<script>
import { bus } from "@/bus.js";
import dashboard from "@/components/dashboard.vue";
import mainUploader from "@/components/mainUploader.vue";
import { FireGetUser } from "@/utils/firebase.js";
import api from "@/utils/api.js";
import { growthbook } from "../utils/featureFlag";
import eventSourceApi from "../utils/eventsApi";

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
    //this.eventSteam();
    this.createWebSocket();
    this.setFeatures();

    if (!localStorageManager.has(PORTFOLIO_DATA)) {
      console.log("Getting data.");
      api.get("/portfolios/parts");
      return;
    }

    try {
      console.log("Using LocalStorage.");
      this.portfolios = localStorageManager.get(PORTFOLIO_DATA);
      this.finalizeDataFetch();
    } catch (e) {
      console.error("Failed parsing, clearing storage.");
      localStorageManager.clear();
      api.get("/portfolios/parts");
    }
  },

  methods: {
    async setFeatures() {
      const user = await FireGetUser();
      growthbook.setAttributes({
        id: user.id,
      });
    },
    async eventSteam() {
      await eventSourceApi.connect();
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
        self.hasData = true;

        self.portfolios = localStorageManager.update_dict(
          PORTFOLIO_DATA,
          JSON.parse(event.data),
        );
        console.log("Portfolio data saved to LocalStorage.");

        self.$emit("app-loading", false);
      };
    },

    finalizeDataFetch() {
      this.hasData = !!this.portfolios;
      this.$emit("app-loading", false);
    },

    handleFileUploaded() {
      this.$emit("app-loading", true);
    },
  },
};
</script>
