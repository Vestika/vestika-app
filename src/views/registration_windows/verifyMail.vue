<template>
  <v-card-text class="mt-12" align="center">
    <span class="material-icons green--text mb-16" style="font-size: 100px"
      >check_circle_outline</span
    >
    <h3
      class="text-center display-1 white--text text--accent-3 font-weight-light"
    >
      {{
        successMsg === successOptions.verifyMsg
          ? messages.verify.title
          : messages.resetPassword.title
      }}
    </h3>
    <h3 class="text-center white--text ma-3 font-weight-light">
      {{
        successMsg === successOptions.verifyMsg
          ? messages.verify.message
          : messages.resetPassword.message
      }}
    </h3>
    <br />
    <div class="text-center">
      <v-btn
        color="white"
        class="noHover-btn white--text mt-2 font-weight-light"
        text
        @click="$emit('new-view', views.loginView)"
      >
        back to login
      </v-btn>
    </div>
  </v-card-text>
</template>

<script>
import { messages } from "@/components/messages.json";

export default {
  props: {
    successMsg: {
      required: true,
    },
    successOptions: {
      required: true,
      type: Object,
    },
    views: {
      required: true,
      type: Object,
    },
  },
  emits: ["new-view", "success-msg"],

  data() {
    return {
      messages,
    };
  },
};
</script>
