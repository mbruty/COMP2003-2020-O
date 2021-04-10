import { io, Socket } from "socket.io-client";
import { includeAuth } from "../includeAuth";

type SocketObserver = (users: SocketUser[]) => void;

export interface SocketUser {
  name: string;
  uid: string;
  ready: boolean;
}

export class GroupObserver {
  private socket: Socket;
  private observers: SocketObserver[] = [];
  private members: SocketUser[];
  constructor() {
    console.log("New observer");

    this.socket = io("http://890084b2a2f3.ngrok.io", {
      transports: ["websocket"],
      jsonp: false,
    });

    this.join(123456).catch((e) => console.log(e));

    // Initalize listeners
    this.socket.on("connect", this.onConnect);

    this.socket.on("user_join", (data) => {
      // Convert each element's ready string to a boolean
      this.members = data.map((element) => {
        element.ready = element.ready === "true";
        return element;
      });
      this.onChange();
    });
  }

  private onConnect() {
    console.log("Websocket connected!");
  }

  public create(data: { latlon: string; distance: number }) {
    this.socket.emit("create", data);
  }

  public async join(room) {
    try {
      const auth = await includeAuth();
      this.socket.emit("join", { id: auth.userid, room: room });
    } catch (e) {
      alert(e);
    }
  }

  public subscribeToJoin(observer: SocketObserver) {
    this.observers.push(observer);
  }

  private onChange() {
    if (this.observers.length > 0)
      this.observers.forEach((o) => o(this.members));
  }
}
