const mongoose = require("mongoose");

mongoose.set('strictQuery', true);
const connectDb = async() => {
    mongoose.connect(process.env.MONGODB_CLOUD_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then(() => {
        console.log('DB COnnected')
    }).catch((error) => {
        throw new Error(`Error connecting to database \n ${error}`)
    })
} 

module.exports = connectDb