<template>
    <v-data-table
      :headers="headers"
      :items="data"
      :sort-by="['name']"
      :sort-desc="[false, true]"
      hide-default-footer
      disable-pagination
      class="transparent"
      fixed-header
      style="height: 100%"

    >
      <template #[`item.name`]="{ item }">
        <v-btn block text :href="item.url" target="_blank">
          {{ item.name }}
        </v-btn>
      </template>

      <template #[`item.units`]="{ item }">
        {{
          item.units
            .toFixed()
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }}
      </template>

      <template #[`item.price`]="{ item }">
        {{
          (isNaN(item.symbol) ? "$" : "₪") +
            item.price
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }}
      </template>

      <template #[`item.value`]="{ item }">
        {{
          "₪" +
            item.value
              .toFixed()
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }}
      </template>

      <template #[`item.net_change`]="{ item }">
        {{
          "₪" +
            item.net_change
              .toFixed()
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }}
      </template>

      <template #[`item.percent_change`]="{ item }">
        {{
          item.percent_change
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%"
        }}
      </template>

      <template #[`item.chart`]="{ item }">
        <inner-table-chart :data-array="instOverTime(item.inst_over_time)" />
      </template>
    </v-data-table>
</template>

<script>
import InnerTableChart from "@/components/charts/innerTableChart.vue";

export default {
  components: { InnerTableChart },
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      },
    },
    chartName: {
      type: String,
      default: "",
    },
  },

  dark: true,

  data() {
    let daysBack = 7;

    return {
      daysBack: daysBack,
      headers: [
        {
          text: "Instrument",
          align: "center",
          value: "name",
        },
        { text: "Symbol", value: "symbol" },
        { text: "Units", value: "units" },
        { text: "Price", value: "price" },
        { text: "Value (₪)", value: "value" },
        { text: "Return (₪)", value: "net_change" },
        { text: "Return (%)", value: "percent_change" },
        { text: "Last " + daysBack + " days", value: "chart", sortable: false },
      ],
    };
  },
  methods: {
    instOverTime(inst_over_time) {
      return inst_over_time.slice(-this.daysBack);
    },
  },
};
</script>

<style lang="scss">
tbody {
  tr:hover {
    background-color: transparent !important;
  }
}
th {
  font-size: 20px !important;
}
td {
  font-size: 16px !important;
  font-weight: bold;
}
.v-data-table__wrapper {
  height: 100%;
}

.v-data-table .v-data-table-header tr th {
  background-color: var(--v-background-base) !important;
}
</style>
