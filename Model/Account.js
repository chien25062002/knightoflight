module.exports = class Account {
  constructor(username, password, state, role) {
    this.username = username;
    this.password = password;
    this.state = state;
    this.role = role;

    this.characterId;
  }

  // Phương thức chuyển đối tượng thành JSON, không bao gồm this.character
  toJSON() {
    const { username, password, state, role, characterId } = this;
    return { username, password, state, role, characterId };
  }
};
