const Database = require("../Classes/Database");
const MapMob = require("../Model/MapMob");
const RuntimeObject = require("../Model/RuntimeObject");
const Main = require("../Classes/Main");

module.exports = class MapService {
  constructor(main = Main) {
    this.db = main.database;
  }

  findMapById(mapId) {
    return new Promise((resolve, reject) => {
      var query = "SELECT * FROM maps WHERE id = ?";

      this.db.queryAsync(query, [mapId]).then(
        (result) => {
          if (result && result.length > 0) {
            var map = new Map();
            map.id = result[0].id;
            map.mapName = result[0].mapName;
            map.xMin = result[0].xMin;
            map.xMax = result[0].xMax;
            map.yMin = result[0].yMin;
            map.yMax = result[0].yMax;

            return resolve(map);
          } else {
            resolve(null);
          }
        },
        (error) => {
          console.log(error);
          return reject(null);
        }
      );
    });
  }

  findAllMobInMap(mapId) {
    return new Promise((resolve, reject) => {
      var query = "SELECT * FROM map_mobs WHERE mapId = ?";

      this.db.queryAsync(query, [mapId]).then(
        (result) => {
          if (result && result.length > 0) {
            var mapMobs = [];

            result.forEach((element) => {
              var mapMob = new MapMob();
              mapMob.mobId = element.mobId;
              mapMob.mapId = element.mapId;
              mapMob.runtimeId = element.runtimeId;
              mapMob.pX = element.pX;
              mapMob.pY = element.pY;

              mapMobs.push(mapMob);
            });

            return resolve(mapMobs);
          } else {
            resolve(null);
          }
        },
        (error) => {
          console.log(error);
          return reject(null);
        }
      );
    });
  }

  findRuntimeObjectInMap(mapId, mapObjectId) {
    return new Promise((resolve, reject) => {
      var query = "SELECT * FROM runtime_map? WHERE mapObjectId = ?";

      this.db.queryAsync(query, [mapId, mapObjectId]).then(
        (result) => {
          if (result && result.length > 0) {
            var runtimeObject = new RuntimeObject();
            runtimeObject.mapObjectId = result[0].mapObjectId;
            runtimeObject.pX = result[0].pX;
            runtimeObject.pY = result[0].pY;

            return resolve(runtimeObject);
          } else {
            resolve(null);
          }
        },
        (error) => {
          console.log(error);
          return reject(null);
        }
      );
    });
  }

  createRuntimeObject(mapId, mapObjectId, pX, pY) {
    return new Promise((resolve, reject) => {
      var query = "INSERT INTO runtime_map? SET ?";

      var data = {
        mapObjectId: [mapObjectId],
        pX: [pX],
        pY: [pY],
      };

      this.db.queryAsync(query, [mapId, data]).then(
        (result) => {
          return resolve(true);
        },
        (error) => {
          console.log(error);
          return reject(false);
        }
      );
    });
  }

  updateRuntimeObject(mapId, mapObjectId, data) {
    return new Promise((resolve, reject) => {
      var query = "UPDATE runtime_map? SET ? WHERE mapObjectId = ?";

      this.db.queryAsync(query, [mapId, data, mapObjectId]).then(
        (result) => {
          return resolve(true);
        },
        (error) => {
          console.log(error);
          return reject(false);
        }
      );
    });
  }

  deleteRuntimeObject(mapId, mapObjectId) {
    return new Promise((resolve, reject) => {
      var query = "DELETE FROM runtime_map? WHERE mapObjectId = ?";

      this.db.queryAsync(query, [mapId, mapObjectId]).then(
        (result) => {
          return resolve(true);
        },
        (error) => {
          console.log(error);
          return reject(false);
        }
      );
    });
  }
};
