const User = require('../models/user');
const PasswordReset = require('../models//password_reset');
const crypto = require('crypto');   // To generate random string i.e accessToken
const resetPasswordMailer = require('../mailers/reset_password_mailer');
const queue = require('../config/kue');
const resetPasswordWorker = require('../workers/reset_password_worker')


// Action for rendering the forgot password page
module.exports.forgotPassword = function(req, res){
    return res.render('forgot_password',{
        title: "Codeial | Home"
    });
}

// Action for matching the username i.e (email)
module.exports.recoverPassword = function(req, res){
    User.findOne({email: req.body.email}, function(err, user){
        if(err){
            console.log('Error in finding the user for forgot password', err);
            return;
        }

        if(user){
            // console.log(user);

            // Create password reset schema for this user and send a email to recover password
            PasswordReset.create({
                user: user.id,
                accessToken: crypto.randomBytes(20).toString('hex'),   // To generate random string i.e accessToken
                isValid: 'true'
            }, function(err, passwordReset){
                if(err){
                    console.log('Error in cresting passwordReset schema', err);
                    return;
                }
                console.log(passwordReset);

                // send a email to recover password
                // resetPasswordMailer.newPassword({user: user, accessToken: passwordReset.accessToken});
                // Create a worker named (--> recover) and assign the job to it
                let job = queue.create('recover', {user: user, accessToken: passwordReset.accessToken}).save(function(err){
                    if (err){
                        console.log('Error in sending to the queue', err);
                        return;
                    }
                    console.log('job enqueued', job.id);

                })

                req.flash('success', 'Check your email.');
                return res.redirect('back');
            })
        }
        else{
            req.flash('error', 'Email did not match');
            return res.redirect('back');
        }
    })
    
}

// Action for reset password form
module.exports.resetPasswordForm = function(req, res){
    PasswordReset.findOne({accessToken: req.query['access-token']}, function(err, passwordReset){
        if(err){
            console.log('Error in fetching the token from database', err);
            return;
        }
        if(passwordReset){
            return res.render('reset_password',{
                title: "Codeial | Home",
                token: passwordReset
            });

        }else{
            console.log('Unauthorized.. Token expired');
            return res.status(401).send('Unauthorized');
        }
    })
}

// Action for resetting the password
module.exports.resetPassword = async function(req, res){
    try{
        let passwordReset = await PasswordReset.findOne({accessToken: req.params.token});
        
        // If token is present and valid
        if(passwordReset && passwordReset.isValid === 'true'){
            // If password and confirm-password  match
            if(req.body.password === req.body['confirm-password']){
                let user = await User.findByIdAndUpdate(passwordReset.user, {password: req.body.password});
                console.log('Password changed successfully', user);

                // Remove the validity of the access token
                await PasswordReset.findByIdAndUpdate(passwordReset.id, {isValid: 'false'});

                req.flash('success', 'Password changed successfully');
                return res.redirect('/');

            }else{
                req.flash('error', 'Passwords did not match');
                return res.redirect('back');
            }

        }else{
            console.log('Unauthorized');
            return res.status(401).send('Unauthorized');
        }

    }catch(err){
        console.log('Error in fetching the token from database', err);
        req.flash('error', err);
        return;
    }
    
}