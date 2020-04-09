//Need JQuery

//Data variables
var countryList = [];
var currentCountryTodayData;
var currentCountryTotal;
var currentCountryData = [];
var currentGlobalCases;
var currentGlobalDeaths;
var currentGlobalRecover;

//Date variables
var date = new Date();
var year = date.getFullYear();
var month = (date.getMonth()+1).toString();
var day = date.getDate().toString();
var today = "";

var myLineChart;
var ctxL;


//Function for making date
function makeToday(){
  if(day.length==1){
    day = "0"+day;
  }

  if(month.length==1){
    month = "0"+month;
  }

  today = year+"-"+month+"-"+day+"T00:00:00Z"

}

//Functions for getting and setting the country array
//Receive from server
function recvCountries(fn){
    var countries = [];

    var request = {
    "url": "https://api.covid19api.com/countries",
    "method": "GET",
    "timeout": 0,
    };
  
    $.ajax(request).done(function (response) {
      //console.log(request.url);
      for(i = 0; i<response.length;i++){
        countries[i] = response[i].Country;
      }
      fn(countries);
    });
}


//Set variable
function initCountries(){
    recvCountries(function(countries){
        countryList=countries;
        countries.sort();
    });
}


//Functions for setting country data
//Receive from server
function recvCountryTotal(fn, country){

  if(countryList.includes(country)){
    var request = {
    "url": "https://api.covid19api.com/total/country/"+country+"/status/confirmed",
    "method": "GET",
    "timeout": 0,
    };

    $.ajax(request).done(function (response) {
      //console.log(request.url);
      var last = response.length-1;
      fn({"cases":response[last].Cases});

    });
  } else {alert("Country not  found");}
}

//Set the current new data being looked at
function initCountryTotal(country){
  recvCountryNewData(function(data){
    currentCountryTotal = data;
  },country);
}


//Functions for setting complete country data
//Receive from server
function recvCountryData(fn,country){
  if(countryList.includes(country)){
    var request = {
    "url": "https://api.covid19api.com/total/country/"+country+"/status/confirmed",
    "method": "GET",
    "timeout": 0,
    };

    $.ajax(request).done(function (response) {
      //console.log(request.url);
      var caseData = [];
      var caseDates = [];
      for(i = 0;i<response.length;i++){
        caseData[i] = response[i].Cases;
        caseDates[i] = response[i].Date;
      }
      fn(caseDates, caseData);

    });
  } else {alert("Country not  found");}
  }
  
  //Set the current country data
  function initCountryData(country){
    recvCountryData(function(caseData,  caseDates, deathData){
      currentCountryData = caseData;
    },country)
  }


//Functions for setting global data
//Receive from server
function recvGlobalData(fn){
  var globalCases = 0;
  var globalDeaths = 0;
  var globalRecover = 0;
  var request = {
    "url": "https://api.covid19api.com/summary",
    "method": "GET",
    "timeout": 0,
    };

    $.ajax(request).done(function (response) {
      for(i = 0; i <response.Countries.length;i++){
        globalCases+=response.Countries[i].TotalConfirmed;
        globalDeaths+=response.Countries[i].TotalDeaths;
        globalRecover+=response.Countries[i].TotalRecovered;
      }

      fn({"cases":globalCases, "deaths":globalDeaths, "recovered":globalRecover});
    });
}

//Set current global data
function initGlobalData(){
recvGlobalData(function(data){
  currentGlobalCases=data.cases;
  currentGlobalDeaths = data.deaths;
  currentGlobalRecover = data.recovered;
})
}

function graphCountry(){
  var country = document.getElementById('selectContainer').options[document.getElementById('selectContainer').selectedIndex].value;  
  console.log(document.getElementById('selectContainer').selectedIndex);
  console.log(country);
  recvCountryData(function(x,y,y2){
    var xVals = x;
    var countryCases = y;

    for(i=0;i<xVals.length;i++){
      xVals[i]=xVals[i].split("T")[0];
    }

    
    //line
    myLineChart.data.datasets[0].data=countryCases;
    myLineChart.data.datasets[0].label=country+" Cases";
    myLineChart.data.labels=xVals;
    //console.log(myLineChart.labels);
    //console.log(countryDeaths);
    myLineChart.update();
    

  }, country);
}


//Functions to run at the beginning
function initFunctions(){
    ctxL = document.getElementById("lineChart").getContext('2d');
    myLineChart = new Chart(ctxL, {
    type: 'line',
    data: {
    labels: [],
    datasets: [{
    label: "",
    data: [],
    backgroundColor: [
    'rgba(237,99,66,0.6)',
    ],

    borderColor: [
    'rgba(237,99,66,0.8)',
    ],
    borderWidth: 2
    },
    ]
    },
    options: {
    responsive: true
    }

  });


  //Get date
  makeToday();
  
  initCountries();//Get available countries
  initGlobalData();//Get global information
  getVideo();

  setTimeout(function(){
    console.log(typeof(countryList[0]));
    if(typeof(countryList[0])!='undefined'){
      
    for(i = 0; i <countryList.length; i++){
      var option = document.createElement("option");   // Create a <button> element
      option.innerHTML = countryList[i];
      option.value = countryList[i];
      // option.addEventListener("select", function(){
      //   graphCountry(option.value);
      //   console.log(option.value);
      // });
      option.className="cool";
      document.getElementById('selectContainer').appendChild(option);

    }

    document.getElementById('gCases').innerHTML="Global Cases: "+currentGlobalCases;
    document.getElementById('gDeaths').innerHTML="Global Deaths: "+currentGlobalDeaths;
    document.getElementById('gRecover').innerHTML="Global Recoveries: "+currentGlobalRecover;
    document.getElementById('status').innerHTML="Data Loaded";
      
    } else {
      document.getElementById('status').style="color:rgb(255,0,0)";
      document.getElementById('status').innerHTML="Loading took too long";
    }    
    //console.log("Cases: "+currentGlobalCases);
    //console.log("Deaths: "+currentGlobalDeaths);
    //console.log("Recovered: "+currentGlobalRecover);

  },3000);
}



function getVideo() {
  $.ajax({
    type: 'GET',
    url: 'https://www.googleapis.com/youtube/v3/search',
    data: {
        key: 'AIzaSyAUth2gq0oAn2pxVD22HfgtksMqTplsnUM',
        q: "coronavirus news",
        videoEmbeddable:"true",
        //eventType:"live",
        order:"date",
        part: 'snippet',
        maxResults: 1,
        type: 'video',
        videoEmbeddable: true,
    },
    success: function(data){
        embedVideo(data)
    },
    error: function(response){
        console.log(response);
    }
  });
}

function embedVideo(data) {
  console.log(data);
  $('#video').attr('src', 'https://www.youtube.com/embed/' + data.items[0].id.videoId)
  $('#vidTitle').text(data.items[0].snippet.title)
  $('.description').text(data.items[0].snippet.description)
}

//getVideo();



window.onload=initFunctions;