// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const authRoutes = require('./routes/auth');
const topicRoutes = require('./routes/topic');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log('Server running on port 5000'));
})
.catch((err) => console.log(err));
