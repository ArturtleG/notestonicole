import { collection, updateDoc, getDocs, doc, query, orderBy, where } 
  from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import { db, dbName } from "./firebaseSetup.js";

let resultsArray;

let last;

//const now = new Date();
const centralTime = centralDate();
const dateArr = centralTime.toISOString().split("T");
console.log(dateArr);
const today = dateArr[0];
//const today = "2025-02-13";

const hour = parseInt(dateArr[1].substring(0,2));
console.log("hour: " + hour);
const nightMode = hour >= 20 || hour < 5;
//const nightMode = true;
console.log(nightMode);

if(nightMode){
    $("body").addClass("nightMode");
}

$("#login").keyup(function(){
    matchPass();
});

async function matchPass() {
    try {
        const messageQuery = query(collection(db, "password"));
        const querySnapshot = await getDocs(messageQuery);
        
        let pass = querySnapshot.docs[0].data().pass;
        
        if($("#login").val() == pass){
            displayMessage();
        }

        
    } catch (error) {
        console.error("Error fetching database: ", error);
    }
}

function navigateMessage(increment) {
    window.scrollTo(0, 0);
    // Calculate the new index based on the increment
    const newIndex = last + increment;
    
    // Check boundaries to prevent going out of range
    if (newIndex < 0 || newIndex >= resultsArray.length) {
        return; 
    }
    
    // Remove any fade class first
    $(".fade").removeClass("fade");
    
    // Update `last` to the new index
    last = newIndex;
    
    // Update UI elements with the new message
    $("#message").html(resultsArray[last].m);
    $("#book").html(resultsArray[last].b);
    $("#quote_date").text(dateToString(resultsArray[last].d));
    $(".entry_num").text(resultsArray[last].entry);
    
    // Toggle the `read` class based on `r`
    if (resultsArray[last].r) {
        $("#quote_status").addClass("read");
    } else {
        $("#quote_status").removeClass("read");
    }
    
    // Add fade to the left arrow if we're at the first message
    if (last === 0) {
        $("#left").addClass("fade");
    }
    // Add fade to the right arrow if we're at the last message
    if (last === resultsArray.length - 1) {
        $("#right").addClass("fade");
    }
}

async function heartMessage() {
    try {
        
        const messageId = resultsArray[last].id; // Get the ID of the current message
        const messageRef = doc(db, dbName, messageId); // Reference to the specific document
        
        // Update the 'read' field to true
        await updateDoc(messageRef, {
            read: true
        });
        
        resultsArray[last].r = true;
        $("#quote_status").addClass("read");
        
    } catch (error) {
        console.error("Error saving status to Firestore: ", error);
    }
}

async function displayMessage(){
    try {
        const messageQuery = query(
            collection(db, dbName),
            where("date", "<=", today),
            orderBy("date")
        );
        const querySnapshot = await getDocs(messageQuery);
        

        const resultsDiv = $("body");
        
        let resultsString = "";
        resultsArray = [];
        let numEntry = 0;
        let entryStatus;

        querySnapshot.forEach((doc) => {
            const messageObject = doc.data();
            const message = convertText(messageObject.message);
            let date = messageObject.date;
            if(date.length>10)
                date = date.substring(0, date.length-2);
            //console.log(date);
            const book = messageObject.book;
            const read = messageObject.read;
            const messageId = doc.id;
            
            if(!(message.includes("Originally A"))){
                numEntry++;
                entryStatus = "#" + numEntry;
            }
            else{
                entryStatus = "repeat";
            }
            
            resultsArray.push({entry:entryStatus, id:messageId, m:message, d:date, b:book, r:read});
        });
        last = resultsArray.length-1;
        
        let statusStyle = resultsArray[last].r?" class='read'":"";
        let hug = nightMode?"W":"B";
        
        resultsString += `
            <div id="view_port">
                <div id="header_spacer"></div>
                <div id="message_wrapper">
                    <div id="message">
                        ${resultsArray[last].m}
                    </div>
                    <img id="hug" src="img/hugArms${hug}.png">
                </div>
                <div id="footer_spacer"></div>
            </div>
            <div id="header">
                <div class="entry_num">${resultsArray[last].entry}</div>
                <div id="quote_date">${dateToString(resultsArray[last].d)}</div>
                <div id="countersWrapper"></div>
            </div>
            <div id="footer">
                <div id="book">${resultsArray[last].b}</div>
                <div id="quote_status"${statusStyle}></div>
                <div id="button_wrapper">
                    <div id="left" arrow>&lt;</div>
                    <div id="right" class="fade" arrow>&gt;</div>
                </div>
            </div>
        `;
        resultsDiv.html(resultsString);
        
        addCounter("#countersWrapper", "bday", "BEST day of the YEAR in", bDate);
        
        $("#left").click(function(){
            navigateMessage(-1);
        });
        
        $("#right").click(function(){
            navigateMessage(1);
        });
        
        $("#quote_status").click(function(){
            if(!$(this).hasClass("read")){
                console.log("updating");
                heartMessage();
            }
        })
        
        $("body").swipe({
            swipeLeft: function() {
                navigateMessage(1);
            },
            swipeRight: function() {
                navigateMessage(-1);
            },
            threshold: 50 // Adjust swipe sensitivity
        });
        
        console.log(resultsArray);
    } catch (error) {
        console.error("Error fetching quote: ", error);
    }
}