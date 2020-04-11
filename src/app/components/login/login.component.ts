import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../providers/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  login(provider: string) {
    this.authService
      .login(provider)
      .then((data) => {
        console.log(data);
        this.router.navigateByUrl("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
