import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { UploadComponent } from './upload/upload.component';
import { DetailComponent } from './detail/detail.component';
import { MappingComponent } from './mapping/mapping.component';

const routes: Routes = [
    { path: '', component: ListComponent },
    { path: ':id', children: [
	{ path: 'detail', component: DetailComponent },
	{ path: 'mapping', component: MappingComponent },
	{ path: 'upload', component: UploadComponent },
    ] }
];
    
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule { }

