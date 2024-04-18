var Database = require("../Classes/Database.js");
const Main = require("../Classes/Main.js");
const Character = require("../Model/Character.js");
const { v4: uuidv4 } = require("uuid");

module.exports = class CharacterService {
  constructor(main = Main) {
    this.db = main.database;
    this.main = main;
  }

  isCharacterNameExisted(charName) {
    var query = "SELECT * FROM characters WHERE charName = ?";

    this.db
      .queryAsync(query, [ID])
      .then((result) => {
        if (result && result.length > 0) {
          return resolve(true);
        } else {
          return resolve(false);
        }
      })
      .catch((err) => {
        return reject(err);
      });
  }

  findById(id) {
    return new Promise((resolve, reject) => {
      var query = "SELECT * FROM characters WHERE id = ?";

      this.db
        .queryAsync(query, id)
        .then((result) => {
          var char = new Character();
          char.id = result[0].id;
          char.charName = result[0].charName;
          char.mapId = result[0].mapId;
          char.power = result[0].power;
          char.potential = result[0].potential;
          char.nowHp = result[0].nowHp;
          char.nowMp = result[0].nowMp;

          char.hpPoint = result[0].hpPoint;
          char.mpPoint = result[0].mpPoint;
          char.atkPoint = result[0].atkPoint;
          char.defPoint = result[0].defPoint;
          char.speed = result[0].speed;

          if (result[0].quest != null && result[0].quest.length > 0) {
            char.quest = result[0].quest;
          } else {
            char.quest = "";
          }

          console.log(result[0].charName);

          return resolve(char);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  findByName(charName) {
    return new Promise((resolve, reject) => {
      var query = "SELECT * FROM characters WHERE charName = ? LIMIT 1";

      this.db
        .queryAsync(query, [charName])
        .then((result) => {
          var char = new Character();
          char.id = result.id;
          char.charName = result.charName;
          char.mapId = result.mapId;
          char.power = result.power;
          char.potential = result.potential;
          char.nowHp = result.nowHp;
          char.nowMp = result.nowMp;

          char.hpPoint = result.hpPoint;
          char.mpPoint = result.mpPoint;
          char.atkPoint = result.atkPoint;
          char.defPoint = result.defPoint;

          char.dir = result.dir;

          return resolve(char);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  createNewCharacter(username, charName) {
    return new Promise((resolve, reject) => {
      this.main.accountService
        .findByUsername(username)
        .then((account) => {
          if (account === null) {
            console.log("account not exist");
            return reject(null);
          } else {
            if (account.characterId === "" || account.characterId === null) {
              var query = "INSERT INTO characters SET ?";

              var id = uuidv4();
              const char = new Character(id, charName);

              this.db
                .queryAsync(query, char)
                .then((result) => {
                  this.findById(id)
                    .then((character) => {
                      console.log("characterName: " + character.charName);
                      return resolve(character);
                    })
                    .catch((err) => {
                      console.log("cannot find id: " + id + ", err: " + err);
                      return reject(null);
                    });
                })
                .catch((err) => {
                  console.log("error when insert into character");
                  return reject(null);
                });
            } else {
              this.findById(id)
                .then((charater) => {
                  return resolve(character);
                })
                .catch((err) => {
                  console.log("cannot find id: " + id);
                  return reject(null);
                });
            }
          }
        })
        .catch((err) => {
          console.log(err);
          return reject(null);
        });
    });
  }

  saveFields(data) {
    var json = {
      mapId: data.mapId,
      power: data.power,
      potential: data.potential,
      nowHp: data.nowHp,
      nowMp: data.nowMp,
      hpPoint: data.hpPoint,
      mpPoint: data.mpPoint,
      atkPoint: data.atkPoint,
      defPoint: data.defPoint,
      dir: data.dir,
      pX: data.pX,
      pY: data.pY,
      quest: JSON.stringify(data.dataQuest),
      skill: JSON.stringify(data.skill),
      currency: JSON.stringify(data.currency),
    };

    var query = "UPDATE characters SET ? WHERE id = ?";

    this.db
      .queryAsync(query, [json, data.id])
      .then((result) => {
        console.log("save field for " + data.id + " completed");
      })
      .catch((err) => {
        console.log("failed to save field for " + data.id + "\n" + err);
      });
  }

  saveQuest(data) {
    // Chuyển đổi đối tượng dataDict thành chuỗi JSON
    var jsonDataDict = JSON.stringify(data.dataDict);

    // Tạo một đối tượng JSON chứa các trường cần lưu
    var json = {
      Id: data.Id,
      dataDict: jsonDataDict,
    };

    var field = {
      quest: JSON.stringify(json),
    };

    console.log(field);

    var query = "UPDATE characters SET ? WHERE id = ?";

    this.db
      .queryAsync(query, [field, data.id])
      .then((result) => {
        console.log("save quest for " + data.id + " completed");
      })
      .catch((err) => {
        console.log("failed to save quest for " + data.id + "\n" + err);
      });
  }
};
