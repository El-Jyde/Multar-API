require("./dbConfig/dbConfig");
const express = require('express');
require('dotenv').config();

const port = process.env.PORT

const userRouter = require('./router/userRouter');

const app = express();

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Welcome to my Multar API for uploading media files')
})
app.use('/api/v1', userRouter);

app.listen(port, () => {
    console.log(`Server is up and running on port: ${port}`)
})