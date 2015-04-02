//  HELPER FUNCTIONS   put in a helpers directory under public
/*
** Computes distance between two points specified with lat and lng coordinates.
*/
function distanceBetweenGeoPoints(lat1, lng1, lat2, lng2){
  var
    milesPerLatDegree = 68.68,
    milesPerLngDegree = 57.68,
    deltaLat = lat2 - lat1,
    deltaLng = lng2 - lng1,
    latMiles = deltaLat * milesPerLatDegree,
    lngMiles = deltaLng * milesPerLngDegree;

  return Math.sqrt( latMiles * latMiles + lngMiles * lngMiles );
}
//  Also need amount to move X and Y each time interval to reach
// destination and go max speed (1200 mph)

// distance in coordinate variance, velocity in mph, timeSlice in ms
function distancePerMove (dx, dy, dist, vel, timeSlice) {
  var milesPerLatDegree = 68.68,
      milesPerLngDegree = 57.68;
  dx = dx * milesPerLngDegree;
  dy = dy * milesPerLatDegree; 
  var time = dist / vel;
  var tshours = timeSlice / 3600000;
  var moves = time / tshours;
  var movex = dx / moves / milesPerLngDegree;
  var movey = dy / moves / milesPerLatDegree;
  return [movex, movey];
  //  Worked the first time, because B!!!
}

/*
** Computes compass heading to travel from source to destination,
** where points are specified with lat and lng coordinates.
**
** Returns either N, S, E, W, NW, NE, SW, or SE.
*/
function computeHeading(sourceLat, sourceLng, destLat, destLng){
  var
    milesPerLatDegree = 68.68,
    milesPerLngDegree = 57.68,
    deltaLat = destLat - sourceLat,
    deltaLng = destLng - sourceLng,
    latMiles = deltaLat * milesPerLatDegree,
    lngMiles = deltaLng * milesPerLngDegree,
    latDirection = latMiles < 0 ? "S" : "N",
    lngDirection = lngMiles < 0 ? "W" : "E";

    if ( Math.abs(latMiles) > 2.0 * Math.abs(lngMiles) ) return latDirection;
    if ( Math.abs(lngMiles) > 2.0 * Math.abs(latMiles) ) return lngDirection;
    return latDirection + lngDirection;
}
