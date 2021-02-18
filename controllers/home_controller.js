module.exports.home = function(req, res){
    // Before settingup view engine
    // return res.end('<h1>Express is up for Codeial!</h1>');

    // After settingup view engine
    return res.render('home', {
        title: "Home"
    });

}

// module.exports.actionName = function(req, res){}