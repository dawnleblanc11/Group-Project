var image_url = "https://static.wikia.nocookie.net/topstrongest/images/3/3b/Street_fighter_iii_3rd_strike_alex_by_hes6789_d8zgi1w-fullview.png/revision/latest?cb=20200502115624";
var url = `https://api.imagga.com/v2/tags?image_url=${image_url}`; //imagga api template literal url, needs to take from input field later
var clientId = "acc_7fb17317fba6ba0";//api key/ USER
var clientSecret = "f56b7dbf6684c3bf156d23228e990b8f";//api_secret/ PASS
var searchTerm = document.querySelector('#searchTerm').value;

var myHeaders = new Headers();
myHeaders.append("Authorization", "Basic YWNjXzdmYjE3MzE3ZmJhNmJhMDpmNTZiN2RiZjY2ODRjM2JmMTU2ZDIzMjI4ZTk5MGI4Zg==");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

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

  fetch(url,requestOptions)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log(data);
    });


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
        var choose = randomNoRepeats(objResponse.objectIDs);

        var objectValue = choose();
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
    