let map;
let marker;
let userPopup;

const userLoc = [-122.397784, 37.784675];
const userFinalLoc = [-122.4077, 37.7841];
const geofence = [
    [-122.4095, 37.7852],
    [-122.4049, 37.7852],
    [-122.4049, 37.7814],
    [-122.4095, 37.7814],
    [-122.4095, 37.7852] // closes rectangle
];
const goldenGate = '#c4352D';

mapboxgl.accessToken = token;

function enableButtons(className) {
    const buttons = document.querySelectorAll(className);
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
        enableButtons('.initSuccess');
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
    userPopup = new mapboxgl.Popup(
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
    setTimeout(() => userPopup.remove(), 5000); // auto-close after 5sec

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
        new mapboxgl.Popup({
            className: 'popup',
            closeButton: false
        })
            .setLngLat(e.lngLat)
            .setHTML('<div>user entering area triggers survey</div>')
            .addTo(map);
    });

    enableButtons('.geoFenceSuccess');
}

function mockUserEntry() {
    marker.setLngLat(userFinalLoc); // SDK method: update marker position

    // SDK method: animate map to follow user
    map.flyTo({
        center: userFinalLoc,
        zoom: 15,
        duration: 2000
    });

    setTimeout(() => {
        const entryPopup = new mapboxgl.Popup({
            closeOnClick: false, 
            className: 'popup',
            closeButton: false
        })
            .setLngLat(userFinalLoc)
            .setHTML('user at transit location! survey opportunity')
            .addTo(map);

        // auto-close after 5sec
        setTimeout(() => entryPopup.remove(), 5000);
    }, 2000);
}

function triggerSurvey() {
    const userLocation = marker.getLngLat(); // SDK method
    /* const surveyPopup = */
    new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        maxWidth: '300px'
    })
        .setLngLat(userLocation)
        .setHTML(`
                <div class="popup">
                    <strong>location-based survey</strong><br><br>
                    <strong>context:</strong> Powell St. Station <br>
                    <strong>trigger:</strong> zone entry + 2min dwell<br><br>
                    "Do you use BART or MUNI more often?"<br><br>
                    <small>Expected response rate: 67% (vs 25% baseline)</small>
                </div>
            `)
        .addTo(map);

    // auto-close after 5sec?
    /* setTimeout(() => surveyPopup.remove(), 5000); */
}
