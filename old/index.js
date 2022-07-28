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

function initMap() {
    const SGLatLong = { lat: 1.36548045615708, lng: 103.82020348793333 };
    const infowindow = new google.maps.InfoWindow();
    const map = new google.maps.Map(document.getElementById("map"), {
        center: SGLatLong,
        zoom: 12,
        mapID: "MAP_ID",
    });

    // new google.maps.Marker({
    //     position: SGLatLong,
    //     map,
    //     title: "HEllo World"
    // })
}

//1.36548045615708, 103.82020348793333
