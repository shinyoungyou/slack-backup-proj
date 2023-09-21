const Message = require('../models/Message');
const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;

/* READ */
exports.getMessages = async (req, res) => {
  try {
    const { lastId, selectedDate, direction } = req.query;
    console.log("lastId: "+lastId);
    const limit = 6; // You can set your desired default page size here
    let where = {};

    if (selectedDate) {
      const startDate = new Date(selectedDate);
      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999); 

      where.postedDate = {
        $lte: endDate,
      };

      const messages = await Message.find(where)
        .select('-createdAt -updatedAt')
        .sort({ postedDate: -1 }) // Sort by postedDate in descending order
        .limit(limit);
      
      res.status(200).json(messages);
    } else {
      if (lastId) {
        const lastMessage = await Message.findById(lastId);

        if (direction === 'prev') {
          where.postedDate = {
            $gt: lastMessage.postedDate
          };
        } else {
          where.postedDate = {
            $lt: lastMessage.postedDate
          };
        }
      }
     
      const messages = await Message.find(where)
        .select('-createdAt -updatedAt')
        .sort({ postedDate: direction === 'prev' ? 1 : -1 }) // Sort by postedDate in descending order
        // .sort({ postedDate: -1 }) // Sort by postedDate in descending order
        .limit(limit);
        res.status(200).json(messages);
      
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


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