import { Server } from 'socket.io';

export function socketHandler(io: Server) {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('joinRoom', (room) => {
      socket.join(room);
    });

    socket.on('orderUpdate', (payload) => {
      const { orderId, status } = payload;
      io.to(orderId).emit('orderStatus', { orderId, status });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}
