const mongoose = require('mongoose');

const WorkspaceSchema = new mongoose.Schema({
  slackId: {
    type: String,
  },
  name: {
    type: String,
    unique: true, // Make the "name" field unique
  },
  botToken: {
    type: String,
  },
  botSlackId: {
    type: String,
  },
}, {
  timestamps: true // automatic dates for when it's created or updated
})

WorkspaceSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model("Workspace", WorkspaceSchema);
