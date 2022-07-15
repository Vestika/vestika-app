<template>
  <div style="height: 100%; width: 100%">
    <span
      style="font-family:'Lucida Grande', 'Lucida Sans Unicode', 'Arial', 'Helvetica', 'sans-serif'; font-size: 22px; position: absolute; left:10px; top:3px; color: rgba(255,255,255,0.2); font-weight: bold;"
    >
      {{ chartName }}
    </span>
    <vue-highcharts
      ref="pieChart"
      :options="chartOptions"
      :highcharts="Highcharts"
    />
  </div>
</template>

<script>
import VueHighcharts from "vue2-highcharts";
import Highcharts3D from "highcharts/highcharts-3d";
import Highcharts from "highcharts";

Highcharts3D(Highcharts);

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
          margin: [0, 10, 20, 10],
          type: "pie",
          backgroundColor: "transparent",
          options3d: {
            enabled: true,
            alpha: 45,
          },
        },
        title: {
          text: "",
        },
        credits: {
          enabled: false,
        },
        tooltip: {
          headerFormat: "{point.key} ({point.percentage:.1f}%)<br>",
          pointFormat: "{point.y}",
          valueDecimals: 0,
          valueSuffix: " ₪\n",
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: "pointer",
            showInLegend: true,
            innerSize: "40%",
            depth: 35,
          },
        },
        legend: {
          itemWidth: 90,
          floating: false,
          itemStyle: {
            color: "var(--v-text-base)",
          },
          layout: "horizontal",
        },
        series: [
          {
            dataLabels: {
              enabled: false,
            },
            data: this.data,
            colors: this.$vuetify.theme.themes.dark.chartColors,
          },
        ],
      };
    },
  },

  data() {
    return {
      Highcharts,
    };
  },
};
</script>
