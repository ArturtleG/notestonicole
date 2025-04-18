import { collection, addDoc, updateDoc, getDocs, deleteDoc, doc, query, orderBy} 
  from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

import { db, dbName } from "./firebaseSetup.js";

let resultsArray;
let toBeDeleted;

$("#date_input").flatpickr();

async function displayAllMessages(scrollTo = "today"){
    console.log("DISPLAYING ALL");
    try {
        const messageQuery = query(
            collection(db, dbName),
            orderBy("date")
        );
        
        const querySnapshot = await getDocs(messageQuery);
        

        const resultsDiv = $("#messages_display");
        
        let resultsString = "";
        resultsArray = [];
        let numEntry = 1;

        querySnapshot.forEach((doc) => {
            const messageObject = doc.data();
            const message = convertText(messageObject.message);
            //const date = messageObject.date;
            const date = messageObject.date;
            const book = messageObject.book;
            const read = messageObject.read;
            const messageId = doc.id;
            
            let todayClass = isToday(date)?" today":"";
            
            let statusStyle = read?" read":"";
        
            resultsString += `
                <div class='edit_message_wrapper${todayClass}' messageid='${messageId}' date='${date}'>
                    <div class='edit_header_wrapper'>
                        <div class="quote_date" editable>${date}</div>
                        <div class='button' button='edit'>edit</div>
                        <div class='button' button='submit'>submit</div>
                        <div class='button' button='cancel'>cancel</div>
                        <div class="delete_entry button">X</div>
                    </div>
                    <div class="message_wrapper">
                        <div class="message" to_edit editable>${message}</div>
                        <div class="book" to_edit editable>${book}</div>
                        <div class="quote_status${statusStyle}"></div>
                    </div>
                </div>
            `;
        });
        
        resultsDiv.html(resultsString);
        
        $('.edit_message_wrapper .button').click(function(){
            let whichButton = $(this).attr("button");
            let parent = $(this).closest(".edit_message_wrapper");
            if(whichButton == "edit"){
                $(this).hide();
                $("[button='submit']", parent).show();
                $("[button='cancel']", parent).show();
                $("[to_edit]", parent).attr("contenteditable", "true");
                $("[editable]", parent).addClass("editable");
                $(".quote_date", parent).flatpickr({
                    dateFormat: "Y-m-d",
                    defaultDate: $(".quote_date", parent).text().trim(),
                    disableMobile: true,
                    onChange: function(selectedDates, dateStr) {
                        // Update the div's text when a new date is selected
                        $(".quote_date", parent).text(dateStr);
                    }
                });
                
            }
            else if(whichButton == "submit"){
                $("[to_edit]", parent).attr("contenteditable", "false");
                $("[editable]", parent).removeClass("editable");
                submitEdit(parent);
            }
            else if(whichButton == "cancel"){
                $(this).hide();
                $("[button='submit']", parent).hide();
                $("[button='edit']", parent).show();
                $("[to_edit]", parent)
                $("[to_edit]", parent).attr("contenteditable", "false");
                $("[editable]", parent).removeClass("editable");
                const flatpickrInstance = $(".quote_date", parent)[0]._flatpickr;
                if (flatpickrInstance) {
                    flatpickrInstance.destroy();
                }
            }
            else{
                toBeDeleted = $(parent).attr("messageid");
                console.log(toBeDeleted);
                $("#modal_wrapper").removeClass("no_display");
                $("#erase_message_wrapper").removeClass("no_display");
            }
        });
        
        let target;
        
        if(scrollTo == "today"){
            target = $("#messages_display .today");
        }
        else{
            target = $('[messageid="' + scrollTo + '"]'); // Find the element with the specific attribute
        }
        
        console.log(target);
        console.log(target.length);
        
        if (target.length) {
            console.log(target.offset().top - 100);
            $('html, body').animate(
                { scrollTop: target.offset().top - 100}, // Animate scroll to the element's top offset
                'slow'
            );
        }
        else{
            console.log($(document).height() - $(window).height());
            $('html, body').animate(
                { scrollTop: $(document).height() - $(window).height() }, // Scroll to bottom
                'slow'
            );
        }
        
    } catch (error) {
        console.error("Error fetching quote: ", error);
    }
}

async function submitEdit(parent){
    try {
        
        let messageid = $(parent).attr("messageid");
        console.log(messageid);

        let updatedDate = $(".quote_date", parent).text().trim();
        let updatedMessage = $(".message", parent).html().trim();
        let updatedBook = $(".book", parent).text().trim();

        const messageRef = doc(db, dbName, messageid);

        await updateDoc(messageRef, {
            date: updatedDate,
            message: updatedMessage,
            book: updatedBook
        });
        
        displayAllMessages(messageid);

        console.log("Message updated successfully!");

    } catch (error) {
        console.error("Error updating the message: ", error);
    }
}

async function submitNew(){
    try {
        // Capture input values for the new message
        const newDate = $("#date_input").val().trim(); // Date input
        const newMessage = `${$("#message_input").val().trim()}`; // Message input
        const newSource = $("#source_input").val().trim(); // Book input

        if (!newDate || !newMessage || !newSource) {
            return;
        }

        const newDocRef = await addDoc(collection(db, dbName), {
            date: newDate,
            message: newMessage,
            book: newSource,
            read: false, // Default value for a new message
        });

        console.log("New message added with ID:", newDocRef.id);

        $("#date_input").val("");
        $("#message_input").val("");
        $("#source_input").val("");
        
        $("#modal_wrapper").addClass("no_display");
        $("#new_message_wrapper").addClass("no_display");

        // Optionally, refresh the message display
        displayAllMessages(newDocRef.id);

    } catch (error) {
        console.error("Error adding new message: ", error);
    }
}

$("#all_messages_button").click(function(){
    displayAllMessages();
});

//NEW MESSAGE
$("#new_message_button").click(function(){
    $("#modal_wrapper").removeClass("no_display");
    $("#new_message_wrapper").removeClass("no_display");
})

$("#submit_new_button").click(function(){
    submitNew();
});

$("#cancel_new_button").click(function(){
    $("#modal_wrapper").addClass("no_display");
    $("#new_message_wrapper").addClass("no_display");
});

$("#no_delete").click(function(){
    $("#modal_wrapper").addClass("no_display");
    $("#erase_message_wrapper").addClass("no_display");
});

$("#yes_delete").click(async function(){
    await deleteMessage(toBeDeleted);
})


async function deleteMessage(drinkId) {
    try {
        const drinkRef = doc(db, dbName, drinkId);
        await deleteDoc(drinkRef);
        $("#modal_wrapper").addClass("no_display");
        $("#erase_message_wrapper").addClass("no_display");
        displayAllMessages(); // Refresh the displayed list
    } catch (error) {
        console.error("Error deleting drink: ", error);
    }
}