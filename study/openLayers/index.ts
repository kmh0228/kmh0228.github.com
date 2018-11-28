	import "babel-polyfill";
	import Map from 'ol/Map.js';
      import View from 'ol/View.js';
      import {defaults as defaultControls} from 'ol/control.js';
      import TileLayer from 'ol/layer/Tile.js';
      import OSM, {ATTRIBUTION} from 'ol/source/OSM.js';


      var openCycleMapLayer = new TileLayer({
        source: new OSM({
          attributions: [
            'All maps © <a href="https://www.opencyclemap.org/">OpenCycleMap</a>',
            ATTRIBUTION
          ],
          url: 'https://{a-c}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png' +
              '?apikey=Your API key from http://www.thunderforest.com/docs/apikeys/ here'
        })
      });

      var openSeaMapLayer = new TileLayer({
        source: new OSM({
          attributions: [
            'All maps © <a href="http://www.openseamap.org/">OpenSeaMap</a>',
            ATTRIBUTION
          ],
          opaque: false,
          url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'
        })
      });


      var map = new Map({
        layers: [
          openCycleMapLayer,
          openSeaMapLayer
        ],
        target: 'map',
        controls: defaultControls({
          attributionOptions: {
            collapsible: false
          }
        }),
        view: new View({
          maxZoom: 18,
          center: [-244780.24508882355, 5986452.183179816],
          zoom: 15
        })
      });
      