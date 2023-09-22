const { createEventAdapter } = require("@slack/events-api");
const { WebClient, LogLevel } = require("@slack/web-api");
const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  logLevel: LogLevel.DEBUG,
});
const Message = require("../models/Message");
const Channel = require("../models/Channel");

// Initialize the Slack Events Adapter
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

// Handle the "message" event
slackEvents.on("message", async (event, respond) => {
  console.log(event);

  /**
   * bring channel list
   */
  const totalChannelLength = await Message.countDocuments();
  if (totalChannelLength === 0) {
    const { channels } = await client.conversations.list();

    channels.forEach(async channel => {
      const newChannel = new Channel({
        slackId: channel.id,
        name: channel.name
      })
      await newChannel.save();
    })
  }

  /**
   * get updated message
   */
  if (event.subtype === "message_changed") {
    const message = await Message.findOne({
      slackId: event.previous_message.client_msg_id,
    });

    message.text = event.message.text;
    message.modifiedDate = new Date(parseInt(event.message.edited.ts) * 1000);

    const updatedMessage = await message.save();
    console.log(`Message updated to MongoDB: ${updatedMessage.text}`);

    /**
     * get deleted message info
     */
  } else if (event.subtype === "message_deleted") {
    await Message.findOneAndDelete({
      slackId: event.previous_message.client_msg_id,
    });

    console.log(`Message deleted`);

    /**
     * get a new message created
     */
  } else if (event.subtype === undefined) {
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
      postedDate: new Date(parseInt(event.ts) * 1000),
      // modifiedDate: null
    });

    await newMessage.save();
    console.log(`Message saved to MongoDB: ${newMessage.text}`);
  }
});

// Handle the "error" event
slackEvents.on("error", (error, respond) => {
  console.error(error);
  respond(error, { status: 500 });
});

module.exports = slackEvents;
