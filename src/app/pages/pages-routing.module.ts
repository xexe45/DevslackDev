import { NgModule } from "@angular/core";
import { RouterModule, Routes, CanActivate } from "@angular/router";

import { PagesComponent } from "./pages.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { RoomComponent } from "./room/room.component";
import { CreateChannelComponent } from "./create-channel/create-channel.component";
import { AuthGuard } from "../guards/auth.guard";

const pagesRoutes = [
  {
    path: "home",
    component: PagesComponent,
    children: [
      { path: "", component: DashboardComponent },
      { path: "rooms/create", component: CreateChannelComponent },
      { path: "rooms/:id", component: RoomComponent },
      { path: "**", redirectTo: "", pathMatch: "full" },
    ],
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(pagesRoutes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
