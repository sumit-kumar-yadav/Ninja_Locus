
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
            user: 'kumarsumit0375@gmail.com',
            pass: 'codial@password'
        }
    },
    google_client_id: '526158861188-0n4fol3mrjhk24e8hkddp235jkrgd506.apps.googleusercontent.com', 
    google_client_secret: '-tds3hZQljXB-U-YNsKTyfpe', 
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",   // Authorized redirect URI as filled in google credential of this project
    jwt_secret: 'codeial'
}

const production = {
    name: 'production'
}

module.exports = development;