console.log("chat_engine.js file is loaded");

class ChatEngine{
    constructor(chatBoxId, userEmail, userId, userName){
        console.log(userId, "userId");
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userName = userName;
        this.userId = userId;
        // this.room = '';

        // Send a req for connection
        this.socket = io.connect('http://localhost:5000');

        if (this.userEmail){
            this.connectionHandler();
        }

    }


    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!', self.userId);

            self.socket.emit('loggedin', self.userId);
            $('#user-chat-box').hide();

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
        $('#chat-message-input-container').submit(function(e){
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
            $('#user-chat-box').show();  // Show the chatbox if it's not showing

            // TODO: Make an ajax call and fetch all the chats between the users and then append in the chat window

            let currentChatboxRoom = $('#chat-message-input-container button').attr('data-room');
            // If either user is sitting idle or has opened the same chatbox room
            if(currentChatboxRoom == 'null' || currentChatboxRoom == data.room){
                // Fill the data and show the mgs
                let newMessage = $('<li>');

                let messageType = 'other-message';

                if (data.user_email == self.userEmail){
                    messageType = 'self-message';
                }

                newMessage.append($('<span>', {
                    'html': data.message
                }));

                newMessage.append($('<sub>', {
                    'html': data.user_email
                }));

                newMessage.addClass(messageType);

                $('#chat-messages-list').append(newMessage);

                // Set the data-room of the chat box as data.room (Useful in case it was null)
                $('#chat-message-input-container button').attr('data-room', data.room);
                $('#chat-with-friend').val(data.user_id);
                if(self.userName != data.user_name){
                    $('#chat-box-friend-name').html(data.user_name);
                }

            }else{
                // Show him the notification of mgs to chat
                let element = $(`span[data-room="${data.room}"]`);
                element.append('<b> &ensp; mgs </b>');
            }
        })

    }

    // Called when friend name is clicked on home page in chat
    createRoom(friendId, friendsName){
        console.log("createRoom function is called with friendId", friendId);
        // If room is already created
        let isRoomExist = $(`#chat-${friendId} span`).attr('data-room-created');
        console.log("isRoomExist value: ", isRoomExist, $(`#chat-${friendId} span`));
        let room = $(`#chat-${friendId} span`).attr('data-room');
        if(isRoomExist == 'false'){
            console.log("Room created successfully by you, room is: ", room);
            this.socket.emit('create', {room: room, userId: this.userId, withUserId: friendId});
            $(`#chat-${friendId} span`).attr('data-room-created', 'true');  // Set that room is created
            this.openChatWindow(room, friendId, friendsName);
        }else{
            console.log("Room already exists");
            this.openChatWindow(room, friendId, friendsName);
            // TODO -> Remove the mgs text next to name if there. Better use class and remove it/add it.
        }
    }    

    openChatWindow(room, friendId, friendsName){
        $('#chat-messages-list').html('');  // Empty the lists of chats
        $('#user-chat-box').show();
        $('#chat-message-input-container button').attr('data-room', room);  // set the data-roo attr of send button of chat box
        $('#chat-with-friend').val(friendId);   // set the value of the chat-with-friend input of chat box
        $('#chat-box-friend-name').html(friendsName);
        console.log("New chat window opened");

        // TODO: Make an ajax call and fetch all the chats between the users and then append in the chat window
        this.fillChats(friendId);

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

                    console.log("chat.from_user._id", chat.from_user._id);
                    console.log("xyxyyxyxyxy", self.userId);
                    if (chat.from_user._id == self.userId){
                        messageType = 'self-message';
                    }

                    newMessage.append($('<span>', {
                        'html': chat.message
                    }));

                    newMessage.append($('<sub>', {
                        'html': "sender email"
                    }));

                    newMessage.addClass(messageType);

                    $('#chat-messages-list').append(newMessage);
                }

            }, error: function(error){
                console.log(error.responseText);
            }
        });
    }

}










// class ChatEngine{
//     constructor(chatBoxId, userEmail){
//         this.chatBox = $(`#${chatBoxId}`);
//         this.userEmail = userEmail;

//         // Send a req for connection
//         this.socket = io.connect('http://localhost:5000');

//         if (this.userEmail){
//             this.connectionHandler();
//         }

//     }


//     connectionHandler(){
//         let self = this;

//         this.socket.on('connect', function(){
//             console.log('connection established using sockets...!');


//             self.socket.emit('join_room', {  // data is sent along with emit name
//                 user_email: self.userEmail,
//                 chatroom: 'codeial'   // Room name
//             });

//             self.socket.on('user_joined', function(data){
//                 console.log('a user joined!', data);
//             })


//         });

//         // CHANGE :: send a message on clicking the send message button
//         $('#send-message').click(function(){
//             let msg = $('#chat-message-input').val();

//             if (msg != ''){
//                 self.socket.emit('send_message', {
//                     message: msg,
//                     user_email: self.userEmail,
//                     chatroom: 'codeial'
//                 });
//             }
//         });

//         self.socket.on('receive_message', function(data){
//             console.log('message received', data.message);


//             let newMessage = $('<li>');

//             let messageType = 'other-message';

//             if (data.user_email == self.userEmail){
//                 messageType = 'self-message';
//             }

//             newMessage.append($('<span>', {
//                 'html': data.message
//             }));

//             newMessage.append($('<sub>', {
//                 'html': data.user_email
//             }));

//             newMessage.addClass(messageType);

//             $('#chat-messages-list').append(newMessage);
//         })

//     }
// }