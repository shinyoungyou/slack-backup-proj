const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  slackId: {
    type: String,
  },
  text: {
    type: String,
  },
  userId: {
    type: String,
  },
  displayName: {
    type: String,
  },
  userPicturePath: {
    type: String,
  },
  channel: {
    type: String,
  },
  postedDate: {
    type: Date,
  },
  modifiedDate: {
    type: Date,
  }
}, {
  timestamps: true // automatic dates for when it's created or updated
})

MessageSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model("Message", MessageSchema);
