var image_url = "http://playground.imagga.com/static/img/example_photos/japan-605234_1280.jpg";
var url = `https://cors.bridged.cc/https://api.imagga.com/v2/tags?image_url=${image_url}`; //imagga api template literal url, needs to take from input field later
var clientId = "acc_7fb17317fba6ba0";//api key/ USER
var clientSecret = "f56b7dbf6684c3bf156d23228e990b8f";//api_secret/ PASS
var searchTerm = document.querySelector('#searchTerm').value;

function repeat(func, times) {
  func();
  times && --times && repeat(func, times);
}

function randomNoRepeats(array) {
  var copy = array.slice(0);
  return function() {
    if (copy.length < 1) { copy = array.slice(0); }
    var index = Math.floor(Math.random() * copy.length);
    var item = copy[index];
    copy.splice(index, 1);
    return item;
  };
}

// commented out Imagga call, gives CORS error/ if no-cors, 401. Opaque data useless anyways
/*
  fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'omit', // include, *same-origin, omit
    headers: new Headers({
      'Authorization': 'Basic acc_7fb17317fba6ba0:f56b7dbf6684c3bf156d23228e990b8f',
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }),
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
    });

*/
    // met api call
    function myFunction() {
      // Make a fetch request to search with user input
        fetch(
          'https://collectionapi.metmuseum.org/public/collection/v1/search?q=' +
            searchTerm +
            '&hasImages=true'
        )
      
        .then(function(objResponse) {
          return objResponse.json();
        })
        .then(function(objResponse) {

          repeat(function () {
        var chooser = randomNoRepeats(objResponse.objectIDs);

        var objectValue = chooser();
          return fetch(
          'https://collectionapi.metmuseum.org/public/collection/v1/objects/'+objectValue
          )    
          .then(function(response) {
          return response.json();
        })
        .then(function(response) {
          if (response === 0) {
            console.log('the Met could not find anything for that.');
          } else {
            console.log(response);
            var metImg = document.createElement('img');
            metImg.setAttribute('class','photo-section');
            metImg.setAttribute('src', response.primaryImage);
            var responseContainerEl = document.querySelector('#response-container');
            responseContainerEl.appendChild(metImg);
          }
        });
          // Return a fetch request to the Metropolitan API with the object data array from the search
        }, 4);
        })
        
        
    }
    