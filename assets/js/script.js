var image_url = "https://images.metmuseum.org/CRDImages/ep/original/SF%20Lorenzetti.jpg";
var url = 'https://api.imagga.com/v2/tags' + "?image_url=" + image_url +'&api_key=acc_7fb17317fba6ba0'

function myFunction() {
  fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'no-cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'omit', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    
  })
      .then(function(imgResponse) {
        return imgResponse.json();
      })
      .then(function(imgResponse) {
        // Create a variable to hold the title of the Wikipedia article
        console.log(imgResponse);
        //var searchTerm = imgResponse.query.random[0].title;
  
       /* // Display the article title above the GIF as a <h2> heading
        var responseHeaderEl = document.querySelector('#response-header');
        responseHeaderEl.innerHTML = '<h2>' + searchTerm + '</h2>';
  
        var rating = document.getElementById('rating').value;
  
        // Return a fetch request to the Giphy search API with the article title and rating parameters
        return fetch(
          'https://api.giphy.com/v1/gifs/search?q=' +
            searchTerm +
            '&rating=' +
            rating +
            '&api_key=HvaacROi9w5oQCDYHSIk42eiDSIXH3FN&limit=1'
        );*/
      })
     /* .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        if (response.data.length === 0) {
          console.log('Giphy could not find anything for that.');
        } else {
          console.log(response.data[0]);
          var responseContainerEl = document.querySelector('#response-container');
          responseContainerEl.innerHTML = '';
          var gifImg = document.createElement('img');
          gifImg.setAttribute('src', response.data[0].images.fixed_height.url);
          responseContainerEl.appendChild(gifImg);
        }
      });
    */}