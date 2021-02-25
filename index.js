const express = require('express');
const app = express();
const port = 800;
const expressLayouts = require('express-ejs-layouts');


app.use(expressLayouts);

// use express router
app.use('/', require('./routes'));  // OR  (./routes/index.js)  -->> /index.js is added by default :)

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.listen(port, function(err){
    if (err){
        // console.log('Error in running the server: ', err);
        console.log(`Error in running the server: ${err}`); // interpolation
    }

    console.log(`Server is running on port: ${port}`);
});
