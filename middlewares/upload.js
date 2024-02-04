const path = require("node:path");
const multer = require("multer");
const crypto = require("node:crypto");

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    console.log(file);
    cd(null, path.join(__dirname, "..", "tmp"));
  },
  filename: (req, file, cd) => {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const suffix = crypto.randomUUID();
    cd(null, `${basename}-${suffix}${extname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
