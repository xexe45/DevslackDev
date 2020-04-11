import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { AuthService } from "../providers/auth.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private route: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.auth.authState.pipe(
      map((user) => {
        if (!user) {
          this.route.navigate(["/login"]);
          return false;
        }

        return true;
      })
    );
  }
}
