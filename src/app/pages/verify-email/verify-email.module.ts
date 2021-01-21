import { ComponentsModule } from './../../components/components.module';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { VerifyEmailPageRoutingModule } from "./verify-email-routing.module";

import { VerifyEmailPage } from "./verify-email.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    VerifyEmailPageRoutingModule,
  ],
  declarations: [VerifyEmailPage],
})
export class VerifyEmailPageModule {}
