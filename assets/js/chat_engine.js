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

        });

        self.socket.on('invite', function(data) {
            console.log("Invitation received to join a room");
            self.room = data.room.room;
            console.log("joining room is: ", self.room);
            self.socket.emit("joinRoom", data);
        });

        // Send a message on clicking the send message button
        $('#send-message').click(function(){
            let msg = $('#chat-message-input').val();

            console.log("After mgs is clicked: ", self.room);
            if (msg != '' && self.room != ''){
                $('#chat-message-input').val(''); // Empty the input box
                self.socket.emit('send_message', {
                    message: msg,
                    user_email: self.userEmail,
                    room: self.room
                });
                // self.socket.emit('message', {room: room, message:message, from: loggedInUser});
            }
        });

        self.socket.on('receive_message', function(data){
            console.log('message received', data.message);
            $('#user-chat-box').show();


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
        })

    }

    // Called when friend name is clicked on home page in chat
    createRoom(id){
        console.log("createRoom function is called with id", id);
        // let loggedInUser = JSON.parse(sessionStorage.getItem('user'));
        this.room = Date.now() + Math.random();
        this.room = this.room.toString().replace(".","_");
        console.log("room is", this.room);
        this.socket.emit('create', {room: this.room, userId: this.userId, withUserId: id});
        this.openChatWindow(this.room);
    }    

    openChatWindow(room){
        // Open chat window  -->> TODO
        $('#user-chat-box').show();
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