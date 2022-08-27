<template>
  <v-app-bar class="topBar" app clipped-left flat v-if="false">
    <div @click="changeRoute">
      <v-toolbar-title class="font-weight-light" style="font-size: 40px">
        Vestika
      </v-toolbar-title>
    </div>
    <v-spacer />
    <v-menu left bottom>
      <template #activator="{ on }">
        <v-btn icon v-on="on">
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/85.jpg" />
          </v-list-item-avatar>
        </v-btn>
        <div v-if="storeState.isAnonymous" class="mr-4">
          <div class="font-weight-light text-center" style="font-size: 12px">
            Enjoying Vestika?
          </div>
          <div class="text-center">
            <v-btn x-small @click="openSignUpForm">
              SignUp
            </v-btn>
          </div>
        </div>
      </template>

      <v-list class="topBar">
        <v-subheader>signed in as {{ username }}</v-subheader>
        <v-list-item
          v-for="(value, key) in userOptions"
          :key="key"
          @click="value.fn"
        >
          <v-list-item-icon class="mr-4">
            <v-icon>{{ value.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ key }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { store } from "../store.js";
import { FireSignout } from "../utils/firebase";
import { FireGetToken } from "@/utils/firebase";
import router from "../router/index";
import api from "@/utils/api";

const localStorageManager = require("../utils/localStorage");

export default {
  props: {
    openSignUpForm: {
      type: Function,
    },
  },
  data() {
    return {
      username: "mock",
      storeState: store.state,
      userOptions: {
        settings: {
          icon: "mdi-cog",
          fn() {
            console.log("Nothing to happen yet");
          },
        },
        "Delete Data": {
          icon: "mdi-delete",
          async fn() {
            const idToken = await FireGetToken();

            if (confirm("You are about to delete all of your data")) {
              api
                .delete("/dashboard", {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${idToken}`,
                  },
                })
                .then(resp => {
                  console.log(resp?.status);
                  console.log("delete OK");
                })
                .catch(error => {
                  console.log(error);
                });
            }
          },
        },
        signout: {
          icon: "mdi-logout",
          async fn() {
            try {
              await FireSignout();
              localStorageManager.clear();
            } catch (error) {
              alert(error);
              return;
            }
            store.clearAnonymousState();
            await router.push("/registration");
          },
        },
      },
    };
  },
  methods: {
    changeRoute() {
      this.$router.go("/");
    },
    changeUserToPermanent() {
      store.setAnonymousState(false);
    },
  },
};
</script>

<style></style>
