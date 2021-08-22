const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

// path where logs are saved
const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);  // Create if not exists

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});




const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: 'blahsomething',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,  // for TLS
        secure: false,
        auth: {
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID, 
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET, 
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,   // Authorized redirect URI as filled in google credential of this project
    jwt_secret: 'codeial',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }

}

const production = {
    name: 'production',
    asset_path: '/' + process.env.CODEIAL_ASSET_PATH,
    // asset_path: process.env.CODEIAL_ASSET_PATH  ->> Saved value as /assets & run server in powershell instead of in git bash of vs code -->> Works fine
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,  // for TLS
        secure: false,
        auth: {
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID, 
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET, 
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,   // Authorized redirect URI as filled in google credential of this project
    jwt_secret: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }

}

// module.exports = development;
module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);