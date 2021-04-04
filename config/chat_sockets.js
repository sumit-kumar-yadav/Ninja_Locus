
module.exports.chatSockets = function(socketServer){
    // Receive a req for connection 
    let io = require('socket.io')(socketServer);

    io.sockets.on('connection', function(socket){  // and then also acknowledge to the client after connection is detected
        console.log('new connection received', socket.id);

        socket.on('disconnect', function(){
            console.log('socket disconnected!');
        });

    });

}