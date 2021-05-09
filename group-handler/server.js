const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const mysql = require("mysql2/promise");
require("dotenv").config();

const TTL = 86400;

// Connect to the db's

const pool = mysql.createPool({
  host: process.env.SQL_HOST,
  user: process.env.SQL_UNAME,
  password: process.env.SQL_PW,
  port: process.env.SQL_PORT,
  database: "tat",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const client = new MongoClient(process.env.MONGO_CONN, {
  useUnifiedTopology: true,
});

let db;
let collection;

client.connect((error) => {
  assert.strictEqual(error, null);
  db = client.db("tat");
  collection = db.collection("sessions");
  collection.createIndex({ lastAccessed: 1 }, { expireAfterSeconds: TTL });
});
require("dotenv").config();

//Whenever someone connects this gets executed
io.on("connection", (socket) => {
  socket.on("join", (message) => joinHandler(message, socket));

  socket.on("create", (message) => createHandler(message, socket));

  socket.on("join_check", (message) => joinCheckHandler(message, socket));

  socket.on("leave", (message) => leaveHandler(message, socket));

  socket.on("ready", (message) => readyHandler(message, socket));

  socket.on("kick", (message) => kickHandler(message, socket));

  socket.on("start_swipe", (message) => startSwipeHanlder(message, socket));

  socket.on("swipe", (message) => swipeHanlder(message, socket));
});

http.listen(process.env.PORT, function () {
  console.log("⚡️ Server listening on port ", process.env.PORT);
});

async function getNameFromID(id) {
  const [
    rows,
    _,
  ] = await pool.execute("SELECT Nickname FROM User WHERE UserID = ?", [id]);
  return rows[0].Nickname;
}

async function createHandler(message, socket) {
  let code = Math.floor(100000 + Math.random() * 900000);
  // While the code doesn't exist, make a new code
  // This could break if we have like 100k + rooms?
  while ((await collection.countDocuments({ code: code })) !== 0) {
    code = Math.floor(100000 + Math.random() * 900000);
  }
  const nick = await getNameFromID(message.id);

  await collection.insertOne({
    code: code.toString(),
    geo: message.latlon,
    distance: Math.round(message.distance * 10) / 10,
    users: [{ id: message.id, name: nick, ready: true }],
    owner: message.id,
    started: false,
    restaurants: [],
    lastAccessed: new Date(),
  });
  socket.join(code.toString());
  socket.emit("room_code", code.toString());
  socket.emit("users_change", {
    owner: message.id,
    users: [{ id: message.id, name: nick, ready: true }],
  });
}

async function joinHandler(message, socket) {
  const room = await collection.findOne({ code: message.room });
  if (!room) {
    socket.emit("message", "Room does not exist");
    return;
  }
  if (
    room.bannedUsers &&
    room.bannedUsers.some(({ id }) => id === message.id)
  ) {
    socket.emit("message", "You have been banned from this room");
    return;
  }
  const nick = await getNameFromID(message.id);
  socket.join(message.room);
  await collection.updateOne(
    { _id: room._id },
    {
      $set: { lastAccessed: new Date() },
      $addToSet: { users: { id: message.id, name: nick, ready: false } },
    }
  );
  const data = await getAllUsersInRoom(room.code);
  io.to(message.room).emit("users_change", data);
}

async function joinCheckHandler(message, socket) {
  const joinedRoom = await collection.findOne({ "users.id": message.id });
  if (joinedRoom) {
    socket.emit("room_code", joinedRoom.code);
    socket.join(joinedRoom.code);
    socket.emit("users_change", joinedRoom);
  }
}

async function getAllUsersInRoom(code) {
  const room = await collection.findOne(
    { code },
    { projection: { users: 1, owner: 1, started: 1 } }
  );
  return room;
}

async function leaveHandler(message, socket) {
  const room = await collection.findOne(
    {
      code: message.room,
    },
    {
      projection: { owner: 1 },
    }
  );
  if (room && room.owner === message.id) {
    // Owner leaving, delete!
    collection.removeOne({ code: message.room });
    io.to(message.room).emit("disband", true);
    socket.leave(message.room);

    return;
  }
  await collection.updateOne(
    { code: message.room },
    {
      $pull: { users: { id: message.id } },
    }
  );
  socket.leave(message.room);
  const updated = await getAllUsersInRoom(message.room);

  io.to(message.room).emit("users_change", updated);
}

async function readyHandler(message, socket) {
  const room = await getAllUsersInRoom(message.room);
  const updated = room.users.map((item) => {
    if (item.id === message.id) {
      item.ready = message.ready;
    }
    return item;
  });
  await collection.updateOne(
    { code: message.room },
    {
      $set: { users: updated },
    }
  );
  io.to(message.room).emit("users_change", { ...room, users: updated });
}

async function kickHandler(message, socket) {
  const res = await collection.updateOne(
    { code: message.room },
    {
      $pull: { users: { id: message.id } },
      $addToSet: { bannedUsers: { id: message.id } },
    }
  );
  io.to(message.room).emit("kicked", message.id);
  const room = await getAllUsersInRoom(message.room);
  io.to(message.room).emit("users_change", { room: message.room, users: room });
}

async function startSwipeHanlder(message, socket) {
  console.log(message);
  io.to(message.room).emit("start_swipe", "");
  await collection.updateOne(
    { code: message.room },
    { $set: { started: true } }
  );
}

async function swipeHanlder(message, socket) {
  console.log(message);
  const rooom = await collection.findOne({ code: message.room });
}
