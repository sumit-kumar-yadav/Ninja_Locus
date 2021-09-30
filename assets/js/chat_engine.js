console.log("chat_engine.js file is loaded !");

class ChatEngine{
    constructor(chatBoxId, userEmail, userId, userName){
        console.log(userId, "userId");
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userName = userName;
        this.userId = userId;
        this.timer = null;
        // this.room = '';

        // Send a req for connection
        this.socket = io.connect('http://ninjalocus.com:5000');

        if (this.userEmail){
            this.connectionHandler();
        }

    }


    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!', self.userId);

            self.socket.emit('loggedin', self.userId);
            // $('#user-chat-box').hide();

        });

        self.socket.on('invite', function(data) {
            console.log("Invitation received to join a room");
            // self.room = data.room.room;
            console.log("Invition accepted to join the room");
            self.socket.emit("joinRoom", data);
            let element = $(`span[data-room="${data.room.room}"]`);
            element.attr('data-room-created', 'true');  // Set that room is created/joined
        });

        // Send a message on clicking the send message button
        $('#chat-message-input-container').submit(async function(e){
            e.preventDefault();

            let msg = $('#chat-message-input').val();

            console.log("After mgs is clicked: ");
            let room = $('#chat-message-input-container button').attr('data-room');
            
            if (msg != '' && room != 'null'){
                
                // Ajax call to store the message sent
                $.ajax({
                    type: 'post',
                    url: '/chats/create',
                    data: $('#chat-message-input-container').serialize(),
                    success: function(data){
                        console.log(`message sent ${data}`);
                       
    
                        new Noty({
                            theme: 'relax',
                            text: "Message Sent!",
                            type: 'success',
                            layout: 'topRight',
                            timeout: 1500
                            
                        }).show();
    
    
                    }, error: function(error){
                        console.log(error.responseText);
                    }
                });

                // emit to send the message
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    user_name: self.userName,
                    user_id: self.userId,
                    room: room
                });

                $('#chat-message-input').val(''); // Empty the input box
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);
            // $('#user-chat-box').show();  // Show the chatbox if it's not showing

            let currentChatboxRoom = $('#chat-message-input-container button').attr('data-room');
            
            // If user has opened the same chatbox room
            if(currentChatboxRoom == data.room){
                // Fill the data and show the mgs
                let newMessage = $('<li>');

                let messageType = 'other-message';

                // if message is sent by self
                if (data.user_email == self.userEmail){
                    messageType = 'self-message';

                    // Append own image
                    newMessage.append($(`
                        <img src='${$('#nav-avatar').attr('src')}' alt="image">
                    `));
                }else{
                    // Append sender's image
                    newMessage.append($(`
                        <img src='${$('#chat-box-friend-name-container img').attr('src')}' alt="image">
                    `));
                }

                newMessage.append($('<span>', {
                    'html': data.message
                }));

                newMessage.append($('<sub>', {
                    'html': data.user_email
                }));

                newMessage.addClass(messageType);

                $('#chat-messages-list').append(newMessage);

                // Scroll up for the new meesage
                let chatMessagesList = document.getElementById('chat-messages-list');
                chatMessagesList.scrollBy(0, newMessage.height() + 10);

                // Mark messages as read
                self.readMessages(data.room, data.user_id);

            }else{  // if(currentChatboxRoom == 'null')  i.e refreshed,   else if chatting with someone else
                // Show him the notification of mgs to chat
                let element = $(`span[data-room="${data.room}"] i`);
                element.removeClass('remove-new-message-icon');
                console.log("class removed");

                new Noty({
                    theme: 'relax',
                    text: `Message from ${data.user_name}`,
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
                new Noty({
                    theme: 'relax',
                    text: `Check in Ninjas`,
                    type: 'success',
                    layout: 'topRight',
                    timeout: 1500
                }).show();
            }
        })

    }

    // Called when friend name is clicked on _users_section.ejs page in chat
    createRoom(friendId, friendsName){
        console.log("createRoom function is called with friendId", friendId, event.target);
        // If room is already created
        let isRoomExist = $(`#chat-${friendId} span`).attr('data-room-created');
        console.log("isRoomExist value: ", isRoomExist, $(`#chat-${friendId} span`));
        let room = $(`#chat-${friendId} span`).attr('data-room');
        if(isRoomExist == 'false'){
            console.log("Room created successfully by you, room is: ", room);
            this.socket.emit('create', {room: room, userId: this.userId, withUserId: friendId});
            $(`#chat-${friendId} span`).attr('data-room-created', 'true');  // Set that room is created
            this.openChatWindow(room, friendId, friendsName, event.target);
        }else{
            console.log("Room already exists");
            this.openChatWindow(room, friendId, friendsName, event.target);
        }

            // Remove the new mgs notification next to name if there.
            let element = $(`span[data-room="${room}"] i`);
            element.addClass('remove-new-message-icon');
    
        }    

    openChatWindow(room, friendId, friendsName, targetElement){
        $('#chat-messages-list').html('');  // Empty the lists of chats
        $('#user-chat-box').show();
        $('#chat-message-input-container button').attr('data-room', room);  // set the data-roo attr of send button of chat box
        $('#chat-with-friend').val(friendId);   // set the value of the chat-with-friend input of chat box
        $('#chat-box-friend-name').html(friendsName);
        console.log("Target element is : ", $(targetElement).attr('data-avatar-url'));
        let friendsAvatarURL = $(targetElement).attr('data-avatar-url')
        if(friendsAvatarURL){
            $('#chat-box-friend-name-container img').attr('src', `${friendsAvatarURL}`);
        }
        console.log("New chat window opened");

        // Create a dummy history so that when back button is clicked in mobile then this dummy history is deleted not original one
        window.history.pushState({id:1}, null, `?name=${friendsName}&u=extra`);

        // Make an ajax call and fetch all the chats between the users and then append in the chat window
        this.fillChats(friendId);

        // Mark the unread messages as read
        this.readMessages(room, friendId);

    }

    fillChats(friendId){
        let self = this;
        // Ajax call and fill the chats
        $.ajax({
            type: 'get',
            url: '/chats',
            data: {friendId: friendId},
            success: function(data){
                console.log(`message received ${data}`);

                for(let chat of data.data.chats){
                    // Fill the chats and show the mgs
                    let newMessage = $('<li>');

                    let messageType = 'other-message';

                    if (chat.from_user._id == self.userId){
                        messageType = 'self-message';
                    }

                    // Append the image
                    newMessage.append($(`
                        <img src=${chat.from_user.avatar} alt="image" onerror="this.onerror=null;this.src='/images/Users-avatar.png';">
                    `));

                    newMessage.append($('<span>', {
                        'html': chat.message
                    }));

                    newMessage.append($('<sub>', {
                        'html': `${new Date(chat.from_user.createdAt).toString().substring(4,16)}` + 'at' + new Date(chat.from_user.createdAt).toString().substring(16, 21) 
                    }));

                    newMessage.addClass(messageType);

                    $('#chat-messages-list').append(newMessage);
                }

                // Scroll to the bottom of chat
                self.scrollToBottom();

                // Stop the loading animation
                $('#chat-loading-animaiton').hide();

            }, error: function(error){
                console.log(error.responseText);
            }
        });

    }

    // Called when message is read (from openChatWindow function and receive_message emit)
    readMessages(room, friendId){
        console.log("under readMessages function: ", friendId);
        $.ajax({
            type: 'get',
            url: '/chats/readMessages',
            data: {friendId: friendId},
            success: function(data){
                if(data.data.read){
                    // Add the remove-new-message-icon class
                    let element = $(`span[data-room="${room}"] i`);   // TODO
                    element.addClass('remove-new-message-icon');
                }
            },
            error: function(err){
                console.log(error.responseText);
            }
        });
    }  

    scrollToBottom(){
        let chatMessagesList = document.getElementById('chat-messages-list');
        chatMessagesList.scrollTop = (chatMessagesList.scrollHeight - chatMessagesList.clientHeight);
    }

    // If friend refreshes his/her website in between chat then this function will make him join the room again
    // Called from the onchange event of #chat-message-input of chat box
    emitToRejoin(){
        console.log("input changed");
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
        let friendId = $('#chat-with-friend').val();
        let room = $('#chat-message-input-container button').attr('data-room');
        this.socket.emit('create', {room: room, userId: this.userId, withUserId: friendId});
        console.log("Joining req resent");
        }, 300);
    }

}


// Check if friend's messages are read or not
function unreadMessages(){
    console.log("unreadmessages function is called");
    $('.friends-of-user span').each(function(){
        let self = $(this);
        let friendId = self.attr('data-friendId');
        let room = self.attr('data-room');
        
        $.ajax({
            type: 'get',
            url: '/chats/checkUnreadMessages',
            data: {friendId: friendId},
            success: function(data){
                console.log("inside unreadMessages", data.data.unread);
                if(data.data.unread){
                    // Remove the remove-new-message-icon class
                    let element = $(`span[data-room="${room}"] i`);
                    element.removeClass('remove-new-message-icon');
                }else{
                    let element = $(`span[data-room="${room}"] i`);
                    element.addClass('remove-new-message-icon');
                }
            },
            error: function(err){
                console.log(error.responseText);
            }
        })
    })
}
unreadMessages();


