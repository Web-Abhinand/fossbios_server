// mongodb://localhost:27017/
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userModal = require('./userModel');
const jwt = require('jsonwebtoken');

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


app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await userModal.findOne({ email: email });

    if (!user) {
      res.status(400).json({ message: { msgBody: "No user found", msgError: true } });
    } else {
      if (password === user.password) {
        // Create the payload for the JWT
        const payload = {
          email: email
        };

        // Sign the token with your secret key
        const secretKey = 'secret_key'; 
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        // Send the token in the response
        res.status(200).json({ isAuthenticated: true, user: { email: email }, token: token });
      } else {
        res.status(400).json({ message: { msgBody: "Wrong password", msgError: true } });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: { msgBody: "Error has occurred", msgError: true } });
  }
});
  

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
}
);