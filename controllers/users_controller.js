const User = require('../models/user');
const path = require('path');
const fs = require('fs');
const Friendship = require('../models/friendship');

// Render the profile
module.exports.profile = async function(req, res){
    let profileUser = await User.findById(req.params.id);

    let friendship;

    // Check if current user and the profile_user are friends or not
    // Find all the friendship of current user
    let existingFriendship = await Friendship.find({_id: {$in: req.user.friendships}});

    // If there exist atleast 1 friendship of current user
    if(existingFriendship){
        for(let i of existingFriendship){
            if((i.from_user == req.user.id && i.to_user == req.params.id)
                || (i.from_user == req.params.id && i.to_user == req.user.id)
            ){
                // They are friends !!
                console.log("They are friends");
                friendship = i;
            }
        }
    }

    return res.render('user_profile', {
        title: 'User Profile',
        profile_user: profileUser,
        friendship: friendship
    });

}

// Action for updating the profile
module.exports.update = async function(req, res){
    if(req.user.id == req.params.id){

        try{

            let user = await User.findById(req.params.id);
            // using multer
            User.uploadedAvatar(req, res, function(err){   // our statically created function inside user.js of models
                if(err){console.log('****** Multer Error: ', err)}

                // console.log(req.file);

                user.name = req.body.name;    // We would have not been able to use req.body without multer in case of file uploading form
                user.email = req.body.email;

                if(req.file){

                    // If user has already uploaded profile pic
                    if(user.avatar){  
                        // delete it from the file system
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    // this is saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }

                user.save();  // Important
                req.flash('success', 'Updated!');
                return res.redirect('back');
            })

        }catch(err){
            req.flash('error', err);
            return res.redirect('back');
        }

    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}



// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile')
    }

    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile')
    }
    
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        console.log('Password is incorrect');
        req.flash('error', 'Passwords did not match');
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){req.flash('error', err); return}

        console.log(user, typeof(user));
        if (!user){
            User.create(req.body, function(err, user){
                if(err){req.flash('error', err); return}

                console.log(`New user created ${user}`);
                req.flash('success', 'You have signed up, login to continue!');
                return res.redirect('/users/sign-in');
            })
        }else{
            console.log('User is already Signed Up');
            
            req.flash('success', 'User id already exist');
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

// Log out and destroy the session
module.exports.destroySession = function(req, res){
    req.logout();  // put by passport.js for us  :)
    req.flash('success', 'You have logged out!');
    req.session.destroy();

    return res.redirect('/');
}