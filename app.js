// Global Variables
var longitude, latitude;
var map; // makes map a global variable so that it can be accessed to easily change the properties

// Check to see if browser supports geolocation services
if ("geolocation" in navigator) {
  console.log("Geolocation is Avaliable");
  navigator.geolocation.getCurrentPosition(setPosition, positionError); // First argument is sucess, second is on error.
} else {
  console.log("Geolocation is not Avaliable");
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "Browser doesn't Support Geolocation";
}

// When a location is found, the location information is put into global variables, and the getMap function is invoked
function setPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  console.log("Latitude = ", latitude, "longitude = ", longitude);

  setTimeout(getMap, 1000); // Calls the map creator after the lat and long have been fixed, so no errors! Timeout to ensure API script is loaded correctly.
}

// takes a PositonError output, when a success (setPosition) isn't achieved. Gives the reason for the error.
function positionError(error) {
  document.querySelector(".notification").style.display = "block"; // Changes the CSS element from display:none (hidden), to block so thats it's visable
  document.querySelector(".notification").innerHTML = error.message; // Put's the error message in notification div
}

//  BING Maps API - Calls from API which is listed in index.html
// function retrieves a map, adds the source data from Naviteq, and searches for any Gyms in a 25km radius of our location)
// function updateMapZoom(zoomAmount) {
//   map = new Microsoft.Maps.Map(document.getElementById("myMap"), {
//     center: new Microsoft.Maps.Location(latitude, longitude),
//     zoom: zoomAmount
//   });

//   // Custom current location pin
//   var pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), {
//     icon: "images/powerlifting.png",
//     anchor: new Microsoft.Maps.Point(12, 39)
//   });
//   map.entities.push(pushpin);

//   var sdsDataSourceUrl =
//   "https://spatial.virtualearth.net/REST/v1/data/c2ae584bbccc4916a0acf75d1e6947b4/NavteqEU/NavteqPOIs";

//   // Load the Bing Spatial Data Services module
//   Microsoft.Maps.loadModule("Microsoft.Maps.SpatialDataService", function() {
//     var queryOptions = {
//       queryUrl: sdsDataSourceUrl,
//       spatialFilter: {
//         spatialFilterType: "nearby",
//         location: map.getCenter(),
//         radius: 10
//       },
//       filter: "EntityTypeID eq 7997" // Filter to retrieve Gyms
//     };
//     //Process the query: getting all Gyms  within 25km of map center
//     Microsoft.Maps.SpatialDataService.QueryAPIManager.search(
//       queryOptions,
//       map,
//       function(data) {
//         map.entities.push(data);
//       },
//       null,
//       false,
//       function(status, message) {
//         document.getElementById("printoutPanel").innerHTML =
//           "Search failure. NetworkStatus: " + status;
//       }
//     );
//   });
//   console.log(map);
// }

// map settings

// Buttons

document.getElementById("two-miles").addEventListener("click", twoMilesPressed);
document
  .getElementById("five-miles")
  .addEventListener("click", fiveMilesPressed);
document.getElementById("ten-miles").addEventListener("click", tenMilesPressed);

function twoMilesPressed() {
  console.log("pressed two");
  updateMapRadius(2);
  getMap(12);
  updateText();
}

function fiveMilesPressed() {
  console.log("pressed five");
  updateMapRadius(5);
  getMap(11);
  updateText();
}

function tenMilesPressed() {
  console.log("pressed ten");
  updateMapRadius(10);
  getMap(10);
  updateText();
}

//Update map on button click - NEED TO UPDATE THE RADIUS SOMEHOW!
function updateMapRadius() {}

//Update Screen message
function updateText(distance, amount) {
  document.getElementById(
    "output"
  ).innerHTML = `There are ${amount} gyms in a ${distance} mile radius - Now go workout!`;
}

var map, layer;

//Query URL to the NAVTEQ POI data source
var sdsDataSourceUrl =
  "https://spatial.virtualearth.net/REST/v1/data/c2ae584bbccc4916a0acf75d1e6947b4/NavteqEU/NavteqPOIs";

function getMap(zoomAmount) {
  map = new Microsoft.Maps.Map("#myMap", {
    center: new Microsoft.Maps.Location(latitude, longitude),
    zoom: zoomAmount
  });

  // Custom current location pin
  var pushpin = new Microsoft.Maps.Pushpin(map.getCenter(), {
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
    var m = e.target.metadata;

    infobox.setOptions({
      title: m.DisplayName,
      description: m.AddressLine + ", " + m.Locality,
      location: e.target.getLocation(),
      visible: true
    });
  });

  //Load the Bing Spatial Data Services module.
  Microsoft.Maps.loadModule("Microsoft.Maps.SpatialDataService", function() {
    //Add an event handler for when the map moves.
    Microsoft.Maps.Events.addHandler(map, "viewchangeend", getNearByLocations);

    //Trigger an initial search.
    getNearByLocations();
  });
}

function getNearByLocations() {
  //Remove any existing data from the layer.
  layer.clear();

  //Hide infobox.
  infobox.setOptions({ visible: false });

  //Create a query to get nearby data.
  var queryOptions = {
    queryUrl: sdsDataSourceUrl,
    spatialFilter: {
      spatialFilterType: "nearby",
      location: map.getCenter(),
      radius: 25
    },
    filter: new Microsoft.Maps.SpatialDataService.Filter(
      "EntityTypeID",
      "eq",
      7997
    ) //Filter to retrieve Gyms.
  };

  //Process the query.
  Microsoft.Maps.SpatialDataService.QueryAPIManager.search(
    queryOptions,
    map,
    function(data) {
      //Add results to the layer.
      layer.add(data);
    }
  );
}
