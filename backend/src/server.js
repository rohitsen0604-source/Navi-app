require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { initSocket } = require('./services/socketService');
const errorHandler = require('./middlewares/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const masterDataRoutes = require('./routes/masterDataRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const driverRoutes = require('./routes/driverRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io initialization with CORS
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Connect to Database
connectDB();

// Initialize Real-time Socket Event Hub
initSocket(io);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'Naavi Central Operations & Booking API',
    interconnectionTarget: '95%',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/master-data', masterDataRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/admin', adminRoutes);

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` ⚓ NAAVI BACKEND ENGINE STARTED ON PORT ${PORT} `);
  console.log(` Interconnected API Single Source of Truth ready.`);
  console.log(` Healthcheck: http://localhost:${PORT}/health`);
  console.log(`=======================================================`);
});

module.exports = { app, server };
