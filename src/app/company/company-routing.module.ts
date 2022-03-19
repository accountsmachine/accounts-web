import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NewComponent }
    from './new/new.component';
import { ListComponent }
    from './list/list.component';

import { BusinessConfigComponent }
    from './business-config/business-config.component';
import { AddressConfigComponent }
    from './address-config/address-config.component';
import { ContactConfigComponent }
    from './contact-config/contact-config.component';
import { WebConfigComponent }
    from './web-config/web-config.component';
import { ActivitiesConfigComponent }
    from './activities-config/activities-config.component';
import { TaxConfigComponent }
    from './tax-config/tax-config.component';
import { LogoComponent }
    from './logo/logo.component';

const routes: Routes = [
    { path: '', component: ListComponent, },
    { path: 'new', component: NewComponent },
    { path: ':id', children: [
	{ path: '', redirectTo: 'business', pathMatch: "full" },
	{ path: 'business', component: BusinessConfigComponent },
	{ path: 'address', component: AddressConfigComponent },
	{ path: 'contact', component: ContactConfigComponent },
	{ path: 'web', component: WebConfigComponent },
	{ path: 'activities', component: ActivitiesConfigComponent },
	{ path: 'tax', component: TaxConfigComponent },
	{ path: 'logo', component: LogoComponent },
    ] }
];
    
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }

