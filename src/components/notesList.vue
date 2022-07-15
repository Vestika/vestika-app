<template>
  <v-card color="rgba(255, 255, 255, 0.1)" flat>
    <v-list two-line subheader>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <v-text-field
              v-model="newTodo"
              id="newTodo"
              name="newTodo"
              label="Type your task"
              @keyup.enter="addTodo"
            />
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-list subheader two-line flat>
      <v-subheader class="subheading" v-if="todos.length === 0"
        >You have 0 Tasks, add some</v-subheader
      >
      <v-subheader class="subheading" v-else>Your Tasks</v-subheader>

      <v-list-item-group>
        <v-list-item v-for="(todo, i) in todos" :key="i">
          <template #default="{ active, toggle }">
            <v-list-item-action class="ma-1 ml-0">
              <v-checkbox @click="toggle"></v-checkbox>
            </v-list-item-action>

            <v-list-item-content>
              <v-list-item-title
                :class="{
                  done: active,
                }"
                >{{ todo.title | capitalize }}</v-list-item-title
              >
            </v-list-item-content>
            <v-btn class="pa-0 ma-0" fab ripple x-small @click="removeTodo(i)">
              <v-icon class="white--text">mdi-close</v-icon>
            </v-btn>
          </template>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      isDark: true,
      show: true,
      newTodo: "",
      todos: [],
      day: this.todoDay(),
      date: new Date().getDate(),
      ord: this.nth(new Date().getDate()),
      year: new Date().getFullYear(),
    };
  },
  methods: {
    addTodo() {
      var value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }

      this.todos.push({
        title: this.newTodo,
        done: false,
      });
      this.newTodo = "";
    },
    removeTodo(index) {
      this.todos.splice(index, 1);
    },
    todoDay() {
      var d = new Date();
      var days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return days[d.getDay()];
    },
    nth(d) {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    },
  },
  filters: {
    capitalize: function(value) {
      if (!value) return "";
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
};
</script>
