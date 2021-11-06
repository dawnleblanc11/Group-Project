var image_url = null;
var url = 'https://api.imagga.com/v2/tags?image_url='+image_url; //imagga api template literal url, needs to take from input field later
var clientId = "acc_7fb17317fba6ba0";//api key/ USER
var searchInput = null;
var searchTerm = "";

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

// Imagga call via url
function urlFunction(){
  fetch(url,requestOptions)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      searchTerm = response.result.tags[0];
    });
    metFunction();
  }


    // met api call
    function metFunction() {
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
        }, 4);
        })
    };
    function keywordFunction(){
      if (searchInput != ""){
        document.getElementById('imageURL').value = ''
        searchTerm = searchInput;
        var responseContainerEl = document.querySelector('#response-container');
        responseContainerEl.innerHTML = '';
        searchInput = document.querySelector('#searchTerm').value;
        metFunction();
      }
    }

    function imguFunction(){
      if (image_url != ""){
        document.getElementById('searchTerm').value = ''
        var responseContainerEl = document.querySelector('#response-container');
        responseContainerEl.innerHTML = '';
        image_url = document.querySelector('#imageURL').value;
        urlFunction();
      }
      };
    