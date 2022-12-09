<template>
  <v-app id="app">
    <nav-bar
      v-if="!isRegistrationRoute()"
      :openSignUpForm="openSignUpForm"
      ref="status"
    />
    <right-side-bar v-if="!isRegistrationRoute() && false"> </right-side-bar>
    <side-bar
      :profilePictureUrl="profilePictureUrl"
      v-if="!isRegistrationRoute()"
      @error-loading-image="DownloadAvatarImage"
    />
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
      <router-view
        @on-profile-image-change="changeProfilePicture"
        @app-loading="changeLoadingStatus"
      />
      <v-dialog v-model="showDialog" width="550px" overlay-color="overlayColor">
        <v-card class="pa-7 registerCard">
          <signup @success-msg="showPopUp"></signup>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import Vue from "vue";
import HighchartsVue from "highcharts-vue";
import Highcharts from "highcharts";
import Stock from "highcharts/modules/stock";
import Signup from "@/views/registration_windows/signup.vue";
import RightSideBar from "@/components/rightSideBar.vue";
import navBar from "@/components/navBar.vue";
import sideBar from "@/components/sideBar/sideBar.vue";
import { messages } from "@/components/messages.json";
import { AVATAR_DEFAULT_IMAGE } from "@/utils/constants";
import api from "@/utils/api";

Stock(Highcharts);
Vue.use(HighchartsVue);

const localStorageManager = require("./utils/localStorage");

export default {
  name: "App",
  components: {
    RightSideBar,
    Signup,
    navBar,
    sideBar,
  },
  mounted() {
    this.initUserProfilePicture();
  },
  data() {
    return {
      showDialog: false,
      verifyPopUp: false,
      popUpText: "",
      isLoading: false,
      profilePictureUrl: "",
      user_info_obj: {},
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
    changeProfilePicture(ProfilePictureUrl) {
      this.profilePictureUrl = ProfilePictureUrl;
    },
    hide_alert() {
      window.setInterval(() => {
        this.verifyPopUp = false;
      }, 7500);
    },

    async DownloadAvatarImage() {
      console.log("Downloading Avatar Image");
      try {
        var profilePictureUrl = await api.get(
          "/users/download_profile_picture_signed_url",
        );
        this.changeProfilePicture(profilePictureUrl);
        this.user_info_obj.profile_picture_url = this.profilePictureUrl;
        localStorageManager.set("user_info", this.user_info_obj);
      } catch (error) {
        this.profilePictureUrl = AVATAR_DEFAULT_IMAGE;
      }
    },

    async initUserProfilePicture() {
      var user_info_obj = localStorageManager.get("user_info");
      if (!user_info_obj) {
        try {
          user_info_obj = await api.get("users");
        } catch (error) {
          console.log("Failed getting user profile picture in side bar");
        }
      }
      if (user_info_obj && user_info_obj.profile_picture_url) {
        this.profilePictureUrl = user_info_obj.profile_picture_url;
        this.user_info_obj = user_info_obj;
        localStorageManager.set("user_info", this.user_info_obj);
      } else {
        await this.DownloadAvatarImage();
      }
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
