// server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const helmet = require('helmet')
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const { setupSocket } = require('./config/socket');

// 🚀 Import Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const postRoutes = require('./routes/postRoutes');
const likeRoutes = require('./routes/likeRoutes');
const commentRoutes = require('./routes/commentRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const tagRoutes = require('./routes/tagRoutes');
const messageRoutes = require('./routes/messageRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const searchRoutes = require('./routes/searchRoutes');

// 🧠 Initialize app and DB
const app = express();
connectDB();

// ⚙️ Middlewares
app.use(logger);
app.use(express.json());
app.use(cors());
app.use(helmet());

// ✅ Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = setupSocket(server);

// 🧩 Attach io instance to req for controllers
app.use((req, res, next) => {
    req.io = io;
    next();
});

// 🚦 Register routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/search', searchRoutes);

// 🧱 Global Error Handler
app.use(errorHandler);

// ✅ Default route
app.get('/', (req, res) => {
    res.send('✅ Server is running and Socket.io is active.');
});

// 🚀 Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`⚡ Server running on port ${PORT}`));
