const { validationResult } = require('express-validator');
const User = require('../models/user');
const UserInfo = require('../models/userInfo');


// Edit the profile page 
module.exports.editProfile = async function(req, res){
    if(req.user.id == req.params.id){

        try{
            // Finds the validation errors in this request and wraps them in an object with handy functions
            const expressValidatorError = validationResult(req);
            if (!expressValidatorError.isEmpty()) {
                // return res.status(400).json({ expressValidatorError: expressValidatorError.array() });
                let arrayOfErrors = expressValidatorError.array();
                if(arrayOfErrors[0].param == 'status'){     // If email is invalid
                    req.flash('error', 'Invalid Status');
                }else if(arrayOfErrors[0].param == 'name'){  // If incorrect format of name 
                    req.flash('error', 'Invalid Name');
                }
                return res.redirect('back');
            }

            // Find the user and update user info 
            let query = { user: req.user.id };
            let updateAddress = {}
            if(req.body.state && req.body.city){
                updateAddress = {
                    address: {
                        country: 'India',
                        state: req.body.state,
                        city: req.body.city
                    }
                }
            }
            let update = {
                user: req.user.id,
                ...updateAddress,
                ...req.body
            }
            let options = {upsert: true, new: true, setDefaultsOnInsert: true};

            let userInfo = await UserInfo.findOneAndUpdate(query, update, options);

            // Update the name of the user
            let user = await User.findByIdAndUpdate(req.user.id, {
                name: req.body.name,
                userInfo: userInfo.id
            });

            req.flash('success', 'Updated');
            return res.redirect('back');

        }catch(err){
            req.flash('error', 'Failed!! Try again');
            console.log("error while updating the profile", err);
            return res.redirect('back');
        }

    }else{
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}