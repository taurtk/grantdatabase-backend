const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/users'));
app.use('/api/grants', require('./routes/grants'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/services', require('./routes/services'));
app.use('/api/notifications', require('./routes/notifications'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 