const express = require('express');
const { createContact ,getContacts,deleteContact} = require('../controllers/contact.controller.js');
const router = express.Router();

router.post('/send',createContact);
router.get('/',getContacts);
router.delete('/:id',deleteContact);
module.exports = router;
