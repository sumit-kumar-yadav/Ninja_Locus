const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');
const POST_PATH = path.join('/uploads/users/posts');

// Storage location and naming of the file
function getStorage(upload){
  let relativePath;
  if(upload == 'avatar'){
    relativePath = AVATAR_PATH
  }else if(upload == 'post'){
    relativePath = POST_PATH
  }

  let storage = multer.diskStorage({
      destination: function (req, file, cb) {  // cb is callback function
        // cb(null, path.join(__dirname, '..', AVATAR_PATH)); // To set the destination of the file in local disc storage
        cb(null, path.join(__dirname, '..', '..', relativePath)); // To set the destination of the file in local disc storage
      },
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));  // Date.now() method returns the number of milliseconds since January 1, 1970 00:00:00 UTC.
        // It's used to differentiate the files with same name set by the uploader users to prevent overwriting the existing file
      }
  })

  return storage;
}

module.exports ={
    AVATAR_PATH,
    POST_PATH,
    storage: getStorage
}



