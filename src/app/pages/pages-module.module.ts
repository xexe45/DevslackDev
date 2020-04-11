import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PagesComponent } from "./pages.component";
import { PagesRoutingModule } from "./pages-routing.module";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MaterialModule } from "./material.module";
import { SharedModule } from "./shared/shared.module";
import { RoomComponent } from "./room/room.component";
import { FormsModule } from "@angular/forms";
import { CreateChannelComponent } from "./create-channel/create-channel.component";
import { IntTimePipe } from "../pipes/int-time.pipe";

@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    RoomComponent,
    CreateChannelComponent,
    IntTimePipe,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
  ],
  exports: [
    PagesRoutingModule,
    DashboardComponent,
    RoomComponent,
    CreateChannelComponent,
    IntTimePipe,
  ],
})
export class PagesModuleModule {}
