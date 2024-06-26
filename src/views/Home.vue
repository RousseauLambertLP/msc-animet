<template>
  <div class="Home">
    <v-main>
      <v-container fluid>
        <map-canvas id="mapComponent" />
      </v-container>
    </v-main>
  </div>
</template>

<script>
import MapCanvas from "../components/Map/MapCanvas.vue";
import { mapGetters } from "vuex";

import localeData from "../locales/importLocaleFiles";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";

export default {
  name: "Home",
  props: ["layers", "extent", "color", "basemap", "proj", "grat"],
  created() {
    proj4.defs(
      "EPSG:3978",
      "+proj=lcc +lat_0=49 +lon_0=-95 +lat_1=49 +lat_2=77 +x_0=0 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs"
    );
    proj4.defs(
      "EPSG:3995",
      "+proj=stere +lat_0=90 +lat_ts=71 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs"
    );
    register(proj4);

    if (this.proj !== undefined) {
      const foundCode = Object.keys(this.getCrsList).find((code) =>
        code.includes(this.proj)
      );
      if (foundCode) {
        this.$store.dispatch("Layers/setCurrentCRS", foundCode);
      }
    }

    if (this.grat === "1") {
      this.$store.dispatch("Layers/setShowGraticules", true);
    }
  },
  async mounted() {
    if (this.layers !== undefined) {
      const layersPassed = this.layers.split(",");
      layersPassed.forEach((layer, index) => {
        this.addLayerEvent(index, ...layer.split(";"));
      });
    }
    if (this.extent !== undefined) {
      let extentPassed = this.extent.split(",");
      let castedExtent = [];
      extentPassed.forEach((element) => {
        castedExtent.push(parseFloat(element));
      });
      this.$root.$emit("goToExtent", castedExtent);
    }
    if (this.color !== undefined) {
      if (this.color.match(/none/gi)) {
        this.$root.$emit("invisibleBasemap");
      } else {
        let matchColor = /((\d{1,3}),(\d{1,3}),(\d{1,3}))/;
        let match = matchColor.exec(this.color);
        if (match !== null) {
          this.$store.dispatch("Layers/setRGB", [
            Number(match[2]),
            Number(match[3]),
            Number(match[4]),
          ]);
          this.$root.$emit("permalinkColor", true);
        }
      }
    }
  },
  methods: {
    async addLayerEvent(
      index,
      layerName,
      opacity,
      isSnapped,
      isVisible,
      style,
      legendDisplayed
    ) {
      var baseURL;
      const sourceContainingLayerName = this.findKeyInLocaleFiles(layerName);
      if (sourceContainingLayerName) {
        const configName = Object.keys(this.getGeoMetWmsSources).find(
          (key) => key.toLowerCase() === sourceContainingLayerName
        );
        baseURL = this.getGeoMetWmsSources[configName]["url"];
      } else {
        return;
      }
      this.$root.$emit("collapseMenu");
      let layer = {};
      layer.Name = layerName;
      layer.isLeaf = true;
      layer.zIndex = index;
      layer.wmsSource = baseURL;
      layer.isSnapped = isSnapped !== "0" ? true : false;
      let op = parseFloat(opacity);
      layer.opacity = isNaN(op) || op > 1 || op < 0 ? 0.75 : op;
      layer.visible = isVisible === "0" ? false : true;
      if (style !== "0") {
        layer.currentStyle = style;
      }
      if (legendDisplayed !== undefined) {
        layer.legendDisplayed = legendDisplayed;
      }
      this.$root.$emit("permaLinkLayer", layer);
    },
    findKeyInLocaleFiles(key) {
      for (const sourceName in localeData["enLocaleData"]) {
        if (Object.hasOwn(localeData["enLocaleData"][sourceName], key)) {
          return sourceName;
        }
      }
      return null; // Key not found in any file
    },
  },
  computed: {
    ...mapGetters("Layers", ["getCrsList", "getGeoMetWmsSources"]),
  },
  components: {
    MapCanvas,
  },
};
</script>
