const { createEventAdapter } = require('@slack/events-api');
const Message = require('../models/Message');

// Initialize the Slack Events Adapter
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

slackEvents.on('message', async (event, respond) => {
  console.log(event);

  if (event.subtype === 'message_changed') {
    
    const message = await Message.findOne({ slackId: event.previous_message.client_msg_id });

    message.text = event.message.text;

    const updatedMessage = await message.save();
    console.log(`Message updated to MongoDB: ${updatedMessage.text}`);

  } else if (event.subtype === 'message_deleted') {

    await Message.findOneAndDelete({ slackId: event.previous_message.client_msg_id });

    console.log(`Message deleted`);

  } else {

    const newMessage = new Message({
      slackId: event.client_msg_id,
      text: event.text,
      user: event.user,
      channel: event.channel,
      postedDate: new Date(parseInt(event.ts) * 1000).toISOString(),
    });
  
    await newMessage.save();
    console.log(`Message saved to MongoDB: ${newMessage.text}`);
  } 
});

slackEvents.on('error', (error, respond) => {
  console.error(error);
  respond(error, { status: 500 });
});

module.exports = slackEvents;
