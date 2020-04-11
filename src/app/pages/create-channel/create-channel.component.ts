import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { RoomInterface } from "../../interfaces/room.interface";
import { ChatService } from "../../providers/chat.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";

@Component({
  selector: "app-create-channel",
  templateUrl: "./create-channel.component.html",
  styleUrls: ["./create-channel.component.scss"],
})
export class CreateChannelComponent implements OnInit {
  room: RoomInterface = {
    name: "",
    slug: "",
    description: "",
  };

  constructor(private chatService: ChatService, private router: Router) {}

  ngOnInit(): void {}

  create(forma: NgForm) {
    if (forma.invalid) {
      Object.values(forma.controls).forEach((control) => {
        control.markAsTouched();
      });

      return;
    }

    this.room.slug = this.createSlug(this.room.name);

    Swal.fire({
      allowOutsideClick: false,
      icon: "info",
      text: "Espere porfavor...",
    });

    Swal.showLoading();

    this.chatService.uniqueSlug(this.room.slug).subscribe((rooms: any) => {
      if (rooms.docs.length > 0) {
        Swal.fire({
          title: "Ooops!",
          icon: "warning",
          text: "Ya existe un canal creado con ese nombre",
        });
        this.clearFields();
      } else {
        this.createChannel();
      }
    });
  }

  createChannel() {
    this.chatService
      .newRoom(this.room)
      .then((response: any) => {
        console.log(response);
        // Swal.close();
        Swal.fire({
          title: "Bien Hecho!",
          icon: "success",
          text: "El canal fue creado satisfactoriamente",
        });
        this.clearFields();
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          title: "Oooops!",
          icon: "error",
          text: "Ocurrio un error",
        });
      });
  }

  cancelar() {
    this.router.navigateByUrl("/home");
  }

  private createSlug(text: string) {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  }

  private clearFields() {
    this.room = {
      name: "",
      slug: "",
      description: "",
    };
  }
}
