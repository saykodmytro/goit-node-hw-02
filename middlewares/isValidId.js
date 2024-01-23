const { isValidObjectId } = require("mongoose");

const { HttpError } = require("../utils");

const isValidId = (req, res, next) => {
  const { id } = req.params;
  console.log("id: ", id);
  if (!isValidObjectId(id)) {
    return next(HttpError(400, `${id} is not a valid id`));
  }
  next();
};

module.exports = isValidId;
