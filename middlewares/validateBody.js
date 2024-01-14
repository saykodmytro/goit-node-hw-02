const validateBody = (schema) => {
  const func = (req, res, next) => {
    if (isEmptyObject(req.body)) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((err) => err.message);
      return res.status(400).json({ message: errorMessages.join(", ") });
    }
    next();
  };
  return func;
};

const validateBodyFavorite = (schema) => {
  const func = (req, res, next) => {
    if (isEmptyObject(req.body)) {
      return res.status(400).json({ message: "Missing fields favorite" });
    }
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(404).json({ message: error.message });
    }
    next();
  };
  return func;
};

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

module.exports = { validateBodyFavorite, validateBody };
