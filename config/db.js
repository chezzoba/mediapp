const mongoose = require('mongoose');

const config = require('config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.get('mongoURI'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('MongoDB Connected');
    } catch(err) {
        console.error(err.message);
        // Exit code 1: Failure
        process.exit(1);
    }
};

module.exports = connectDB;