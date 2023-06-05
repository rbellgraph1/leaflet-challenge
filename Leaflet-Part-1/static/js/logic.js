

// Creating the map object
var myMap = L.map("map").setView([37.0902, -95.7129], 5.45);

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Store our API endpoint as queryUrl.
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
    console.log(data);
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            const properties = feature.properties;
            const geometry = feature.geometry;
            const coordinates = geometry.coordinates;
            const magnitude = properties.mag;
            const depth = coordinates[2];
            const title = properties.title;
            const type = properties.type;

            // Calculate marker size based on magnitude
            const markerSize = magnitude * 5;

            // Calculate marker color based on depth
            var markerColor = "";
            if (depth <= 10) {
                markerColor = "rgb(102, 255, 102)";
            } else if (depth <= 30) {
                markerColor = "rgb(255, 255, 102)";
            } else if (depth <= 50) {
                markerColor = "rgb(255, 217, 102)";
            } else if (depth <= 70) {
                markerColor = "rgb(255, 179, 102)";
            } else if (depth <= 90) {
                markerColor = "rgb(255, 140, 102)";
            } else {
                markerColor = "rgb(255, 102, 102)";
            }

            // Create the marker
            return L.circleMarker(latlng, {
                radius: markerSize,
                color: markerColor,
                fillColor: markerColor,
                fillOpacity: 0.7, 
                className: 'custom-circle-marker' // CSS class name
            }).bindPopup(`Type: ${type}<br>Coordinates: ${coordinates}<br>Place: ${properties.place}<br>Magnitude: ${magnitude}<br>Depth: ${depth}<br>`);
        }
    }).addTo(myMap);

    // Create legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var labels = ['-10-10', '11-30', '31-50', '51-70', '71-90', '90+'];
        var colors = ["rgb(102, 255, 102)", "rgb(255, 255, 102)", "rgb(255, 217, 102)", "rgb(255, 179, 102)", "rgb(255, 140, 102)", "rgb(255, 102, 102)"];

        for (var i = 0; i < labels.length; i++) {
            div.innerHTML +=
                '<i style="background:' + colors[i] + '"></i> ' +
                labels[i] + '<br>';
        }
        return div;
    };

    legend.addTo(myMap);
});






