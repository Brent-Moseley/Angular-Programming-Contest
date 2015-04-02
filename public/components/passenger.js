// Passenger constructor function
// Put this into Passenger model
function Passenger (options, pNumber, pMarker) {
  // publicly accessible instance vars
  this.name = options.name;
  this.city = options.city;
  this.status = "Not ready";

  // private vars
  var zip = options.zip,
      lat = options.lat,
      lng = options.lng,
      number = pNumber,
      marker = pMarker;

  this.getLat = function () {
    return lat;
  }
  this.getLng = function () {
    return lng;
  }
  this.getName = function () {
    return this.name;
  }
  this.getCity = function () {
    return this.city;
  }
  this.getStatus = function () {
    return this.status;
  }
  this.clickMe = function () {
    google.maps.event.trigger(marker, 'click');
  }    
  this.haveArrived = function (heli) {
    marker.setMap(null);
    this.status = "Riding " + heli;
  }                
}
