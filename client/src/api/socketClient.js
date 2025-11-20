// ✅ src/api/socketClient.js
import { io } from 'socket.io-client';

let socket = null;

/**
 * Initialize Socket.io client once
 * and return the singleton instance.
 */
export const initSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      transports: ['websocket'],
      auth: {
        token: localStorage.getItem('token'), // optional: send JWT if backend uses auth
      },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.warn('⚠️ Socket disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
    });
  }

  return socket;
};

/**
 * Get the existing socket instance.
 * Throws an error if not initialized.
 */
export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized! Call initSocket() first.');
  }
  return socket;
};
