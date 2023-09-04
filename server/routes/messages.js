const { Router } = require('express');
const { getMessages, getMessage } = require("../controllers/messages");
const addPaginationHeader = require('../middlewares/httpExtensions');

const router = Router();

router.use(addPaginationHeader);

router.get("/", getMessages);

router.get('/:messageId', getMessage);

module.exports = router