var image_url = null;
var url = 'https://api.imagga.com/v2/tags?image_url='+image_url; //imagga api template literal url, needs to take from input field later
var clientId = "acc_7fb17317fba6ba0";//api key/ USER
var searchInput = null;
var searchTerm = "";
var uploadedImg = null;

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



//Imagga call via image upload
function imgFunction() {
let photo = document.getElementById("image-file").files[0];
let formData = new FormData(); 
formData.append("photo", photo);
fetch('https://api.imagga.com/v2/uploads/?image='+photo, {method: "POST", headers: myHeaders,  body: formData })
    .then(function(uploadResponse) {
      return uploadResponse.json();
    })
    .then(function(uploadResponse) {
      console.log(uploadResponse);
      var imageID = uploadResponse.result.upload_id;
      // Return a fetch request to the Giphy search API with the article title and rating parameters
      return fetch('https://quiet-lowlands-76346.herokuapp.com/https://api.imagga.com/v2/tags?image_upload_id='+imageID, 
      {method: "GET", headers: {'Authorization': "Basic YWNjXzdmYjE3MzE3ZmJhNmJhMDpmNTZiN2RiZjY2ODRjM2JmMTU2ZDIzMjI4ZTk5MGI4Zg==", 'Access-Control-Allow-Origin': 'null', 'Content-Type': 'application/json'},redirect: 'follow' })
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      console.log(response);
    });
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
          'https://collectionapi.metmuseum.org/public/collection/v1/search?tags=true&hasImages=true&q='+
            searchTerm
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
            var metBox = document.createElement('section');
            metBox.setAttribute('class','box');
            var responseContainerEl = document.querySelector('#response-container');
            responseContainerEl.appendChild(metBox);
            metBox.innerHTML = `<img src = "${response.primaryImage}"/>`;
          }
        });
        }, 4);
        
        })
    };




var input = document.querySelector('#searchInput');
var input2 = document.querySelector('#imageURL');
var button = document.querySelector('#keyword-search');
var button2 = document.querySelector('#url-search');
var button3 = document.querySelector('#image-search');

button.disabled = true; //setting button state to disabled
button2.disabled = true; //setting button state to disabled
//button3.disabled = true;

input.addEventListener('change',() => stateHandle('#searchInput',button));
input2.addEventListener('change',() => stateHandle('#imageURL',button2));

button.addEventListener("click", function(event){
  event.preventDefault()
});
button2.addEventListener("click", function(event){
  event.preventDefault()
});
button3.addEventListener("click", function(event){
  event.preventDefault()
});

function stateHandle(element,buttonP) {
    if (document.querySelector(element).value === "") {
        buttonP.disabled = true; //button remains disabled
    } else {
        buttonP.disabled = false; //button is enabled
    }
}



    function keywordFunction(){
        document.getElementById('imageURL').value = '';
        var responseContainerEl = document.querySelector('#response-container');
        responseContainerEl.style.display = "flex";
        responseContainerEl.style.webkitAnimationName = 'fadeIn';
        responseContainerEl.style.webkitAnimationDuration = '1s';
        responseContainerEl.innerHTML = '';
        searchInput = document.querySelector('#searchInput').value;
        searchTerm = searchInput;
        var mainEl = document.querySelector('#main');
        mainEl.style.display = "none";
        if (searchInput != null){metFunction();}
        console.log("clicked");
    };

    function imguFunction(){
      
        document.getElementById('searchInput').value = '';
        var responseContainerEl = document.querySelector('#response-container');
        responseContainerEl.style.display = "flex";
        responseContainerEl.style.webkitAnimationName = 'fadeIn';
        responseContainerEl.style.webkitAnimationDuration = '1s';
        responseContainerEl.innerHTML = '';
        var mainEl = document.querySelector('#main');
        mainEl.style.display = "none";
        image_url = document.querySelector('#imageURL').value;
        if (image_url != null){urlFunction();}
      };

      function imgUPFunction(){
         /* document.getElementById('searchInput').value = '';
          document.getElementById('imageURL').value = '';
          var responseContainerEl = document.querySelector('#response-container');
          responseContainerEl.style.display = "flex";
          responseContainerEl.style.webkitAnimationName = 'fadeIn';
          responseContainerEl.style.webkitAnimationDuration = '1s';
          responseContainerEl.innerHTML = '';
          var mainEl = document.querySelector('#main');
          mainEl.style.display = "none";*/
          imgFunction();
        };