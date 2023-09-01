const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI)
    }  catch (error) {
        if (error instanceof mongoose.Error) {
            console.error('MongoDB Error:', error.message);
        } else {
            console.error('An error occurred while connecting to MongoDB:', error.message);
        }
    }
}

module.exports = connectDB