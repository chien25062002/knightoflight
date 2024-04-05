const Main = require("../Classes/Main");
const MapService = require("../Service/MapService");

module.exports = class MapController {
  constructor(main = Main, id) {
    this.main = main;
    this.mapservice = new MapService(main);

    this.mapId = id;
    this.mapData;
    this.mapMobData;

    this.initialize();

    this.updateInterval = setInterval(this.update, 100);
  }

  initialize() {
    // load map data
    this.mapservice
      .findMapById(this.mapId)
      .then((result) => {
        this.mapData = result;
      })
      .catch((err) => {
        console.log(err);
      });

    // load Mob In Map
    this.mapservice
      .findAllMobInMap(this.mapId)
      .then((result) => {
        this.mapMobData = result;

        var runtimeObject;
        // kiểm tra xem đã có mob được khởi tạo trong map runtime chưa, nếu chưa thì tạo và gửi về cho các client để đồng bộ hiển thị
        this.mapMobData.forEach((mapMob) => {
          runtimeObject = this.mapservice
            .findRuntimeObjectInMap(this.mapId, mapMob.runtimeId)
            .then((result) => {
              if (result == null) {
                // nếu trong runtime map chưa có mob thì sinh mob
                this.mapservice.createRuntimeObject(
                  this.mapId,
                  mapMob.runtimeId,
                  mapMob.pX,
                  mapMob.pY
                );
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  update() {}

  onReceiveRequest(session = Session, data) {}
};
