const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    console.log(file);
    cd(null);
  },
});

const upload = multer({ storage });

module.exports = upload;
