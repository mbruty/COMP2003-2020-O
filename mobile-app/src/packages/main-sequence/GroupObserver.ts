import { LatLng } from "react-native-maps";
import { io, Socket } from "socket.io-client";
import { WS_URL } from "../../constants";
import { includeAuth } from "../includeAuth";

type SocketObserver = (users: SocketUser[], code: number) => void;

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
  public onError: () => void | undefined;
  constructor(userId: string) {
    console.log("New observer");
    this.userId = userId;
    this.socket = io(WS_URL, {
      transports: ["websocket"],
      jsonp: false,
    });

    this.socket.on("message", (message) => {
      console.log(message);
      if (message === "Room does not exist") {
        this.code = 0;
        this.onError();
        this.onChange();
      }
    });
    // Initalize listeners
    this.socket.on("connect", () => {
      this.socket.emit("join_check", { id: this.userId });
    });

    this.socket.on("users_change", (data) => {
      // Convert each element's ready string to a boolean
      this.members = data.users.map((element) => {
        element.owner = element.id === data.owner;
        return element;
      });

      this.onChange();
    });

    this.socket.on("room_code", (code) => {
      this.code = code;
      this.onChange();
    });
  }

  public kick(id: string) {
    // ToDo : Ban the user from the room
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
    this.onChange();
  }
  public async join(room) {
    console.log({ room });

    try {
      this.socket.emit("join", { id: this.userId, room: room });
      this.code = room;
      this.onChange();
    } catch (e) {
      alert(e);
    }
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
      this.observers.forEach((o) => o(this.members, this.code));
  }
}
