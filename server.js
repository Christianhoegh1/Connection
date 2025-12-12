const http = require("http");
const WebSocket = require("ws");

// Create a basic HTTP server (Render requires one main server using PORT)
const server = http.createServer();

const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", ws => {
  console.log("Client connected");
  clients.push(ws);

  ws.on("message", msg => {
    // Broadcast to everyone except sender
    clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    clients = clients.filter(c => c !== ws);
  });
});

// Render provides the port via environment variable
const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log("🚀 Signaling server running on port " + PORT);
});
