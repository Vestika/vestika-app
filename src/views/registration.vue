<template>
  <v-container fill-height fluid>
    <v-row justify="center" align="center">
      <v-col xs="12" md="9" lg="9">
        <v-card class="registerCard elevation-2">
          <v-window v-model="currentView">
            <v-window-item :value="views.loginView">
              <v-row align="center" justify="center">
                <v-col xs="12" md="6" lg="6" order="0">
                  <welcome-page-image></welcome-page-image>
                </v-col>
                <v-col xs="12" md="6" lg="6" order="1">
                  <login :views="views" @new-view="updateView"></login>
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item eager :value="views.signUpView">
              <v-row align="center" justify="center">
                <v-col xs="12" md="6" lg="6" order="1">
                  <welcome-page-image></welcome-page-image>
                </v-col>
                <v-col xs="12" md="6" lg="6" order="0">
                  <signup
                    :views="views"
                    :successOptions="successMessages"
                    @success-msg="updateSuccess"
                    @new-view="updateView"
                    ref="signupComponent"
                  ></signup>
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item eager :value="views.resetPasswordView">
              <v-row align="center" justify="center">
                <v-col xs="12" md="6" lg="6" order="1">
                  <welcome-page-image></welcome-page-image>
                </v-col>
                <v-col xs="12" md="6" lg="6" order="0">
                  <reset-password
                    :views="views"
                    :successOptions="successMessages"
                    @success-msg="updateSuccess"
                    @new-view="updateView"
                  ></reset-password>
                </v-col>
              </v-row>
            </v-window-item>

            <v-window-item eager :value="views.verifyView">
              <v-row align="center" justify="center">
                <v-col xs="12" md="6" lg="6" order="0">
                  <welcome-page-image></welcome-page-image>
                </v-col>
                <v-col xs="12" md="6" lg="6" order="1">
                  <verify-mail
                    :views="views"
                    :successOptions="successMessages"
                    :success-msg="success"
                    @new-view="updateView"
                  ></verify-mail>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import login from "@/views/registration_windows/login.vue";
import signup from "@/views/registration_windows/signup.vue";
import resetPassword from "@/views/registration_windows/resetPassword.vue";
import verifyMail from "@/views/registration_windows/verifyMail.vue";
import welcomePageImage from "@/views/registration_windows/welcomePageImage.vue";

const views = Object.freeze({
  loginView: 1,
  signUpView: 2,
  resetPasswordView: 3,
  verifyView: 4,
});
const successMessages = Object.freeze({ verifyMsg: 1, resetMsg: 2 });

export default {
  components: {
    login,
    signup,
    resetPassword,
    verifyMail,
    welcomePageImage,
  },
  data() {
    return {
      views,
      successMessages,
      currentView: views.loginView,
      success: undefined,
    };
  },
  mounted() {
    document.addEventListener("keyup", this.slide);
  },

  methods: {
    updateView(newView) {
      if (newView) {
        this.currentView = newView;
      }
    },
    updateSuccess(successMsg) {
      if (successMsg) {
        this.success = successMsg;
      }
    },
    slide(event) {
      if (event.keyCode === 39 && this.currentView === views.loginView) {
        this.currentView = views.signUpView;
      } else if (event.keyCode === 37 && this.currentView !== views.loginView) {
        this.currentView = views.loginView;
      }
    },
  },
};
</script>

<style>
.noHover-btn:before {
  display: none;
}
.noHover-btn:after {
  display: none;
}
/* Change the white to any color */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px var(--v-registerCard-base) inset !important;
  -webkit-text-fill-color: white !important;
}
</style>
