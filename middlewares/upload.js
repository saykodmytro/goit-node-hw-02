const path = require("node:path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    console.log(file);
    cd(null, path.join(__dirname, "..", "tmp"));
  },
});

const upload = multer({ storage });

module.exports = upload;
