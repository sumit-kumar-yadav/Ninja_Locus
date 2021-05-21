class ChatEngine{
    constructor(chatBoxId, userEmail, userId){
        console.log(userId, "userId");
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;
        this.userId = userId;
        this.room = '';

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
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            console.log("After mgs is clicked: ");
            let room = $('#chat-message-input-container button').attr('data-room');
            if (msg != '' && room != 'null'){
                $('#chat-message-input').val(''); // Empty the input box
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    room: room
                });
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);
            $('#user-chat-box').show();  // Show the chatbox if it's not showing

            let currentChatboxRoom = $('#chat-message-input-container button').attr('data-room');
            // If either user is sitting idle or has opened the same chatbox room
            if(currentChatboxRoom == 'null' || currentChatboxRoom == data.room){
                // Fill the data and show him the mgs
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

            }else{
                // Show him the notification of mgs to chat
                let element = $(`span[data-room="${data.room}"]`);
                element.append('<b> &ensp; mgs </b>');
            }
        })

    }

    // Called when friend name is clicked on home page in chat
    createRoom(id){
        console.log("createRoom function is called with id", id);
        // If room is already created
        let isRoomExist = $(`#chat-${id} span`).attr('data-room-created');
        console.log("isRoomExist value: ", isRoomExist, $(`#chat-${id} span`));
        let room = $(`#chat-${id} span`).attr('data-room');
        if(isRoomExist == 'false'){
            console.log("Room created successfully by you, room is: ", room);
            this.socket.emit('create', {room: room, userId: this.userId, withUserId: id});
            $(`#chat-${id} span`).attr('data-room-created', 'true');  // Set that room is created
            this.openChatWindow(room);
        }else{
            console.log("Room already exists");
            this.openChatWindow(room);
            // TODO -> Remove the mgs text next to name if there. Better use class and remove it/add it.
        }
    }    

    openChatWindow(room){
        // Open chat window  -->> TODO
        $('#user-chat-box').show();
        $('#chat-message-input-container button').attr('data-room', room);
        console.log("New chat window opened");
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