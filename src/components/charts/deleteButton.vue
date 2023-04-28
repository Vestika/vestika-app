<template>
  <v-tooltip v-model="showTooltip" left>
    <span>Press again to confirm</span>
    <template v-slot:activator="{ attrs }">
      <v-btn
        text
        icon
        :color="buttonColor"
        @click="toggleConfirm"
        v-bind="attrs"
        :class="confirming ? '' : 'invisibleButton'"
      >
        <v-icon>mdi-trash-can-outline</v-icon>
      </v-btn>
    </template>
  </v-tooltip>
</template>

<script>
import { bus } from "@/bus.js";

export default {
  data() {
    return {
      confirming: false,
      showTooltip: false,
      buttonColor: 'none',
    };
  },
  methods: {
    toggleConfirm() {
      if (this.confirming) {
        this.$emit('delete-item');
        this.cancelConfirm();
      } else {
        this.confirm();
      }
    },
    confirm() {
      bus.$emit('confirm-focus');
      this.confirming = true;
      this.showTooltip = true;
      this.buttonColor = 'error';
      let self = this;
      setTimeout(() => {
        self.cancelConfirm();
      }, 3000);
    },
    cancelConfirm() {
      this.confirming = false;
      this.showTooltip = false;
      this.buttonColor = 'none';
    },
    onKeyup(event) {
      if (event.keyCode === 27) { // Esc key
        this.cancelConfirm();
      }
    },
  },
  mounted() {
    document.addEventListener('keyup', this.onKeyup);
    bus.$on("confirm-focus", () => {
      this.cancelConfirm();
    });
  },
  beforeUnmount() {
    document.removeEventListener('keyup', this.onKeyup);
  },
};
</script>

<style>
.invisibleButton {
  opacity: 0 !important;
}

tr:hover > td > .invisibleButton {
  opacity: 1 !important;
}
</style>
