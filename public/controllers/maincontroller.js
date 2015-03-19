var app = angular
    .module('courttimes',[])
    .controller('MainController',function($scope){
        var markers = [];

        function getAll () {
          showOnMap();
          return true;
        };


        //  HELPER FUNCTIONS
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

        var passengers = [
          {
            "name": "Rick James",
            "city": "Phoenix",
            "zip": 85051,
            "lat": 33.5791048,
            "lng": -112.1515555
          },
          {
            "name": "Freddie Mercury",
            "city": "Scottsdale",
            "zip": 85032,
            "lat": 33.617367,
            "lng": -111.879048
          },
          {
            "name": "Eddie Money",
            "city": "Fountain Hills",
            "zip": 85258,
            "lat": 33.5541185,
            "lng": -111.7444259
          },
          {
            "name": "Yngwie Malmsteem",
            "city": "Phoenix",
            "zip": 85053,
            "lat": 33.6346034,
            "lng": -112.1497104
          },
          {
            "name": "John Bonham",
            "city": "Phoenix",
            "zip": 85021,
            "lat": 33.5778487,
            "lng": -112.0917989
          },
          {
            "name": "Steve Perry",
            "city": "Phoenix",
            "zip": 85018,
            "lat": 33.454372,
            "lng": -111.963068
          },
          {
            "name": "David Paich",
            "city": "Phoenix",
            "zip": 85004,
            "lat": 33.6122129,
            "lng": -111.9655176
          },
          {
            "name": "Alex Van Halen",
            "city": "Scottsdale ",
            "zip": 85254,
            "lat": 33.5815568,
            "lng": -111.933732
          },
          {
            "name": "Amy Lee",
            "city": "Cave Creek",
            "zip": 85266,
            "lat": 33.757534,
            "lng": -111.9524
          },
          {
            "name": "Candy Dulfer",
            "city": "Scottsdale",
            "zip": 85018,
            "lat": 33.454467,
            "lng": -111.87536
          },
          {
            "name": "Paul Hardcastle",
            "city": "Phoenix",
            "zip": 85041,
            "lat": 33.3903924,
            "lng": -112.2765659
          },
          {
            "name": "Joe Satriani",
            "city": "Scottsdale",
            "zip": 85260,
            "lat": 33.6081362,
            "lng": -111.9201204
          },
          {
            "name": "Lindsey Stirling",
            "city": "Phoenix",
            "zip": 85017,
            "lat": 33.504739,
            "lng": -112.127767
          },
          {
            "name": "Stewart Copeland",
            "city": "Chandler",
            "zip": 85224,
            "lat": 33.298039,
            "lng": -111.86955
          },
          {
            "name": "MC Hammer",
            "city": "Queen Creek",
            "zip": 85297,
            "lat": 33.1904345,
            "lng": -111.6938745
          },
          {
            "name": "Dizzy Gillespie",
            "city": "Glendale",
            "zip": 85306,
            "lat": 33.6192465,
            "lng": -112.1850876
          },
          {
            "name": "Sting",
            "city": "Chandler",
            "zip": 85018,
            "lat": 33.275516,
            "lng": -111.879572
          },
          {
            "name": "Adam Levine",
            "city": "Mesa",
            "zip": 85041,
            "lat": 33.4284764,
            "lng": -111.7052862
          },
          {
            "name": "Christina Aguilera",
            "city": "Litchfield Park",
            "zip": 85260,
            "lat": 33.456322,
            "lng": -112.4083387
          },
          {
            "name": "Sarah Vaughan",
            "city": "Anthem",
            "zip": 85017,
            "lat": 33.864549,
            "lng": -112.149245
          },
          {
            "name": "Charlie Parker",
            "city": "Avondale",
            "zip": 85224,
            "lat": 33.45398,
            "lng": -112.304333
          },
          {
            "name": "Ian Astbury",
            "city": "Cave Creek",
            "zip": 85297,
            "lat": 33.784636,
            "lng": -111.95681
          },
          {
            "name": "Jonathan Cain",
            "city": "Glendale",
            "zip": 85306,
            "lat": 33.672246,
            "lng": -112.222106
          },          
          //  Special Destination Object, always the last in the list. 
          {
            "name": "Destination",
            "city": "Destination",
            "zip": 85306,
            "lat": 33.484467,
            "lng": -111.97536
          }          
        ];

        var windConditions = [
          {
            "day": "Day 1",
            "vx": -6,   // -6 indicates from the east at 6 mph
            "vy": 22    // 22 indicates from the south at 22 mph
          },
          {
            "day": "Day 2",
            "vx": 28,   // 28 indicates from the west at 28 mph
            "vy": -19    // -10 indicates from the north at 19 mph
          },
          {
            "day": "Day 3",
            "vx": 11,
            "vy": 33
          },
          {
            "day": "Day 4",
            "vx": -60,
            "vy": 2
          },
          {
            "day": "Day 5",
            "vx": 0,
            "vy": 0
          },          
        ];

        var targetLat = 33.484467;
        var targetLng = -111.97536;
        var mapOptions = {
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          center: new google.maps.LatLng(targetLat+0.05, targetLng),
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById('middle'), mapOptions);
        var bounds = new google.maps.LatLngBounds();  

        function showOnMap  () {
          for (var i = 0; i < passengers.length-1; i++) {
            // Create passenger markers, do not show last one (destination)
            var myLatlng = new google.maps.LatLng(passengers[i].lat, passengers[i].lng);
            bounds.extend(myLatlng);
            
            marker = createMarker (map, myLatlng, passengers[i].name, i);
            markers.push (marker);

            //map.fitBounds(bounds);
          };  
          var targetLatlng = new google.maps.LatLng(targetLat, targetLng);
          var markerTarget = createMarker (map, targetLatlng, "Destination", -1);
          markers.push (markerTarget);
          map.setZoom(10);  // Cannot do this if you also use fitBounds
   
       };  

       function createMarker (map, myLatlng, name, i) {
          var icons = ['heli-green mini.png', 'heli-blue redo.png', 'helicopter - red enLarge.png'] //  'heli-red.png']
          if (i == -1)     // refactor!
            var current = new google.maps.Marker({
              position: myLatlng,
              icon: 'target.gif',
              map: map,
              title: name,
              clickable: false
            })
          else if (i < -1)     // -4, -3, -2, refactor
            var current = new google.maps.Marker({
              position: myLatlng,
              icon: icons[i+4],
              map: map,
              title: 'Helicopter Service',
              clickable: false
            })          
          else
            var current = new google.maps.Marker({
              position: myLatlng,
              icon: 'Person.png',
              map: map,
              title: passengers[i].name,
              desc: passengers[i].desc,
              city: passengers[i].city,
              zip: passengers[i].zip,
              number: i,
              isAdded: false,
              clickable: true
            })
          google.maps.event.addListener(current, 'click', function() {
            //map.setCenter(current.getPosition());
            if (current.isAdded) return;  // already added! 

            console.log ('clicked marker ' + current.title + ' Number: ' + String(current.number));
            added = dispatchAddPickup (passenger_list[current.number]);
            if (added) {
              current.isAdded = true;
              passenger_list[current.number].status ="On List";
              current.setAnimation(google.maps.Animation.BOUNCE);
              console.log ('  yay!!  Added to queue');
            }
            $scope.$apply();    // Necessary to get Angular to see the status change. 
          });
          return current;
       };



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
          this.getNumPickups = function () {
            if (goingToDest) return 0;
            else return pickup.length;
          }
          this.goingToDestination = function () {
            return goingToDest;
          }
          this.getX = function () {
            return posX;
          }
          this.getY = function () {
            return posY;
          }
          this.getName = function () {
            return name;
          }          
          this.addPickup = function (newPassenger) {
            console.log ('  Heli ' + name + ' reporting in on pickup for:' + newPassenger.getName());
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
              return true;          
            }
            else if (pickup.length + passenger.length < 3 && !goingToDest) { 
              console.log (' Adding regular pickup');
              pickup.push (newPassenger);  // Accept new passenger
              if (currentTarget == -1) {
                currentTarget = 0;
                setFirst();
              }
              return true;
            }
            else {
              console.log ('  No can do!!! Already have:' + pickup.length + ' ' + passenger.length + ' ' + goingToDest);
              return false;
            }
          }


          // primary run function, call on a regular basis to give the
          // helicopter a "move" turn.
          this.run = function () {
            if (pickup.length > 0) {
              var there = move (currentTarget);  // move one step to target
              if (there) {
                console.log ('Arrived at: ' + pickup[currentTarget].getCity());
                if (pickup[currentTarget].getCity() == 'Destination') {
                  console.log ('At final destination!!');
                  goingToDest = false;
                  pickup = [];
                  angular.forEach (passenger, function (pass) {
                    pass.status = "Arrived";
                  });
                  passenger = [];
                  currentTarget = -1;
                  $scope.allPassengersArrived = allPassengersArrived();
                  if ($scope.allPassengersArrived) alert ("All Done!!");
                  console.log ('passenger_list now: ' + String(passenger_list.length));
                  return;
                }
                pickup[currentTarget].haveArrived(name);
                
                passenger.push(pickup.shift());
                if (pickup.length == 0 && passenger.length == 0) {
                  // No passengers left to pick up
                  currentTarget = -1;
                  // Add pickup destination if passengers here
                  return;
                }
                if (passenger.length == 3 || 
                    (passenger.length > 0 && pickup.length == 0)) {
                  // we have the 3 passengers, now add destination
                  pickup.push (destination);
                  goingToDest = true;
                }
                setTarget (pickup[currentTarget]);
              }

            }

          }

          this.setDestination = function (dest) {
            destination = dest;
          }
          this.getMarker = function () {
            return marker;
          }

          // private functions
          function setTarget (target) {
            // Switch this below?
            var dist = distanceBetweenGeoPoints(posY, posX, target.getLat(), target.getLng()); // lat1, lng1, lat2, lng2
            var dx = target.getLng() - posX;
            var dy = target.getLat() - posY;
            // distance in coordinate variance, velocity in mph, timeSlice in ms
            var moves = distancePerMove (dx, dy, dist, 1500, 50);  // 1500 mph
            movex = moves[0];
            movey = moves[1];
          }


          function setFirst () {
            setTarget (pickup[0]);
          }

          function move (target) {
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
            var newPos = new google.maps.LatLng(posY, posX);
            marker.setPosition (newPos);
            // posX = newX;
            // posY = newY;
            return false;
          }  
        }     

        // Passenger constructor function
        // Takes in an options object in this format:
        // {
        //     "name": "Rick James",
        //     "city": "Phoenix",
        //     "zip": 85051,
        //     "lat": 33.5791048,
        //     "lng": -112.1515555
        // }
        function Passenger (options, pNumber) {
          // publicly accessible instance vars
          this.name = options.name;
          this.city = options.city;
          this.status = "Not ready";

          // private vars
          var zip = options.zip,
              lat = options.lat,
              lng = options.lng,
              number = pNumber;

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
            google.maps.event.trigger(markers[number], 'click');
          }    
          this.haveArrived = function (heli) {
            markers[number].setMap(null);
            this.status = "Riding " + heli;
          }                
        }
       
       var passenger_list = [];
       var helicopters = [];
       var waiting_queue = [];
       var minute_counter = 0;
       //  Start of Execution
       showOnMap();
       createPassengers();
       createHelicopters();
       var start = new Date().getTime();
       $scope.time = '';
       $scope.passengersShow = passengers.slice (0, -1);



       //*****   MAIN TIMER LOOP  ********
       // ********************************
       setInterval(function(){
         dispatch ();
       } , 50);    // 50

       $scope.wait = '';
       setInterval(function(){
         dispatchManageWaitingQueue ();
         $scope.wait = waiting_queue;
       } , 333);    // Expensive operation, only call every third second


      setInterval(function(){       
        var list = passengersNotReady();
        if (list.length > 0) {
          var who = Math.floor (Math.random() * list.length);
          console.log ('Computer clicking: ' + who);
          list[who].clickMe();
        }
        }, 45000);  // 45 seconds

       $scope.allPassengersArrived = false;
       function allPassengersArrived () {
         var arrived = 0;
         angular.forEach (passenger_list, function (pass) {
           if (pass.getName() != 'Destination' &&
               pass.getStatus() == 'Arrived') arrived++;
         });
         if (arrived == passenger_list.length - 1) return true;
         return false;
       }

       function passengersNotReady () {
         var notReady = [];
         angular.forEach (passenger_list, function (pass) {
           if (pass.getStatus() == 'Not ready' 
               && pass.getName() != "Destination") notReady.push(pass);
         });
         return notReady;
       }

       function createPassengers () {
         angular.forEach (passengers, function (passenger, i) {
           passenger_list[i] = new Passenger(passenger, i);
           passenger_list[i].number = i;
         });

       }

       function createHelicopters () {
         var name = ['Mean Green', 'Blue-beri', 'Hot Tamale']
         var i = -4;
         while (helicopters.length < 3) {
           var randLat = Math.random (1) * 0.65 + 33.15;
           var randLng = -111.8 - Math.random (1) * 0.48;
           var heliLatlng = new google.maps.LatLng(randLat, randLng);
           var markerHeli = createMarker (map, heliLatlng, "", i);  // -4, -3, -2
           var newHeli = new Helicopter(randLng, randLat, markerHeli, name[i+4]);
           newHeli.setDestination(passenger_list[passenger_list.length - 1]);
           helicopters.push(newHeli);
           i++;
         }
       }

       function dispatchAddPickup (passenger) {
         console.log (' Pushing a passenger onto waiting_queue:');
         waiting_queue.push (passenger);
         console.log (waiting_queue);

         return true;
       }

       function dispatchManageWaitingQueue () {
         // This is the main logic for added passengers to the best helicopter
         // available, the goal here is to keep this queue empty and to keep the
         // helicopters busy, getting passengers to the destination in the most
         // optimal way possible.  Helicopters will simply pick up passengers in
         // the order they are given.  They will always head to the destination
         // when they have picked up everyone in their pickup queue, and will not
         // add to it when they are heading to their destination.
         // Strategy:  
         //    Go through each helicopter that is not heading to the destination.
         //    Determine how many more passengers it can pick up, X.  Then
         //    find the X closest passengers from the waiting queue to that 
         //    helicopter and assign it to pick them up.
         //
         //    Future enhancement:  Since a random passenger is added every 
         //    minute, added a provision where when a passenger appears that
         //    is close to a helicopter that has a full pickup queue, that 
         //    passengers can be "swapped".  One guy is put back on the waiting
         //    queue in favor of the new one if overal time would be better.
         //
         //  Algirthm B:  Make the list of distances.  Always choose the one most
         //    opportune pick up per turn, as long as the Heli has room. 
         //
         //   Times:   6:10.0
         //
         //  Code is gold!   Knowledge is power, technical know-how and experience
         //  is my power in the market! 
         if (waiting_queue.length == 0) return;  // Nothing to do!!
         console.log (' Waiting queue length: ' + waiting_queue.length);
         var distance_table = [];
         var helis_avail = 0;

         angular.forEach (helicopters, function (heli, j) {
           //if (!heli.goingToDestination() &&
           var this_max = 3;    // pickups plus passengers
           // Because destination counts as a pickup, max would be
           // 3 passengers plus he one "pickup"
           //if (heli.goingToDestination()) this_max = 4;  
           if (heli.getNumPassengers() + heli.getNumPickups() < this_max) {
               // Only consider helicopters that have more room.
               // If so, create a list of distances from this helictoper to
               // all waiting passengers
               helis_avail++;
               console.log (' Heli ' + heli.getName() + ' is under capacity since max ' + this_max);
               var distances = [];
               var posX = heli.getX();
               var posY = heli.getY();
               angular.forEach (waiting_queue, function (passenger, i) {
                 console.log (' Processing waiting_queue at: ' + i);
                 distances.push ({
                   index: i,
                   dist: distanceBetweenGeoPoints(posY, posX, passenger.getLat(), passenger.getLng())
                 });
               });
               distance_table.push(distances);

           }
           else
           {
             var distances = [];
             //console.log (' Heli ' + heli.getName() + ' is too busy.');
             // Helicopter is not available, fill with high values.
             for (var bb = 0; bb < waiting_queue.length; bb++)
               distances.push ({
                 index: bb,
                 dist: 999
               });
              distance_table.push(distances);
           }

         });
         if (helis_avail == 0) return;  // none available yet.
         console.log ('Heli avail for pickup');
 
         var shortest = 999;
         var shortesti = shortest_pass = shortest_heli =  0;
         for (var heli = 0; heli < 3; heli++) {
           // Considering just the next available passenger in the waiting queue,
           // Find the available helicopter that is closest and then assign it for
           // the pickup.   cc is the helicopter
           for (var pass = 0; pass < waiting_queue.length; pass++) {
             if (distance_table[heli][pass].dist < shortest) {
               if (!helicopters[heli].goingToDestination() || distance_table[heli][pass].dist < 7) {
                 // Add this newest if not going to destination or diverting less than 7 miles
                 shortest = distance_table[heli][pass].dist;
                 shortest_heli = heli;
                 shortest_pass = pass;
                 shortesti = distance_table[heli][pass].index;  // sets the passenger "number"
               } 
             }
            }
          }
         console.log ('Shortest heli is number: ' + shortest_heli + ' to get passenger:' + shortest_pass + ' distance ' + shortest);
         // We have the closest to this helicopter, now see if any of the
         // others yet to be checked are actually closer
         if (shortest < 999) {
           // a pickup heli was found
           console.log ('  doing pickup for:');
           console.log (waiting_queue[shortesti]);
           console.log ('  Waiting queue before:');
           console.log (waiting_queue);
           var gtg = dispatchAddPickupHC (shortest_heli, waiting_queue[shortesti]);   // add closest to HC pickup queue
           if (!gtg) console.log ('ERROR:  heli could not do pickup!!');
           else waiting_queue.splice (shortesti, 1);   // remove from waiting list    
           console.log ('  Waiting queue after:');
           console.log (waiting_queue);     
         }
       }

       function dispatchAddPickupHC (heli_number, passenger) {
         // Add a passenger to one of the helicopters pickup queues.
         var added = false;
         added = helicopters[heli_number].addPickup(passenger);
         // This should always succeed.
         return added;
       }

       function dispatch () {
         for (var i = 0; i < 3; i++)
           helicopters[i].run();
         statusUpdate (helicopters);
         var now = new Date().getTime();
         now -= start;
         var mins = String (Math.floor(now / 60000));
         var seconds = String (Math.floor(now / 1000)) - mins * 60;
         var fraction = String (Math.floor((now % 1000) / 100));
         if (seconds.length == 1) seconds = '0' + seconds;
         $scope.time =  mins + ':' + seconds + '.' + fraction; 
       }

       $scope.numPassengers = 0;
       $scope.numPickups = 0;
       $scope.heliStatus = [];
       $scope.passengersShow = passenger_list;
       function statusUpdate (heli) {
         $scope.heliStatus = [];
         for (var i = 0; i < 3; i++) {
           $scope.heliStatus.push({
             name: heli[i].getName(),
             pass: heli[i].getNumPassengers(),
             pick: heli[i].getNumPickups()
           });
         }
         $scope.$apply();
       }

    });

