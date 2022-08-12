mapboxgl.accessToken =
  "pk.eyJ1IjoiZ3VuZHVzdGFuIiwiYSI6ImNsNjdubmYzNzA1MDgza3FoaWxoaXhlaTkifQ.1C5TzAc0lhTVxr2q3yedbg";

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
  enableHighAccuracy: true,
});

function successLocation(position) {
  console.log(position);
  setupMap([position.coords.longitude, position.coords.latitude]);
}

function errorLocation(position) {
  setupMap([-2.24, 53.48]);
}

function setupMap(center) {
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v11",
    center: center,
    zoom: 12,
  });

  const nav = map.addControl(new mapboxgl.NavigationControl());

  map.addControl(
    new MapboxDirections({
      accessToken: mapboxgl.accessToken,
    }),
    "top-left"
  );

  // const geojson = {
  //   type: "FeatureCollection",
  //   features: [
  //     {
  //       type: "Feature",
  //       geometry: {
  //         type: "Point",
  //         coordinates: [position.coords.longitude, position.coords.latitude],
  //       },
  //       properties: {
  //         title: "Mapbox",
  //         description: "London",
  //       },
  //     },
  //   ],
  // };

  // geojason.features.array.forEach(function(marker) {
  //   var el = document.createAttribute.Element('div');
  //   el.className = 'marker';

  //   new.mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).addTo(map)
  // });
}
