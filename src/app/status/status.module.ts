import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field'; 
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

import { StatusRoutingModule } from './status-routing.module';
import { VatComponent } from './vat/vat.component';
import { CorptaxComponent } from './corptax/corptax.component';
import { AccountsComponent } from './accounts/accounts.component';
import { ObligationsComponent } from './obligations/obligations.component';
import { PaymentsComponent } from './payments/payments.component';
import { LiabilitiesComponent } from './liabilities/liabilities.component';
import {
    DisconnectConfirmationComponent
} from './disconnect-confirmation/disconnect-confirmation.component';

@NgModule({
    declarations: [
	OverviewComponent,
	VatComponent,
	CorptaxComponent,
	AccountsComponent,
	ObligationsComponent,
	PaymentsComponent,
	LiabilitiesComponent,
	DisconnectConfirmationComponent,
    ],
    imports: [
	CommonModule,
	StatusRoutingModule,
	MatDialogModule,
	MatTableModule,
	MatIconModule,
	MatInputModule,
	MatButtonModule,
	ReactiveFormsModule,
	MatButtonToggleModule,
	MatCardModule,
	MatSelectModule,
	MatFormFieldModule,
	FormsModule,
    ]
})
export class StatusModule { }

