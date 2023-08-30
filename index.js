require('dotenv').config();

const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const Message = require('./models/Message.js');
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

connectDB()

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//middleware for cookies
app.use(cookieParser());

// Require the Node Slack SDK package (github.com/slackapi/node-slack-sdk)
const { WebClient, LogLevel } = require("@slack/web-api");

// WebClient instantiates a client that can call API methods
// When using Bolt, you can use either `app.client` or the `client` passed to listeners.
const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG
});

// Store conversation history
let conversationHistory;
// ID of channel you watch to fetch the history for
let channelId = process.env.SLACK_CHANNEL;

const getMessages = async () => {
  try {
    // Call the conversations.history method using WebClient
    const result = await client.conversations.history({
      channel: channelId,
      limit: 10
    });
  
    conversationHistory = result.messages;

    try {
      for (const message of conversationHistory) {
        const newMessage = new Message({
          slackId: message.client_msg_id,
          text: message.text,
          user: message.user,
          channel: channelId,
          postedDate: new Date(parseInt(message.ts) * 1000).toISOString(),
          modifiedDate: message.edited ? new Date(parseInt(message.edited.ts) * 1000).toISOString() : null,
        });
  
        await newMessage.save();
        console.log(`Message saved to MongoDB: ${newMessage.text}`);
      }
    } catch (error) {
      console.error('Error saving messages:', error);
    }
  
    // Print results
    console.log(conversationHistory.length + " messages found in " + channelId);
    console.log(conversationHistory);
  }
  catch (error) {
    console.error(error);
  }
}

getMessages();

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})