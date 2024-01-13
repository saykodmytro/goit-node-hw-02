const express = require("express");

const router = express.Router();

const ContactController = require("../../controllers/contact");

router.get("/", ContactController.listContacts);

router.get("/:id", ContactController.getContactById);

router.post("/", ContactController.addContact);

router.delete("/:id", ContactController.removeContact);

router.put("/:id", ContactController.updateContact);

router.patch("/:id/favorite", ContactController.changeContactFavorite);

module.exports = router;
