import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewComponent } from './overview/overview.component';

import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'; 
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { SharedModule } from '../shared/shared.module';

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
	SharedModule,
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

