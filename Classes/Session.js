let ShortID = require('shortid');
var Server = require('./Server.js');

module.exports = class Session {

    constructor(server = Server) {
        this.id = ShortID.generate();
        this.socket;
        this.server = server;
        this.account;
    }

    //Handles all our io events and where we should route them too to be handled
    createEvents() {

        let session = this;
        let socket = session.socket;

        socket.on('connection', function() {
            
        });
    }
}