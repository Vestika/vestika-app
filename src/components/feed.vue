<template>
  <div>
    <v-card class="mx-auto" outlined>
      <v-list-item three-line>
        <v-list-item-content>
          <v-text-field
            v-model="message"
            placeholder="Whats on your mind"
            solo-inverted
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>

      <v-card-actions>
        <v-btn :loading="loading" outlined rounded text @click="tweet()">
          post
        </v-btn>
      </v-card-actions>
    </v-card>

    <div v-for="(item, $index) in list" :key="$index" :data-num="$index + 1">
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-avatar size="72px">
            <img
              src="https://avatars0.githubusercontent.com/u/9064066?v=4&s=460"
              alt="John"
            />
          </v-avatar>
        </v-list-item-avatar>

        <v-list-item-title>{{ item.user_id }}</v-list-item-title>
      </v-list-item>

      <v-list-item class="px-2">
        <v-list-item-content>{{ item.message }}</v-list-item-content>
      </v-list-item>

      <v-list-item class="px-2">
        <v-list-item-subtitle
          >Percent Change {{ item.portfolio_content.percent_change }} %
        </v-list-item-subtitle>
        <v-col lg="10">
          <pie-chart
            :data-array="calcChart(item.portfolio_content.assets_percentage)"
          />
        </v-col>
      </v-list-item>

      <v-banner></v-banner>
    </div>

    <infinite-loading @infinite="infiniteHandler"></infinite-loading>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";
import api from "@/utils/api";
import pieChart from "./charts/pieChart.vue";

export default {
  components: {
    InfiniteLoading,
    pieChart,
  },

  data() {
    return {
      last_id: null,
      list: [],
      message: null,
      loading: false,
    };
  },
  methods: {
    calcChart(assetsData) {
      return assetsData.map(a => [a.name, a.percent]);
    },

    async tweet() {
      try {
        this.loading = true;
        await api
          .post(
            "/feed",
            {
              message: this.message,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          )
          .then(response => {
            this.list.unshift(response);
            this.loading = false;
          });
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
      this.message = null;
    },
    async update() {},
    async infiniteHandler($state) {
      api
        .get(`${process.env.VUE_APP_BASE_URL}/feed/scroll`, {
          params: {
            last_id: this.last_id,
          },
        })
        .then(data => {
          if (data.portfolios_list.length) {
            this.last_id = data.last_id;
            this.list.push(...data.portfolios_list);
            $state.loaded();
          } else {
            $state.complete();
          }
        });
    },
  },
};
</script>
