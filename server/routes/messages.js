const { Router } = require('express');
const { getMessages, getMessage } = require("../controllers/messages");

const router = Router();

router.get("/", getMessages);

router.get('/:messageId', getMessage);

module.exports = router