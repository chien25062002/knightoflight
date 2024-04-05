var Vector3 = require("./Vector3");

module.exports = class Transform {
  constructor() {
    this.position;
    this.rotation;
    this.scale;
  }

  setPosition(X, Y, Z) {
    this.position = new Vector3(X, Y, Z);
  }

  getPosition() {
    return this.position;
  }

  setRotation(X, Y, Z) {
    this.rotation = new Vector3(X, Y, Z);
  }

  getRotation() {
    return this.rotation;
  }

  setScale(X, Y, Z) {
    this.scale = new Vector3(X, Y, Z);
  }

  getScale() {
    return this.scale;
  }
};
