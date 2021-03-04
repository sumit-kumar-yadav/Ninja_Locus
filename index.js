const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 800;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo').default;



app.use(express.urlencoded());

app.use(cookieParser());

//Setting static files
app.use(express.static('./assets'));

// Setting layouts for our page
app.use(expressLayouts);
// Extract styles and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


// mongo-session is used to store the session cookie iin the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,    
    resave: false,  // Don't save same data again and again
    cookie: {   // Timeout of the session in millisec, bro try kroo save krke.... ok____ it's still throwing error
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb://localhost/codeial_development',
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err || 'connect-mongo setup ok');
        })
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);


// use express router
app.use('/', require('./routes'));  // OR  (./routes/index.js)  -->> /index.js is added by default :)


app.listen(port, function(err){
    if (err){
        // console.log('Error in running the server: ', err);
        console.log(`Error in running the server: ${err}`); // interpolation
    }

    console.log(`Server is running on port: ${port}`);
});
