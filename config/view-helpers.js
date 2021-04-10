
const env = require('./environment');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {

    // Put assetPath function in the locals of views via app
    app.locals.assetPath = function(filePath){
        if (env.name == 'development'){
            return '/' + filePath;  // i.e fetch assets from assets folder which are not renamed
        }

        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath];
    }
}