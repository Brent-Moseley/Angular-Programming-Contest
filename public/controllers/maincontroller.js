angular
    .module('app')
    .controller('MainController', ['passengerservice', '$scope', MainController]);

    function MainController(passengerservice,  $scope){
      //   Game URL Local:   file://localhost/Users/brentmoseley/Projects/Angular-contest/public/mappage.html
      //  Application level variables:
      var markers = [];
      var passenger_list = [];
      var helicopters = [];
      var waiting_queue = [];
      var storms = [];
      var isStorm = false;

      var targetLat = 33.484467;
      var targetLng = -111.97536;
      var passengers = passengerservice.getPassengerList();
      var num_helis = 5;   // app level var in main controller 


        function getAll () {
          showOnMap();
          return true;
        };

        // put this in map component directory
        //  Directive guide:   https://docs.angularjs.org/guide/directive
        //  Start by making tables into directives.
        //  It does not make sense to make the helicopters, passengers, and storms into directives since
        //  they do not have an attribute in the DOM.  Let them be classes in separate component files, and
        //  have a model component and a controller component.
        //  Create a table directive, a row directive, and a cell directive that can be re-used in my financial 
        //  tracker, like a reusable component.
        //  Just Do.
        //  Make the map be a directive if it makes sense for organization. 
        // http://kirkbushell.me/when-to-use-directives-controllers-or-services-in-angular/
        //  Use Directives for DOM manipulation and user interaction.  Use services for handling data and talking
        //  to the backend, and can be used like the model in Ruby - as data containers. 
        //  Controllers just make the connection between the services (model) and the directives, and handle complex
        //  business layer logic for the views.
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
          var icons = ['heli-green mini.png', 'heli-blue redo.png', 'helicopter - red enLarge.png', 'heli-red.png', 'icon_helicopter.png'];
          if (i == -1)     // refactor!  Break up into separate functions: createTargetMarker, createStormMarker, createHeliMarker, createPersonMarker
            var current = new google.maps.Marker({
              position: myLatlng,
              icon: 'target.gif',
              map: map,
              title: name,
              clickable: false
            })
          else if (i == -10)     // -6, -5, -4, -3, -2, refactor
            var current = new google.maps.Marker({
              position: myLatlng,
              icon: 'rain_snow.png',
              opacity: 0,
              map: map,
              title: 'Helicopter Doom!',
              clickable: false
            })   
          else if (i < -1 && i > -10)     // -6, -5, -4, -3, -2, refactor
            var current = new google.maps.Marker({
              position: myLatlng,
              icon: icons[i+6],
              map: map,
              title: 'Helicopter Service',
              clickable: false
            })          
          else
            var current = new google.maps.Marker({
              position: myLatlng,
              icon: 'Person.png',
              map: map,
              zIndex: -10,
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


        //  Object goes in the model dir, break functions up into doing one thing each, one level of 
        //  abstraction or responsibility, more details provided lower.
        // 

       //  Start of Execution - put this into the main controller
       showOnMap();
       createPassengers();
       createHelicopters();
       createStorms();
       var start = new Date().getTime();
       $scope.time = '';
       $scope.isStorm = false;
       $scope.passengersShow = passengers.slice (0, -1);   // Supposed to not show the destination



       //*****   MAIN TIMER LOOP  ********
       // ********************************
       //  Also keep in main controller
       //  file://localhost/Users/brentmoseley/Projects/Angular-contest/public/mappage.html
       setInterval(function(){
         dispatch ();
       } , 50);    // 50

       $scope.wait = '';
       setInterval(function(){
         dispatchManageWaitingQueue ();
         $scope.wait = waiting_queue;
       } , 333);    // Expensive operation, only call every third second

       setInterval(function(){
         $scope.isStorm = isStorm;
         if (isStorm) {
           isStorm = storms[0].runStorms ();
         }
       } , 130);    // Expensive operation, only call every third second

       setInterval(function(){
         collisionDetector();
         statusUpdate (helicopters);
       } , 750);    // Expensive operation, only call every three quarters of a second

       setInterval(function(){
         if (isStorm) return;   // already a storm!
         if (Math.floor (Math.random() * 100) < 50) {  // 30
           console.log ('creating storm');
           // 5% chance every 3 seconds to kick off a big storm
           storms[0].startNew();
           isStorm = true;
         }
       } , 3000);  

      setInterval(function(){       
        var list = getPassengersNotReady();
        if (list.length > 0) {
          var who = Math.floor (Math.random() * list.length);
          console.log ('Computer clicking: ' + who);
          list[who].clickMe();
        }
        }, 30000);  // 30 seconds

       $scope.allPassengersArrived = false;
       function allPassengersArrived () {
         var arrived = 0;      // num arrived
         angular.forEach (passenger_list, function (pass) {
           if (pass.getName() != 'Destination' &&
               pass.getStatus() == 'Arrived') arrived++;
         });
         if (arrived == passenger_list.length - 1) return true;
         return false;
       }

       function getPassengersNotReady () {
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
         var name = ['Mean Green', 'Blue-beri', 'Hot Tamale', 'Red Chili', 'Black Hawk']
         var i = -6;
         while (helicopters.length < num_helis) {
           var randLat = Math.random (1) * 0.65 + 33.15;
           var randLng = -111.8 - Math.random (1) * 0.48;
           var heliLatlng = new google.maps.LatLng(randLat, randLng);
           var markerHeli = createMarker (map, heliLatlng, "", i);  // -4, -3, -2
           var newHeli = new Helicopter(randLng, randLat, markerHeli, name[i+6]);
           newHeli.setDestination(passenger_list[passenger_list.length - 1]);
           helicopters.push(newHeli);
           i++;
         }
       }

       function createStorms () {
         // Most of this should be in a constructor of a Storm class
         var stormLatlng = new google.maps.LatLng(30, -110);
         var markerStorm = createMarker (map, stormLatlng, "", -10);
         console.log ('Creating storm marker');
         storms.push(new Storm(markerStorm));
         console.log ('Storm queue:');
         console.log (storms);
       }


       function collisionDetector () {
         //  Put this in Dispatch object
         // var targetLat = 33.484467;
         // var targetLng = -111.97536;
         return;
         angular.forEach (helicopters, function (heli, i) {
            var j = i + 1;
            //debugger;
            var posX = heli.getX();
            var posY = heli.getY();
            var myMoveX = heli.getMoveX();
            var myMoveY = heli.getMoveY();
            while (j < num_helis) {
              var secondX = helicopters[j].getX();
              var secondY = helicopters[j].getY();
              var otherMoveX = helicopters[j].getMoveX();
              var otherMoveY = helicopters[j].getMoveY();
              var closeX = Math.abs(posX - secondX);
              var closeY = Math.abs(posY - secondY);
              var sameX = (myMoveX < 0 && otherMoveX < 0) ||
                          (myMoveX > 0 && otherMoveX > 0);
              var sameY = (myMoveY < 0 && otherMoveY < 0) ||
                          (myMoveY > 0 && otherMoveY > 0); 
              if (myMoveX == 0 && myMoveY == 0) sameY = sameX = false;  
              if (otherMoveX == 0 && otherMoveY == 0) sameY = sameX = false; 
              if (closeX < 0.03 && closeY < 0.03 && !sameX && !sameY) {
                 // heli collision!!

                 heli.bump(otherMoveX, otherMoveY);
                 helicopters[j].bump(myMoveX, myMoveY);
                 return;
              }
              j++;
            }
         });
       }

       // create a Dispatch object for this
       function dispatchAddPickup (passenger) {
         console.log (' Pushing a passenger onto waiting_queue:');
         waiting_queue.push (passenger);
         console.log (waiting_queue);

         return true;
       }

       $scope.waiting_queue = [];
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
         //   Times:   
         //
         //  Code is gold!   Knowledge is power, technical know-how and experience
         //  is my power in the market!  The better you get at it, the more you will get
         //  paid to do it, the more prestige you will have, and the more fun you will have
         //  doing it! 

         //   Break into multiple functions
         $scope.waiting_queue = waiting_queue;
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
         for (var heli = 0; heli < num_helis; heli++) {
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
           // if (Math.random(1) * 100 < 20) {
           //   shortest_heli = 0;
           //   // dispatch is sometimes lazy and just picks the first heli
           // }
           var gtg = dispatchAddPickupHC (shortest_heli, waiting_queue[shortesti]);   // add closest to HC pickup queue
           if (!gtg) console.log ('ERROR:  heli could not do pickup!!');     // Should never see this!
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
         // $scope.allPickups = [];
         // $scope.allPassengers = [];
         var storm = storms.length > 0 ? storms[0] : null;
         for (var i = 0; i < num_helis; i++)
           helicopters[i].run(storm);
         //statusUpdate (helicopters);
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
         //$scope.allPickups.push(heli.getPickups());
         //$scope.allPassengers.push(heli.getPassengers());
         for (var i = 0; i < num_helis; i++) {
           $scope.heliStatus.push({
             name: heli[i].getName(),
             numPassengers: heli[i].getNumPassengers(),
             numPickups: heli[i].getNumPickups(),
             passengers: heli[i].getPassengers(),
             pickups: heli[i].getPickups(),
             marker: heli[i].getMarker()
           });
         }
         $scope.$apply();
       }

    };



//   GAME REFINEMENTS
// Add a new feature to the game where when the player clicks
//  a bouncing icon (ready passenger), the nearest heli is automatically diverted.  Switch helicopters if necessary.
//  Dispatch algorithm is also simpler - always dispatch the nearest helicopter when a passenger is clicked,
//  go to next nearest if that one is full, put in waiting queue if no helis avail.
//  Also refactor the heli status table to show the passenger and pickup queues, with status.
//  Do not show the long passenger list, just show a waiting queue. 
//  Helis can have breakdowns and be stranded for some time.  Passengers will then "jump out" to be picked up again.
//  Passengers in helicopters pickup queue immediately go to the waiting queue, as do passengers. 
//  Remove map panning
//
//  Play a LOT with it all!!!  I am a Javascript, and developer kung fu engineer.  I kick ass and train hard!! I take
//  on all opponents, especially the hardest ones! 
