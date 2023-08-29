require('dotenv').config();

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
      channel: channelId
    });
  
    conversationHistory = result.messages;
  
    // Print results
    console.log(conversationHistory.length + " messages found in " + channelId);
    console.log(conversationHistory);
  }
  catch (error) {
    console.error(error);
  }
}

getMessages();
