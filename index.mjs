import Slack from '@slack/bolt';
import dotenv from 'dotenv';

dotenv.config()

const app = new Slack.App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
})

const blocks = [
  {
    "type": "section",
    "text": {
      "type": "plain_text",
      "text": "That's amazing!",
      "emoji": true
    }
  },
  {
    "type": "image",
    "title": {
      "type": "plain_text",
      "text": "I Need a Marg",
      "emoji": true
    },
    "image_url": "https://assets3.thrillist.com/v1/image/1682388/size/tl-horizontal_main.jpg",
    "alt_text": "marg"
  }
]

await app.client.chat.postMessage({
  token: process.env.SLACK_BOT_TOKEN,
  channel: process.env.SLACK_CHANNEL,
  text: "Block Kit Builder Payload",
  blocks
})