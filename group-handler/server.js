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
  console.log(await collection.countDocuments({ code: code }));
  while ((await collection.countDocuments({ code: code })) !== 0) {
    code = Math.floor(100000 + Math.random() * 900000);
  }

  await collection.insertOne({
    code: code,
    geo: message.latlon,
    distance: Math.round(message.distance * 10) / 10,
    users: [{ id: message.id, name: nick, ready: true }],
    owner: message.id,
    lastAccessed: new Date(),
  });
  const nick = await getNameFromID(message.id);
  socket.join(code);
  socket.emit("room_code", code);
  socket.emit("users_change", {
    owner: message.id,
    users: [{ id: message.id, name: nick, ready: true }],
  });
}

async function joinHandler(message, socket) {
  console.log(message.room);
  const room = await collection.findOne({ code: message.room });
  console.log(room);
  if (!room) {
    // handle error
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
  const ownedRooms = await collection.findOne(
    { owner: message.id },
    { projection: { code: 1 } }
  );
  if (ownedRooms) {
    socket.emit("room_code", ownedRooms.code);
    socket.join(ownedRooms.code);
    const room = await getAllUsersInRoom(ownedRooms.code);
    console.log(room);
    socket.emit("users_change", room);
  }
}

async function getAllUsersInRoom(code) {
  const room = await collection.findOne(
    { code },
    { projection: { users: 1, owner: 1 } }
  );
  return room;
}

async function leaveHandler(message, socket) {
  console.log(message.room);
  const res = await collection.updateOne(
    { code: message.room },
    {
      $pull: { users: { id: message.id } },
    }
  );
  socket.leave(message.room);
  const room = await getAllUsersInRoom(message.room);

  io.to(message.room).emit("users_change", room);
}

async function readyHandler(message, socket) {
  console.log(message);
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
