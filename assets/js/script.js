function myFunction() {
    var searchTerm = document.querySelector('#searchTerm').value;
    fetch(
      'https://api.si.edu/openaccess/api/v1.0/search?q=' +
        searchTerm +
        '&api_key=rKHhf40H1Sghba5GMCz0540CFRt5d9yOVZItR1EW'
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(response) {
        console.log(response);
      });
  }