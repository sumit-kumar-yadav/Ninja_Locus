const mongoose = require('mongoose');


const chatSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean
    },
    from_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    to_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;




                                // Other Ideas

// const chatSchema = new mongoose.Schema({
//     friendship: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Friendship'
//     },
//     messages: [{
//         content: {
//             type: String,
//             required: true 
//         },
//         sender: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User'
//         }
//     }]
// },{
//     timestamps: true
// });


// var ChatSchema = new Schema({
//     sender : {
//         type : mongoose.Schema.Types.ObjectId,
//         ref : 'User'
//     },
//     messages : [
//         {
//             message : String,
//             meta : [
//                 {
//                     user : {
//                         type : mongoose.Schema.Types.ObjectId,
//                         ref : 'User'
//                     },
//                     delivered : Boolean,
//                     read : Boolean
//                 }
//             ]
//         }
//     ],
//     is_group_message : { type : Boolean, default : false },
//     participants : [
//         {
//             user :  {
//                 type : mongoose.Schema.Types.ObjectId,
//                 ref : 'User'
//             },
//             delivered : Boolean,
//             read : Boolean,
//             last_seen : Date
//         }
//     ]
// });


