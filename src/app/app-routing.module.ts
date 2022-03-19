import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FrontComponent } from './front/front.component';
import { HomeComponent } from './home/home.component';

import { VatTokenComponent }
    from './auth/vat-token/vat-token.component';

import { AuthGuardService as AuthGuard } from './auth-guard.service';

const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "vat-token", canActivate: [AuthGuard],
      loadChildren: () => import(
	  './auth/auth.module'
      ).then(m => m.AuthModule)
    },
    { path: "front", component: FrontComponent },
    { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
    { path: "company", canActivate: [AuthGuard],
      loadChildren: () =>
      import( './company/company.module').then(m => m.CompanyModule)
    },
    { path: "books", canActivate: [AuthGuard],
      loadChildren: () => import(
	  './books/books.module'
      ).then(m => m.BooksModule)
    },
    { path: "accounts", canActivate: [AuthGuard],
      loadChildren: () => import(
	  './accounts/accounts.module'
      ).then(m => m.AccountsModule)
    },
    { path: "status", canActivate: [AuthGuard],
      loadChildren: () => import(
	  './status/status.module'
      ).then(m => m.StatusModule)
    },
    { path: "filing", canActivate: [AuthGuard],
      loadChildren: () => import(
	  './filing/filing.module'
      ).then(m => m.FilingModule)
    },
    { path: "corptax", canActivate: [AuthGuard],
      loadChildren: () => import(
	  './corptax/corptax.module'
      ).then(m => m.CorptaxModule)
    },
    { path: "vat", canActivate: [AuthGuard],
      loadChildren: () => import(
	  './vat/vat.module'
      ).then(m => m.VatModule)
    },
    { path: '**', redirectTo: 'front' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

