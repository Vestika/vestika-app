import Vue from "vue";
import Vuetify from "vuetify/lib";
import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      dark: {
        background: "#0D1F2D",
        topBar: "#28292D",
        upload: "#1A1A1A",
        uploadHover: "#28292D",
        card: "#313B45",
        brighterCard: "#506070",
        registerCard: "#1A1A1A",
        buttons: "#D3D3D3",
        overlayColor: "#646464",
        lineChart: "#CDCAF2",
        text: "#FFFFFF",
        title: "#D8D8D8",
        success: "#32DC9E",
        info: "#2196F3",
        warning: "#FFC107",
        error: "#FF8AAA",
        chartColors: [
          "#EF968E",
          "#999EBD",
          "#3D5E80",
          "#C76B99",
          "#FFBA08",
          "#FF781F",
          "#BC5090",
        ],
        mainTheme: "#EF968E",
      },
    },
    options: {
      customProperties: true,
    },
  },
  icons: {
    iconfont: "md" || "fa",
  },
});
