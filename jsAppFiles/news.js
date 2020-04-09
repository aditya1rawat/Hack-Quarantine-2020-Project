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
        var link = document.createElement("a");
        var container = document.createElement("tr");
        var indexSource = document.createElement("td");
        var indexDescription = document.createElement("td");

        link.href=response.articles[i].url;
        link.target="_blank";
        //indexSource.innerHTML = response.articles[i].source.name;
        link.innerHTML = response.articles[i].source.name;
        indexDescription.innerHTML = response.articles[i].description;//title;
        link.style="color:#ff5733";
        //indexSource.style="color:#ff5733";
        indexDescription.style="color:white";
        indexSource.append(link)
        container.append(indexSource);
        container.append(indexDescription);
        
        document.getElementById('tbody').append(container);
        console.log(response.articles[i]);
        
        //document.getElementsByClassName('news').style="height:fit-content";
        container.style="height:100%";
      }
    });  
  }
  getNews();