//initialize global variables
var image_url = null;
var searchInput = null;
var searchTerm = null;
var uploadedImg = null;

//imagga api url, needs to take from input field later
var url = 'https://api.imagga.com/v2/tags?image_url='+image_url; 

//store fetch headers and request options in variables
var myHeaders = new Headers();
myHeaders.append("Authorization", "Basic YWNjXzdmYjE3MzE3ZmJhNmJhMDpmNTZiN2RiZjY2ODRjM2JmMTU2ZDIzMjI4ZTk5MGI4Zg==");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

// creates the previous search term list on refresh or new login 21-35
$(document).ready(function () {
  if (localStorage.getItem("storedsearchTerms") == null) {
     localStorage.setItem("storedsearchTerms", "[]");
   };
   var storedsearchTermsparsed = JSON.parse(
     window.localStorage.getItem("storedsearchTerms")
   );
// when searchTerm function working need to test the ability to call function- click working since Change in color
   for (i = 0; i < storedsearchTermsparsed.length; i++) {
     $("#priorsearchterms")
       .append("<li>" + storedsearchTermsparsed[i] + "</li>").css("list-style-type","none")
       .on("click", "li", function () {
         $(this).css("background", "#328cc1");
         var index = $("li").index(this);
         document.querySelector('#searchInput').value = storedsearchTermsparsed[index];
         keywordFunction();
       });
   }
});

//repeat function, calls same code block per param 2.
function repeat(func, times) {
  func();
  times && --times && repeat(func, times);
};

//takes random index from array without repeating.
function randomNoRepeats(array) {
  var copy = array.slice(0);
  return function() {
    if (copy.length < 1) { copy = array.slice(0); }
    var index = Math.floor(Math.random() * copy.length);
    var item = copy[index];
    copy.splice(index, 1);
    return item;
  };
};

//Imagga call via image upload. 400 BAD REQUEST
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

function storeTerms() {
//add the searchTerms to local storage during the live session
//initilizes variables for local storage
  if (localStorage.getItem("storedsearchTerms") == null) {
    localStorage.setItem("storedsearchTerms", "[]");
    }
  var storedsearchTerms = JSON.parse(localStorage.getItem("storedsearchTerms"));
  //removes duplicates before sending to storage
  if (storedsearchTerms.indexOf(searchTerm)=== -1) {
    storedsearchTerms.push(searchTerm);
  };
  //sends to local storage
  localStorage.setItem("storedsearchTerms", JSON.stringify(storedsearchTerms));
  //places the most recent search term on the top of the list
  $("#priorsearchterms")
    .prepend("<li>" + searchTerm + "</li>").css("list-style-type","none")
    .on("click", "li", function () {
    $(this).css("background", "#328cc1");
    });
  };

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
    //takes random index from response
    .then(function(objResponse) {
      console.log(objResponse);
      if (objResponse.objectIDs == null) {
        //null response catch. 'no result' screen needed. 
        console.log('the Met could not find anything for that.');
      } else {
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
          var metBox = document.createElement('section');
          metBox.setAttribute('class','box');
          var responseContainerEl = document.querySelector('#response-container');
          responseContainerEl.appendChild(metBox);
          metBox.innerHTML = `<img src = "${response.primaryImage}"/>`;
        
      });
    }, 4); 
  }
  })
  };

var input = document.querySelector('#searchInput');
var input2 = document.querySelector('#imageURL');
var button = document.querySelector('#keyword-search');
var button2 = document.querySelector('#url-search');
var button3 = document.querySelector('#image-search');

//setting button states to disabled
button.disabled = true; 
button2.disabled = true; 
button3.disabled = true; // image upload button disabled, not functional in time :(

input.addEventListener('change',() => stateHandle('#searchInput',button));
input2.addEventListener('change',() => stateHandle('#imageURL',button2));

//prevent default behavior for all buttons, dont want page to refresh. 
//I'm sure there's a more elegant way to do this
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
};

function keywordFunction(){
  document.getElementById('imageURL').value = '';
  var responseContainerEl = document.querySelector('#response-container');
  responseContainerEl.style.display = "flex";
  responseContainerEl.innerHTML = '';
  searchInput = document.querySelector('#searchInput').value;
  searchTerm = searchInput;
  var mainEl = document.querySelector('#main');
  mainEl.style.display = "none";
  if (searchInput != null){
    metFunction();
    storeTerms();
    }
  };

function imguFunction(){
  document.getElementById('searchInput').value = '';
  var responseContainerEl = document.querySelector('#response-container');
  responseContainerEl.style.display = "flex";
  responseContainerEl.innerHTML = '';
  var mainEl = document.querySelector('#main');
  mainEl.style.display = "none";
  image_url = document.querySelector('#imageURL').value;
  if (image_url != null){
    urlFunction();
    storeTerms();
    }
  };

function imgUPFunction(){
  /* document.getElementById('searchInput').value = '';
  document.getElementById('imageURL').value = '';
  var responseContainerEl = document.querySelector('#response-container');
  responseContainerEl.style.display = "flex";
  responseContainerEl.innerHTML = '';
  var mainEl = document.querySelector('#main');
  mainEl.style.display = "none";*/
  imgFunction();
  };