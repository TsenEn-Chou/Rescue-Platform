var car_latlng = new Map();
var car_status = new Map();
let car_markers = [];
var locations = [];
let map;
// create direction service and direction display layer
var directionsService;
var directionsDisplay;

function initMap() {
	directionsService = new google.maps.DirectionsService();
	directionsDisplay = new google.maps.DirectionsRenderer();
	$.ajax({
		type: 'GET',
		url: 'http://140.116.245.229:3000/GetSeedsJson',
		dataType: 'json',
		success: function (JData) {
			var i = 0;
			$.each(JData, function () {
				locations[i] = { lat: parseFloat(JData[i].seed_latitude), lng: parseFloat(JData[i].seed_longitude) };
				i++;
			});
			map = new google.maps.Map(document.getElementById("map"), {
				zoom: 8,
				center: { lat: 23.745523, lng: 120.912494 },
			});
			//set direction display layer
			directionsDisplay.setMap(map);
			// Create an array of alphabetical characters used to label the markers.
			const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			// Add some markers to the map.
			// Note: The code uses the JavaScript Array.prototype.map() method to
			// create an array of markers based on a given "locations" array.
			// The map() method here has nothing to do with the Google Maps API.

			//blue spot image
			var blue_marker = {
				url: "./Img/blue_spot.png",
				size: new google.maps.Size(42, 42),
				scaledSize: new google.maps.Size(42, 42)
			};


			const markers = locations.map((location, i) => {
				return new google.maps.Marker({
					position: location,
					map: map,
					label: labels[i % labels.length],
					icon: blue_marker,
				});
			});

			// Add a marker clusterer to manage the markers.
			// new MarkerClusterer(map, markers, {
			// 	imagePath:
			// 		"https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
			// });
		},

		error: function (xhr) {
			alert("ERROR: " + xhr.status + " " + xhr.statusText);
		},

	});
	//navigation function
	// add_directions();
}
//for deciding whether set markers to null or not 
var first_load_in = 1;

var interval = setInterval(function () {
	/* do something that will execute every 3000 milliseconds*/
	$.ajax({
		url: "http://140.116.245.229:3000/GetCarsJson",
		type: "POST",
		dataType: "json",
		success: function (JData) {
			var NumOfJData = JData.length;
			for (var i = 0; i < NumOfJData; i++) {
				if (first_load_in == 0) {
					car_markers[i].setMap(null);
				}
				car_status.set(JData[i]["car_license_plate"], JData[i]["car_status"]);
				car_latlng.set(JData[i]["car_license_plate"], { lat: JData[i]["car_latitude"], lng: JData[i]["car_longitude"] });
				car_markers[i] = new google.maps.Marker({
					position: car_latlng.get(JData[i]["car_license_plate"]),
					map: null,
					icon: './Img/ambulance_s.png',
					label: JData[i]["car_license_plate"]
				});

				if (JData[i]["car_status"] == 0) {
					car_markers[i].setMap(null);
				}
				else {
					car_markers[i].setMap(map);
				}

			}
			first_load_in = 0;
		},
		error: function () {
			alert("ERROR!!!");
		}
	});
}, 1000);

