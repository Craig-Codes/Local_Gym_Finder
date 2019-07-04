// Global Variables
var longitude, latitude;
var map;

// Check to see if browser supports geolocation services
if ("geolocation" in navigator) {
  console.log("Geolocation is Avaliable");
  navigator.geolocation.getCurrentPosition(setPosition, positionError); // First argument is sucess, second is on error.
} else {
  console.log("Geolocation is not Avaliable");
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

// When a location is found, the location information is put into global variables, and the getMap function is invoked
function setPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  console.log("Latitude = ", latitude, "longitude = ", longitude);

  setTimeout(getMap, 1000); // Calls the map creator after the lat and long have been fixed, so no errors! Timeout to ensure API is loaded correctly.
}

// takes a PositonError output, when a success (setPosition) isn't achieved. Gives the reason for the error.
function positionError(error) {
  document.querySelector(".notification").style.display = "block"; // Changes the CSS element from display:none (hidden), to block so thats it's visable
  document.querySelector(".notification").innerHTML = error.message; // Put's the error message in notification div
}

//  BING Maps API - Calls from API which is listed in index.html
// function retrieves a map, adds the source data from Naviteq, and searches for any Gyms in a 25km radius of our location)
function getMap() {
  var map = new Microsoft.Maps.Map(document.getElementById("myMap"), {
    center: new Microsoft.Maps.Location(latitude, longitude),
    zoom: 10
  });

  var sdsDataSourceUrl =
    "https://spatial.virtualearth.net/REST/v1/data/c2ae584bbccc4916a0acf75d1e6947b4/NavteqEU/NavteqPOIs";
  // Load the Bing Spatial Data Services module
  Microsoft.Maps.loadModule("Microsoft.Maps.SpatialDataService", function() {
    var queryOptions = {
      queryUrl: sdsDataSourceUrl,
      spatialFilter: {
        spatialFilterType: "nearby",
        location: map.getCenter(),
        radius: 25
      },
      filter: "EntityTypeID eq 7997" // Filter to retrieve Gyms
    };
    //Process the query: getting all Gyms  within 25km of map center
    Microsoft.Maps.SpatialDataService.QueryAPIManager.search(
      queryOptions,
      map,
      function(data) {
        map.entities.push(data);
      },
      null,
      false,
      function(status, message) {
        document.getElementById("printoutPanel").innerHTML =
          "Search failure. NetworkStatus: " + status;
      }
    );
  });
  console.log(map);
}
