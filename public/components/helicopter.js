//  Helicopter constructor function
//  Constructor takes a start X and Y (make random in simulation)
//  Coordinate are lat / lng
function Helicopter (startX, startY, hmarker, hname) {
  // private vars
  var posX = startX,
      posY = startY,
      name = hname,
      movex = 0,     // X movement, per move, to get to current target
      movey = 0,
      pickup = [],
      passenger = [],
      marker = hmarker,
      destination = {},    // special destination
      goingToDest = false,
      currentTarget = -1;   // current index number of passenger to get
  //var mylen = text.length;     // private var
  //this.content = text;         // instance var
  //this.len = mylen.toString() + " chars.";  

  // Instance methods
  this.getNumPassengers = function () {
    return passenger.length;
  }
  this.getPickups = function () {
    return pickup;
  }
  this.getPassengers = function () {
    return passenger;
  }          
  this.getNumPickups = function () {
    if (goingToDest) return 0;
    else return pickup.length;
  }
  this.goingToDestination = function () {
    return goingToDest;
  }
  this.getMarker = function () {
    return marker;
  }
  this.getX = function () {
    return posX;
  }
  this.getY = function () {
    return posY;
  }
  this.getMoveX = function () {
    return movex;
  }
  this.getMoveY = function () {
    return movey;
  }          
  this.getName = function () {
    return name;
  }          
  this.addPickup = function (newPassenger) {
    console.log ('  Heli ' + name + ' reporting in on pickup for:' + newPassenger.getName());
    // if (Math.random(1) * 100 < 65) {
    //   return false;
    //   // they are often lazy or not ready and just won't do a pickup!!
    // }
    if (pickup.length + passenger.length < 4 && goingToDest) {
      // 4 here, because the destination counts as one "pickup"
      // pickup should always be empty if we are going to dest,
      // so can add this new pickup if there is space
      console.log (' Adding when going to dest');
      goingToDest = false;
      pickup.pop();         // remove the destination
      pickup.push (newPassenger);  // Accept new passenger
      currentTarget = 0;
      setFirst();
      reOrder();
      return true;          
    }
    else if (pickup.length + passenger.length < 3 && !goingToDest) { 
      console.log (' Adding regular pickup');
      pickup.push (newPassenger);  // Accept new passenger
      if (currentTarget == -1) {
        currentTarget = 0;
        setFirst();
      }
      else reOrder();
      return true;
    }
    else {
      console.log ('  No can do!!! Already have:' + pickup.length + ' ' + passenger.length + ' ' + goingToDest);
      return false;
    }
    reOrder();     // Shuffle passengers to get nearest first, then second nearest, etc. 
  }

  this.bump = function (otherMovex, otherMovey) {
    console.log (' Bumped!! ' + otherMovex*15 + ' ' + otherMovey*15);
    if (movex == 0 && movey == 0) {
      console.log ('Not moving, so taking other velocity.');
      posX += otherMovex * 15;
      posY += otherMovey * 15;            }
    else {
      console.log (' bumped based on my velocity: ' + movex*10 + ' ' + movey*10);
      posX -= movex * 10;
      posY -= movey * 10;
    }
    setFirst();   // set course again!!
  }

  // primary run function, call on a regular basis to give the
  // helicopter a "move" turn.
  this.run = function (storm) {
    if (pickup.length > 0) {
      var there = move (currentTarget, storm);  // move one step to target
      if (there) {
        console.log ('Arrived at: ' + pickup[currentTarget].getCity());
        if (pickup[currentTarget].getCity() == 'Destination') {
          // Put into a function called unload
          console.log ('At final destination!!');
          goingToDest = false;
          movex = movey = 0;
          pickup = [];
          angular.forEach (passenger, function (pass) {
            pass.status = "Arrived";
          });
          passenger = [];
          currentTarget = -1;
          console.log ('passenger_list now: ' + String(passenger_list.length));
          return "Arrival";
        }
        pickup[currentTarget].haveArrived(name);
        
        passenger.push(pickup.shift());
        if (pickup.length == 0 && passenger.length == 0) {
          // No passengers left to pick up.... Don't Think we ever hit this!!
          console.log (' ********   WHOA   *********');
          currentTarget = -1;
          return "Idle";
        }

        // Put all this into a function below called setDestinationWhenFull
        if (passenger.length == 3 || 
            (passenger.length > 0 && pickup.length == 0)) {
          // we have the 3 passengers, now add destination
          pickup.push (destination);
          goingToDest = true;
        }
        setTarget (pickup[currentTarget]);
        return "Pickup";
        // So hard to read, this if block is way too long!! 
      }
      return "Running";
    }
    return "No Pickups";
  }

  this.setDestination = function (dest) {
    //  Why this function?  
    destination = dest;
  }

  // put small functions and getters at top of object definition

  // Helicopter private functions
  function setTarget (target) {
    var dist = distanceBetweenGeoPoints(posY, posX, target.getLat(), target.getLng()); // lat1, lng1, lat2, lng2
    var dx = target.getLng() - posX;
    var dy = target.getLat() - posY;
    // distance in coordinate variance, velocity in mph, timeSlice in ms
    var moves = distancePerMove (dx, dy, dist, 2800, 50);  // 1500 mph, speed is very important, put at top of object as constant
    movex = moves[0];
    movey = moves[1];
  }

 // TIMES:  2:56, 2:46.4, 2:43.6, 1:59.6, 1:54.9

  function reOrder () {
    console.log ('   *** REORDER ***');
    var distance_table = [];
    angular.forEach (pickup, function (passenger, i) {
      distance_table.push ({
        index: i,
        dist: distanceBetweenGeoPoints(posY, posX, passenger.getLat(), passenger.getLng()),
        pass: passenger
      });
    });

    var j = 0;
    while (j < distance_table.length-1) {
      if (distance_table[j+1]['dist'] < distance_table[j]['dist']) {
        // switch them
        var temp = distance_table[j+1];
        distance_table[j+1] = distance_table[j];
        distance_table[j] = temp;
        j = -1;
      }
      j++;
    }
    console.log ('  Updated distance table in heli reOrder:');
    console.log (distance_table);
    pickup = [];
    angular.forEach (distance_table, function (dist) {
      pickup.push(dist.pass);
    });
    console.log ('   And resulting pickup queue:');
    console.log (pickup);
    setFirst();

  }

  function setFirst () {
    setTarget (pickup[0]);
  }

  function move (target, storm) {
    var dx = pickup[target].getLng() - posX;
    var dy = pickup[target].getLat() - posY;
    if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
      return true;
    }
    // var moveX = dx && dx / Math.abs(dx);
    // var moveY = dy && dy / Math.abs(dy);
    // var newX = posX + moveX * 0.001;
    // var newY = posY + moveY * 0.001;
    posX += movex;
    posY += movey;
    if (storm) {
      var stormX = storm.getX();
      var stormY = storm.getY();
      var closeX = Math.abs(posX - stormX);
      var closeY = Math.abs(posY - stormY-0.12);
      //debugger;
      if (closeX < 0.08 && closeY < 0.08) {
        // too damn close to the storm!!!
        posX += Math.random (1) * 0.06 - 0.03;
        posY += Math.random (1) * 0.06 - 0.03;
        setFirst();   // set course again!!
      }
    }            
    var newPos = new google.maps.LatLng(posY, posX);
    marker.setPosition (newPos);
    // posX = newX;
    // posY = newY;
    return false;
  }  
}     
