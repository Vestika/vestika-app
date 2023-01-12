<template>
  <v-card-text class="mt-12">
    <h1
      class="text-center display-2 white--text text--accent-3 font-weight-light"
    >
      WELCOME
    </h1>
    <br />
    <h3 class="text-center white--text ma-3 font-weight-light">
      LOGIN AND START EXPLORING
    </h3>

    <v-form class="pt-7 mb-0 shrink mx-13" @submit.prevent="signin(false)">
      <v-text-field
        v-model="email"
        outlined
        dark
        autocomplete="off"
        type="email"
        label="E-MAIL"
        data-cy="emailInput"
        prepend-inner-icon="mdi-account"
        color="white"
        hide-details
        class="mb-3"
      />
      <v-text-field
        v-model="password"
        outlined
        dark
        type="password"
        label="PASSWORD"
        data-cy="passwordInput"
        color="white"
        hide-details
        prepend-inner-icon="mdi-lock"
      />
      <v-layout align-center justify-space-between>
        <v-checkbox
          v-model="isRememberMeChecked"
          label="Remember me"
          color="#ef968e"
        />
        <v-btn
          text
          class="noHover-btn white--text mr-n4 font-weight-light"
          data-cy="forgotPass"
          @click="$emit('new-view', views.resetPasswordView)"
        >
          forgot password?
        </v-btn>
      </v-layout>

      <div class="text-center mt-13">
        <v-btn
          type="submit"
          class="login-btn"
          data-cy="signin"
          block
        >
          LOGIN
        </v-btn>
        <v-btn
          @click="signin(true)"
          v-if="false"
          class="buttons white--text font-weight-bold"
          width="48%"
          >login as a guest</v-btn
        >
        <p v-if="isError" class="error--text mt-2">
          {{ errorMessage }}
        </p>
      </div>
      <div class="text-center">
        <v-btn
          color="white"
          class="noHover-btn white--text mt-2 font-weight-light"
          text
          @click="$emit('new-view', views.signUpView)"
        >
          don't have an account?
        </v-btn>
      </div>
    </v-form>
  </v-card-text>
</template>

<script>
import { store } from "@/store.js";
import {
  FireSignin,
  FireHandleRememberMe,
  FireSigninGuest,
} from "@/utils/firebase.js";

export default {
  props: {
    views: {
      required: true,
      type: Object,
    },
  },
  emits: ["new-view"],

  data() {
    return {
      email: undefined,
      password: undefined,
      isError: false,
      isRememberMeChecked: true,
      errorMessage: "",
    };
  },

  methods: {
    async signin(isGuest) {
      try {
        await this.checkRememberMe();
        if (isGuest) {
          await FireSigninGuest();
          store.setAnonymousState(true);
        } else {
          await FireSignin({
            email: this.email,
            password: this.password,
          });
          store.setAnonymousState(false);
        }
      } catch (error) {
        this.isError = true;
        this.errorMessage = error;
        return;
      }
      await this.$router.push("/");
    },

    async checkRememberMe() {
      try {
        await FireHandleRememberMe(this.isRememberMeChecked);
      } catch (error) {
        this.isError = true;
        this.errorMessage = error;
      }
    },
  },
};
</script>

<style>
.login-btn {
  background-color: #ef968e !important;
}
</style>