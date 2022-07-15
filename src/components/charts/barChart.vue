<template>
  <div style="height: 100%; width: 100%">
    <span
      style="font-family:'Lucida Grande', 'Lucida Sans Unicode', 'Arial', 'Helvetica', 'sans-serif'; font-size: 22px; position: absolute; left:10px; top:3px; color: rgba(255,255,255,0.2); font-weight: bold;"
    >
      {{ chartName }}
    </span>
    <vue-highcharts ref="barChart" :options="chartOptions" />
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
      type: Object,
      default: function() {
        return {};
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
          marginTop: 40,
          type: "column",
          backgroundColor: "transparent",
        },
        title: {
          text: "",
        },
        xAxis: {
          type: "category",
          categories: this.data.names,
          labels: {
            autoRotation: 0,
            style: {
              color: "var(--v-title-base)",
            },
          },
        },
        yAxis: {
          // visible: false,
          title: "",
          endOnTick: false,
          gridLineWidth: 0,
          stackLabels: {
            style: {
              fontSize: "12px",
            },
          },
        },
        credits: {
          enabled: false,
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          valueDecimals: 2,
        },
        colors: this.$vuetify.theme.themes.dark.chartColors,
        plotOptions: {
          series: {
            borderRadius: 3,
            dataLabels: {
              enabled: true,
              style: {
                color: "contrast",
                fontSize: "12px",
                textOutline: "10px 0px contrast",
              },
            },
          },
          column: {
            colorByPoint: true,
            borderWidth: 0,
            pointWidth: 30,
          },
        },
        series: [
          {
            name: "Price",
            dataLabels: {
              enabled: true,
              inside: true,
              format: "{y:,.0f}",
              animation: {
                defer: 6000,
              },
              style: {
                fontWeight: "bold",
                fontSize: "12px",
                textOutline: "0px contrast",
              },
            },
            animation: {
              defer: 3000,
            },
            data: this.data.values,
          },
        ],
      };
    },
  },
  data() {
    return {};
  },
};
</script>
