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
        res.status(200).json({ isAuthenticated: true })
        
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
  

// Define the logout route
app.post('/logout', (req, res) => {
  const token = req.header('x-auth-token');
  console.log(token);
  if (!token) {
    return res.status(200).json({ message: 'User is already logged out' });
  }
  try {
    const decodedToken = jwt.verify(token, 'secret_key'); 
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});


app.get('/userEmails', async (req, res) => {
  try {
    // Fetch all user emails from the database
    const users = await userModal.find({}, 'email'); 
    // Extract emails and send them as a response
    const userEmails = users.map(user => user.email);
    res.status(200).json(userEmails);
  } catch (error) {
    console.error('Error fetching user emails:', error);
    res.status(500).json({ message: 'Error fetching user emails' });
  }
});


app.put('/approveUser/:email', async (req, res) => {
  const { email } = req.params;
  console.log(email);

  try {
    // Find the user by ID and update the 'approved' field to true
    const user = await userModal.findOneAndUpdate({ email }, { approved: true }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User approved', user });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ message: 'Error approving user' });
  }
});


app.get('/allUsersDetails', async (req, res) => {
  try {
    // Query the database to retrieve all user details
    const users = await userModal.find(); // This assumes your user model is named "userModal"

    // Send the list of users as a JSON response
    res.json(users);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
});

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
}
);