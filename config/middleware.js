const User = require('../models/user');

const env = require('./environment');
const fs = require('fs');
const path = require('path');



// For flash messages
module.exports.setFlash = function(req, res, next){
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
    }

    next();
}

// For Default User Avatar
module.exports.setNewPathOfDefaultAvatar = function(req, res, next){
    // console.log("req url is: ", req.url);
    if(env.name == 'production' && req.url == '/images/Users-avatar.png'){
        let newfilePath = req.url.substr(1);
        req.url = '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[newfilePath];
        // console.log("new url is: ", req.url);
    }
    next();
}

// Middleware to put form data in the req.body along with avatar & upload avatar and put it's details in req.file
module.exports.uploadAvatar = function(req, res, next){
    if(req.user.id == req.params.id){

        // Upload avatar and put it's details in req.file
        User.uploadedAvatar(req, res, function(err){  // our statically created function inside user.js of models
            if(err){
                console.log('****** Multer Error: ', err);
                // console.log(req.file);

                req.flash('error', ' Image upload failed');
                return res.redirect('back');
            }
            next();
        })
        
    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}