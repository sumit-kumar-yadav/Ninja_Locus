const passport = require('passport');
console.log('passport is loaded now');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


// authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email'
    },
    function(email, password, done){  // email and password are automatically passed
        // find a user and establish the identity
        User.findOne({email: email}, function(err, user)  {
            if (err){
                console.log('Error in finding user --> Passport');
                return done(err);
            }

            console.log(`############## ${user}`);
            if (!user || user.password != password){
                console.log('Invalid Username/Password');
                return done(null, false);  // returned to failureRedirect in users.js
            }

            return done(null, user);  // user is returned to passport.serializeUser()
        });
    }


));


// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    console.log(`************** ${user}`);
    console.log(user.id, 'and   ', user._id);  // both are same
    done(null, user.id);   // user.id is sent to session in index.js to encript cookie
});



// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null, user);
    });
});



module.exports = passport;