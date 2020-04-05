// Initialize The App Client
const client = stitch.Stitch.initializeDefaultAppClient("stitchchat-qzouw");
// Get A MongoDB Service Client
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
                    </div>
                </div>
            </div>
        </div>
     `);
            document.getElementById("comments").innerHTML = html;
        });
}

function displayCommentsOnLoad() {
    client.auth
        .loginWithCredential(new stitch.AnonymousCredential())
        .then(displayComments)
        .catch(console.error);
}

function addComment() {
    const newComment = document.getElementById("new_comment");
    const username = document.getElementById("username");
    console.log("New Comment " + newComment.value);
    console.log("Name" + username.value);
    console.log("Add Comment", client.auth.user.id);
    let date = new Date().toLocaleString();
    console.log("Date: " + date);
    let message = { 'owner_id': client.auth.user.id, 'username': username.value, 'comment': newComment.value, 'date': date };
    console.log("Message: " + message);
    db.collection("comments")
        .insertOne(message)
        .then(displayComments);
    newComment.value = "";
    displayComments();
}