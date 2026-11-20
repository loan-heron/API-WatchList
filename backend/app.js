require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const filmRoutes = require('./routes/films.route');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', filmRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((error, req, res, next) => {
  if (error.status) {
    return res.status(error.status).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
