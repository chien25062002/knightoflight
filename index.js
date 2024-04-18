let io = require("socket.io")(process.env.PORT || 2506);

const { Emitter } = require("@socket.io/component-emitter");

const PacketType = {
  CONNECT: 0,
  DISCONNECT: 1,
  EVENT: 2,
  ACK: 3,
  CONNECT_ERROR: 4,
  BINARY_EVENT: 5,
  BINARY_ACK: 6,
};

module.exports = PacketType;

// Hàm chuyển đổi số thành enum
module.exports.numberToEnum = function (number) {
  for (const key in PacketType) {
    if (PacketType[key] === number) {
      return key;
    }
  }
  return undefined;
};

const RESERVED_EVENTS = [
  "connect", // được sử dụng phía client
  "connect_error", // được sử dụng phía client
  "disconnect", // được sử dụng ở cả hai phía
  "disconnecting", // được sử dụng phía server
  "newListener", // được sử dụng bởi EventEmitter của Node.js
  "removeListener", // được sử dụng bởi EventEmitter của Node.js
];

module.exports = RESERVED_EVENTS;

class Encoder {
  /**
   * Encode a packet into a list of strings/buffers
   */
  encode(packet) {
    return [JSON.stringify(packet)];
  }
}

function isObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

class Decoder extends Emitter {
  /**
   * Receive a chunk (string or buffer) and optionally emit a "decoded" event with the reconstructed packet
   */
  add(chunk) {
    try {
      //const packet = JSON.parse(jsonChunk.substring(1));

      const packet = this.decodeString(chunk);
      if (this.isPacketValid(packet)) {
        this.emit("decoded", packet);
      } else {
        throw new Error("invalid format");
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      throw error; // Ném lỗi khi gặp lỗi parsing JSON
    }
  }

  isPacketValid({ type, data, nsp, id }) {
    console.log("check valid");
    const isNamespaceValid = typeof nsp === "string";
    const isAckIdValid = id === undefined || Number.isInteger(id);
    if (!isNamespaceValid || !isAckIdValid) {
      return false;
    }
    switch (type) {
      case 0: // CONNECT
        return data === undefined || isObject(data);
      case 1: // DISCONNECT
        return data === undefined;
      case 2: // EVENT
        return Array.isArray(data) && typeof data[0] === "string";
      case 3: // ACK
        return Array.isArray(data);
      case 4: // CONNECT_ERROR
        return isObject(data);
      default:
        return false;
    }
  }

  decodeString(str) {
    let i = 0;
    // Tìm kiếm loại gói
    const p = {
      type: Number(str.charAt(0)),
    };

    var type = PacketType.numberToEnum(p.type);
    if (type === undefined) {
      throw new Error("unknown packet type " + p.type);
    }

    // Tìm kiếm thông tin về tệp đính kèm nếu loại là binary
    if (type === PacketType.BINARY_EVENT || type === PacketType.BINARY_ACK) {
      const start = i + 1;
      while (str.charAt(++i) !== "-" && i != str.length) {}
      const buf = str.substring(start, i);
      if (buf != Number(buf) || str.charAt(i) !== "-") {
        throw new Error("Illegal attachments");
      }
      p.attachments = Number(buf);
    }

    // Tìm kiếm namespace (nếu có)
    if ("/" === str.charAt(i + 1)) {
      const start = i + 1;
      while (++i) {
        const c = str.charAt(i);
        if ("," === c) break;
        if (i === str.length) break;
      }
      p.nsp = str.substring(start, i);
    } else {
      p.nsp = "/";
    }

    // Tìm kiếm id
    const next = str.charAt(i + 1);
    if ("" !== next && Number(next) == next) {
      const start = i + 1;
      while (++i) {
        const c = str.charAt(i);
        if (null == c || Number(c) != c) {
          --i;
          break;
        }
        if (i === str.length) break;
      }
      p.id = Number(str.substring(start, i + 1));
    }

    // Tìm kiếm dữ liệu json
    if (str.charAt(++i)) {
      const payload = JSON.parse(str.substr(i));
      if (Decoder.isPayloadValid(p.type, payload)) {
        p.data = payload;
      } else {
        throw new Error("invalid payload");
      }
    }

    // In ra log và trả về đối tượng Packet
    console.log("decoded", str, "as", p);
    return p;
  }

  // Hàm kiểm tra tính hợp lệ của payload
  static isPayloadValid(type = PacketType, payload) {
    switch (type) {
      case PacketType.CONNECT:
        return isObject(payload);
      case PacketType.DISCONNECT:
        return payload === undefined;
      case PacketType.CONNECT_ERROR:
        return typeof payload === "string" || isObject(payload);
      case PacketType.EVENT:
      case PacketType.BINARY_EVENT:
        return (
          Array.isArray(payload) &&
          (typeof payload[0] === "number" ||
            (typeof payload[0] === "string" &&
              RESERVED_EVENTS.indexOf(payload[0]) === -1))
        );
      case PacketType.ACK:
      case PacketType.BINARY_ACK:
        return Array.isArray(payload);
      default:
        return false; // Trả về false cho các trường hợp khác
    }
  }

  /**
   * Clean up internal buffers
   */
  destroy() {}
}

const parser = { Encoder, Decoder };

let Server = require("./Classes/Server.js");

io.parser = parser;

console.log("Server has started");

if (process.env.PORT == undefined) {
  console.log("Local Server");
} else {
  console.log("Hosted Server");
}

let server = new Server(process.env.PORT == undefined);

// Update every 0.1sec
setInterval(
  () => {
    server.onUpdate();
  },
  100,
  0
);

io.on("connection", function (socket) {
  let session = server.onConnected(socket);

  session.createEvents();
  session.socket.emit("connected", { id: session.id });
});
