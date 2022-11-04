<template>
  <v-container fill-height fluid id="registerContainer">
    <v-row justify="center" align="center">
      <v-col xs="12" md="9" lg="9">
        <v-card id="registerCard">
          <v-window v-model="currentView" class="registerWindow">
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

<style lang="scss">
.noHover-btn:before {
  display: none;
}
.noHover-btn:after {
  display: none;
}

@mixin dots($count) {
$text-shadow: ();
  @for $i from 0 through $count {
    $text-shadow: $text-shadow,
    (-0.5+ (random()) * 3) +
  em
  (-0.5+ (random()) * 3) +
  em
  8px
  hsla(random() * 360, 100%, 50%, 0.9);
  }
  text-shadow: $text-shadow;
}

html {
  font: 5vmin/1.3 Serif;
  overflow: hidden;
  background: #123;
}

body {
  color: transparent;
  width: 0;
}

#registerContainer {
  position: fixed;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  margin: 15px;
  height: calc(100% - 30px);
  width: calc(100% - 30px);
}

#registerCard {
  background-color: rgba(255, 255, 255, 0.05) !important;
  box-shadow: 0 0 30px rgba(158, 202, 237, 0.4);

}

.registerCard {
  height: 100px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

}

head::before,
head::after,
body::before,
body::after {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 3em;
  height: 3em;
  content: ".";
  mix-blend-mode: screen;
  animation: 33s -1s move infinite ease-in-out alternate;
  z-index: -1;
}

body::before {
  @include dots(10);
  animation-duration: 33s;
  animation-delay: -31s;
}

body::after {
  @include dots(60);
  animation-duration: 82s;
  animation-delay: -21s;
}

head::before {
  @include dots(40);
  animation-duration: 81s;
  animation-delay: -11s;
}

head::after {
  @include dots(40);
  animation-duration: 130s;
  animation-delay: -1s;
}

@keyframes move {
  from {
    transform: rotate(0deg) scale(12) translateX(-20px);
  }
  to {
    transform: rotate(360deg) scale(18) translateX(20px);
  }
}

@font-face {
  font-family: "Poiret One";
  font-style: normal;
  font-weight: 400;
  src: url("../../fonts/poiret-one-v9-latin-regular.eot"); /* IE9 Compat Modes */
  src: local(""),
  url("../../fonts/poiret-one-v9-latin-regular.eot?#iefix")
  format("embedded-opentype"),
    /* IE6-IE8 */ url("../../fonts/poiret-one-v9-latin-regular.woff2")
  format("woff2"),
    /* Super Modern Browsers */
  url("../../fonts/poiret-one-v9-latin-regular.woff") format("woff"),
    /* Modern Browsers */ url("../../fonts/poiret-one-v9-latin-regular.ttf")
  format("truetype"),
    /* Safari, Android, iOS */
  url("../../fonts/poiret-one-v9-latin-regular.svg#PoiretOne")
  format("svg"); /* Legacy iOS */
}
@-webkit-keyframes autofill {
  0%,100% {
    color: #666;
    background: transparent;
  }
}

input:-webkit-autofill,
input:-webkit-autofill:focus {
  transition: background-color 600000s 0s, color 600000s 0s;
}
input[data-autocompleted] {
  background-color: transparent !important;
}

</style>
