require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();
const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity, restrict in production
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(cors());

// Attach io to request object - MUST BE BEFORE ROUTES
app.use((req, res, next) => {

    req.io = io;
    next();
});

// Database Connection
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.get('/', (req, res) => {
    res.send('Farmer2Home Connect API is running...');
});

io.on('connection', (socket) => {


    socket.on('joinUserRoom', (userId) => {

        socket.join(userId);
    });

    socket.on('disconnect', () => {

    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {

});
