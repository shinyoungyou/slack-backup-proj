const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  slackId: {
    type: String,
  },
  name: {
    type: String,
    unique: true, // Make the "name" field unique
  },
  workspace: {
    type: String,
  }
}, {
  timestamps: true // automatic dates for when it's created or updated
})

ChannelSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model("Channel", ChannelSchema);
