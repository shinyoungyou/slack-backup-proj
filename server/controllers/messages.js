const Message = require('../models/Message');
const mongoose = require('mongoose');

/* READ */
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find();

    res.status(200).json(messages);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

exports.getMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(404).json({ message: 'Invalid Message ID' })
    }

    const message = await Message.findById(messageId);

    if (!message) return res.status(404).json({ message: 'Message not found' });

    res.status(200).json(message);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}