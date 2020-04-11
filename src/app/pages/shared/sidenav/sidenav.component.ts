import { Component, OnInit } from "@angular/core";
import { ChatService } from "../../../providers/chat.service";
import { Router } from "@angular/router";
import { AuthService } from "../../../providers/auth.service";

@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
})
export class SidenavComponent implements OnInit {
  loading = false;

  constructor(
    public chatService: ChatService,
    private router: Router,
    public auth: AuthService
  ) {
    this.chatService.loadRooms().subscribe();
  }

  ngOnInit(): void {}

  newChannel() {
    this.router.navigateByUrl("/home/rooms/create");
  }

  previus(event) {
    event.preventDefault();
  }

  next(event) {
    event.preventDefault();
  }

  salir() {
    this.auth.logout().then(() => {
      this.router.navigateByUrl("login");
    });
  }
}
