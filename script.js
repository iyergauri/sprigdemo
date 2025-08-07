let map;
let marker;

const userLoc = [-122.397784, 37.784675];
const geofence = [
                [-122.4095, 37.7852],
                [-122.4049, 37.7852],
                [-122.4049, 37.7814],
                [-122.4095, 37.7814],
                [-122.4095, 37.7852] // closes rectangle
            ];
const goldenGate = '#c4352D';

mapboxgl.accessToken = token;

function enableButtons() {
    const buttons = document.querySelectorAll('.initSuccess');
    buttons.forEach(b => {
        b.disabled = false;
    });
}

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
        enableButtons();
    });

    // SDK method: handle map errors
    map.on('error', function (e) {
        console.log('sdk error' + e.error.message);
    });
}

function createMockUser() {
    // SDK method: create marker for user location
    marker = new mapboxgl.Marker({
        color: goldenGate,
        scale: 1
    })
        .setLngLat(userLoc) // User location in SF
        .addTo(map); // SDK method: add marker to map

    // SDK method: create popup for user marker
    const userPopup = new mapboxgl.Popup(
            {   
                closeOnClick: true,
                closeButton: false,
                offset: 20,
                className: 'popup',
                anchor: 'right'
            }
        )
        .setHTML('<div>listening for user movement</div>')
        .setLngLat(userLoc);

    marker.setPopup(userPopup); // SDK method: attach popup to marker
    userPopup.addTo(map); // auto-open popup
}

function createGeofence() {
    const geofenceData = {
        'type': 'Feature',
        'geometry': {
            'type': 'Polygon',
            'coordinates': [geofence]
        },
        'properties': {
            'name': 'powell station survey zone'
        }
    };

    // SDK method: add data source to map
    map.addSource('geofence-source', {
        'type': 'geojson',
        'data': geofenceData
    });

    // SDK method: add layer to visualize geofence
    map.addLayer({
        'id': 'geofence-fill',
        'type': 'fill',
        'source': 'geofence-source',
        'paint': {
            'fill-color': goldenGate,
            'fill-opacity': 0.3
        }
    });

    // SDK method: add border layer
    map.addLayer({
        'id': 'geofence-border',
        'type': 'line',
        'source': 'geofence-source',
        'paint': {
            'line-color': goldenGate,
            'line-width': 2
        }
    });

    // SDK method: add click handler for geofence
    map.on('click', 'geofence-fill', function (e) {
        // SDK method: create popup on click
        new mapboxgl.Popup({className: 'popup'})
            .setLngLat(e.lngLat)
            .setHTML('<div>user entering area triggers survey</div>')
            .addTo(map);
    });

    geofenceAdded = true;
    logEvent('✅ Geofence created successfully');
    logEvent('SDK methods used: addSource(), addLayer(), on()');
}