const Server = require("./Server.js");
var Controller = require("./Controller.js");
var Session = require("./Session.js");
var Database = require("./Database.js");
const AccountService = require("../Service/AccountService.js");
const CharacterService = require("../Service/CharacterService.js");
const MapController = require("../Controller/MapController.js");

module.exports = class Main {
  constructor(server = Server) {
    this.server = server;
    this.controller;
    this.database;

    this.accountService;
    this.characterService;

    this.initialize();
  }

  initialize() {
    this.controller = new Controller(this);
    this.database = new Database();
    this.accountService = new AccountService(this);
    this.characterService = new CharacterService(this);
  }

  onUpdate() {
    this.controller.onUpdate();
  }

  onRequestReceived(session = Session, data) {
    this.controller.onRequestReceived(session, data);
  }
};
