import Vue from "vue";
import Vuetify from "vuetify";
import axios from "axios";
import { FireGetToken } from "@/utils/firebase";

Vue.use(Vuetify);

export default {
  data() {
    return {
      goalTypes: {},
      dialogContent: {},
      update: false,
      index: 0,
      dialog: false,
      startDateMenu: false,
      endDateMenu: false,
      goals: [],
    };
  },
  created() {
    this.fetchGoalTypes();
    this.fetchGoals();
    this.resetGoal();
  },
  methods: {
    async fetchGoals() {
      const idToken = await FireGetToken();
      let goalsResponse;
      try {
        goalsResponse = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/goals/`,
          {
            headers: { Authorization: `Bearer ${idToken}` },
          },
        );
      } catch (error) {
        return false;
      }

      let goalsLength = goalsResponse.length;
      for (let i = 0; i < goalsLength; i++) {
        this.goals.push(this.goalResponseToGoal(goalsResponse[i]));
      }
      await this.getGoalsValues();
    },
    async fetchGoalTypes() {
      const idToken = await FireGetToken();
      try {
        this.goalTypes = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/goals/goal_types`,
          {
            headers: { Authorization: `Bearer ${idToken}` },
          },
        );
      } catch (error) {
        return false;
      }
      this.goalTypes = this.goalTypes.data;
    },
    onClick(index) {
      this.dialogContent = Object.assign({}, this.goals[index]);
      this.update = true;
      this.dialog = true;
      this.index = index;
    },
    resetGoal() {
      this.update = false;
      this.dialogContent = {
        goalDefinitionId: null,
        goalName: null,
        goalValue: null,
        currentValue: null,
        calculatedPercent: 0,
        dateDiff: 0,
        goalType: null,
        startDate: new Date().toISOString().substr(0, 10),
        dueDate: new Date().toISOString().substr(0, 10),
      };
    },
    toCamel(s) {
      return s.replace(/([-_][a-z])/gi, $1 => {
        return $1
          .toUpperCase()
          .replace("-", "")
          .replace("_", "");
      });
    },
    goalResponseToGoal(goalResponse) {
      let goal = {};
      let self = this;
      Object.keys(goalResponse).forEach(function(key) {
        goal[self.toCamel(key)] = goalResponse[key];
      });

      goal["currentValue"] = 0;
      goal["dateDiff"] = 0;
      goal["calculatedPercent"] = 0;
      return goal;
    },
    updateGoalsValue(goalResponse) {
      let goalsLength = this.goals.length;
      let goalValues = Object.fromEntries(
        goalResponse.map(item => [item.goal_definition_id, item.goal_value]),
      );

      for (let i = 0; i < goalsLength; i++) {
        this.goals[i].currentValue
          = goalValues[this.goals[i].goalDefinitionId] || 0;
        this.goals[i].dateDiff = this.calcDaysLeft(this.goals[i]);
        this.goals[i].calculatedPercent = this.calcPercent(this.goals[i]);
      }
    },
    getGoalData(goal) {
      return {
        start_date: goal.startDate,
        due_date: goal.dueDate,
        goal_name: goal.goalName,
        goal_value: goal.goalValue,
        goal_type: goal.goalType,
      };
    },
    async creatGoal(goal) {
      const idToken = await FireGetToken();
      let goalData = this.getGoalData(goal);
      let res;
      try {
        res = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/goal/`,
          goalData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          },
        );
      } catch (error) {
        return false;
      }
      this.goals.push(this.goalResponseToGoal(res.data));
    },
    async getGoalsValues() {
      const idToken = await FireGetToken();
      let res;
      try {
        res = await axios.post(
          `${process.env.VUE_APP_BASE_URL}/goals/update_values`,
          null,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          },
        );
      } catch (error) {
        return false;
      }
      this.updateGoalsValue(res.data);
    },
    async updateGoal(goal) {
      const idToken = await FireGetToken();
      let goalData = this.getGoalData(goal);
      let res;
      try {
        res = await axios.put(
          `${process.env.VUE_APP_BASE_URL}/goal/`,
          goalData,
          {
            params: { goal_definition_id: goal.goalDefinitionId },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          },
        );
      } catch (error) {
        return false;
      }
      this.goals[this.index] = this.goalResponseToGoal(res.data);
    },
    calcDaysLeft(goal) {
      let today = new Date();
      let diffTime = Date.parse(goal.dueDate) - today;
      diffTime = diffTime > 0 ? diffTime : 0;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    },
    calcPercent(goal) {
      let percent = 0;
      if (goal.goalValue > 0) {
        percent = (goal.currentValue / goal.goalValue) * 100;
      }
      if (percent > 100) {
        percent = 100;
      }
      return percent;
    },
    async setGoal() {
      if (this.update) {
        await this.updateGoal(this.dialogContent);
      } else {
        this.dialogContent.goalType = this.dialogContent.goalType.value;
        await this.creatGoal(this.dialogContent);
      }
      await this.getGoalsValues();
      this.resetGoal();
    },
  },
  computed: {
    getGoals: function() {
      return this.goals;
    },
    getTitle: function() {
      return this.update ? "Update" : "Set New";
    },
  },
};
