var Transform = require("../Core/Transform.js");

module.exports = class Character {
  constructor(id, charName) {
    this.id = id;
    this.charName = charName;
    this.mapId = 0;
    this.power = 2000;
    this.potential = 2000;
    this.nowHp = 100;
    this.nowMp = 100;

    this.hpPoint = 1;
    this.mpPoint = 1;
    this.atkPoint = 1;
    this.defPoint = 1;

    this.dir = 1;
    this.speed = 2;
    this.quest = "";
  }
};
