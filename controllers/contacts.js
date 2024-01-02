const { HttpError, ctrlWrapper } = require("../utils/index");

const contacts = require("../models/contacts");

const contactSchema = require("../contactsSchemas/contacts.js");

const getAll = async (req, res, next) => {
  const rezult = await contacts.listContacts();
  if (!rezult) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(rezult);
};

const getById = async (req, res, next) => {
  const { id } = req.params;
  const rezult = await contacts.getContactById(id);
  if (!rezult) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(rezult);
};

const add = async (req, res, next) => {
  const id = req.body;
  const { error } = contactSchema.validate(req.body, {
    abortEarly: false,
  });

  if (typeof error !== "undefined") {
    return res.status(400).json({
      message: error.details
        .map((err) => `missing required ${err.context.label} field`)
        .join(", "),
    });
  }

  const rezult = await contacts.addContact(id);
  if (!rezult) {
    throw HttpError(404, "Not found");
  }
  return res.status(201).send(rezult);
};

const deleteById = async (req, res, next) => {
  const { id } = req.params;
  console.log("id: ", id);
  const rezult = await contacts.removeContact(id);
  if (!rezult) {
    throw HttpError(404, "Not found");
  }
  return res.status(201).send({ message: "contact deleted" });
};

const updateById = async (req, res, next) => {
  const { error } = contactSchema.validate(req.body, {
    abortEarly: false,
  });

  const value = req.body;
  const { contactId } = req.params;

  if (isEmptyObject(value)) {
    return res.status(400).json({ message: "missing fields" });
  }
  if (typeof error !== "undefined") {
    return res.status(400).json({
      message: error.details
        .map((err) => `missing required ${err.context.label} field`)
        .join(", "),
    });
  }

  const rezult = await contacts.updateContact(contactId, value);
  if (!rezult) {
    throw HttpError(404, "Not found");
  }
  return res.status(201).send(rezult);
};

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
};