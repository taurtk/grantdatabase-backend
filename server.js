const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();

// Configure CORS
app.use(cors({
    origin: ['http://localhost:5173', 'https://your-frontend-domain.com'], // Add your frontend URLs
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/grants', require('./routes/grants'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/services', require('./routes/services'));
app.use('/api/notifications', require('./routes/notifications'));

// Add a pre-flight route handler
app.options('*', cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 