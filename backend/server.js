require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const profileRoutes = require('./src/routes/profile.routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/profiles', profileRoutes);

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ success: false, msg: 'Invalid request data' });
  }
  return res.status(500).json({ success: false, msg: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/profile_management';

mongoose.connect(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(() => {
    console.error('Unable to connect to the database. Check MONGODB_URI and MongoDB availability.');
    process.exit(1);
  });
