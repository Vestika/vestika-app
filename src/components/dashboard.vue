<template>
  <div>
    <manualStock
      :dialog="showManualStockDialog"
      @close="showManualStockDialog = false"
    />
    <v-row align="center" justify="center">
      <!--  Restore  -->
      <layout-control-button
        tooltip="Reset default layout"
        icon="mdi-backup-restore"
        :action="resetUserLayout"
      />

      <!--  Save  -->
      <layout-control-button
        tooltip="Save layout"
        icon="mdi-content-save"
        :action="saveUserLayout"
      />

      <!--  Load  -->
      <layout-control-button
        tooltip="Load layout"
        icon="mdi-download"
        :action="loadUserLayout"
      />

      <!--  Clear  -->
      <layout-control-button
        tooltip="Clear local storage"
        icon="mdi-delete"
        :action="clearLocalStorage"
      />

      <!--  Lock / Unlock  -->
      <layout-control-button
        v-if="locked"
        tooltip="Unlock layout"
        icon="mdi-lock"
        :action="toggleLayoutLock"
      />
      <layout-control-button
        v-else
        tooltip="Lock layout"
        icon="mdi-lock-open-outline"
        :action="toggleLayoutLock"
      />
    </v-row>

    <v-container
      fluid
      style="padding: 0"
      @contextmenu="rightClickHandler($event)"
    >
      <grid-layout
        id="layout-background"
        :layout.sync="currentLayoutArr"
        :col-num="13"
        :row-height="30"
        :is-draggable="!this.locked"
        :is-resizable="!this.locked"
        :margin="[20, 20]"
        @layout-updated="updateChartsSize"
      >
        <v-menu v-model="showAddMenu" :position-x="x" :position-y="y" absolute>
          <v-list class="pa-0">
            <v-list-item
              style="background-color: var(--v-success-base)"
              v-for="(itemToAdd, index) in hiddenBoxes"
              :key="index"
              @click="addItem(index)"
            >
              <v-list-item-title>{{ itemToAdd.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <grid-item
          v-for="item in currentLayoutArr"
          v-bind:key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :minW="2"
          :minH="3"
          :maxW="13"
          :maxH="16"
          @resize="resizeEvent"
        >
          <div
            style="height: 100%"
            @contextmenu="rightClickHandler($event, item)"
          >
            <component
              v-if="item.isComponent"
              :is="item.c"
              v-bind="currentProperties(item)"
              :ref="item.c"
              @show-manual-stock-dialog="openManualStockDialog"
            ></component>
          </div>
          <v-menu
            v-model="showRemoveMenu"
            :position-x="x"
            :position-y="y"
            absolute
          >
            <v-list class="pa-0">
              <v-list-item
                style="background-color: var(--v-error-base)"
                v-for="(listItem, index) in listItems"
                :key="index"
                @click="listItem.action"
              >
                <v-list-item-title>{{ listItem.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </grid-item>
      </grid-layout>
    </v-container>
  </div>
</template>

<script>
import { GridLayout, GridItem } from "vue-grid-layout";
import api from "@/utils/api.js";
import LayoutControlButton from "@/components/layoutControlButton.vue";
import barChart from "@/components/charts/barChart.vue";
import pieChart from "@/components/charts/pieChart.vue";
import stackedBarChart from "@/components/charts/stackedBarChart.vue";
import lineChart from "@/components/charts/lineChart.vue";
import tableChart from "@/components/charts/tableChart.vue";
import numbers from "@/components/charts/numbers.vue";
import defaultLayout from "@/components/defaultDashboard.json";
import filepondUploader from "@/components/filepondUploader.vue";
import { growthbook } from "../utils/featureFlag";
import manualStock from "@/components/manualStock.vue";

const localStorageManager = require("../utils/localStorage");

export default {
  name: "ViewDashboard",
  components: {
    LayoutControlButton,
    GridLayout,
    GridItem,
    barChart,
    pieChart,
    stackedBarChart,
    lineChart,
    tableChart,
    numbers,
    filepondUploader,
    manualStock,
  },

  props: {
    portfolios: {
      required: true,
      type: Object,
      default: function() {
        return {};
      },
    },
  },

  watch: {
    immediate: true,
    portfolios: {
      handler() {
        this.onPageLoad();
      },
      deep: true,
    },
  },

  data() {
    return {
      locked: true,
      assetsArray: [],
      worthData: [],
      commissionsNames: [],
      commissionsValues: [],
      currentLayoutObj: {},
      defaultLayoutObj: undefined,
      currentLayoutArr: [],
      clickedItemStringIndex: undefined,
      showRemoveMenu: false,
      showAddMenu: false,
      hiddenBoxes: [],
      listItems: [{ title: "Remove", action: this.removeItem }],
      x: 0,
      y: 0,
      dashboardData: {},
      userDashboardId: undefined,
      showManualStockDialog: false,
    };
  },

  mounted() {
    // fetch and parse the data from server.
    this.onPageLoad();
  },

  computed: {
    currentProperties: function() {
      // sends updated data to chart components
      return item =>
        Object({
          data: item.dataProp,
          chartName: item.name,
          isLocked: Boolean(this.locked),
        });
    },
  },

  methods: {
    openManualStockDialog() {
      this.showManualStockDialog = true;
    },

    updateChartsSize: function() {
      // iterates over the charts and fit their sizes to container size.
      this.currentLayoutArr.forEach(item => this.updateSize(item));
    },

    resetUserLayout() {
      // when user clicks the reset layout button, the default layout is loaded.
      this.loadFromDefault();
      this.currentLayoutObj = this.defaultLayoutObj;
      this.updateLayoutList();
      this.hiddenBoxes = [];
    },

    getLayoutMapper() {
      // creates an object from layout where key is the item name
      return {
        netWorth: this.currentLayoutObj["0"],
        netChangeWithDiv: this.currentLayoutObj["1"],
        assets: this.currentLayoutObj["2"],
        dividends: this.currentLayoutObj["3"],
        commissions: this.currentLayoutObj["4"],
        netChangePercent: this.currentLayoutObj["5"],
        uploadBox: this.currentLayoutObj["6"],
        worthOverTime: this.currentLayoutObj["7"],
        instrumentTable: this.currentLayoutObj["8"],
      };
    },

    async saveUserLayout() {
      // when user clicks the save layout button, the custom layout is saved to database.
      let dashboard;
      let curLayout = JSON.parse(JSON.stringify(this.currentLayoutObj)); // deep clone of currentLayoutObj
      for (let key in curLayout) {
        delete curLayout[key]?.dataProp;
        delete curLayout[key]?.moved;
      }

      try {
        if (this.userDashboardId) {
          console.log("update");
          // update
          dashboard = await api.put(
            `/dashboard`,
            {
              layout: curLayout,
            },
            {
              params: {
                entity_id: this.userDashboardId,
              },
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
        } else {
          console.log("create");
          dashboard = await api.post("/dashboard", {
            layout: curLayout,
          });
          this.userDashboardId = dashboard.uid;
        }
      } catch (error) {
        console.log(error);
        return false;
      }
      localStorageManager.set("layoutData", dashboard);
      console.log(dashboard);
    },

    async loadUserLayout() {
      this.currentLayoutObj = await this.loadLayout();
      this.setLayout();
      this.updateLayoutList();
    },

    async loadLayout() {
      // on load or when user clicks the load custom layout button, his custom layout is loaded.
      let dashboard;
      try {
        dashboard = localStorageManager.get("layoutData");
        if (!dashboard) {
          dashboard = await api.get("/dashboard");
          localStorageManager.set("layoutData", dashboard);
        }
        this.userDashboardId = dashboard.uid;
        return dashboard.content.layout;
      } catch (error) {
        if (error.response.status === 404) {
          this.loadFromDefault();
          return this.defaultLayoutObj;
        }
      }
    },

    clearLocalStorage() {
      localStorageManager.clear();
    },

    rightClickHandler(e, item) {
      // when user right clicks on some item, the remove option will appear.
      e.preventDefault();
      this.x = e.clientX;
      this.y = e.clientY;

      if (e.target.id === "layout-background") {
        this.$nextTick(() => {
          this.showAddMenu = true;
        });
      } else if (item) {
        this.clickedItemStringIndex = item.i;
        this.$nextTick(() => {
          this.showRemoveMenu = true;
        });
      }
    },

    removeItem: function() {
      // removes an item from the currentLayoutObj and updates the layout list.
      if (this.clickedItemStringIndex in this.currentLayoutObj) {
        let itemToRemove = this.currentLayoutObj[this.clickedItemStringIndex];
        delete this.currentLayoutObj[this.clickedItemStringIndex];
        this.hiddenBoxes.push(itemToRemove); // add removed item to the hidden items list
      }
      this.updateLayoutList();
    },

    addItem: async function(index) {
      // adds an item to the currentLayoutObj and updates the layout list.
      let item = this.hiddenBoxes.splice(index, 1)[0]; // item was added to layout therefore we should remove it from the hidden items
      this.currentLayoutObj[item.i] = item;
      this.updateLayoutList();
      this.updateSize(item);
    },

    resizeEvent: function(i, newH, newW, newHPx, newWPx) {
      // when the item is resized, if its a chart, the chart size will adjust to container size.
      let item = this.currentLayoutObj[i];
      // "lineChart" is a Highstock chart which does not respond well to `setSize()`
      // so we exclude it from this event and it will resize when the user finishes resizing the container.
      if (item.c !== "lineChart") {
        if (item.isChart) {
          let comp = this.$refs[item.c][0];
          let chart = comp.$refs[item.c];
          chart.chart.setSize(newWPx, newHPx);
        }
      }
    },

    updateSize: function(item) {
      // update size of item to container's size.
      this.$nextTick(() => {
        if (item.isChart) {
          let comp = this.$refs[item.c][0];
          let chart = comp.$refs[item.c].chart;
          let cont = chart.container.getBoundingClientRect();
          chart.setSize(cont.width, cont.height, false);
        }
      });
    },

    setLayout: function() {
      const self = this;
      // create a deep copy of the layout object.
      for (const [, layoutData] of Object.entries(this.currentLayoutObj)) {
        layoutData.dataProp = self.dashboardData[layoutData.name];
      }
    },

    loadFromDefault: function() {
      // load layout from default layout.
      const self = this;
      // create a deep copy of the layout object.
      this.defaultLayoutObj = JSON.parse(JSON.stringify(defaultLayout));
      for (const [, layoutData] of Object.entries(this.defaultLayoutObj)) {
        layoutData.dataProp = self.dashboardData[layoutData.name];
      }
    },

    updateLayoutList() {
      // when layout object changes, it will update the layout list.
      const self = this;
      this.currentLayoutArr = [];
      for (const [, layout_data] of Object.entries(this.currentLayoutObj)) {
        if (
          layout_data?.name === "Upload Box"
          && !growthbook.isOn("upload_enabled")
        ) {
          continue;
        }
        this.currentLayoutArr.push(layout_data);
        layout_data.dataProp = self.dashboardData[layout_data.name];
      }
    },

    parseNetWorthOverTime() {
      if (this.portfolios.net_over_time == null) {
        return [];
      }
      const graphData = this.portfolios.net_over_time.data;
      console.log(graphData);
      let len = graphData.length;
      let result = [];
      for (let i = 0; i < len; i++) {
        result.push([Date.parse(graphData[i].date), graphData[i].value]);
      }
      return result;
    },

    parseCommissions() {
      if (this.portfolios.commissions == null) {
        return { names: [], values: [] };
      }

      const commissionsData = JSON.parse(this.portfolios.commissions).data;

      for (let i = 0; i < commissionsData.length; i++) {
        this.commissionsNames[i] = commissionsData[i].name;
        this.commissionsValues[i] = commissionsData[i].value;
      }
      return {
        names: this.commissionsNames,
        values: this.commissionsValues,
      };
    },

    parseAssets() {
      if (this.portfolios.assets == null) {
        return [];
      }

      const assetsData = this.portfolios.assets;
      const assetsArray = [];

      for (let i = 0; i < assetsData.length; i++) {
        assetsArray[i] = [assetsData[i].name, assetsData[i].value];
      }
      return assetsArray;
    },

    parseDividends() {
      if (this.portfolios.dividends == null) {
        return {};
      }
      return this.portfolios.dividends;
    },

    parseTable() {
      if (this.portfolios.instruments == null) {
        return [];
      }
      return this.portfolios.instruments.data;
    },

    setNumberBox(
      data,
      name,
      color = "var(--v-success-base)",
      decimalPlaces = 0,
      prefix = String.fromCharCode(0x20aa), // NIS symbol
      suffix = "",
    ) {
      let value = null;
      if (data != null) {
        value
          = prefix
          + data.value
            .toFixed(decimalPlaces)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            .toString()
          + suffix;
      }
      return {
        number: value,
        color: color,
        title: name,
      };
    },

    parseDashboardData() {
      this.dashboardData["Assets"] = this.parseAssets();
      // this.dashboardData["Net Change No Div"] = this.portfolios.net_change_no_dividends;
      this.dashboardData["Dividends"] = this.parseDividends();
      this.dashboardData["Instrument Table"] = this.parseTable();
      this.dashboardData["Value Over Time"] = this.parseNetWorthOverTime();
      this.dashboardData["Commissions"] = this.parseCommissions();

      this.dashboardData["Value"] = this.setNumberBox(
        this.portfolios.net_worth,
        "Value",
      );

      // Return value includes earnings from dividends
      this.dashboardData["Return"] = this.setNumberBox(
        this.portfolios.net_change_with_dividends,
        "Return",
      );

      this.dashboardData["%Return"] = this.setNumberBox(
        this.portfolios.percent_change,
        "%Return",
        "var(--v-success-base)",
        2,
        "",
        "%",
      );

      this.dashboardData["USD/ILS"] = this.setNumberBox(
        this.portfolios.usd_ils,
        "USD/ILS",
        "rgba(255, 255, 255, 0.2)",
        3,
      );

      this.dashboardData["Cash Balance"] = this.setNumberBox(
        this.portfolios.balance,
        "Cash Balance",
        "rgba(255, 255, 255, 0.2)",
        2,
      );

      this.dashboardData["USD"] = this.setNumberBox(
        this.portfolios.currency_usd,
        "USD",
        "rgba(255, 255, 255, 0.2)",
        2,
        "$",
      );
    },

    async onPageLoad() {
      console.log("Displaying:");
      console.log(this.portfolios);
      this.updateChartsSize();
      this.parseDashboardData();
      await this.loadUserLayout();
    },

    toggleLayoutLock() {
      this.locked ^= true;
      console.log("locked = " + Boolean(this.locked));
    },
  },
};
</script>

<style>
.vue-grid-layout .vue-grid-item {
  opacity: 0.9;
  background-color: transparent;
}

.vue-grid-item:not(.vue-grid-placeholder) {
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  box-shadow: 4px 4px 5px 0 black;
  overflow: hidden;
}

.vue-grid-item.vue-grid-placeholder {
  background: grey !important;
  opacity: 20% !important;
}

.v-menu__content {
  box-shadow: -3px 0 3px 1px rgba(0, 0, 0, 0.12);
}

.v-card {
  background-color: transparent !important;
}

.vue-highcharts,
.highcharts-container {
  height: 100% !important;
  width: 100% !important;
}
</style>
