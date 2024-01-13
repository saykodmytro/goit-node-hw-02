const express = require("express");

const router = express.Router();

const ContactController = require("../../controllers/contact");

const {
  contactAddSchema,
  contactUpdateSchema,
  contactChangeSchema,
} = require("../../contactsSchemas/contacts");

const {
  validateBody,
  validateBodyFavorite,
} = require("../../middlewares/validateBody");

router.get("/", ContactController.listContacts);

router.get("/:id", ContactController.getContactById);

router.post("/", validateBody(contactAddSchema), ContactController.addContact);

router.delete("/:id", ContactController.removeContact);

router.put(
  "/:id",
  validateBody(contactUpdateSchema),
  ContactController.updateContact
);

router.patch(
  "/:id/favorite",
  validateBodyFavorite(contactChangeSchema),
  ContactController.changeContactFavorite
);

module.exports = router;
