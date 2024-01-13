const Contact = require("../models/contact");

const listContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.send(contacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findById(id);
    if (contact === null) {
      return res.status(404).send("Contact not found");
    }
    res.send(contact);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  try {
    const result = await Contact.create(contact);

    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findByIdAndDelete(id);
    if (contact === null) {
      return res.status(404).send("Contact not found");
    }
    res.send(contact);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  try {
    const result = await Contact.findByIdAndUpdate(id, contact, { new: true });

    if (result === null) {
      return res.status(404).send("Book not found");
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
};

const changeContactFavorite = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await Contact.findByIdAndUpdate(
      id,
      {
        favorite: req.body.favorite,
      },
      { new: true }
    );

    if (result === null) {
      return res.status(404).send("Book not found");
    }

    res.send(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  changeContactFavorite,
};
