import { ExpoPushToken } from "expo-notifications";
import { LatLng } from "react-native-maps";
import { io, Socket } from "socket.io-client";
import { WS_URL } from "../../constants";
import { includeAuth } from "../includeAuth";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";

type SocketObserver = (
  users: SocketUser[],
  code: number,
  swipeStarted: boolean
) => void;

export interface SocketUser {
  name: string;
  id: string;
  ready: boolean;
  owner: boolean;
}

export class GroupObserver {
  private socket: Socket;
  private observers: SocketObserver[] = [];
  private members: SocketUser[];
  private code: number = 0;
  private userId: string;
  private swipeStarted: boolean = false;
  public onError: (message: string) => void | undefined;
  public onSwipeStart: () => void | undefined;
  constructor(userId: string) {
    console.log("New observer");
    this.userId = userId;
    this.socket = io(WS_URL, {
      transports: ["websocket"],
      jsonp: false,
    });

    this.socket.on("message", (message) => {
      console.log(message);
      this.code = 0;
      this.onError(message);
      this.onChange();
    });
    // Initalize listeners
    this.socket.on("connect", () => {
      this.socket.emit("join_check", { id: this.userId });
    });

    this.socket.on("users_change", (data) => {
      if (data.started !== undefined) {
        this.swipeStarted = data.started;
      }
      // Convert each element's ready string to a boolean
      this.members = data.users.map((element) => {
        element.owner = element.id === data.owner;
        return element;
      });

      this.onChange();
    });

    this.socket.on("room_code", (code) => {
      this.code = code;
      // Try and get the push notification token
      this.registerForPushNotifications();
      this.onChange();
    });

    this.socket.on("kicked", (kickedId) => {
      this.socket.emit("leave", { id: this.userId, room: this.code });
      if (kickedId === this.userId) {
        this.code = 0;
        this.onError("You have been banned from this room");
        this.onChange();
      }
    });

    this.socket.on("disband", () => {
      console.log("disband");

      // Leave the room
      this.socket.emit("leave", { room: this.code, id: this.userId });
      this.code = 0;
      this.onError("The owner of the room has delete the room");
      this.onChange();
    });

    this.socket.on("start_swipe", () => {
      if (this.onSwipeStart) {
        this.onSwipeStart();
      }
    });
    this.socket.on("finish", (message) => {
      alert("Match!" + message.restaurantID);
    });
    this.socket.on("joined", () => {
      this.registerForPushNotifications(); // Once we've joined, try and get the push notification token
      this.onChange();
    });
  }

  public onSwipe(restaurantID: number, foodID: number, isLike: boolean) {
    if (isLike) {
      this.socket.emit("swipe", {
        restaurantID,
        foodID,
        room: this.code,
        id: this.userId,
      });
    }
  }

  public kick(id: string) {
    // ToDo : Ban the user from the room
    this.socket.emit("kick", { id, room: this.code });
  }

  public async create(latlon: LatLng, distance: number) {
    const auth = await includeAuth();
    this.socket.emit("create", {
      latlon: { lat: latlon.latitude, lng: latlon.longitude },
      distance,
      id: auth.userid,
    });
  }

  public leave() {
    this.socket.emit("leave", { id: this.userId, room: this.code });
    this.code = -1;
    this.swipeStarted = false;
    this.onChange();
  }
  public join(room) {
    try {
      this.socket.emit("join", {
        id: this.userId,
        room: room,
      });
      this.code = room;
    } catch (e) {
      alert(e);
    }
  }

  public startSwipe() {
    this.socket.emit("start_swipe", { room: this.code });
  }

  public async toggleReady() {
    // Get the ready state of the current user
    const auth = await includeAuth();
    const currentUser = this.members.find((el) => el.id === auth.userid);
    this.socket.emit("ready", {
      ready: !currentUser.ready,
      id: currentUser.id,
      room: this.code,
    });
  }
  public subscribe(observer: SocketObserver) {
    this.observers.push(observer);
  }

  private onChange() {
    if (this.observers.length > 0)
      this.observers.forEach((o) =>
        o(this.members, this.code, this.swipeStarted)
      );
  }
  private async registerForPushNotifications() {
    if (Constants.isDevice) {
      // We can't get notifications from a simulator :(
      // Get the notifications permission
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        return;
      }
      if (Platform.OS === "android") {
        console.log("here");
        try {
          Notifications.setNotificationChannelAsync(
            "notifications-sound-channel",
            {
              name: "Track and taste",
              importance: Notifications.AndroidImportance.MAX,
              vibrationPattern: [0, 250, 250, 250],
              lightColor: "#FF231F7C",
            }
          );
        } catch (e) {
          alert(e);
        }
      }

      // If the permission was granted, then get the token
      const token = await Notifications.getExpoPushTokenAsync();
      // Sometimes we won't have this
      // Some devices do not support push tokens...
      // Some users won't give us perms
      this.socket.emit("register_notifications", {
        id: this.userId,
        room: this.code,
        token: token.data,
      });
    }
  }
}
