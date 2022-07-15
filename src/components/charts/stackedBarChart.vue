<template>
  <div style="height: 100%; width: 100%">
    <span
      style="font-family:'Lucida Grande', 'Lucida Sans Unicode', 'Arial', 'Helvetica', 'sans-serif'; font-size: 22px; position: absolute; left:10px; top:3px; color: rgba(255,255,255,0.2); font-weight: bold;"
    >
      {{ chartName }}
    </span>
    <vue-highcharts ref="stackedBarChart" :options="chartOptions" />
  </div>
</template>

<script>
import VueHighcharts from "vue2-highcharts";

export default {
  components: {
    VueHighcharts,
  },
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      },
    },
    chartName: {
      type: String,
      default: "",
    },
  },

  computed: {
    chartOptions() {
      return {
        chart: {
          type: "column",
          marginTop: 40,
          backgroundColor: "transparent",
        },
        title: {
          text: "",
        },
        tooltip: {
          valueDecimals: 2,
          valueSuffix: " $\n",
        },
        xAxis: {
          type: "category",
          categories: this.getDates(),
          labels: {
            autoRotation: 0,
            style: {
              color: "var(--v-title-base)",
            },
          },
        },
        credits: {
          enabled: false,
        },
        yAxis: {
          // visible: false,
          title: "",
          gridLineWidth: 0,
          stackLabels: {
            formatter: function() {
              return this.total.toFixed();
            },
            enabled: true,
            style: {
              fontSize: "12px",
            },
          },
        },
        series: this.prepareData(),
        colors: this.$vuetify.theme.themes.dark.chartColors,
        legend: {
          floating: true,
          layout: "vertical",
          align: "right",
          verticalAlign: "top",
          x: 0,
          y: 0,
          borderWidth: 0,
          labelFormatter: function() {
            return this.name.toUpperCase();
          },
          itemStyle: {
            color: "var(--v-text-base)",
          },
        },
        plotOptions: {
          series: {
            borderRadius: 3,
            stacking: "normal",
            dataLabels: {
              enabled: true,
              style: {
                color: "contrast",
                fontSize: "12px",
                textOutline: "0px 0px contrast",
              },
            },
          },
          column: {
            borderWidth: 0,
            stacking: "normal",
            dataLabels: {
              enabled: true,
              format: "{y:,.0f}",
              style: {
                fontWeight: "bold",
                fontSize: "12px",
                textOutline: "2px contrast",
              },
            },
          },
        },
      };
    },
  },

  data() {
    return {};
  },

  methods: {
    parseDate: function(date_str) {
      const cur_date = new Date(date_str);
      return cur_date.toLocaleString("en", { year: "2-digit", month: "short" });
    },
    getDates: function() {
      // assumes data is sorted by date.
      // date duplicates are allowed.
      const dates = [];
      if (!this.data) {
        return [];
      }
      for (let i = 0; i < this.data.length; i++) {
        const str_date = this.parseDate(this.data[i].date);

        // check that the current date isn't already in the array (last element)
        if (dates.slice(-1)[0] !== str_date) {
          dates.push(str_date);
        }
      }
      return dates;
    },
    prepareData: function() {
      if (!this.data) {
        return [];
      }

      const dates = this.getDates();

      const result = {};

      let date_counter = 0;

      for (let j = 0; j < this.data.length; j++) {
        const curr_date = this.parseDate(this.data[j].date);
        const symbol = this.data[j].name;
        const amount = this.data[j].value;

        let prev_date = dates[date_counter];

        if (curr_date !== prev_date) {
          date_counter += 1;
          prev_date = dates[date_counter];
        }

        if (!(symbol in result)) {
          result[symbol] = new Array(dates.length).fill(0);
        }

        result[symbol][date_counter] += amount;
      }

      const output = [];
      for (const [key, value] of Object.entries(result)) {
        output.push({ name: key, data: value });
      }
      return output;
    },
  },
};
</script>
