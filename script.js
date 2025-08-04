let map;
let marker;

const userLoc = [-122.397784, 37.784675];
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
                className: 'popup'
            }
        )
        .setHTML('<div>listening for user movement</div>')
        .setLngLat(userLoc);

    marker.setPopup(userPopup); // SDK method: attach popup to marker
    userPopup.addTo(map);
}