<template>
  <div style="height: 100%">
    <v-skeleton-loader
      v-show="!this.data"
      style="height: 100%"
      type="image"
    ></v-skeleton-loader>
    <v-container fill-height class="justify-center">
      <div>
        <span
          style="font-family:'Lucida Grande', 'Lucida Sans Unicode', 'Arial', 'Helvetica', 'sans-serif'; font-size: 22px; position: absolute; left:10px; top:3px; color: rgba(255,255,255,0.2); font-weight: bold;"
        >
          {{ data.title }}
        </span>
        <h1
          v-show="this.data && Object.keys(this.data).length"
          class="text-center"
          :style="{ color: data.color }"
        >
          {{ getValue }}
        </h1>
      </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "numbers",

  props: {
    data: {
      type: Object,
    },
  },

  computed: {
    getValue() {
      return this.data.number;
    },
  },
};
</script>
