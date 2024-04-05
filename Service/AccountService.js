const Database = require("../Classes/Database.js");
const Main = require("../Classes/Main.js");
const Account = require("../Model/Account.js");

module.exports = class AccountService {
  constructor(main = Main) {
    this.main = main;
    this.db = new Database();
  }

  findByUsernameAndPassword(username, password) {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM accounts where username = ? AND password = ?";

      this.db
        .queryAsync(query, [username, password])
        .then((result) => {
          if (result && result.length > 0) {
            const account = new Account();
            account.username = result[0].username;
            account.password = result[0].password;
            account.state = result[0].state;
            account.role = result[0].role;
            account.characterId = result[0].characterId;
            return resolve(account);
          } else {
            return resolve(null);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  findByUsername(username) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM accounts WHERE username = ?";

      this.db
        .queryAsync(query, username)
        .then((result) => {
          if (result && result.length > 0) {
            const account = new Account();
            account.username = result[0].username;
            account.password = result[0].password;
            account.state = result[0].state;
            account.role = result[0].role;
            account.characterId = result[0].characterId;
            return resolve(account);
          } else {
            return resolve(null);
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

  register(username, password) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO accounts SET ?";
      const values = {
        username: username,
        password: password,
        state: 1,
        role: 0,
        characterId: "",
      };
      console.log(values);
      this.db.queryAsync(query, values).then(
        (result) => {
          console.log("register account: " + username + " successfully.");

          this.findByUsername(username).then(
            (result) => {
              return resolve(result);
            },
            (err) => {
              return reject(err);
            }
          );
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  handleRegister(username, password) {
    return new Promise((resolve, reject) => {
      this.findByUsername(username).then(
        (account) => {
          if (account !== null) {
            return reject("Account Existed");
          } else {
            this.register(username, password).then(
              (account) => {
                return resolve(account);
              },
              (err) => {
                return reject(err);
              }
            );
          }
        },
        (err) => {
          return reject(err);
        }
      );
    });
  }

  createCharacter(username, charId) {
    return new Promise((resolve, reject) => {
      var query = "UPDATE accounts SET characterId = ? WHERE username = ?";

      this.db
        .queryAsync(query, [charId, username])
        .then((result) => {
          return resolve(result);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }
};
