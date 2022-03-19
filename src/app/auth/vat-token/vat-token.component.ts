import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VatService } from '../../vat/vat.service';

@Component({
    selector: 'app-vat-token',
    templateUrl: './vat-token.component.html',
    styleUrls: ['./vat-token.component.scss']
})
export class VatTokenComponent implements OnInit {

    constructor(
	private route : ActivatedRoute,
	private router : Router,
	private vat : VatService,
    ) { }

    ngOnInit(): void {
	this.route.queryParams.subscribe(params => {

	    if (params["code"]) {
		this.vat.receiveToken(params["code"], params["state"]);
	    }

	    this.router.navigate(["/home"]);

	});


    }

}
