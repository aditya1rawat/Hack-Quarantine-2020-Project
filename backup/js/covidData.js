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

//Function formaking date
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
      for(i = 0;i<response.length;i++){
        caseData[i] = response[i].Cases;
      }
      fn(caseData);

    });
  } else {alert("Country not  found");}
  }
  
  //Set the current country data
  function initCountryData(country){
    recvCountryData(function(caseData){
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
//Functions to run at the beginning
function initFunctions(){
  //Get date
  makeToday();
  
  initCountries();//Get available countries
  initGlobalData();//Get global information


  setTimeout(function(){
    
    console.log("Cases: "+currentGlobalCases);
    console.log("Deaths: "+currentGlobalDeaths);
    console.log("Recovered: "+currentGlobalRecover);

  },3000);
}

initFunctions();