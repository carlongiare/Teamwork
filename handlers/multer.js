const multer = require('multer');

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/jpe|jpeg|png|gif$i/)) {
      cb(new Error('File not supported'), false);
      return;
    }
    cb(null, true);
  },
});
