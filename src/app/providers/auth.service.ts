import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
@Injectable({
  providedIn: "root",
})
export class AuthService {
  userToken: string;
  state = true;
  public usuario: any = {};

  constructor(public auth: AngularFireAuth) {
    this.auth.authState.subscribe((user) => {
      console.log("Estado del usuario: ", user);
      if (!user) {
        return;
      }
      this.state = true;
      this.usuario.nombre = user.displayName;
      this.usuario.uid = user.uid;
      this.usuario.photoURL = user.photoURL;
    });
  }

  login(provider: string) {
    if (provider === "google") {
      return this.auth.signInWithPopup(new auth.GoogleAuthProvider());
    } else {
      return this.auth.signInWithPopup(new auth.TwitterAuthProvider());
    }
  }

  logout() {
    this.usuario = {};
    this.state = false;
    return this.auth.signOut();
  }

  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem("token", idToken);

    const hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem("expira", hoy.getTime().toString());
  }

  private leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
    } else {
      this.userToken = "";
    }

    return this.userToken;
  }

  isAuthenticated(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }

    const expira = Number(localStorage.getItem("expira"));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }
}
