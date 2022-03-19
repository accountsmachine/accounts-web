import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VatTokenComponent } from './vat-token/vat-token.component';
import { CredentialsComponent } from './credentials/credentials.component';

import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
    VatTokenComponent,
    CredentialsComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
  ]
})
export class AuthModule { }
