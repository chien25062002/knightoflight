const Main = require("./Main.js");
var Session = require("./Session.js");
var Socket = require("socket.io");
var Account = require("../Model/Account.js");

module.exports = class Controller {
  constructor(main = Main) {
    this.main = main;
  }

  onUpdate() {}

  onRequestReceived(session = Session, data) {
    let controller = this;
    let messageId = parseInt(data["message"]);

    let resData;
    console.log("messageId " + messageId + "\n");
    switch (messageId) {
      case 10: // login
        var username = data["username"];
        var password = data["password"];

        this.main.accountService
          .findByUsernameAndPassword(username, password)
          .then((account) => {
            resData = this.responeData(11, account.toJSON());
            this.sendResponeTo(session, resData);
            console.log("user " + username + " login successfully.");
          })
          .catch((err) => {
            resData = this.responeData(13, null);
            console.log(err);
            console.log(
              "login failed: " + username + ", password: " + password
            );
          });
        break;
      case 20: // đăng ký tài khoản
        var username = data["username"];
        var password = data["password"];

        //console.log("username: " + username + " password: " + password);

        this.main.accountService.handleRegister(username, password).then(
          (account) => {
            resData = controller.responeData(22, account.toJSON());
            controller.sendResponeTo(session, resData);
          },
          (err) => {
            if (err === "Account Existed") {
              controller.sendResponeTo(session, this.responeData(12, null));
            }
            console.log(err);
          }
        );
        break;

      case 30: // tạo nhân vật
        var username = data["username"];

        this.main.characterService
          .createNewCharacter(data["username"], data["charName"])
          .then((character) => {
            this.main.accountService
              .createCharacter(username, character.id)
              .then((result) => {
                console.log(
                  "update charId: " + character.id + " to user: " + username
                );
              })
              .catch((err) => {
                console.log(err);
              });

            resData = controller.responeData(31, character);
            controller.sendResponeTo(session, resData);
          })
          .catch((err) => {
            console.log(err);
          });
        break;

      case 33:
        this.main.characterService
          .saveFields(data.data)
          .then(() => {
            resData = this.responeData(34);
            this.sendResponeTo(session, resData);
          })
          .catch((err) => {
            resData = this.responeData(34);
            this.sendResponeTo(session, resData);
          });
        break;

      case 100: // yêu cầu load map
        var mapId = data["mapId"];
        this.main.mapCtrls[mapId].onRequestReceived(session, data);
        break;

      case 201: // yêu cầu load leaderboard
        this.main.characterService.loadLeader(50, data.id).then((result) => {
          resData = this.responeData(202, result);

          this.sendResponeTo(session, resData);
        });
        break;

      case 1001: // RequestLoginCharacter
        this.main.characterService
          .findById(data["characterId"])
          .then((character) => {
            resData = this.responeData(1002, character);
            this.sendResponeTo(session, resData);
          })
          .catch((err) => {
            console.log("error when request login character: " + err);
          });
        break;
    }
  }

  responeData(messageId, data) {
    var json1 = { message: messageId };
    const mergedObject = { ...json1, ...data };
    return mergedObject;
  }

  sendResponeTo(session = Session, data) {
    session.socket.emit("response", data);
  }
};
