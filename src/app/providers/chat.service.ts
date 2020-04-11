import { RoomInterface } from "./../interfaces/room.interface";
import { Injectable } from "@angular/core";
import { map, filter } from "rxjs/operators";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { MessageInterface } from "../interfaces/message.interface";
import { MessageDayInterface } from "../interfaces/messageday.interface";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class ChatService {
  private roomsCollection: AngularFirestoreCollection<RoomInterface>;
  rooms: RoomInterface[] = [];

  private roomDoc: AngularFirestoreDocument<RoomInterface>;
  private messagesCollection: AngularFirestoreCollection<MessageInterface>;
  messages: MessageInterface[] = [];

  private messageDoc: AngularFirestoreDocument<MessageDayInterface>;

  constructor(private afs: AngularFirestore, private auth: AuthService) {}

  loadRooms() {
    this.roomsCollection = this.afs.collection<RoomInterface>("rooms", (ref) =>
      ref.orderBy("slug")
    );

    return this.roomsCollection.valueChanges().pipe(
      map((rooms: RoomInterface[]) => {
        this.rooms = rooms;
        console.log(this.rooms);
      })
    );
  }

  loadMessages(key: string) {
    this.roomDoc = this.afs.doc<RoomInterface>(`rooms/${key}`);
    return this.roomDoc
      .collection<MessageInterface>("messages")
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as MessageInterface;
            const id = a.payload.doc.id;
            const messages = [];
            return { id, ...data };
          })
        )
      );
  }

  getMessagesFromMessages(room: string, id: string) {
    this.messageDoc = this.afs.doc<MessageDayInterface>(
      `rooms/${room}/messages/${id}`
    );

    return this.messageDoc
      .collection<MessageDayInterface>("messages", (ref) =>
        ref.orderBy("time", "asc")
      )
      .valueChanges();
  }

  getRoomBySlug(slug: string) {
    const chatsCollection = this.afs.collection<RoomInterface>("rooms", (ref) =>
      ref.where("slug", "==", slug).limit(1)
    );

    return chatsCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as RoomInterface;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  newRoom(room: RoomInterface) {
    return this.roomsCollection.add(room);
  }

  uniqueSlug(slug: string) {
    const collection = this.afs.collection<RoomInterface>("rooms", (ref) =>
      ref.where("slug", "==", slug)
    );
    return collection.get();
  }

  verificarDia(roomId: string) {
    // 1. Verificar si existen mensajes de hoy sino crear el nodo
    const date = new Date().toDateString();

    const messages = this.afs.collection<MessageInterface>(
      `rooms/${roomId}/messages`,
      (ref) => ref.where("date", "==", date)
    );

    return messages.get();
  }

  addDay(roomId: string) {
    const date = new Date().toDateString();
    const data: MessageInterface = {
      date,
    };

    const messages = this.afs.collection<MessageInterface>(
      `rooms/${roomId}/messages`
    );

    return messages.add(data);
  }

  newMessage(roomId: string, key: string, message: string) {
    const time = new Date().getTime();
    const timeString = new Date(time).toLocaleTimeString();

    const msg: any = {
      user: {
        uid: this.auth.usuario.uid,
        alias: "",
        name: this.auth.usuario.nombre,
        social: "",
        status: true,
        url_img: this.auth.usuario.photoURL,
      },
      message,
      time: timeString,
    };
    console.log(msg);

    const roomMessages = this.afs.doc<MessageDayInterface>(
      `rooms/${roomId}/messages/${key}`
    );
    const messages = roomMessages.collection<MessageDayInterface>("messages");

    return messages.add(msg);
  }
}
