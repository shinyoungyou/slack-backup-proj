const { createEventAdapter } = require("@slack/events-api");
const { WebClient, LogLevel } = require("@slack/web-api");
const client = new WebClient(process.env.SLACK_BOT_TOKEN, {
  logLevel: LogLevel.DEBUG,
});
const Message = require("../models/Message");
const Channel = require("../models/Channel");

// Initialize the Slack Events Adapter
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);

slackEvents.on("channel_created", async (event, respond) => {
  console.log(event);

  const newChannel = new Channel({
    slackId: event.channel.id,
    name: event.channel.name,
    workspace: event.channel.context_team_id
  })
  await newChannel.save();
  console.log(`Channel saved to MongoDB: ${newChannel.name}`);
});

slackEvents.on("channel_name", async (event, respond) => {
  console.log(event);

  const channel = await Channel.findOne({
    slackId: event.channel,
  });

  channel.name = event.name;

  const updatedChannel = await channel.save();
  console.log(`Channel updated to MongoDB: ${updatedChannel.name}`);
});

// Handle the "message" event
slackEvents.on("message", async (event, respond) => {
  console.log(event);

  /**
   * bring channel list
   */
  const totalChannelLength = await Channel.countDocuments();
  console.log("totalChannelLength: "+totalChannelLength);
  if (totalChannelLength === 0) {
    const { channels } = await client.conversations.list();

    channels.forEach(async channel => {
      const newChannel = new Channel({
        slackId: channel.id,
        name: channel.name,
        workspace: event.team
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
     * slack event: channel_rename (should be..)
     */
  } else if (event.subtype === "channel_name") {
    const channel = await Channel.findOne({
      slackId: event.channel,
    });
  
    channel.name = event.name;
  
    const updatedChannel = await channel.save();
    console.log(`Channel updated to MongoDB: ${updatedChannel.name}`);

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
