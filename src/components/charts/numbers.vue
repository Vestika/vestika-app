<template>
  <v-container fill-height class="justify-center">
    <div>
      <span
        style="font-family:'Lucida Grande', 'Lucida Sans Unicode', 'Arial', 'Helvetica', 'sans-serif'; font-size: 22px; position: absolute; left:10px; top:3px; color: rgba(255,255,255,0.2); font-weight: bold;"
      >
        {{ data.title }}
      </span>
      <h1 class="text-center" :style="{ color: data.color }">
        {{ data.number }}
      </h1>
    </div>
  </v-container>
</template>

<script>
export default {
  name: "numbers",
  props: {
    data: {
      type: Object,
      default: function() {
        return {};
      },
    },
  },
};
</script>
