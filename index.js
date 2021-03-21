const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo').default;
const sassMiddleware =require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');


// Note: you must place sass-middleware *before* `express.static` or else it will not work.
app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,  //  Put false in production mode
    outputStyle: 'extended',  // To not show in one line
    prefix: '/css'   // Important --- Where prefix is at <link rel="stylesheets" href="/css/style.css"/>
}));



app.use(express.urlencoded());

app.use(cookieParser());

//Setting static files
app.use(express.static('./assets'));

// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

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

app.use(flash());  // Use only after session is used
app.use(customMware.setFlash);


// use express router
app.use('/', require('./routes'));  // OR  (./routes/index.js)  -->> /index.js is added by default :)


app.listen(port, function(err){
    if (err){
        // console.log('Error in running the server: ', err);
        console.log(`Error in running the server: ${err}`); // interpolation
    }

    console.log(`Server is running on port: ${port}`);
});
