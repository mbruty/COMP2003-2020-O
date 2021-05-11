const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const mysql = require("mysql2/promise");
const { Expo } = require("expo-server-sdk");
require("dotenv").config();

const expo = new Expo();
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
  http.listen(process.env.PORT, function () {
    console.log("⚡️ Server listening on port ", process.env.PORT);
  });
  test();
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

  socket.on("register_notifications", (message) =>
    notificationHandler(message, socket)
  );
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
    restaurantsLiked: [],
    matched: false,
    lastAccessed: new Date(),
  });
  socket.join(code.toString());
  socket.emit("room_code", { code: code.toString(), state: "waiting" });
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
      $addToSet: {
        users: {
          id: message.id,
          name: nick,
          ready: false,
        },
      },
    }
  );
  const data = await getAllUsersInRoom(room.code);
  socket.emit("joined", true); // Tell the client they have successfully joined
  io.to(message.room).emit("users_change", data);
}

async function joinCheckHandler(message, socket) {
  const joinedRoom = await collection.findOne({ "users.id": message.id });
  if (joinedRoom) {
    let roomState = joinedRoom.started ? "swipe" : "waiting";
    if (joinedRoom.matched) {
      roomState = "matched";
    }
    socket.emit("room_code", {
      code: joinedRoom.code,
      state: roomState,
    });
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
  const room = await collection.findOne({ code: message.room });
  let userFoodLikes = room[`likes-${message.id}`];
  let restaurantsLiked = room.restaurantsLiked;
  // If we have liked restaurants
  if (restaurantsLiked.length > 0) {
    // If some one has already liked that restaurant
    const restaurantExistsInDoc = restaurantsLiked.some(
      (item) => item.restaurantID === message.restaurantID
    );
    // It exists, so update
    if (restaurantExistsInDoc) {
      restaurantsLiked.forEach((restaurant) => {
        // Find the correct restuarant
        if (restaurant.restaurantID === message.restaurantID) {
          // Find the user
          const userExistsInRestaurantArray = restaurant.likes.some(
            (user) => user.userID === message.id
          );
          // User exists in the array
          if (userExistsInRestaurantArray) {
            restaurant.likes.forEach((user) => {
              console.log(user);
              if (user.userID === message.id) {
                user.items.push(message.foodID);
              }
              return user;
            });
          }
          // If the user hasn't liked it, add them!
          else {
            restaurant.likes.push({
              userID: message.id,
              items: [message.foodID],
            });
            // See if all the other users have liked this restaurant
            // assume every one has liked
            let isLikedByAll = true;
            room.users.forEach(({ id }) => {
              if (
                restaurant.likes.find((user) => user.userID === id) ===
                undefined
              ) {
                isLikedByAll = false;
              }
            });
            if (isLikedByAll) {
              io.to(message.room).emit("finish", {
                restaurantID: message.restaurantID,
              });
              console.log("It's a match!");
              room.pushTokens.forEach((token) => {});
            }
          }
        }
        return restaurant;
      });
    }
    // No one has liked that restaurant, so create it!
    else {
      restaurantsLiked.push({
        restaurantID: message.restaurantID,
        likes: [
          {
            userID: message.id,
            items: [message.foodID],
          },
        ],
      });
    }
  }
  // We don't have any liked restaurants, so just set 'em
  else {
    restaurantsLiked = [
      {
        restaurantID: message.restaurantID,
        likes: [
          {
            userID: message.id,
            items: [message.foodID],
          },
        ],
      },
    ];
  }
  if (userFoodLikes === undefined) {
    userFoodLikes = [message.foodID];
  } else {
    userFoodLikes.push(message.foodID);
  }
  await collection.updateOne(
    { code: message.room },
    {
      $set: {
        restaurantsLiked: restaurantsLiked,
      },
    }
  );
}

async function notificationHandler(message, socket) {
  console.log(message);
  await collection.updateOne(
    { code: message.room },
    {
      $addToSet: { pushTokens: message.token },
    }
  );
}

async function test() {
  const messages = [];
  const token = "";
  if (Expo.isExpoPushToken(token)) {
    messages.push({
      to: token,
      sound: "default",
      body: "🔥🔥 Your group has decided on a place to eat! 🔥🔥",
      channelId: "notifications-sound-channel",
    });
  }
  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log(ticketChunk);
      tickets.push(ticketChunk);
    } catch (e) {
      console.log(e); // It isn't vital that these send...
      // Although expo do say its more likely that notifications get sent twice over failing which is nice
    }
  }
  let receiptIds = [];
  for (let ticket of tickets) {
    // NOTE: Not all tickets have IDs; for example, tickets for notifications
    // that could not be enqueued will have error information and no receipt ID.
    if (ticket.id) {
      receiptIds.push(ticket.id);
    }
  }

  let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
  // Like sending notifications, there are different strategies you could use
  // to retrieve batches of receipts from the Expo service.
  for (let chunk of receiptIdChunks) {
    try {
      let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
      console.log(receipts);

      // The receipts specify whether Apple or Google successfully received the
      // notification and information about an error, if one occurred.
      for (let receiptId in receipts) {
        let { status, message, details } = receipts[receiptId];
        if (status === "ok") {
          console.log("OK");
          continue;
        } else if (status === "error") {
          console.error(
            `There was an error sending a notification: ${message}`
          );
          if (details && details.error) {
            // The error codes are listed in the Expo documentation:
            // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
            // You must handle the errors appropriately.
            console.error(`The error code is ${details.error}`);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}
