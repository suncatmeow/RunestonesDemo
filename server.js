const http = require('http');
const server = http.createServer((req, res) => {
  // This allows you to visit the URL in your browser to confirm it's working
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('BattleMage Server is Alive!');
});

const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Allow connection from your GitHub Pages
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 3000;

let players = {};

console.log(`Server attempting to start on port ${port}...`);

io.on("connection", (socket) => {
  console.log("New player joined:", socket.id);

  socket.on("move", (data) => {
    players[socket.id] = data;
    socket.broadcast.emit("updatePlayers", players);
// Add this inside io.on("connection", (socket) => { ... })

  // When Player A wants to challenge Player B
  socket.on("challenge_request", (targetSocketId) => {
    console.log(`Challenge sent from ${socket.id} to ${targetSocketId}`);
    
    // Send the message ONLY to the specific player (Player B)
    io.to(targetSocketId).emit("challenge_received", socket.id);
  });
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
  });
});

// IMPORTANT: Listen on the 'server', not 'io' directly
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});