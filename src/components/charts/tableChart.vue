<template>
  <div style="height: 100%">
    <v-data-table
      id="mainTable"
      style="height: 100%; overflow: auto !important;"
      v-if="this.data && this.data.length"
      :headers="headers"
      :items="data"
      :sort-by="'value'"
      sort-desc
      must-sort
      item-key="symbol"
      hide-default-footer
      disable-pagination
      class="transparent"
      fixed-header
      show-expand
      :expanded.sync="expanded"
      @click:row="(item, slot) => slot.expand(!slot.isExpanded)"
    >
      <!--ADD THIS ABOVE IF YOU WANT TO TRY RESIZABLE COLUMNS-->
      <!--v-resizable-columns-->

      <template v-slot:expanded-item="{ item: ParentItem }">
        <td :colspan="headers.length" style="padding: 0">
          <v-data-table
            id="nestedTable"
            :headers="nestedHeaders"
            :items="ParentItem.transactions"
            :sort-by="'date_at_purchase'"
            must-sort
            item-key="name"
            hide-default-footer
            disable-pagination
            class="alternativeBackground"
            dense
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
            <template #[`item.actions`]>
              <v-btn
                text
                icon
                @click.native.stop
                @click="notImplementedAlertVisible ^= true"
                class="invisibleButton"
              >
                <v-icon>mdi-trash-can-outline</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </td>
      </template>

      <template #[`header.data-table-expand`]>
        <v-btn text icon>
          <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-on="on"
              v-bind="attrs"
              @click="showManualStockDialog"
            >
              mdi-plus-circle-outline
            </v-icon>
          </template>
          <span>Add Investment</span>
        </v-tooltip>
        </v-btn>
      </template>

      <template #[`item.name`]="{ item }">
        <div class="truncate">
          <v-btn
            outlined
            :rounded="!/[a-z]/i.test(item.symbol)"
            width="80"
            small
            :href="item.url"
            target="_blank"
            style="margin-right: 15px"
          >
            {{ item.symbol }}
          </v-btn>

          <span>{{ item.name }}</span>
        </div>
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
        <v-chip
          ripple
          label
          style="width: 100px;"
          class="justify-center"
          color="rgba(255, 255, 255, 0.1)"
          :text-color="
            item.net_change > 0
              ? 'success'
              : item.net_change < 0
              ? 'error'
              : undefined
          "
        >
          {{
          (item.net_change &lt; 0 ? "-" : "") + "₪" +
            Math.abs(item.net_change)
              .toFixed()
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }}
        </v-chip>
      </template>

      <template #[`item.percent_change`]="{ item }">
        <v-chip
          ripple
          label
          style="width: 75px;"
          class="justify-center"
          color="rgba(255, 255, 255, 0.1)"
          :text-color="
            item.net_change > 0
              ? 'success'
              : item.net_change < 0
              ? 'error'
              : undefined
          "
        >
          {{
            item.percent_change
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%"
          }}
        </v-chip>
      </template>

      <template #[`item.chart`]="{ item }">
        <inner-table-chart :data-array="instOverTime(item.inst_over_time)" />
      </template>

      <template #[`item.actions`]>
        <div class="truncate">
          <v-btn text icon @click.native.stop>
            <v-icon>mdi-plus-circle-outline</v-icon>
          </v-btn>
          <v-btn
            text
            icon
            @click.native.stop
            @click="notImplementedAlertVisible ^= true"
          >
            <v-icon>mdi-trash-can-outline</v-icon>
          </v-btn>
        </div>
      </template>

    </v-data-table>

    <v-skeleton-loader v-else type="table-thead, table-tbody">
    </v-skeleton-loader>

    <v-snackbar v-model="notImplementedAlertVisible">
      Sorry, Not Implemented Yet!
    </v-snackbar>
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
      notImplementedAlertVisible: false,
      daysBack: daysBack,
      dialog: false,
      expanded: [],
      nestedHeaders: [
        { text: "", value: "", sortable: false },
        { text: "Purchase Date", value: "date_at_purchase" },
        { text: "Purchase Price", value: "price_at_purchase" },
        { text: "Quantity", value: "units" },
        { text: "Value", value: "cost" },
        { text: "", value: "actions", sortable: false, align: "right" },
      ],
      headers: [
        { text: "", value: "data-table-expand", align: 'center' },
        { text: "Name", value: "name" }, // width is set by `.truncate` CSS rule
        { text: "Quantity", value: "units", width: "105" },
        { text: "Price", value: "price", minWidth: "150" },
        { text: "Value", value: "value", minWidth: "150" },
        { text: "Gain", value: "net_change", minWidth: "135" },
        { text: "Gain (%)", value: "percent_change", minWidth: "115" },
        { text: "Last " + daysBack + " days", value: "chart", sortable: false },
        { text: "", value: "actions", sortable: false, minWidth: "150", align: "right" },
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
.invisibleButton {
  opacity: 0 !important;
}

.invisibleButton:hover {
  opacity: 1 !important;
}

.truncate {
  max-width: 25vw;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/*.resizable-columns-divider div {*/
/*  background-color: white !important;*/
/*  box-shadow: #ef968e;*/
/*}*/

tbody > tr:hover {
  background-color: rgba(255, 255, 255, 0.04) !important;
}

th {
  font-size: 14px !important;
  background-color: var(--v-background-base) !important;
}

#mainTable td {
  font-weight: bold;
  cursor: pointer;
}

#nestedTable td {
  cursor: default;
}

.v-data-table__wrapper {
  height: 100%;
}
::-webkit-scrollbar {
  width: 13px !important;
  height: 13px !important;
}
::-webkit-scrollbar-corner {
  background: transparent;
}


.v-data-table,
.v-data-table__wrapper,
.v-skeleton-loader__table-thead,
.v-skeleton-loader__table-tbody {
  background-color: transparent !important;
}

</style>
