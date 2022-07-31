// "use strict";
// // Object.defineProperty(exports, "__esModule", { value: true });

// // Initialize and add the map
// function initMap() {
//     const singaporeLatLong = { lat: 1.36548045615708, lng: 103.82020348793333 };
//     // The map, centered at Singapore
//     const map = new google.maps.Map(document.getElementById("map"), {
//         center: singaporeLatLong,
//         zoom: 12,
//     });
//     // The marker, positioned at Singapore
//     // const marker = new google.maps.Marker({
//     //     position: singaporeLatLong,
//     //     map: map,
//     // });

//     //create the places service
//     let service = new google.maps.places.PlacesService(map);

//     let request = {
//         query: "Bak Chor Mee",
//         fields: ["name", "geometry"],
//     };

//     console.log(request)

//     // The marker, positioned at Singapore
//     // const marker = new google.maps.Marker({
//     //     position: request,
//     //     map: map,
//     // });

//     function createMarker(place) {
//         if (!place.geometry || !place.geometry.location) return;
//         let marker = new google.maps.Marker({
//             map: map,
//             position: place.geometry.location,
//         });
//         google.maps.event.addListener(marker, "click", function () {
//             infowindow.setContent(place.name || "");
//             infowindow.open(map);
//         });
//     }

//     service.textSearch(request, function (results, status) {
//         if (status === google.maps.places.PlacesServiceStatus.OK) {
//             for (let i = 0; i < results.length; i++) {
//                 console.log(results[i]);
//                 createMarker(results[i]);
//             }
//             map.setCenter(results.geometry.location);
//         }
//     });
// }

// window.initMap = initMap;
