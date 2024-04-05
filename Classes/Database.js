"use strict";
const MySql = require("mysql");
const Util = require("util");
require("dotenv").config();

module.exports = class Database {
  constructor() {
    this.connection;

    this.initialize();
  }

  initialize() {
    this.connection = MySql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      port: process.env.PORT,
    });
    console.log(process.env.HOST);

    // Kết nối và xử lý sự kiện lỗi
    this.connection.connect((err) => {
      if (err) {
        console.error("Không thể kết nối đến MySQL:", err.message);
      } else {
        console.log("Kết nối MySQL thành công");
      }
    });
  }
  queryAsync(query, values) {
    return new Promise((resolve, reject) => {
      this.connection.query(query, values, function (err, res) {
        // Call reject on error states,
        // call resolve with results
        if (err) return reject(err);
        return resolve(res);
      });
    });
  }

  closeConnection() {
    if (this.connection) {
      this.connection.end((err) => {
        if (err) {
          console.error("Lỗi khi đóng kết nối MySQL:", err.message);
        } else {
          console.log("Đã đóng kết nối MySQL");
        }
      });
    }
  }
};
