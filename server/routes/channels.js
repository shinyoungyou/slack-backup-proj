const { Router } = require('express');
const { getChannels, getChannel } = require("../controllers/channels");

const router = Router();

router.get("/", getChannels);

router.get('/:channelId', getChannel);

module.exports = router