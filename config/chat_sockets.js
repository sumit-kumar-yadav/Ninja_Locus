
module.exports.chatSockets = function(socketServer){
    // Receive a req for connection 
    let io = require('socket.io')(socketServer);

    io.sockets.on('connection', function(socket){  // and then also acknowledge to the client after connection is detected
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });

        socket.on('join_room', function(data){
            console.log('joining request rec.', data);

            // Join the room if already exists, else create and then join automatically
            socket.join(data.chatroom);

            // Emit in the same room 
            io.in(data.chatroom).emit('user_joined', data);
        })

    });

}