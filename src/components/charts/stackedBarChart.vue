<template>
  <div style="height: 100%; width: 100%">
    <span
      style="font-family:'Lucida Grande', 'Lucida Sans Unicode', 'Arial', 'Helvetica', 'sans-serif'; font-size: 22px; position: absolute; left:10px; top:3px; color: rgba(255,255,255,0.2); font-weight: bold;"
    >
      {{ chartName }}
    </span>
    <highcharts
      class="hc"
      ref="stackedBarChart"
      :options="chartOptions"
    ></highcharts>
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
        this.chartOptions.series = newOptions.dividends_value;
        this.chartOptions.xAxis.categories = newOptions.dates;
      },
      deep: true,
    },
  },

  computed: {},
  data() {
    return {
      chartOptions: {
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
          categories: this.data.dates,
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
        series: this.data.dividends_value,
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
