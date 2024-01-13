const Contact = require("../models/contact");
const { ctrlWrapper } = require("../utils/index");

const listContacts = async (req, res, next) => {
  const contacts = await Contact.find();
  res.send(contacts);
};

const getContactById = async (req, res, next) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);
  if (contact === null) {
    return res.status(404).send("Contact not found");
  }
  res.send(contact);
};

const addContact = async (req, res, next) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  const result = await Contact.create(contact);
  res.status(201).send(result);
};

const removeContact = async (req, res, next) => {
  const { id } = req.params;

  const contact = await Contact.findByIdAndDelete(id);
  if (contact === null) {
    return res.status(404).send("Contact not found");
  }
  res.send(contact);
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  const result = await Contact.findByIdAndUpdate(id, contact, { new: true });

  if (result === null) {
    return res.status(404).send("Contact not found");
  }

  res.send(result);
};

const changeContactFavorite = async (req, res, next) => {
  const { id } = req.params;

  const result = await Contact.findByIdAndUpdate(
    id,
    {
      favorite: req.body.favorite,
    },
    { new: true }
  );

  if (result === null) {
    return res.status(404).send("Contact not found");
  }

  res.send(result);
};

module.exports = {
  listContacts: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  removeContact: ctrlWrapper(removeContact),
  addContact: ctrlWrapper(addContact),
  updateContact: ctrlWrapper(updateContact),
  changeContactFavorite: ctrlWrapper(changeContactFavorite),
};
