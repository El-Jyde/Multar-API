const mongoose = require('mongoose');
require('dotenv').config();

const DB = process.env.database

mongoose.connect(DB)
.then(() => {
    console.log('Connection to database established successfully')
})
.catch((err) => {
    console.log('Failed to connect to database: ' +err.message)
})