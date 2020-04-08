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
            console.log(user);
            userLocation.lat = location.latitude;
            userLocation.long = location.longitude;
            
            mymap.setView([userLocation.lat, userLocation.long],5);
            circle.setLatLng([userLocation.lat,userLocation.long]);
            marker.setLatLng([userLocation.lat,userLocation.long]);
        
            console.log("Radar.io status:"+status);
            writeUserLocation({id:"nothing",lat:"1", long:"2"});
    });
    
        
    setTimeout(function(){
        mymap.setView([userLocation.lat, userLocation.long],5);

        circle.addTo(mymap);
        marker.addTo(mymap);
    }, 1000);

    



    // Initialize The App Client
    const client = stitch.Stitch.initializeDefaultAppClient("stitchchat-qzouw");
    // Get A MongoDB Service Client
    client.auth.loginWithCredential(new stitch.AnonymousCredential())
        .then(s => console.log('authenticated successfully!!!!'))
        .catch(console.error);
        
    // console.log('Your client id is: '+ client.auth.user.id);

    const mongodb = client.getServiceClient(
        stitch.RemoteMongoClient.factory,
        "mongodb-atlas"
    );
    // Get A Reference To The Blog Database
    const db = mongodb.db("users");

    function writeUserLocation(user){
        var message = {'user_id': user.id,  'lat': user.location.latitude, 'long':user.location.longitude};

        db.collection("location")
        .insertOne(message)
    
    }
