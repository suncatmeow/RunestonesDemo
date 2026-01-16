const port = process.env.PORT || 3000; // Render tells us which port to use
const io = require("socket.io")(port, {
  cors: {
    origin: "*", // Allow your GitHub Pages game to connect
    methods: ["GET", "POST"]
  }
});

let players = {};

console.log(`Server running on port ${port}`);

io.on("connection", (socket) => {
  console.log("New player joined:", socket.id);

  socket.on("move", (data) => {
    players[socket.id] = data;
    socket.broadcast.emit("updatePlayers", players);
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updatePlayers", players); // Tell everyone to delete the ghost
  });
});