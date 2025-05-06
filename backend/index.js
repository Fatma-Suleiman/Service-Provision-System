// index.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const bodyParser = require('body-parser');
const path    = require('path');
const db      = require('./db');

// Routers (make sure these are the files under /routes, not controllers)
const reviewRoutes           = require('./routes/reviewRoutes');
const authRoutes             = require('./routes/authRoutes');
const serviceRoutes          = require('./routes/serviceRoutes');
const bookingsRoutes         = require('./routes/bookingsRoutes');
const providersRoutes      = require('./routes/providers');        // <— your file under routes/
const serviceRequestsRoutes = require('./routes/serviceRequests');


const app  = express();
const port = process.env.PORT || 5000;

// CORS setup
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Body parser
app.use(bodyParser.json());

// Static file serving
//app.use('/images',  express.static(path.join(__dirname, 'public/images')));//
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Quick DB test
app.get('/test-db', async (req, res) => {
  try {
    const [results] = await db.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Database connected', solution: results[0].solution });
  } catch (error) {
    console.error('Database connection error:', error.message);
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Mount all routers
app.use('/api/reviews',          reviewRoutes);
app.use('/api/auth',             authRoutes);
app.use('/api/services',         serviceRoutes);
app.use('/api/bookings',         bookingsRoutes);
app.use('/api/providers',        providersRoutes);
 app.use('/api/service-requests', serviceRequestsRoutes);
 
// Root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the JiraniConnect Backend!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
