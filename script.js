let map;
mapboxgl.accessToken = token;

function initializeSDK() {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12', // TODO: add our own styles?
        center: [-122.40848, 37.78267], // matches style screenshots
        zoom: 13.67
    });

    // SDK event listener - fires when map is ready
    map.on('load', function () {
        console.log('Mapbox SDK initialized successfully');
     });

    // SDK method: handle map errors
    map.on('error', function (e) {
        console.log('sdk error' + e.error.message);
    });
}
