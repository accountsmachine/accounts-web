import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CredentialsComponent }
    from './credentials/credentials.component';

const routes: Routes = [
    { path: '', component: CredentialsComponent },
//    { path: ':id', children: [
//	{ path: 'detail', component: DetailComponent },
//	{ path: 'upload', component: UploadComponent },
//    ] }
];
    
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

