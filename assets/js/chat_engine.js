class ChatEngine{
    constructor(chatBoxId, userEmail){
        this.chatBox = $(`#${chatBoxId}`);
        this.userEmail = userEmail;

        // Send a req for connection
        this.socket = io.connect('http://localhost:5000');

        if (this.userEmail){
            this.connectionHandler();
        }

    }


    connectionHandler(){
        let self = this;

        this.socket.on('connect', function(){
            console.log('connection established using sockets...!');


            self.socket.emit('join_room', {  // data is sent along with emit name
                user_email: self.userEmail,
                chatroom: 'codeial'   // Room name
            });

            self.socket.on('user_joined', function(data){
                console.log('a user joined!', data);
            })


        });
    }
}