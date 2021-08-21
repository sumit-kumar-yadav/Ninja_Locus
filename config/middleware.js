const User = require('../models/user');

// For flash messages
module.exports.setFlash = function(req, res, next){
    res.locals.flash = {
        'success': req.flash('success'),
        'error': req.flash('error')
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