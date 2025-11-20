// 📦 socket/index.js
let ioInstance; // Will hold the socket.io instance

const setupSocket = (server) => {
    const { Server } = require('socket.io');

    const io = new Server(server, {
        cors: {
        origin: process.env.CLIENT_URL || '*', // or your frontend URL
        methods: ['GET', 'POST'],
        credentials: true,
        },
    });

  // 🔌 When a client connects
    io.on('connection', (socket) => {
        console.log('⚡ New socket connected:', socket.id);

        // ✅ Expect frontend to send userId to join their room
        socket.on('register', (userId) => {
        if (userId) {
            socket.join(userId);
            console.log(`📦 User ${userId} joined their private room`);
        }
        });

    // Optionally listen for manual testing
        socket.on('test:notification', (data) => {
            console.log('🧪 Test event received:', data);
            io.to(data.userId).emit('notification:new', data);
        });

        socket.on('disconnect', () => {
            console.log('❌ Socket disconnected:', socket.id);
        });
    });

    ioInstance = io;
    return io;
};

// 🧠 Helper: get socket.io instance anywhere (e.g. in controller)
const getIO = () => {
  if (!ioInstance) throw new Error('Socket.io not initialized!');
  return ioInstance;
};

module.exports = { setupSocket, getIO };
