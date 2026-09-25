const express = require('express');
const profileRoutes = require('./src/routes/profile.routes');

const app = express();

app.use(express.json());

app.use('/api/profiles', profileRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server safely running without Mongo on http://localhost:${PORT}`);
});