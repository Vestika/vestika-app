<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      enable-resize-watcher
      :clipped="clipped"
      app
      right
      color="background"
    >
      <v-layout justify-space-between column fill-height>
        <v-list>
          <v-list-item class="pa-0">
            <v-list-item-content>
              <v-list-item-title style="font-size: 20px"
                >Reminders</v-list-item-title
              >
              <calendar></calendar>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="pa-0">
            <v-list-item-content>
              <v-list-item-title style="font-size: 20px"
                >Notes</v-list-item-title
              >
              <notesList></notesList>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title style="font-size: 20px"
                >Goals</v-list-item-title
              >
              <goalsList></goalsList>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-layout>
    </v-navigation-drawer>
  </div>
</template>

<script>
import Calendar from "@/components/calendar.vue";
import notesList from "@/components/notesList.vue";
import goalsList from "@/components/goalsList/goalsList.vue";

export default {
  components: { Calendar, notesList, goalsList },
  data() {
    return {
      drawer: true,
      clipped: false,
    };
  },
};
</script>
