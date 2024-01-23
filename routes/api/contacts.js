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
  isValidId,
} = require("../../middlewares/index");

router.get("/", ContactController.listContacts);

router.get("/:id", isValidId, ContactController.getContactById);

router.post("/", validateBody(contactAddSchema), ContactController.addContact);

router.post(
  "/:id",
  validateBody(contactAddSchema),
  ContactController.updateContact
);

router.delete("/:id", isValidId, ContactController.removeContact);

router.put(
  "/:id",
  isValidId,
  validateBody(contactUpdateSchema),
  ContactController.updateContact
);

router.patch(
  "/:id/favorite",
  isValidId,
  validateBodyFavorite(contactChangeSchema),
  ContactController.changeContactFavorite
);

module.exports = router;
