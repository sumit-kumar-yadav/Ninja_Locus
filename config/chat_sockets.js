const clientSocketIds = require('../models/socket');

module.exports.chatSockets = function(socketServer, options){
    // Receive a req for connection 
    let io = require('socket.io')(socketServer, options);


    // Returns array of socket id correcponding to a user id
    const getSocketByUserId = async function(id){
        let sockets = await clientSocketIds.find({ userId: id });
        return sockets;
    }

    io.sockets.on('connection', function(socket){  // and then also acknowledge to the client after connection is detected
        console.log('new connection received', socket.id);

        socket.on('loggedin', async function(userId) {
            console.log("on logged in : ", userId);

            // Delete the previous socket of user id if present ( TODO: Remove this for multiple device and delete it when user signs out using ajax )
            await clientSocketIds.deleteMany({ userId: userId });
            
            // Store the new socket id and correcponding user id
            let sockets = await clientSocketIds.create({
                socketId: socket.id,
                userId: userId
            });

            // Print all the sockets and corresponding users on the terminal
            let allSockets = await clientSocketIds.find({});
            console.log('All Sockets are: ', allSockets);
        });

        // Create the room and join if chat is initialized by the user after clicking the name
        socket.on('create', async function(data) {
            console.log("create room")
            socket.join(data.room);  // User joined the room

            // Get the sockets of the user's friend and ask him to join same room
            let sockets = await getSocketByUserId(data.withUserId);
            if(sockets.length > 0){
                for(i of sockets){
                    socket.broadcast.to(i.socketId).emit("invite",{room:data});
                }
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

        socket.on('disconnect', async function(){
            let sockets = await clientSocketIds.findOneAndDelete({socketId: socket.id});
            console.log('socket disconnected!', sockets);
        });

        socket.on('disconnecting', function(){
            // console.log(socket.rooms); // This set contains atleast the socket.id
            // for(let room of rooms){
            //     // socket.leave(room); -->> No need to do this as this is done as soon as socket disconnects
            // }
        })

    });

}