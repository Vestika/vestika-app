<template>
  <v-app id="app">
    <nav-bar
      v-if="!isRegistrationRoute()"
      :openSignUpForm="openSignUpForm"
      ref="status"
    />
    <right-side-bar v-if="!isRegistrationRoute() && false"> </right-side-bar>
    <side-bar v-if="!isRegistrationRoute()" />
    <v-progress-linear
      :active="isLoading"
      indeterminate
      absolute
      color="var(--v-mainTheme-base)"
    />
    <v-main id="main">
      <v-alert
        :value="verifyPopUp"
        outlined
        transition="slide-y-transition"
        type="success"
        text
      >
        {{ popUpText }}
      </v-alert>
      <router-view @on-loading="changeLoadingStatus" />
      <v-dialog v-model="showDialog" width="550px" overlay-color="overlayColor">
        <v-card class="pa-7 registerCard">
          <signup @success-msg="showPopUp"></signup>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import Signup from "@/views/registration_windows/signup";
import RightSideBar from "@/components/rightSideBar";
import navBar from "./components/navBar.vue";
import sideBar from "./components/sideBar/sideBar.vue";
import { messages } from "./components/messages";

export default {
  name: "App",
  components: {
    RightSideBar,
    Signup,
    navBar,
    sideBar,
  },
  data() {
    return {
      showDialog: false,
      verifyPopUp: false,
      popUpText: "",
      isLoading: true,
    };
  },
  methods: {
    isRegistrationRoute() {
      return this.$route.name === "registration";
    },
    openSignUpForm() {
      this.showDialog = true;
    },
    showPopUp(successMsg) {
      if (successMsg) {
        this.$refs.status.changeUserToPermanent();
        this.showDialog = false;
        this.verifyPopUp = true;
        this.popUpText = messages.verify.message;
        this.hide_alert();
      }
    },
    changeLoadingStatus(loadingStatus) {
      console.log('Change "loading" status to:', loadingStatus);
      this.isLoading = loadingStatus;
    },
    hide_alert() {
      window.setInterval(() => {
        this.verifyPopUp = false;
      }, 7500);
    },
  },
};
</script>

<style>
#app {
  background-color: var(--v-background-base);
}

::-webkit-scrollbar {
  width: 15px;
}

::-webkit-scrollbar-track {
  background: var(--v-background-base);
}

::-webkit-scrollbar-thumb {
  background: var(--v-card-base);
  border: solid 3px var(--v-background-base);
  border-radius: 7px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--v-brighterCard-base);
}
</style>
