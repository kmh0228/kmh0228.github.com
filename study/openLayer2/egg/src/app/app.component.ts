import { Component } from '@angular/core';


import Map from 'ol/Map.js';
import View from 'ol/View.js';
import {defaults as defaultControls} from 'ol/control.js';
import TileLayer from 'ol/layer/Tile.js';
import OSM, {ATTRIBUTION} from 'ol/source/OSM.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'egg';

  ngAfterViewInit():void{



    var openCycleMapLayer = new TileLayer({
      source: new OSM({
        attributions: [
          'All maps © <a href="https://www.opencyclemap.org/">OpenCycleMap</a>',
          ATTRIBUTION
        ],

        url: 'http://192.168.3.33/osm_tiles/{z}/{x}/{y}.png'
      })
    });



    var map = new Map({
      layers: [
        openCycleMapLayer
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
        zoom:3
      })
    });


  }


















}
