//initialize global variables
var searchInput = null;
var searchTerm = null;
var uploadedImg = null;
var researchIndex = 0;
var storedsearchTermsparsed =[];
var responseToggle = 1;

//store fetch headers and request options in variables
var myHeaders = new Headers();
myHeaders.append("Authorization", "Basic YWNjXzdmYjE3MzE3ZmJhNmJhMDpmNTZiN2RiZjY2ODRjM2JmMTU2ZDIzMjI4ZTk5MGI4Zg==");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};
// gets data from loccal storage
// creates a previous search term list on refresh or new login
$(document).ready(function () {
  if (localStorage.getItem("storedsearchTerms") == null) {
     localStorage.setItem("storedsearchTerms", "[]");
   };
   storedsearchTermsparsed = JSON.parse(
     window.localStorage.getItem("storedsearchTerms")
   );
   for (i = 0; i < storedsearchTermsparsed.length; i++) {
     $("#priorsearchterms")
       .append(`<a class="navbar-item">` + storedsearchTermsparsed[i] + `</a>`)
       };
   }    
);

//performs a search when the prior list is clicked
$("#priorsearchterms").on("click","li",function () {
         $(this).css("background", "#328cc1");
         researchIndex = $("li").index(this);
         researchTerm = storedsearchTermsparsed[researchIndex];
         responseToggle = 0;
         readyContainer();
         metFunction(researchTerm);
}); 

document.addEventListener('DOMContentLoaded', () => {

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {

        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
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
fetch('https://api.imagga.com/v2/uploads/?image='+photo, {method: "POST", body: formData})
.then(function(response) {
  return response.json();
})
.then(function(response) {
  'https://api.imagga.com/v2/tags?image_upload_id='+image_url;
 // searchTerm = response.result.tags[0];
});
metFunction();
}

// Imagga call via url
function urlFunction(animage_url){
//imagga api url, needs to take from input field later
var url = 'https://api.imagga.com/v2/tags?image_url='+ animage_url; 

  fetch(url,requestOptions)
    .then(function(response) {
      return response.json();
    })
    .then(function(response) {
      if (response.tags == null) {
        //null response catch. 'no result' screen needed. 
        var metBox = document.createElement('section');
        var responseContainerEl = document.querySelector('#response-container');
        responseContainerEl.appendChild(metBox);
        metBox.innerHTML =`
      <h1 class="bd-notification is-primary head-style">
        NO RESULTS
      </h1>
      <p> Unfortunately, we were not able to find any gallery items that match your query</p>
      <br/>
      <div class="link-container">
       <a href="#search" onclick="readyContainer()" >Try again!</a>
     </div>`
        console.log('the Met could not find anything for that.');
      } else {
      searchurlTerm = response.result.tags[0].tag.en;
      console.log(searchurlTerm)
      metFunction(searchurlTerm);
      }
    });
}

function storeTerms(anyTerm) {
//add the searchTerms to local storage during the live session
//initilizes variables for local storage
  if (localStorage.getItem("storedsearchTerms") == null) {
    localStorage.setItem("storedsearchTerms", "[]");
    }
  var storedsearchTerms = JSON.parse(localStorage.getItem("storedsearchTerms"));
  //removes duplicates before sending to storage
  if (storedsearchTerms.indexOf(anyTerm)=== -1) {
    storedsearchTerms.push(anyTerm);
  };
  //sends to local storage
  localStorage.setItem("storedsearchTerms", JSON.stringify(storedsearchTerms));
  //places the most recent search term on the top of the list
  $("#priorsearchterms")
    .prepend("<li>" + anyTerm + "</li>").css("list-style-type","none")
    .on("click", "li", function () {
    $(this).css("background", "#328cc1");
    var index = $("li").index(this);
         researchTerm = storedsearchTermsparsed[1];
         console.log(researchTerm);
    });
  };

// met api call
function metFunction(metsearchTerm) {
// Make a fetch request to search with user input
  fetch(
    'https://collectionapi.metmuseum.org/public/collection/v1/search?tags=true&hasImages=true&q='+
    metsearchTerm
    )
    .then(function(objResponse) {
      return objResponse.json();
      })
    //takes random index from response
    .then(function(objResponse) {
      console.log(objResponse);
      if (objResponse.objectIDs == null) {
        //null response catch. 'no result' screen needed. 
        var metBox = document.createElement('section');
        var responseContainerEl = document.querySelector('#response-container');
        responseContainerEl.appendChild(metBox);
        metBox.innerHTML =`
      <h1 class="bd-notification is-primary head-style">
        NO RESULTS
      </h1>
      <p> Unfortunately, we were not able to find any gallery items that match your query</p>
      <br/>
      <div class="link-container">
       <a href="#search" onclick="readyContainer()" >Try again!</a>
     </div>`
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
          var metBox = document.createElement('div');
          metBox.setAttribute('class','box');
          var responseContainerEl = document.querySelector('#response-container');
          responseContainerEl.appendChild(metBox);
          metBox.innerHTML = `<a href = "https://www.metmuseum.org/art/collection/search/${objectValue}"><img src = "${response.primaryImage}"></a>`;
        
      });
    }, 4); 
  }
  })
  };

var input = document.querySelector('#searchInput');
var input2 = document.querySelector('#imageURL');
var button = document.querySelector('#keyword-search');
var button2 = document.querySelector('#url-search');

button.disabled = true; //setting button state to disabled
button2.disabled = true; //setting button state to disabled
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
  responseToggle = 0;
  readyContainer();
  searchInput = document.querySelector('#searchInput').value;
  searchTerm = searchInput;
  if (searchInput != null){
    storeTerms(searchTerm);
    metFunction(searchTerm);
    }
  };

function imguFunction(){
  document.getElementById('searchInput').value = '';
  responseToggle = 0;
  readyContainer();
  image_url = document.querySelector('#imageURL').value;
  if (image_url != null){
    urlFunction(image_url);
    }
  };

function imgUPFunction(){
  /* document.getElementById('searchInput').value = '';
  responseToggle = 0;
  readyContainer();*/
  imgFunction();
  };

  function readyContainer() {
  
  if (responseToggle == 0){
  var responseContainerEl = document.querySelector('#response-container');
  responseContainerEl.style.display = "flex";
  responseContainerEl.innerHTML = '';
  var mainEl = document.querySelector('#main');
  mainEl.style.display = "none";
  responseToggle = 1;
  }
  else{
    var responseContainerEl = document.querySelector('#response-container');
    responseContainerEl.style.display = "none";
    responseContainerEl.innerHTML = '';
    var mainEl = document.querySelector('#main');
    mainEl.style.display = "grid";
  }
  };
