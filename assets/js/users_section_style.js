
// Show the hidden content if button is clicked
function toggleHiddenContainer(headingButton){
    headingButton.click(function(e){
        let hiddenContainer = $(this).siblings(".hidden-container");
        // if hidden-container is closed
        if(hiddenContainer.attr('data-closed') == "true"){
            // Rotate up the dropdown icon
            $(' .more-option', $(this)).css({
                "transform": "rotateX(180deg)"
            })

            // Show the content
            hiddenContainer.css({
                "height": "auto",
                "max-height": "250px",
                "overflow-y": "scroll"
            });

            // set data-closed as false
            hiddenContainer.attr('data-closed', "false");

        }else{  // hidden-container is opened

            // Rotate down the dropdown icon
            $(' .more-option', $(this)).css({
                "transform": "rotateX(0deg)"
            })

            // Hide the content
            hiddenContainer.css({
                "height": "0px",
                "max-height": "0px",
                "overflow-y": "hidden"
            });

            // set data-closed as true
            hiddenContainer.attr('data-closed', "true");
        }

    });
}
$('#users-container .heading-button').each(function(){
    let self = $(this);
    toggleHiddenContainer(self);
});


function fillDummyInfo(){
    // Check if there is no received request then fill dummy data
    let receivedRequests = $('#users-received-requests .hidden-container .friends-of-user');
    if(receivedRequests.length == 0){
        $('#users-received-requests .hidden-container').html(`
            <p class="friends-of-user">
                No received request &#128546;
            </p>
        `)
    }

    // Check if there is no sent request then fill dummy data
    let sentRequests = $('#users-sent-requests .hidden-container .friends-of-user');
    if(sentRequests.length == 0){
        $('#users-sent-requests .hidden-container').html(`
            <p class="friends-of-user">
                No sent request &#129300;
            </p>
        `)
    }

    // Check if there is no friend then fill dummy data
    let friends = $('#users-friends .hidden-container .friends-of-user');
    if(friends.length == 0){
        $('#users-friends .hidden-container').html(`
            <p class="friends-of-user">
                No friends till now &#128566;
            </p>
        `)
    }

    // Check if there is no friend to chat then fill dummy data
    let chat = $('#users-chat .hidden-container .friends-of-user');
    if(chat.length == 0){
        $('#users-chat .hidden-container').html(`
            <p class="friends-of-user">
                Make friends and chat &#128519;
            </p>
        `)
    }
}
fillDummyInfo();