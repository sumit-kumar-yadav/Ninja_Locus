const nodeMailer = require('../config/nodemailer');


// this is another way of exporting a method
exports.newComment = (comment) => {
    console.log('inside newComment mailer', comment);

    nodeMailer.transporter.sendMail({
       from: 'kumarsumit0375@gmail.com',
       to: comment.user.email,  // to the commenter. For sending to the post owner use comment.post.user.email
       // for multiple participants-->> to: 'first_email, second_email',
       subject: "New Comment Published!",
       html: '<h1>Yup, your comment is now published!</h1>' 
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
        return;
    });
}