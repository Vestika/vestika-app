<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn text @click="action" v-bind="attrs" v-on="on">
        <v-icon color="var(--v-buttons-base)">
          {{ icon }}
        </v-icon>
      </v-btn>
    </template>
    <span>
      {{ tooltip }}
    </span>
  </v-tooltip>
</template>

<script>
export default {
  props: {
    tooltip: String,
    icon: String,
    action: Function,
  },
};
</script>
