const mongoose = require('mongoose');

const connectDB = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_uri)
        console.log('mongoDb connected✅✅');
        
    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

module.exports = connectDB;