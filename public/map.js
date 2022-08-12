// let long = 103.82020348793333;
// let lat = 1.36548045615708;
// let singaporeLngLat = [long, lat];

// mapboxgl.accessToken =
//   "pk.eyJ1IjoiZ3VuZHVzdGFuIiwiYSI6ImNsNjdubmYzNzA1MDgza3FoaWxoaXhlaTkifQ.1C5TzAc0lhTVxr2q3yedbg";

// navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
//   enableHighAccuracy: true,
// });

// function successLocation(position) {
//   console.log(position);
//   setupMap([position.coords.longitude, position.coords.latitude]);
// }

// function errorLocation(position) {
//   setupMap([-2.24, 53.48]);
// }

// function setupMap(center) {
//   const map = new mapboxgl.Map({
//     container: "map",
//     style: "mapbox://styles/mapbox/streets-v11",
//     center: center,
//     zoom: 11,
//   });

// const marker2 = new mapboxgl.Marker({ color: 'red'})
// .setLngLat(singaporeLngLat)
// .addTo(map);
// }
