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

      <template v-slot:expanded-item="{ item: parentItem }">
        <td :colspan="headers.length" style="padding: 0">
          <v-data-table
            id="nestedTable"
            :headers="nestedHeaders"
            :items="parentItem.transactions"
            :sort-by="'date_at_purchase'"
            must-sort
            item-key="name"
            hide-default-footer
            disable-pagination
            class="alternativeBackground"
            dense
          >
            <template #[`item.date_at_purchase`]="{ item }">
              <editable-text
                :value="item.date_at_purchase"
                @text-edit="updateValue(item, 'date_at_purchase', $event)"
              />
            </template>

            <template #[`item.price_at_purchase`]="{ item }">
              <editable-text
                :value="item.price_at_purchase"
                :formatter="
                  isNaN(parentItem.symbol)
                    ? formatPurchasePriceUSD
                    : formatPurchasePriceILS
                "
                @text-edit="updateValue(item, 'price_at_purchase', $event)"
              />
            </template>

            <template #[`item.units`]="{ item }">
              <editable-text
                :value="item.units"
                @text-edit="updateValue(item, 'units', $event)"
              />
            </template>

            <template #[`item.cost`]="{ item }">
              {{
                (isNaN(parentItem.symbol) ? "$" : "₪") +
                  item.cost
                    .toFixed()
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }}
            </template>

            <template #[`item.actions`]="{ item }">
                <delete-button @delete-item="deleteItem(parentItem, item)" class="invisibleButton"/>
              <v-btn
                text
                icon
                v-show="item._dirty"
                @click="revertItem(item)"
                class="invisibleButton"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </td>
      </template>

      <template #[`header.data-table-expand`]>
        <v-btn text icon>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-on="on" v-bind="attrs" @click="showManualStockDialog">
                mdi-plus-circle-outline
              </v-icon>
            </template>
            Add Investment
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
          {{ item.name }}
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
          <v-btn
            text
            icon
            @click.native.stop
            @click="notImplementedAlertVisible ^= true"
          >
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
import EditableText from "@/components/charts/editableText.vue";
import deleteButton from "@/components/charts/deleteButton.vue";


export default {
  components: {
    InnerTableChart,
    EditableText,
    deleteButton,
  },
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
        // { text: "", value: "", sortable: false, width: "170" },
        {
          text: "",
          value: "actions",
          sortable: false,
          align: "right",
          width: "170",
        },
        { text: "Purchase Date", value: "date_at_purchase", width: "150" },
        { text: "Quantity", value: "units", width: "150" },
        { text: "Purchase Price", value: "price_at_purchase", width: "150" },
        { text: "Value", value: "cost", width: "150" },
        { text: "", value: "", sortable: false },
      ],
      headers: [
        { text: "", value: "data-table-expand", align: "center" },
        { text: "Name", value: "name" }, // width is set by `.truncate` CSS rule
        { text: "Quantity", value: "units", width: "105" },
        { text: "Price", value: "price", minWidth: "150" },
        { text: "Value", value: "value", minWidth: "150" },
        { text: "Gain", value: "net_change", minWidth: "135" },
        { text: "Gain (%)", value: "percent_change", minWidth: "115" },
        { text: "Last " + daysBack + " days", value: "chart", sortable: false },
        {
          text: "",
          value: "actions",
          sortable: false,
          minWidth: "150",
          align: "right",
        },
      ],
    };
  },
  methods: {
    revertItem(item) {
      for (const key in item._originalValues) {
        item[key] = item._originalValues[key];
      }
      delete item._dirty;
      delete item._originalValues;
    },
    deleteItem(parentItem, item) {
      parentItem.transactions.splice(parentItem.transactions.indexOf(item), 1);
    },
    instOverTime(inst_over_time) {
      return inst_over_time.slice(-this.daysBack);
    },
    showManualStockDialog() {
      this.$emit("show-manual-stock-dialog");
    },
    _formatPurchasePrice(value) {
      return parseFloat(value)
        .toFixed(2)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    formatPurchasePriceILS(value) {
      return "₪" + this._formatPurchasePrice(value);
    },
    formatPurchasePriceUSD(value) {
      return "$" + this._formatPurchasePrice(value);
    },
    updateValue(item, key, newValue) {
      // Check if the value has changed
      if (item[key] !== newValue) {
        item._dirty = true;
        if (!item._originalValues) {
          item._originalValues = {};
        }
        // Store the original value if it hasn't been stored already
        if (!(key in item._originalValues)) {
          item._originalValues[key] = item[key];
        }
        // Update the value
        item[key] = newValue;
        // Check if all values have been changed back to their original value
        if (
          Object.entries(item._originalValues).every(
            ([key, value]) => item[key] === String(value),
          )
        ) {
          // Clear the dirty flag and original values
          delete item._dirty;
          delete item._originalValues;
        }
        item[key] = newValue;
      }
    },
  },
};
</script>

<style lang="scss">
.invisibleButton {
  opacity: 0 !important;
}

tr:hover > td > .invisibleButton {
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

.v-text-field {
  font-size: 14px !important;
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
