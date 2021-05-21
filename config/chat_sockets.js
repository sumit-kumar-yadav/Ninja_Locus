
module.exports.chatSockets = function(socketServer, options){
    // Receive a req for connection 
    let io = require('socket.io')(socketServer, options);

    // To store the each client socket and user id
    let clientSocketIds = [];

    const getSocketByUserId = (id) =>{
        let socket = '';
        for(let i = 0; i<clientSocketIds.length; i++) {
            if(clientSocketIds[i].userId == id) {
                socket = clientSocketIds[i].socket;
                break;
            }
        }
        return socket;
    }

    io.sockets.on('connection', function(socket){  // and then also acknowledge to the client after connection is detected
        console.log('new connection received', socket.id);

        socket.on('loggedin', function(userId) {
            console.log("on logged in : ", userId);
            // Filter the clientSocketIds array if userId is already present
            clientSocketIds.filter(item => item.userId != userId);
            // Push the userId with updated socket
            clientSocketIds.push({socket: socket, userId:  userId});
            console.log("clientSocketIds is: ", clientSocketIds);
        });

        // Create the room and join if chat is initialized by the user after clicking the name
        socket.on('create', function(data) {
            console.log("create room")
            socket.join(data.room);  // User joined the room
            // Get the socket of the user's friend and ask him to join same room
            let withSocket = getSocketByUserId(data.withUserId);
            if(withSocket != ''){
                socket.broadcast.to(withSocket.id).emit("invite",{room:data});
            }else{
                console.log('Your friend is offline');
            }
        });

        socket.on('joinRoom', function(data) {
            socket.join(data.room.room);
            console.log("Your friend joined the chat room");
        });

        socket.on('send_message', function(data) {
            // socket.broadcast.to(data.room).emit('receive_message', data);   --> To send all except the sender itself
            io.in(data.room).emit('receive_message', data);
        })

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });

    });

}