//Needs Jquery

function getNews(){
    var request = {
    "url": "https://newsapi.org/v2/top-headlines?q=coronavirus&apiKey=16ffa5558e524aa4884401dd3a61736a",
    "method": "GET",
    "timeout": 0,
    };
  
    $.ajax(request).done(function (response) {
      //console.log(response);
      for(i=0;i<response.articles.length;i++){
        console.log(response.articles[i].source.name);
      }
    });  
  }
  