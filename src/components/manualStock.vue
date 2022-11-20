<template>
  <v-dialog
    :value="showDialog"
    @click:outside="closeManualStockDialog()"
    @keydown.esc="closeManualStockDialog()"
    max-width="590"
  >
    <v-card style="background-color: var(--v-card-base) !important;">
      <v-card-title class="text-h5">
        Add Stock Manually
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          :items="symbols"
          label="Symbol"
          placeholder="Select symbol"
          v-model="symbols[0]"
        ></v-autocomplete>
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          style="background-color: blue !important;"
        >
          <template
            v-slot:activator="{ on, attrs }"
            style="background-color: blue !important;"
          >
            <v-text-field
              v-model="purchaseDate"
              required
              label="Purchase Date"
              append-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            :max="new Date().toISOString().split('T')[0]"
            v-model="purchaseDate"
            @input="menu = false"
          >
          </v-date-picker>
        </v-menu>
        <v-text-field
          label="Units"
          hint="The amount of shares you own."
          type="number"
          step="any"
          min="0"
          required
          ref="input"
          :rules="[numberRule]"
          v-model.number="units"
        ></v-text-field>
        <v-text-field
          v-model="purchasePrice"
          label="Purchase Price"
          hint="If not specified, stock price at purchase date will be taken."
          type="number"
          min="0"
          :rules="[numberRule]"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="var(--v-mainTheme-base)"
          text
          @click="closeManualStockDialog()"
        >
          Cancel
        </v-btn>

        <v-btn
          color="var(--v-mainTheme-base)"
          text
          @click="closeManualStockDialog()"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { SYMBOLS } from "@/utils/constants";

export default {
  computed: {
    showDialog() {
      return this.dialog;
    },
  },

  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      units: 0,
      purchasePrice: undefined,
      purchaseDate: new Date(
        Date.now() - new Date().getTimezoneOffset() * 60000,
      )
        .toISOString()
        .substr(0, 10),
      numberRule: val => {
        if (val < 0) return "Please enter a positive number";
        return true;
      },
      menu: false,
      symbols: SYMBOLS,
    };
  },

  methods: {
    closeManualStockDialog() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.theme--dark.v-list {
  background: var(--v-background-base);
}

/deep/ .theme--dark.v-picker__body {
  background-color: var(--v-background-base) !important;
}

/deep/ .v-picker__title {
  background-color: var(--v-background-base) !important;
}
</style>
