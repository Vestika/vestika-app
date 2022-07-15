<template>
  <vue-highcharts ref="sparkline" :options="chartOptions" />
</template>

<script>
import VueHighcharts from "vue2-highcharts";

export default {
  components: {
    VueHighcharts,
  },

  props: {
    dataArray: {
      type: Array,
      default: function() {
        return [];
      },
    },
  },
  watch: {
    immediate: true,
    dataArray: {
      handler() {
        this.updateChartColor();
      },
    },
  },

  mounted() {
    this.updateChartColor();
  },

  data() {
    return {};
  },

  computed: {
    chartOptions() {
      return {
        chart: {
          margin: [0, 0, 0, 0],
          width: 200,
          backgroundColor: "transparent",
        },
        title: {
          text: "",
        },
        credits: {
          enabled: false,
        },
        yAxis: {
          gridLineWidth: 0,
        },
        xAxis: {
          gridLineWidth: 0,
          lineWidth: 0,
          tickWidth: 0,
        },
        legend: {
          enabled: false,
        },
        plotOptions: {
          series: {
            threshold: null,
            enableMouseTracking: true,
            shadow: false,
          },
        },
        tooltip: {
          // snap: 0,
          backgroundColor: "transparent",
          borderColor: "transparent",
          shadow: false,
          style: {
            color: "var(--v-text-base)",
            fontSize: "14px",
          },
          formatter: function() {
            return `${this.y.toFixed(2)}$`;
          },
          // positioner: function() {
          //   return { x: -8, y: -5 };
          // },
        },
        series: [
          {
            marker: {
              enabled: false,
            },
            type: "area",
            name: "price",
            fillOpacity: 0.25,
            data: this.prepareData(),
          },
        ],
      };
    },
  },

  methods: {
    prepareData: function() {
      return this.dataArray.map(function(obj) {
        return obj.value;
      });
    },

    updateChartColor() {
      const fillColor = {
        linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1.4,
        },
        stops: [
          [0, null],
          [1, "rgba(0, 0, 0, 0)"],
        ],
      };
      var series = this.$refs.sparkline.chart.series[0];
      if (
        this.dataArray[0].value
        > this.dataArray[this.dataArray.length - 1].value
      ) {
        fillColor.stops[0][1] = this.$vuetify.theme.themes.dark.error;
        series.update({ color: this.$vuetify.theme.themes.dark.error });
        series.update({ fillColor: fillColor });
      } else {
        fillColor.stops[0][1] = this.$vuetify.theme.themes.dark.success;
        this.$refs.sparkline.chart.series[0].update({
          color: this.$vuetify.theme.themes.dark.success,
        });
        series.update({ fillColor: fillColor });
      }
    },
  },
};
</script>
