const express = require('express');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', authRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
