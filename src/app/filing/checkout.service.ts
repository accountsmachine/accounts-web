import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { CommerceService } from './commerce.service';
import { CompanyService, Company, Companies } from '../company/company.service';

@Injectable({
    providedIn: 'root'
})
export class CheckoutService {

    constructor(
	private commerce : CommerceService,
    ) {

    }

}

