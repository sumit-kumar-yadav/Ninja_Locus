const express = require('express');
const app = express();
const port = 8000;

// use express router
app.use('/', require('./routes'));  // OR  (./routes/index.js)  -->> /index.js is added by default :)



app.listen(port, function(err){
    if (err){
        // console.log('Error in running the server: ', err);
        console.log(`Error in running the server: ${err}`); // interpolation
    }

    console.log(`Server is running on port: ${port}`);
});
