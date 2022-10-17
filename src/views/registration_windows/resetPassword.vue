<template>
  <v-card-text class="mt-12">
    <h1
      class="text-center display-2 white--text text--accent-3 font-weight-light"
    >
      RESET PASSWORD
    </h1>
    <br />
    <h3 class="text-center white--text ma-3 font-weight-light">
      Here you can reset your forgotten password
      <br />
      Enter your e-mail and click "Reset password"
    </h3>

    <v-form class="pt-14 mb-0 shrink mx-13">
      <v-text-field
        v-model="email"
        outlined
        dark
        color="white"
        type="email"
        label="E-MAIL"
        data-cy="emailInput"
        prepend-inner-icon="mdi-account"
        :rules="[rules.required, rules.emailRules]"
      />
      <div class="text-center mt-3">
        <v-btn
          data-cy="resetPassword"
          class="buttons white--text font-weight-bold"
          block
          @click="resetUserPassword"
        >
          reset password
        </v-btn>
        <p v-if="isError" class="error--text mt-2">
          {{ errorMessage }}
        </p>
      </div>
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
    </v-form>
  </v-card-text>
</template>

<script>
import { FireForgotPassword } from "@/utils/firebase.js";

export default {
  props: {
    views: {
      required: true,
      type: Object,
    },
    successOptions: {
      required: true,
      type: Object,
    },
  },
  emits: ["new-view", "success-msg"],
  data() {
    return {
      email: undefined,
      isError: false,
      errorMessage: "",
      isResetSuccess: false,

      rules: {
        required: value => !!value || "Required.",
        emailRules: value =>
          !value
          || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
          || "E-mail must be valid",
      },
    };
  },

  methods: {
    async resetUserPassword() {
      this.isError = false;
      this.errorMessage = "";
      try {
        await FireForgotPassword({ email: this.email });
      } catch (error) {
        this.isError = true;
        this.errorMessage = error;
        return;
      }
      this.$emit("new-view", this.views.verifyView);
      this.$emit("success-msg", this.successOptions.resetMsg);
    },
  },
};
</script>
