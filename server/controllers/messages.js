const Message = require('../models/Message');
const mongoose = require('mongoose');


/* READ */
exports.getMessages = async (req, res) => {
  try {
    const { pageNumber, pageSize, selectedDate } = req.query;
    const page = parseInt(pageNumber) || 1;
    const limit = parseInt(pageSize) || 4; // You can set your desired default page size here
    let filter = {};

    if (selectedDate) {
      // If selectedDate is provided, create a filter based on that date.
      // In this case, set a range that includes the start and end of that date.

      const startDate = new Date(selectedDate);
      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999); // 해당 날짜의 끝 지점을 설정 (23:59:59.999)

      filter.postedDate = {
        $gte: startDate,
        $lte: endDate,
      };

    const totalItems = await Message.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const messages = await Message.find(filter)
      .select('-createdAt -updatedAt')
      .sort({ postedDate: -1 }) // Sort by postedDate in descending order
      .limit(limit);

    res.addPaginationHeader(page, limit, totalItems, totalPages);
    res.status(200).json(messages);
    } else {

      const totalItems = await Message.countDocuments();
      const skip = (page - 1) * limit;
      const totalPages = Math.ceil(totalItems / limit);
  
      const messages = await Message.find(filter)
        .select('-createdAt -updatedAt')
        .sort({ postedDate: -1 }) // Sort by postedDate in descending order
        .skip(skip)
        .limit(limit);
  
      res.addPaginationHeader(page, limit, totalItems, totalPages);
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