// dataservice factory
angular
    .module('app', [])
    .factory('passengerservice', ['$http', function ($http) {
      return {
          getPassengerList: getPassengerList
      };

      function getPassengerList() {
        return getFullPassengers();
      }
      //  DATA - put in a service to just return this JSON (), simulated http call to a backend

      function getFullPassengers () {
        return [
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
      }
  }
]);