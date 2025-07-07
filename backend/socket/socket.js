module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("📡 Client connected:", socket.id);

    socket.on("join-payment-room", (paymentId) => {
      socket.join(paymentId);
      console.log(`✅ Client ${socket.id} joined room: ${paymentId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};