// mongodb://localhost:27017/
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userModal = require('./userModel');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/fossbiosuser');

app.post('/register', async (req, res) => {
    console.log(req.body);
    try{
        await userModal.create(req.body);
    } catch (err) {
        console.log(err);
    }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
}
);