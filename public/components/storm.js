// Storm constructor function
function Storm (markerStorm) {
  // publicly accessible instance vars
  // this.something

  // private vars
  var stormX, stormY, stormMX, stormMY, stormOpacity = 0;
  var marker = markerStorm;
  marker.setOpacity (0);
  console.log ('Done creating first storm');

  this.getX = function () {
    return stormX;
  }

  this.getY = function () {
    return stormY;
  }  

  //  Start a new storm
  this.startNew = function () {
    var randLat = Math.random (1) * 0.65 + 33.15;
    var randLng = -111.8 - Math.random (1) * 0.48;
    stormX = randLng;
    stormY = randLat;
    stormMX = Math.random (1) * 0.03 - 0.015;
    stormMY = Math.random (1) * 0.03 - 0.015;
    var stormLatlng = new google.maps.LatLng(randLat, randLng);
    marker.setOpacity (0);
    marker.setPosition (stormLatlng);

    return;
  }


  this.runStorms = function () {
    stormX += stormMX;
    stormY += stormMY;
    if (stormX < -113 || stormX > -111 ||
       stormY < 32.5 || stormY > 34.5) {
     // Storm is off boundary, it is gone
     return false;
    }
    stormOpacity += 0.07;     // Make storm "bubble up" / fade in
    var newPos = new google.maps.LatLng(stormY, stormX);
    marker.setPosition (newPos);   
    marker.setOpacity (stormOpacity);      
    return true;    // Storm is still raging.
  }

}
