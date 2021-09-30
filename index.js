const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view-helpers')(app);
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


// setup the chat server to be used with socket.io
const chatServer = require('http').createServer(app);
const options = {
    cors: {
        origin: "http://ninjalocus.com",
        methods: ["GET", "POST"]
      }
};
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer, options);
chatServer.listen(5000, function(){
    console.log('chat server is listening on port 5000');
});


const path = require('path');
// Note: you must place sass-middleware *before* `express.static` or else it will not work.
if(env.name == 'development'){
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, '/scss'),
        dest: path.join(__dirname, env.asset_path, '/css'),
        debug: true,  //  Put false in production mode
        outputStyle: 'extended',  // To not show in one line
        prefix: '/css'   // Important --- Where prefix is at <link rel="stylesheets" href="/css/style.css"/>
    }));
}



app.use(express.urlencoded());  //app.use(express.urlencoded({extended: false}));

app.use(cookieParser());

// Set new path for defalut avatar in production mode  (Must be set before setting express static file path)
app.use(customMware.setNewPathOfDefaultAvatar);

//Setting static files
// app.use(express.static('.' + env.asset_path));
app.use(express.static(path.join(__dirname, env.asset_path)));

// make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));

// Middleware for logger (morgon)
app.use(logger(env.morgan.mode, env.morgan.options));

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
    secret: env.session_cookie_key,
    saveUninitialized: false,    
    resave: false,  // Don't save same data again and again
    // cookie: {   // Timeout of the session in millisec
    //     maxAge: (24 * 60 * 60 * 1000)
    // },
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb://localhost/codeial_development',
            ttl: 24 * 60 * 60, // = 1 day
            autoRemove: 'interval',
            autoRemoveInterval: 60 // In minutes.
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


// For running in windows change prod_start
// "scripts": {
//     "start": "nodemon index.js",
//     "test": "echo \"Error: no test specified\" && exit 1",
//     "prod_start": "SET NODE_ENV=production&& nodemon index.js"
//   }