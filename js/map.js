// #mapid { height: 400px; width:400px;} -- in styles
// <div id="mapid"></div>

var userLocation = {long:0,lat:0};
    var circle = L.circle([0, 0], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    });

    var marker = L.marker([0, 0]);

    //Create map
    var mymap = L.map('mapid').setView([userLocation.lat,userLocation.long], 5);

    L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=i1eBbBnWLxXDdoChTlCk', {
        //attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>'
        

    }).addTo(mymap);

    //Get user location
    Radar.initialize("prj_live_pk_8e1671617a075b41f6784138268a0fe62082f51d");
      //Radar.setPlacesProvider(Radar.PLACES_PROVIDER.FACEBOOK);
      //Radar.setUserId("a");
      Radar.trackOnce(function(status, location, user, events) {
        console.log(location);
        userLocation.lat = location.latitude;
        userLocation.long = location.longitude;
        
        mymap.setView([userLocation.lat, userLocation.long],5);
        //circle.setLatLng([userLocation.lat,userLocation.long]);
        marker.setLatLng([userLocation.lat,userLocation.long]);
    });
    
        
    setTimeout(function(){
        mymap.setView([userLocation.lat, userLocation.long],5);

        //circle.addTo(mymap);
        marker.addTo(mymap);
    }, 1000);

    
