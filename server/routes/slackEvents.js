const { createEventAdapter } = require('@slack/events-api');
const { WebClient, LogLevel } = require("@slack/web-api");
const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  logLevel: LogLevel.DEBUG
});
const Message = require('../models/Message');

// Initialize the Slack Events Adapter
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

slackEvents.on('message', async (event, respond) => {
  console.log(event);

  if (event.subtype === 'message_changed') {

    const message = await Message.findOne({ slackId: event.previous_message.client_msg_id });

    message.text = event.message.text;
    message.modifiedDate = new Date(parseInt(event.message.edited.ts) * 1000).toISOString();

    const updatedMessage = await message.save();
    console.log(`Message updated to MongoDB: ${updatedMessage.text}`);

  } else if (event.subtype === 'message_deleted') {

    await Message.findOneAndDelete({ slackId: event.previous_message.client_msg_id });

    console.log(`Message deleted`);

  } else {

    // Fetch user info using the user's ID
    const userResponse = await client.users.info({ user: event.user });
    const displayName = userResponse.user.profile.real_name;
    const userPicturePath = userResponse.user.profile.image_48;

    const newMessage = new Message({
      slackId: event.client_msg_id,
      text: event.text,
      userId: event.user,
      displayName,
      userPicturePath,
      channel: event.channel,
      postedDate: new Date(parseInt(event.ts) * 1000).toISOString(),
    });

    if (event.subtype === 'file_share') {
      const fileList = event.files.map(async (file) => {
        console.log(file);
        const fileListResponse = await client.files.list({ 
          user: event.user,
          // ts_from: `${file.created-1}`, ts_to: `${file.created+1}`
        });
        console.log(fileListResponse);
        const fileData = fileListResponse.files[0];
        const publicUrl = fileData.is_public ? fileData.permalink_public : null;
    
        return {
          id: file.id,
          title: file.title,
          picturePath: publicUrl
        }
      })

      console.log(fileList);

      newMessage.files = fileList;
    }

    await newMessage.save();
    console.log(`Message saved to MongoDB: ${newMessage.text}`);
  } 
});

slackEvents.on('error', (error, respond) => {
  console.error(error);
  respond(error, { status: 500 });
});

module.exports = slackEvents;
