import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ChatService } from "../../providers/chat.service";
import { RoomInterface } from "../../interfaces/room.interface";

@Component({
  selector: "app-room",
  templateUrl: "./room.component.html",
  styleUrls: ["./room.component.scss"],
})
export class RoomComponent implements OnInit {
  message: string;
  room: any = {};
  messages: any = [];
  element: any;
  disabled = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.element = document.getElementById("app-mensajes");

    this.activatedRoute.params.subscribe((params) => {
      const id = params["id"];
      console.log(id);
      this.getRoom(id);
    });
  }

  getRoom(slug: string) {
    this.chatService.getRoomBySlug(slug).subscribe((data) => {
      console.log(data);
      this.room = data[0];
      this.getMessages(this.room.id);
    });
  }

  getMessages(key: string) {
    this.chatService.loadMessages(key).subscribe((data) => {
      const messages = data;
      this.myMessages(messages).then((mgs) => {
        this.messages = messages;
        console.log(this.messages);
      });
    });
  }

  myMessages(messages: any[]) {
    return new Promise((resolve, reject) => {
      messages.forEach((message) => {
        this.chatService
          .getMessagesFromMessages(this.room.id, message.id)
          .subscribe((mgs: any) => {
            message.messages = mgs;
            setTimeout(() => {
              this.element.scrollTop = this.element.scrollHeight;
            }, 20);
          });
      });
      resolve(messages);
    });
  }

  enviar() {
    console.log("enviando");
    this.disabled = true;
    this.chatService.verificarDia(this.room.id).subscribe((data: any) => {
      console.log(data);
      if (data.docs.length === 0) {
        /** Creo el dia y anido el mensaje */
        this.chatService.addDay(this.room.id).then((day: any) => {
          const id = day.id;
          this.chatService
            .newMessage(this.room.id, id, this.message)
            .then(() => {
              this.message = "";
              this.disabled = false;
            });
        });
      } else {
        /** Anido el mensaje */
        const dia = data.docs[0];
        console.log(dia);
        this.chatService
          .newMessage(this.room.id, dia.id, this.message)
          .then(() => {
            this.message = "";
            this.disabled = false;
          });
      }
    });
  }
}
