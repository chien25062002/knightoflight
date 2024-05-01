const { resolve } = require("path");
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

          char.pX = result[0].pX;
          char.pY = result[0].pY;
          char.dir = result[0].dir;

          if (result[0].quest != null && result[0].quest.length > 0) {
            char.quest = result[0].quest;
          } else {
            char.quest = "";
          }

          if (result[0].inventory != null && result[0].inventory.length > 0) {
            char.inventory = result[0].inventory;
          } else {
            char.inventory = "";
          }

          if (result[0].skill != null && result[0].skill.length > 0) {
            char.skill = result[0].skill;
          } else {
            char.skill = "";
          }

          if (result[0].currency != null && result[0].currency.length > 0) {
            char.currency = result[0].currency;
          } else {
            char.currency = "";
          }

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

              var moment = require("moment");
              var created_date = moment().format("YYYY-MM-DD HH:mm:ss");
              char.created_date = created_date;

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
    return new Promise((resolve, reject) => {
      try {
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
          inventory: JSON.stringify(data.dataInventory),
          skill: JSON.stringify(data.skill),
          currency: JSON.stringify(data.currency),
        };

        var query = "UPDATE characters SET ? WHERE id = ?";

        this.db
          .queryAsync(query, [json, data.id])
          .then((result) => {
            console.log("save field for " + data.id + " completed");

            return resolve();
          })
          .catch((err) => {
            console.log("failed to save field for " + data.id + "\n" + err);
            return reject();
          });
      } catch (error) {
        console.log("error when save character data\n" + error);
        return reject();
      }
    });
  }

  loadLeader(limit = 100) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT id, charName, power FROM characters ORDER BY power DESC LIMIT ?";

      this.db
        .queryAsync(query, [limit])
        .then((results) => {
          var characters = [];

          results.forEach((result) => {
            // Tạo một đối tượng mới chỉ chứa 3 thuộc tính cần thiết
            var character = {
              id: result.id,
              charName: result.charName,
              power: result.power,
            };

            characters.push(character);
          });

          return resolve(characters);
        })
        .catch((err) => {
          console.log("error when load leader board\n" + err);
          return reject(null);
        });
    });
  }

  loadLeader(limit = 100, myId) {
    return new Promise((resolve, reject) => {
      // Truy vấn để lấy danh sách top 100 character có power cao nhất
      const queryTop =
        "SELECT id, charName, power FROM characters ORDER BY power DESC, created_date DESC LIMIT ?";

      // Truy vấn để lấy rank hiện tại của character của bạn
      const queryRank =
        "SELECT COUNT(*) AS character_rank " +
        "FROM characters " +
        "WHERE power >= (SELECT power FROM characters WHERE id = ?) AND created_date <= (SELECT created_date FROM characters WHERE id = ?)";

      let topCharacters;
      let myRank;

      // Thực hiện truy vấn lấy danh sách top 100 character
      this.db
        .queryAsync(queryTop, [limit])
        .then((results) => {
          topCharacters = results.map((result) => ({
            id: result.id,
            charName: result.charName,
            power: result.power,
          }));

          // Sau khi lấy được danh sách top 100 character, thực hiện truy vấn để lấy rank của character của bạn
          this.db
            .queryAsync(queryRank, [myId, myId])
            .then((result) => {
              // Lấy rank từ kết quả truy vấn
              myRank = result[0].character_rank;

              // Tạo dữ liệu trả về bao gồm danh sách top 100 character và rank của character của bạn
              const responseData = {
                rankingPower: topCharacters,
                rankingPowerMe: myRank,
              };

              // Trả về promise đã hoàn thành với dữ liệu
              resolve(responseData);
            })
            .catch((err) => {
              console.log("error when load my power rank \n" + err);
              return reject(null);
            });
        })
        .catch((err) => {
          console.log("error when load my power rank \n" + err);
          return reject(null);
        });
    });
  }
};
