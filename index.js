require('dotenv').config();

const express = require('express')
const app = express()
const morgan = require('morgan');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const credentials = require('./middlewares/credentials');
const helmet = require('helmet');
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')
const slackEvents = require('./routes/slackEvents');
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

connectDB()

// Plug in the Slack Events Adapter before the body parsing middleware
app.use('/slackevent', slackEvents.requestListener());

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//middleware for cookies
app.use(cookieParser());

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({
    // origin: 'https://slack-backup-proj.com',
    // credentials: true,
  })); 
} else {
  app.use(morgan('dev'));
  app.use(cors({
    origin: [
      'https://api.slack.com/',
      'http://localhost:3000'
    ],
    credentials: true,
  })); 
}

app.post('/', (req, res) => {
  const { challenge } = req.body;
  if (challenge) {
    res.send({ challenge });
  } else {
    res.send('Hello World!');
  }
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})