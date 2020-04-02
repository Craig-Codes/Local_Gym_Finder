// Preloader
$("body").append(
  '<div style="" id="loadingDiv"><img class="loader" src="/images/preloader.png" alt="Loading..."></div>'
);
$(window).on("load", function() {
  setTimeout(removeLoader, 1000);
});
function removeLoader() {
  $("#loadingDiv").fadeOut(500, function() {
    $("#loadingDiv").remove();
  });
}

// Global Variables
let longitude, latitude; // used to center the map based on user location
let map; // makes map a global variable so that it can be accessed to change the properties for different button clicks
let pinQuantity; // variable stores the number of pins created on each search
let distanceRadius; // Distance radius circle from center of the map in km's

// Check to see if browser supports geolocation services
if ("geolocation" in navigator) {
  console.log("Geolocation is Available");
  navigator.geolocation.getCurrentPosition(setPosition, positionError);
} else {
  console.log("Geolocation is not Available");
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "Browser doesn't Support Geolocation";
}

// When a location is found, the location information is put into global variables, and the getMap function is invoked
function setPosition(position) {
  latitude = position.coords.latitude; // Gets current position lat
  longitude = position.coords.longitude; // Gets current position long
  setTimeout(getMap, 1000); // Calls the map creator after the lat and long have been fixed, so no errors! Timeout to ensure API script is loaded correctly.
}

// takes a PositionError output, when a success (setPosition) isn't achieved. Gives the reason for the error.
function positionError(error) {
  document.querySelector(".notification").style.display = "block"; // Changes the CSS element from display:none (hidden), to block so thats it's visible
  document.querySelector(".notification").innerHTML = error.message; // Put's the error message in notification div
}

// Button event listeners and on click functions
document.getElementById("two-miles").addEventListener("click", twoMilesPressed);
document
  .getElementById("five-miles")
  .addEventListener("click", fiveMilesPressed);
document.getElementById("ten-miles").addEventListener("click", tenMilesPressed);

function twoMilesPressed() {
  getMap(12); // Draws a new map with the map zoom set off the argument
  distanceRadius = 2; // Changes distance radius so that the displayed text gives the user the amount of miles away all of the facilities are (used by the getNearByLocations function)
  getNearByLocations(3.2); // Checks SDS data and plots each matching data type within the distance radius, provided in km's by the argument
}

function fiveMilesPressed() {
  getMap(11);
  distanceRadius = 5;
  getNearByLocations(8);
}

function tenMilesPressed() {
  getMap(10);
  distanceRadius = 10;
  getNearByLocations(16.1);
}

// Map builder
let infobox, layer;

//Query URL to the Microsoft POI data source
const sdsDataSourceUrl =
  "https://spatial.virtualearth.net/REST/v1/data/Microsoft/PointsOfInterest";

// Function draws a map, and sets the zoom value
function getMap(zoomAmount) {
  map = new Microsoft.Maps.Map("#myMap", {
    center: new Microsoft.Maps.Location(latitude, longitude),
    zoom: zoomAmount
  });

  // Custom current location pin
  let pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), {
    icon: "images/powerlifting.png",
    anchor: new Microsoft.Maps.Point(12, 39)
  });
  map.entities.push(pushpin);

  //Create an infobox to display content for each result.
  infobox = new Microsoft.Maps.Infobox(map.getCenter(), { visible: false });
  infobox.setMap(map);

  //Create a layer for the results.
  layer = new Microsoft.Maps.Layer();
  map.layers.insert(layer);

  //Add a click event to the layer to show an infobox when a pushpin is clicked.
  Microsoft.Maps.Events.addHandler(layer, "click", function(e) {
    let m = e.target.metadata;
    infobox.setOptions({
      title: m.DisplayName,
      description: m.AddressLine + ", " + m.Locality,
      location: e.target.getLocation(),
      visible: true
    });
  });

  //Load the Bing Spatial Data Services module.
  Microsoft.Maps.loadModule("Microsoft.Maps.SpatialDataService", function() {});
}

// Function checks SDS data and plots each matching data type within the distance radius, provided in km's by the argument
function getNearByLocations(newRadius) {
  //Remove any existing data from the layer.
  layer.clear();
  //Hide infobox.
  infobox.setOptions({ visible: false });
  //Create a query to get nearby data, using the newRadius argument as the radius value
  let queryOptions = {
    queryUrl: sdsDataSourceUrl,
    top: 250, // max amount of results which can be displayed... bing maps supports 250 maximum
    spatialFilter: {
      spatialFilterType: "nearby",
      location: map.getCenter(),
      radius: newRadius
    },
    //Filter to retrieve Gyms / sports facilities
    filter: new Microsoft.Maps.SpatialDataService.Filter(
      "EntityTypeID",
      "eq",
      142
    )
  };

  //Process the query.
  Microsoft.Maps.SpatialDataService.QueryAPIManager.search(
    queryOptions,
    map,
    function(data) {
      //Add results to the layer.
      pinQuantity = data.length; // used to send amount of pins into text
      map.entities.push(data);
      layer.add(data);
      updateText(pinQuantity, distanceRadius);
    }
  );
}

//Update Screen message
function updateText(amount, distance) {
  document.getElementById(
    "output"
  ).innerHTML = `There are ${amount} sports facilities in a ${distance} mile radius - Now go workout!`;
}
