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
const db = mongodb.db("chat");

    /**
     * isEmpty method returns true if string is empty or undefined else return false.
     */
    function isEmpty(str) {
        return (!str || 0 === str.length);
    }


// Display Comments Function
function displayComments() {
    //console.log("The Display Method Is Called");
    db.collection("comments")
        .find({}, { limit: 1000 })
        .toArray()
        .then(docs => {
            const html = docs.map(doc => `
        <div>
            <div class="row align-items-stretch program">
                <div class="col-12 border-top border-bottom py-5" data-aos="fade" data-aos-delay="200">
                    <div class="row align-items-stretch">
                        <div class="col-md-3 text-white mb-3 mb-md-0"><span class="h5">${doc.username}</span></div>
                        <div class="col-md-9" id="${doc._id}">
                            <h5 class="text-white">${doc.comment}</h5>
                            <span>${doc.date}</span><br/>

                            <span class="cool" onclick="replyTo('${doc._id}');">Reply</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     `).reverse();
            //console.log(html.join();
            var newHTML = "";
            //html = html.reverse();
            for(i = 0; i<html.length; i++){
                newHTML+=html[i];
            }



         document.getElementById("comments").innerHTML = newHTML;

            for(i=0;i<docs.length;i++){

                if(!("replies" in docs[i])) continue;
                var replyHTML = docs[i].replies.map(reply => `
                    <br/>
                    <br/>
                    <div class="text-white"><span class="h5">${reply.username}:</span></div>

                    <p style="padding-left:50px;">${reply.reply}<p>
                
                `);
                //replyHTML.reverse();
                document.getElementById(docs[i]._id).innerHTML+=replyHTML.reverse();
            }
        });
}

function replyTo(str) {
    //console.log(str);
    if(document.getElementById(str).value!="complete") {
        var html = `
        <!--split-->
            
            <div class="md-form mb-4">
            <br/>
            <div style="width:100%;">

            <textarea class="md-textarea form-control  textArea" placeholder="Write your reply" rows="3" id="reply${str}"></textarea>
            <!--label for="form18">Material textarea colorful on :focus state</label-->
            
            <button type="button" class="btn btn-primary py-1 px-3 text-primary postReply" onclick="submitReply('${str}')">post</button>
            </div>
            </div>
        `;
        document.getElementById(str).innerHTML+=html;
        document.getElementById(str).value="complete";
    } else {
        document.getElementById(str).innerHTML=document.getElementById(str).innerHTML.split("<!--split-->")[0];
        document.getElementById(str).value="";
    }
}

function submitReply(str) {
    //console.log(str);
    const username = document.getElementById("username").value;
    console.log(username);
    if(username=="") {
        console.log("Not filled");
        alert("Please enter your name at the top");
        replyTo(str);
        return;
    }
    var indexId;
    var focusedComment;

        db.collection('comments').find({}).toArray().then(docs => {
            for(i=0;i<docs.length;i++){
                //console.log(str);
                var idString = docs[i]._id.toString();
                //console.log(docs[i]._id);
                indexId = docs[i]._id;
                focusedComment = docs[i];
                //console.log("indexId: "+typeof(indexId));
                if(idString==str){break;}
                
            }
        
            //console.log(indexId);
    

    var replyMessage = document.getElementById("reply"+str).value;
    document.getElementById(str).innerHTML=document.getElementById(str).innerHTML.split("<!--split-->")[0];
    var html = `
        <br/>
        <br/>
        <div class="text-white"><span class="h5">${username}:</span></div>

        <p style="padding-left:50px;">${replyMessage}<p>
    
    `;

    document.getElementById(str).innerHTML+=html;

    // db.collection('comments').updateMany({'username':"JP"}, {'owner_id': client.auth.user.id, 'reply':replyMessage},
    // {
    //     upsert: true
    //   }
    // );
    var message;
    if(!("replies" in focusedComment)){
        focusedComment["replies"] = [{"reply":replyMessage, "username":username}];
        //message = {'owner_id': client.auth.user.id, 'replies':replyMessage, 'id':indexId}
        message = focusedComment;
    } else {
        focusedComment.replies.push({"reply":replyMessage, "username":username});
        message = focusedComment;
    }
    //  db.collection('comments').insertOne(message)
    //        .then(function(){console.log("Hello")})
    //        .catch(console.error);
    
    console.log(message);
    
    console.log(focusedComment);
    
    
    //console.log(client.auth.user.id);
    db.collection('comments').updateOne({'_id':indexId},message, {upsert:true});
    });
}


function displayCommentsOnLoad() {
    displayComments();
}

/**
 * Add comment method inserts comment in mongodb
 */
function addComment() {
    //console.log('Add comment method is called ...................');
    const newCommentHtml = document.getElementById("new_comment");
    const usernameHtml = document.getElementById("username");
    const commentValue = newCommentHtml.value;
    const userNameValue = username.value;
    const date = new Date().toLocaleString();
    //console.log('Ready to insert comment ...................');
    if(isEmpty(commentValue) || isEmpty(userNameValue)){
        //console.log('Missing either user name or comment ...................');
        alert("Required Fields Are Empty! Username And Message Are Required Fields!");
    } else {
        //console.log('inserting comment ...................');
        const message = { 'owner_id': client.auth.user.id, 'username': userNameValue, 'comment': commentValue, 'date': date };
        //console.log("<<<<<<<<<<<<< New Comment >>>>>>>>>>>>>>>>: " + message);
        db.collection("comments")
          .insertOne(message)
          .then(displayComments)
          .catch(console.error);
        //console.log('inserted comment ...................');            
        //clean up the fields in HTML
        newCommentHtml.value = "";
        usernameHtml.value = "";
        //once message is inserted in MongoDB, fetch all messages to display in comment section
        //console.log('Calling displayComments method ...................');
        displayComments();
    }


}