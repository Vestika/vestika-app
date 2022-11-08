import { bus } from "@/bus.js";
import api from "@/utils/api.js";
import router from "@/router/index.js";
import { store } from "@/store.js";
import { FireSignout, FireGetUser, FireGetToken } from "@/utils/firebase.js";

const localStorageManager = require("../../utils/localStorage");

export default {
  mounted() {
    this.InitUserName();
  },

  props: {
    profilePictureUrl: String,
  },
  data() {
    return {
      items: [
        { title: "Portfolio", link: "/" },
        // { title: "Feed", link: "/feed" },
        // { title: "Dividends", link: "/dividends" },
        // { title: "Expenses", link: "/expenses" },
        // { title: "Calculators", link: "/calculators" },
      ],
      storeState: store.state,
      username: undefined,
      userOptions: {
        "Settings": {
          icon: "mdi-cog",
          fn() {
            router.push("/profile");
          },
        },
        "Delete Data": {
          icon: "mdi-delete",
          async fn() {
            const idToken = await FireGetToken();

            if (confirm("You are about to delete all of your data")) {
              localStorageManager.clear();
              api
                .delete("/dashboard", {
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`,
                  },
                })
                .then(resp => {
                  console.debug(resp);
                  bus.$emit("data-cleared");
                })
                .catch(error => {
                  console.error(error);
                });
            }
          },
        },
        "Sign Out": {
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
    async InitUserName() {
      const user = await FireGetUser();
      this.username = user.email.split("@")[0];
    },
    imageLoadError() {
      console.log("image error");
      this.$emit("error-loading-image");
    },
  },
};
