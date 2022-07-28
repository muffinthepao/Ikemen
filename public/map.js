"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
// var map;
// function initMap() {
//     map = new google.maps.Map(document.getElementById("map"), {
//         center: { lat: -34.397, lng: 150.644 },
//         zoom: 8,
//     });
// }
// window.initMap = initMap();

// function initMap() {
//     const SGLatLong = { lat: 1.36548045615708, lng: 103.82020348793333 };
//     const infowindow = new google.maps.InfoWindow();
//     const map = new google.maps.Map(document.getElementById("map"), {
//         center: SGLatLong,
//         zoom: 12,
//         mapID: "MAP_ID",
//     });

//     // new google.maps.Marker({
//     //     position: SGLatLong,
//     //     map,
//     //     title: "HEllo World"
//     // })
// }

// window.initMap = initMap();

// Initialize and add the map
function initMap() {
    const singaporeLatLong = { lat: 1.36548045615708, lng: 103.82020348793333 };
    // The map, centered at Uluru
    const map = new google.maps.Map(document.getElementById("map"), {
        center: singaporeLatLong,
        zoom: 12,
    });
    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
      position: singaporeLatLong,
      map: map,
    });
  }
  
window.initMap = initMap;
