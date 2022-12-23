<template>
  <div style="height: 100%;">
    <v-data-table
      v-show="this.data && this.data.length"
      :headers="headers"
      :items="data"
      :sort-by="['name']"
      :sort-desc="[false, true]"
      item-key="name"
      hide-default-footer
      disable-pagination
      class="transparent"
      fixed-header
      style="height: 100%"
      show-expand
      @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
      :expanded.sync="expanded"
    >
      <template #[`header.actions`]="{ header }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-on="on"
              v-bind="attrs"
              small
              @click="showManualStockDialog"
              >mdi-plus-circle</v-icon
            >{{ header.text }}
          </template>
          <span>Add Stock Manually</span>
        </v-tooltip>
      </template>

      <template v-slot:expanded-item="{ item: ParentItem }">
        <td :colspan="headers.length" style="padding: 0px">
          <v-data-table
            id="nestedTable"
            :headers="nestedHeaders"
            :items="ParentItem.transactions"
            :sort-by="['name']"
            :sort-desc="[false, true]"
            item-key="name"
            hide-default-footer
            disable-pagination
            class="alternativeBackground"
            fixed-header
          >
            <template #[`item.date_at_purchase`]="{ item }">
              {{ item.date_at_purchase }}
            </template>
            <template #[`item.price_at_purchase`]="{ item }">
              {{
                (isNaN(ParentItem.symbol) ? "$" : "₪") +
                  item.price_at_purchase
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }}
            </template>
            <template #[`item.units`]="{ item }">
              {{ item.units }}
            </template>
            <template #[`item.cost`]="{ item }">
              {{
                (isNaN(ParentItem.symbol) ? "$" : "₪") +
                  item.cost
                    .toFixed()
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }}
            </template>
          </v-data-table>
        </td>
      </template>

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
    <v-skeleton-loader
      v-show="!this.data || !this.data.length"
      max-height="100%"
      type="table-thead, table-tbody, table-tfoot"
    >
    </v-skeleton-loader>
  </div>
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
      dialog: false,
      expanded: [],
      nestedHeaders: [
        {
          text: "Date of Purchase",
          value: "date_at_purchase",
          align: "center",
        },
        {
          text: "price at Purchase",
          value: "price_at_purchase",
          align: "center",
        },
        { text: "Units", value: "units", align: "center" },
        { text: "Cost", value: "cost", align: "center" },
      ],
      headers: [
        {
          text: "",
          value: "actions",
          sortable: false,
          width: "10px",
        },
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
        { text: "", value: "data-table-expand" },
      ],
    };
  },
  methods: {
    instOverTime(inst_over_time) {
      return inst_over_time.slice(-this.daysBack);
    },
    showManualStockDialog() {
      this.$emit("show-manual-stock-dialog");
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
.v-skeleton-loader__table-thead {
  background-color: transparent !important;
}
.v-skeleton-loader__table-tbody {
  background-color: transparent !important;
}
</style>
