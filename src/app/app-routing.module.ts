import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

import { VatTokenComponent }
    from './auth/vat-token/vat-token.component';

import { AuthGuardService as AuthGuard } from './auth-guard.service';

const routes: Routes = [

    { path: "vat-token", canActivate: [AuthGuard],
      loadChildren: () => import(
	  './auth/auth.module'
      ).then(m => m.AuthModule)
    },

    { path: "home", component: HomeComponent },

    { path: "company",
      loadChildren: () =>
      import( './company/company.module').then(m => m.CompanyModule)
    },
    { path: "books",
      loadChildren: () => import(
	  './books/books.module'
      ).then(m => m.BooksModule)
    },
    { path: "accounts",
      loadChildren: () => import(
	  './accounts/accounts.module'
      ).then(m => m.AccountsModule)
    },
    { path: "status",
      loadChildren: () => import(
	  './status/status.module'
      ).then(m => m.StatusModule)
    },
    { path: "filing",
      loadChildren: () => import(
	  './filing/filing.module'
      ).then(m => m.FilingModule)
    },
    { path: "corptax",
      loadChildren: () => import(
	  './corptax/corptax.module'
      ).then(m => m.CorptaxModule)
    },
    { path: "vat",
      loadChildren: () => import(
	  './vat/vat.module'
      ).then(m => m.VatModule)
    },
    { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

