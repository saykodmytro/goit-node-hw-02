const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("file: ", file);
    cb(null);
  },
  //   filename: function (req, file, cb) {
  //     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  //     cb(null, file.fieldname + "-" + uniqueSuffix);
  //   },
});

module.exports = multer({ storage });
