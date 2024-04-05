let Session = require("./Session.js");
let Main = require("./Main.js");

module.exports = class Server {
  constructor(isLocal = false) {
    this.isLocal = isLocal;

    this.sessions = [];
    this.sessionsInMap = [];
    this.main = new Main(this);

    this.initialize();
  }

  initialize() {
    this.main.initialize();
  }

  onUpdate() {
    // Update
    let server = this;
    server.main.onUpdate();
  }

  // Handle a new connection to the server
  onConnected(socket) {
    let server = this;
    let session = new Session(server);

    session.socket = socket;

    console.log("Addded new sesssion to the server (" + session.id + ")");
    server.sessions[session.id] = session;

    session.socket.on("request", function (data) {
      server.main.onRequestReceived(session, data);
    });

    return session;
  }

  onDisconnected(session = Session) {
    let server = this;
    let id = session.id;

    delete server.sessions[id];
    console.log("A Session has been ternimated (" + session.id + ")");

    // If connection has account, Tell other players currently in the map that we have disconnected from the game
    if (!(session.account === null || session.account === undefined)) {
    }
  }
};
