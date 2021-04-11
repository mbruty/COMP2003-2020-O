import { LatLng } from "react-native-maps";
import { io, Socket } from "socket.io-client";
import { includeAuth } from "../includeAuth";

type SocketObserver = (users: SocketUser[], code: number) => void;

export interface SocketUser {
  name: string;
  uid: string;
  ready: boolean;
  owner: boolean;
}

export class GroupObserver {
  private socket: Socket;
  private observers: SocketObserver[] = [];
  private members: SocketUser[];
  private code: number = 0;
  constructor() {
    console.log("New observer");

    this.socket = io("http://785e3988ed41.ngrok.io/", {
      transports: ["websocket"],
      jsonp: false,
    });

    this.socket.on("message", console.log)
    // Initalize listeners
    this.socket.on("connect", () => {
      
      if(this.code !== 0) {
        this.join(this.code);
      }
      console.log("Websocket connected!");
    });

    this.socket.on("user_join", (data) => {
      // Convert each element's ready string to a boolean
      this.members = data.map((element) => {
        element.ready = element.ready === "true";
        element.owner = element.owner === "true";
        return element;
      });
      this.onChange();
    });

    this.socket.on("room_code", (code) => {
      this.code = code;
      this.onChange();
    })

    this.socket.on("join_check", async() => {
      const auth = await includeAuth();
      this.socket.emit("join_check", {id: auth.userid})
    })
  }

  public async create(latlon: LatLng, distance: number ) {
    const auth = await includeAuth();
    this.socket.emit("create", {latlon: `${latlon.latitude},${latlon.longitude}`, distance, id: auth.userid});
  }

  public async join(room) {
    try {
      const auth = await includeAuth();
      this.socket.emit("join", { id: auth.userid, room: room });
      this.code = room;
      this.onChange();
    } catch (e) {
      alert(e);
    }
  }

  public subscribe(observer: SocketObserver) {
    this.observers.push(observer);
  }

  private onChange() {
    if (this.observers.length > 0)
      this.observers.forEach((o) => o(this.members, this.code));
  }
}
