require("dotenv").config();
const mongoose = require("mongoose");

async function connectDB() {
    const dburl = process.env.MONOGDB_CONNECTION_STR;
    console.log(dburl)
    await mongoose.connect(dburl);
    console.log("Database connected Successfully");
}


module.exports = connectDB 