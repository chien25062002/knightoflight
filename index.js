let io = require("socket.io")(process.env.PORT || 2506);
let Server = require("./Classes/Server.js");

console.log("Server has started");

if (process.env.PORT == undefined) {
  console.log("Local Server");
} else {
  console.log("Hosted Server");
}

let server = new Server(process.env.PORT == undefined);

// Update every 0.1sec
setInterval(
  () => {
    server.onUpdate();
  },
  100,
  0
);

io.on("connection", function (socket) {
  let session = server.onConnected(socket);

  session.createEvents();
  session.socket.emit("connected", { id: session.id });
});
