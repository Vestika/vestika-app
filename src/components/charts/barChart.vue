<template>
  <div style="height: 100%; width: 100%">
    <span
      style="font-family:'Lucida Grande', 'Lucida Sans Unicode', 'Arial', 'Helvetica', 'sans-serif'; font-size: 22px; position: absolute; left:10px; top:3px; color: rgba(255,255,255,0.2); font-weight: bold;"
    >
      {{ chartName }}
    </span>
    <highcharts
      v-show="
        this.data &&
          Object.keys(this.data).length &&
          this.data.names.length &&
          this.data.values.length
      "
      class="hc"
      ref="barChart"
      :options="chartOptions"
    ></highcharts>
    <v-skeleton-loader
      v-show="
        !this.data ||
          !Object.keys(this.data).length ||
          !this.data.names.length ||
          !this.data.values.length
      "
      style="height: 100%"
      type="image"
    ></v-skeleton-loader>
  </div>
</template>

<script>
export default {
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

  watch: {
    data: {
      handler(newOptions) {
        this.chartOptions.series[0].data = newOptions.values;
        this.chartOptions.xAxis.data = newOptions.names;
      },
      deep: true,
    },
  },

  data() {
    return {
      chartOptions: {
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
              style: {
                fontWeight: "bold",
                fontSize: "12px",
                textOutline: "0px contrast",
              },
            },
            data: this.data.values,
          },
        ],
      },
    };
  },
};
</script>

<style>
.hc {
  height: 100% !important;
}
</style>
