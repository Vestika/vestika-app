<template>
  <v-card-text class="mt-12">
    <h1
      class="text-center display-2 white--text text--accent-3 font-weight-light"
    >
      JOIN VESTIKA
    </h1>
    <br />
    <h3 class="text-center white--text ma-3 font-weight-light">
      PLEASE ENTER E-MAIL ADDRESS AND PASSWORD
    </h3>

    <v-form
      v-model="valid"
      class="pt-7 mb-0 shrink mx-13"
      ref="form"
      @submit.prevent="signup"
    >
      <v-text-field
        v-model="email"
        outlined
        autofocus
        autocomplete="off"
        dark
        color="white"
        type="email"
        label="E-MAIL"
        data-cy="emailInput"
        prepend-inner-icon="mdi-account"
        :rules="[rules.required, rules.emailRules]"
      />
      <v-text-field
        v-model="password"
        outlined
        dark
        color="white"
        label="PASSWORD"
        data-cy="password"
        hint="At least 8 characters"
        prepend-inner-icon="mdi-lock"
        :rules="rules.passwordRules"
        :type="showPassword ? 'text' : 'password'"
      >
        <template v-slot:append>
          <v-icon
            v-if="showPassword"
            @click="showPassword = !showPassword"
            tabindex="-1"
            >mdi-eye</v-icon
          >
          <v-icon
            v-if="!showPassword"
            @click="showPassword = !showPassword"
            tabindex="-1"
            >mdi-eye-off</v-icon
          >
        </template>
      </v-text-field>
      <v-text-field
        v-model="confirmPassword"
        outlined
        dark
        color="white"
        label="CONFIRM PASSWORD"
        data-cy="confirmPassword"
        hint="At least 8 characters"
        prepend-inner-icon="mdi-lock"
        :rules="rules.passwordMatch"
        :type="showConfirmPassword ? 'text' : 'password'"
      >
        <template v-slot:append>
          <v-icon
            v-if="showConfirmPassword"
            @click="showConfirmPassword = !showConfirmPassword"
            tabindex="-1"
            >mdi-eye</v-icon
          >
          <v-icon
            v-if="!showConfirmPassword"
            @click="showConfirmPassword = !showConfirmPassword"
            tabindex="-1"
            >mdi-eye-off</v-icon
          >
        </template>
      </v-text-field>
      <div class="text-center mt-6">
        <v-btn data-cy="signup" type="submit" class="create-btn" block>
          Create account
        </v-btn>
        <p v-if="isError" class="error--text mt-2">
          {{ errorMessage }}
        </p>
      </div>
      <div class="text-center">
        <v-btn
          v-show="!storeState.isAnonymous"
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
import { store } from "@/store.js";
import { FireSignup, FireSignUpAnonymous } from "@/utils/firebase.js";

export default {
  props: {
    views: {
      required: false,
      type: Object,
    },
    successOptions: {
      required: false,
      type: Object,
    },
  },
  emits: ["new-view", "success-msg"],

  data() {
    return {
      email: undefined,
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      isError: false,
      errorMessage: "",
      valid: false,
      storeState: store.state,
      invalidFormMsg: "Invalid form",

      rules: {
        required: value => !!value || "Required.",
        emailRules: value =>
          !value
          || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
          || "E-mail must be valid",
        passwordMatch: [
          value => !!value || "Type confirm password",
          value =>
            value === this.password
            || "The passwords you entered do not match.",
        ],
        passwordRules: [
          value => !!value || "Please type password",
          value => (value && value.length >= 8) || "minimum 8 characters",
        ],
      },
    };
  },
  methods: {
    async signup() {
      this.isError = false;
      this.errorMessage = "";
      if (!this.valid) {
        this.isError = true;
        this.errorMessage = this.invalidFormMsg;
        return;
      }
      try {
        if (this.storeState.isAnonymous) {
          await FireSignUpAnonymous({
            email: this.email,
            username: this.email,
            password: this.password,
          });
          this.$refs.form.reset();
          this.$emit("success-msg", true);
        } else {
          await FireSignup({
            email: this.email,
            username: this.email,
            password: this.password,
          });
          this.$emit("new-view", this.views.verifyView);
          this.$emit("success-msg", this.successOptions.verifyMsg);
        }
      } catch (error) {
        this.isError = true;
        this.errorMessage = error;
      }
    },
  },
};
</script>

<style>
.create-btn {
  background-color: #ef968e !important;
}
</style>
