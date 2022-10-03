import api from "@/utils/api";
import router from "../../router/index";
import { store } from "@/store";
import { FireSignout, FireGetUser, FireGetToken } from "@/utils/firebase";

const localStorageManager = require("../../utils/localStorage");

export default {
  mounted() {
    this.InitUserName();
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
              localStorageManager.clear();
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
    async InitUserName() {
      const user = await FireGetUser();
      this.username = user.email.split("@")[0];
    },
  },
};
