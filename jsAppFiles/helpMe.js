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

// Display Comments Function
function displayComments() {
    console.log("The Display Method Is Called");
    db.collection("comments")
        .find({}, { limit: 1000 })
        .toArray()
        .then(docs => {
            const html = docs.map(doc => `
        <div>
            <div class="row align-items-stretch program">
                <div class="col-12 border-top border-bottom py-5" data-aos="fade" data-aos-delay="200">
                    <div class="row align-items-stretch">
                        <div class="col-md-3 text-white mb-3 mb-md-0"><span class="h4">${doc.username}</span></div>
                        <div class="col-md-9">
                            <h2 class="text-white">${doc.comment}</h2>
                            <span>${doc.date}</span>
                        </div>
                        <div class="col-md-3">
                        <input type="submit" value="Delete" class="btn btn-primary py-2 px-4 text-white" id="delete">
                        </div>
                    </div>
                </div>
            </div>
        </div>
     `);
            document.getElementById("comments").innerHTML = html;
        });
}

function displayCommentsOnLoad() {
    displayComments();
}

/**
 * Add comment method inserts comment in mongodb
 */
function addComment() {
    const newCommentHtml = document.getElementById("new_comment");
    const usernameHtml = document.getElementById("username");
    const commentValue = newCommentHtml.value;
    const userNameValue = username.value;
    const date = new Date().toLocaleString();
    console.log("Date: " + date);
    console.log("New Comment: ", commentValue);
    console.log("Name: ", userNameValue);
    if(isEmpty(commentValue) || isEmpty(userNameValue)){
        alert("Required Fields Are Empty! Username And Message Are Required Fields!");
    } else {
        const message = { 'owner_id': client.auth.user.id, 'username': userNameValue, 'comment': commentValue, 'date': date };
        console.log("Message: " + message);
        db.collection("comments")
            .insertOne(message)
            .then(displayComments);
            //clean up the fields in HTML
            newCommentHtml.value = "";
            usernameHtml.value = "";
            //once message is inserted in MongoDB, fetch all messages to display in comment section
        displayComments();
    }

    /**
     * isEmpty method returns true if string is empty or undefined else return false.
     */
    function isEmpty(str) {
        return (!str || 0 === str.length);
    }
}

// function deleteComment() {
    

// }