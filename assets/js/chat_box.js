
// Whenever back button is pressed of the browser then this is called 
window.addEventListener("popstate", closeChatWindow);
function closeChatWindow(){
    // Hide the chat box
    $('#user-chat-box').hide();
    // Set the data-room of send button of chat box as null 
    $('#chat-message-input-container button').attr('data-room', null);
    $('#chat-with-friend').val(null);
}

// Called when close button is clicked in chat window
function closeCurrentChatWindow(){
    window.history.back(); // Since back buttin is not clicked, we need to pop back our custom history
    closeChatWindow();
}