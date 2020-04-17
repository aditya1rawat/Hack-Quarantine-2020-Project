// #mapid { height: 400px; width:400px;} -- in styles
// <div id="mapid"></div>

var userLocation = {long:0,lat:0};
var circle = L.circle([0, 0], {
    color: 'aqua',
    fillColor: 'aqua',
    fillOpacity: 0.3,
    radius: 20
});


    var marker = L.marker([0, 0]);

    //Create map
    var mymap = L.map('mapid').setView([userLocation.lat,userLocation.long], 15);

    L.tileLayer('https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=i1eBbBnWLxXDdoChTlCk', {
        //attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        attribution:'<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>'
        

    }).addTo(mymap);

    //Get user location
    Radar.initialize("prj_live_pk_8e1671617a075b41f6784138268a0fe62082f51d");
      //Radar.setPlacesProvider(Radar.PLACES_PROVIDER.FACEBOOK);
      //Radar.setUserId("a");





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
    const db = mongodb.db("user");
    /*    console.log(db.collection("location")
        .find({}, { limit: 1000 })
        .toArray());

        console.log(client.auth.user.id);
    */



//    var data  = db.collection('location')        
//    .find({}, { limit: 1000 })
//    .toArray();
    

//    data.then(docs => {

//         console.log(docs);


//     for(i = 0; i<docs.length;i++){
//         if(math.abs(docs[i].lat-location.latitude)<1 && math.abs(docs[i].long)-location.longitude<1){
//             c = L.circle([0, 0], {
//                 color: 'red',
//                 fillColor: '#f03',
//                 fillOpacity: 0.5,
//                 radius: 500
//             });
//             c.setLatLng([docs[i].lat, docs[i].long]);
//             //mymap.setView([docs[i].lat, docs[i].long],5);
//             c.addTo(mymap);
//         }
//     }
//     //console.log("Radar.io status:"+status);
//     console.log("New ok 12");

// });

var data  = db.collection('location')        
.find({}, { limit: 10000 })
.toArray();
 

data.then(docs => {

     console.log(docs);

     console.log(typeof(docs[0]._id))});

    Radar.trackOnce(function(status, location, user, events) {
            console.log(location);
            console.log(user);
            userLocation.lat = location.latitude;
            userLocation.long = location.longitude;
            
            mymap.setView([userLocation.lat, userLocation.long],15);
            marker.setLatLng([userLocation.lat,userLocation.long]);
        
            var data  = db.collection('location')        
            .find({}, { limit: 10000 })
            .toArray();
             
         
            data.then(docs => {
         
                 console.log(docs);
         
                 console.log(typeof(docs._id))
             for(i = 0; i<docs.length;i++){

                 //if(Math.abs(docs[i].lat-location.latitude)>3 && Math.abs(docs[i].long-location.longitude>3)){
                    
                     console.log("It is smaller");
                     c = L.circle([0, 0], {
                         color: 'red',
                         fillColor: '#f03',
                         fillOpacity: 0.5,
                         radius:20
                     });
                     c.setLatLng([docs[i].lat, docs[i].long]);
                     //mymap.setView([docs[i].lat, docs[i].long],5);
                     c.addTo(mymap);
                 }
             //}
             circle.setLatLng([userLocation.lat,userLocation.long]);

             //console.log("Radar.io status:"+status);
             console.log("New ok 14");
         
         });
         
         

            var message = {'owner_id': client.auth.user.id, 'user_id':user._id,  'lat': location.latitude, 'long':location.longitude};

            //db.collection("location").insertOne(message).then(function(){console.log("This ran")}).catch(console.error);
            db.collection("location").updateMany({'user_id':user._id}, message,
            
            {
                upsert: true
              }
            );
            
            //writeUserLocation(user.then(function(){console.log("This ran")}).catch(console.error);;
    });
    
        
   //setTimeout(function(){
        mymap.setView([userLocation.lat, userLocation.long],15);

        circle.addTo(mymap);
        marker.addTo(mymap).bindPopup("You are here");
 //   }, 1000);

    




    function writeUserLocation(user){
        var message = {'user_id': user._id,  'lat': user.location.coordinates[1], 'long':user.location.coordinates[0]};

        db.collection("location")
        .insertOne(message)
    
    }
