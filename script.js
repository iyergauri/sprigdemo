let map;
mapboxgl.accessToken = 'pk.eyJ1IjoiZ2F1cmNvcmUiLCJhIjoiY21kdGsycWJuMTNobzJqcTNmYWNwazYxeSJ9.UxZYYRmBuYRiQMoVUATKQA';

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
        // console.log('Map style loaded: streets-v12');
    });

    // SDK method: handle map errors
    map.on('error', function (e) {
        console.log('sdk error' + e.error.message);
    });
}
