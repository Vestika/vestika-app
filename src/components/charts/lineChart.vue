<template>
  <div @dblclick="resetZoom" style="height: 100%">
    <span
      style="font-family:'Lucida Grande', 'Lucida Sans Unicode', 'Arial', 'Helvetica', 'sans-serif'; font-size: 22px; position: absolute; left:10px; top:3px; color: rgba(255,255,255,0.2); font-weight: bold;"
    >
      {{ chartName }}
    </span>
    <highcharts
      v-show="this.data && this.data.length"
      :constructorType="'stockChart'"
      class="hc"
      ref="lineChart"
      :options="chartOptions"
    ></highcharts>
    <v-skeleton-loader
      v-show="!this.data || !this.data.length"
      style="height: 100%"
      type="image"
    ></v-skeleton-loader>
  </div>
</template>

<script>
import customEvents from "highcharts-custom-events";
import Highcharts from "highcharts/highstock";

customEvents(Highcharts);

Highcharts.setOptions({
  lang: {
    // Pre-v9 legacy settings
    rangeSelectorZoom: "",
  },
});

export default {
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      },
    },
    isLocked: {
      type: Boolean,
      default: true,
    },
    chartName: {
      type: String,
      default: "",
    },
  },

  watch: {
    data: {
      handler(newOptions) {
        this.chartOptions.series[0].data = newOptions;
      },
      deep: true,
    },
  },

  computed: {
    zoomType() {
      if (this.isLocked) {
        return "x";
      } else {
        return "";
      }
    },
  },

  data() {
    var cloneToolTip = null;
    return {
      Highcharts: Highcharts,
      chartRef: undefined,
      chartOptions: {
        chart: {
          marginTop: 40,
          zoomType: this.zoomType,
          backgroundColor: "transparent",
          events: {
            // event when mouse is released
            load: function(e) {
              if (!e.shiftKey) {
                var chart = this;
                chart.shiftPressed = false;
                chart.labelGroup = chart.renderer.g("labelGroup").add();
                document.addEventListener("mouseup", function() {
                  if (chart.shiftPressed) {
                    chart.shiftPressed = false;
                    if (chart.pointMouseDown.x < chart.hoverPoint.x) {
                      chart.xAxis[0].setExtremes(
                        chart.pointMouseDown.x,
                        chart.hoverPoint.x,
                      );
                    } else {
                      chart.xAxis[0].setExtremes(
                        chart.hoverPoint.x,
                        chart.pointMouseDown.x,
                      );
                    }
                  }
                  if (cloneToolTip) {
                    chart.container.firstChild.removeChild(cloneToolTip);
                    cloneToolTip = undefined;
                  }
                  chart.mouseDown = false;
                  if (chart.label) {
                    chart.label.destroy();
                    chart.label = undefined;
                  }
                  if (chart.selectionRect) {
                    chart.selectionRect.destroy();
                    chart.selectionRect = undefined;
                  }
                });
              }
              chart.container.onmousedown = function(e) {
                chart.mouseDown = true;
                chart.shiftPressed = e.shiftKey;
                if (!chart.shiftPressed) {
                  if (cloneToolTip) {
                    chart.container.firstChild.removeChild(cloneToolTip);
                  }
                  cloneToolTip = chart.tooltip.label.element.cloneNode(true);
                  chart.container.firstChild.appendChild(cloneToolTip);
                }
                chart.pointMouseDown = chart.hoverPoint;
              };
            },
          },
        },
        xAxis: {
          type: "datetime",
        },
        yAxis: {
          gridLineWidth: 0,
          opposite: false,
        },
        tooltip: {
          valueDecimals: 0,
          valueSuffix: " ₪\n",
          backgroundColor: "transparent",
          borderColor: "transparent",
          shadow: false,
          style: {
            color: "var(--v-text-base)",
            fontSize: "10px",
          },
        },
        title: {
          text: "",
        },
        legend: {
          enabled: false,
        },
        credits: {
          enabled: false,
        },
        plotOptions: {
          series: {
            marker: {
              radius: 4,
            },
            dataLabels: {
              allowOverlap: true,
            },
            point: {
              events: {
                // event when mouse is over the chart
                mouseOver() {
                  var point = this,
                    chart = point.series.chart;
                  if (chart.shiftPressed) {
                    if (chart.selectionRect) {
                      chart.selectionRect.destroy();
                      chart.selectionRect = undefined;
                    }
                    rectWidth = point.plotX - chart.pointMouseDown.plotX;
                    if (rectWidth > 0) {
                      x = chart.plotLeft + chart.pointMouseDown.plotX;
                      sign = 1;
                    } else {
                      x = chart.plotLeft + point.plotX;
                      sign = -1;
                    }
                    chart.selectionRect = chart.renderer
                      .rect(
                        x, // x
                        chart.plotTop, // y
                        (point.plotX - chart.pointMouseDown.plotX) * sign, // width
                        chart.plotSizeY, // height
                      )
                      .attr({
                        fill: "rgba(153, 158, 189, 0.2)",
                        zIndex: -1,
                      })
                      .add();
                  } else {
                    var dif,
                      percentDif,
                      rectWidth,
                      sign,
                      percentageColor,
                      devideBy,
                      x;

                    if (chart.mouseDown) {
                      if (chart.label) {
                        chart.label.destroy();
                        chart.label = undefined;
                      }
                      if (chart.selectionRect) {
                        chart.selectionRect.destroy();
                        chart.selectionRect = undefined;
                      }
                      if (chart.pointMouseDown.x < point.x) {
                        dif = point.y - chart.pointMouseDown.y;
                        devideBy = chart.pointMouseDown.y;
                      } else {
                        dif = chart.pointMouseDown.y - point.y;
                        devideBy = point.y;
                      }
                      if (devideBy !== 0) {
                        percentDif
                          = Math.round((dif / devideBy) * 10000) / 100 + "%";
                      } else {
                        percentDif = 0;
                      }

                      rectWidth = point.plotX - chart.pointMouseDown.plotX;
                      if (rectWidth > 0) {
                        x = chart.plotLeft + chart.pointMouseDown.plotX;
                        sign = 1;
                      } else {
                        x = chart.plotLeft + point.plotX;
                        sign = -1;
                      }
                      if (dif === 0) {
                        percentageColor = "grey";
                      } else {
                        percentageColor
                          = dif > 0
                            ? "var(--v-success-base)"
                            : "var(--v-error-base)";
                      }

                      chart.selectionRect = chart.renderer
                        .rect(
                          x, // x
                          chart.plotTop, // y
                          (point.plotX - chart.pointMouseDown.plotX) * sign, // width
                          chart.plotSizeY, // height
                        )
                        .attr({
                          fill: "rgba(153, 158, 189, 0.2)",
                          zIndex: -1,
                        })
                        .add();
                      chart.label = chart.renderer
                        .label(
                          dif > 0 ? " +" + percentDif : percentDif,
                          x
                            + (point.plotX - chart.pointMouseDown.plotX)
                              * sign
                              * 0.5,
                          60,
                        )
                        .add(chart.labelGroup)
                        .css({ color: percentageColor });
                      chart.labelGroup
                        .translate(-chart.label.width / 2, 0)
                        .toFront();
                    }
                  }
                },
              },
            },
          },
        },
        navigator: {
          enabled: false,
        },
        scrollbar: {
          barBackgroundColor: "var(--v-card-base)",
          barBorderColor: "var(--v-card-base)",
          barBorderRadius: 7,
          barBorderWidth: 0,
          height: 10,
          showFull: false,
          trackBackgroundColor: "transparent",
          trackBorderColor: "transparent",
        },
        rangeSelector: {
          floating: true,
          buttonPosition: {
            x: -25,
            y: -30,
            align: "center",
          },
          inputPosition: {
            y: -30,
            x: -10,
          },
          buttonTheme: {
            // styles for the buttons
            "fill": "none",
            "stroke": "none",
            "stroke-width": 0,
            "r": 8,
            "style": {
              color: "#999EBD",
              fontWeight: "bold",
            },
            "states": {
              hover: {},
              select: {
                fill: "#999EBD",
                style: {
                  color: "white",
                },
              },
            },
          },
          labelStyle: {},
          inputStyle: {
            color: "#999EBD",
            fontWeight: "bold",
            stroke: "none",
          },
          inputBoxBorderColor: "#999EBD",
          inputBoxWidth: 120,
          inputBoxHeight: 18,
          selected: 5,
        },
        series: [
          {
            name: "Worth",
            type: "area",
            color: "var(--v-lineChart-base)",
            data: this.data,
            gapSize: 5,
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
              },
              stops: [
                [0, "rgba(143, 151, 204)"],
                [1, "rgba(143, 151, 204, 0)"],
              ],
            },
            marker: {
              enabled: false,
              radius: 2,
            },
            lineWidth: 2,
            threshold: null,
          },
        ],
      },
    };
  },

  mounted() {
    this.chartRef = this.$refs.lineChart.chart;
    this.initialExtremeX = this.chartRef.xAxis[0].getExtremes();
  },
  methods: {
    resetZoom() {
      const currentX = this.chartRef.xAxis[0].getExtremes();
      if (
        currentX.min !== this.initialExtremeX.min
        || currentX.max !== this.initialExtremeX.max
      ) {
        this.chartRef.xAxis[0].setExtremes(
          this.initialExtremeX.min,
          this.initialExtremeX.max,
        );
      }
    },
  },
};
</script>

