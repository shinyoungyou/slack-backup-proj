const Message = require('../models/Message');
const mongoose = require('mongoose');

/* READ */
exports.getMessages = async (req, res) => {
  try {
    const { lastId, selectedDate, direction, search } = req.query;
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
      
      if (messages.length < 4) {
        where.postedDate = {
          $gte: startDate,
        };

        const moreMessages = await Message.find(where)
          .select('-createdAt -updatedAt')
          .sort({ postedDate: 1 }) // Sort by postedDate in descending order
          .limit(limit);
        
        res.status(200).json(moreMessages.reverse());
      } else {
        res.status(200).json(messages);
      }
    } 

    if (direction) {
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

    if (search) {
      const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
      where.text = searchRegex;

      const searchMessages = await Message.find(where)
        .select('-createdAt -updatedAt')
        .sort({ postedDate: -1 }) // Sort by postedDate in descending order
        .limit(limit);

      res.status(200).json(searchMessages);
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