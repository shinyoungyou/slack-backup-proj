const Channel = require('../models/Channel');
const mongoose = require('mongoose');

/* READ */
exports.getChannels = async (req, res) => {
  try {
    const channels = await Channel.find()
      .select('-createdAt -updatedAt');

    res.status(200).json(channels);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.getChannel = async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(404).json({ message: 'Invalid Message ID' })
    }

    const channel = await Channel.findById(channelId);

    if (!channel) return res.status(404).json({ message: 'Message not found' });

    res.status(200).json(channel);


    res.status(200).json(searchMessages);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