<style>
.highcharts-reset-zoom {
  display: none !important;
}
.highcharts-scrollbar-arrow {
  display: none !important;
}
.highcharts-scrollbar-button {
  display: none !important;
}

input[type="date"] {
  background: var(--v-background-base);
  line-height: 18px;
  outline: 0;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: saturate(10000%) hue-rotate(70deg);
}

[type="date"]::-webkit-calendar-picker-indicator {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAATCAYAAAB2pebxAAABGUlEQVQ4jc2UP06EQBjFfyCN3ZR2yxHwBGBCYUIhN1hqGrWj03KsiM3Y7p7AI8CeQI/ATbBgiE+gMlvsS8jM+97jy5s/mQCFszFQAQN1c2AJZzMgA3rqpgcYx5FQDAb4Ah6AFmdfNxp0QAp0OJvMUii2BDDUzS3w7s2KOcGd5+UsRDhbAo+AWfyU4GwnPAYG4XucTYOPt1PkG2SsYTbq2iT2X3ZFkVeeTChyA9wDN5uNi/x62TzaMD5t1DTdy7rsbPfnJNan0i24ejOcHUPOgLM0CSTuyY+pzAH2wFG46jugupw9mZczSORl/BZ4Fq56ArTzPYn5vUA6h/XNVX03DZe0J59Maxsk7iCeBPgWrroB4sA/LiX/R/8DOHhi5y8Apx4AAAAASUVORK5CYII=
  )
    center/60% no-repeat;
  opacity: 0.7;
}
input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
.hc {
  height: 100% !important;
}
</style>
