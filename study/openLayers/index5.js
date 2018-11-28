"use strict";

exports.__esModule = true;
require("babel-polyfill");
var Map_js_1 = require("ol/Map.js");
var View_js_1 = require("ol/View.js");
var control_js_1 = require("ol/control.js");
var Tile_js_1 = require("ol/layer/Tile.js");
var OSM_js_1 = require("ol/source/OSM.js");
var openCycleMapLayer = new Tile_js_1["default"]({
    source: new OSM_js_1["default"]({
        attributions: ['All maps © <a href="https://www.opencyclemap.org/">OpenCycleMap</a>', OSM_js_1.ATTRIBUTION],
        url: 'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png' + '?apikey=Your API key from http://www.thunderforest.com/docs/apikeys/ here'
    })
});
var openSeaMapLayer = new Tile_js_1["default"]({
    source: new OSM_js_1["default"]({
        attributions: ['All maps © <a href="http://www.openseamap.org/">OpenSeaMap</a>', OSM_js_1.ATTRIBUTION],
        opaque: false,
        url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'
    })
});
var map = new Map_js_1["default"]({
    layers: [openCycleMapLayer, openSeaMapLayer],
    target: 'map',
    controls: control_js_1.defaults({
        attributionOptions: {
            collapsible: false
        }
    }),
    view: new View_js_1["default"]({
        maxZoom: 18,
        center: [-244780.24508882355, 5986452.183179816],
        zoom: 15
    })
});
