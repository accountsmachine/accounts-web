import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VatService } from '../../vat/vat.service';

@Component({
    selector: 'app-vat-token',
    templateUrl: './vat-token.component.html',
    styleUrls: ['./vat-token.component.scss']
})
export class VatTokenComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private vat = inject(VatService);


    ngOnInit(): void {
	this.route.queryParams.subscribe(params => {

	    if (params["code"]) {
		this.vat.receiveToken(params["code"], params["state"]);
	    }

	    this.router.navigate(["/home"]);

	});


    }

}
