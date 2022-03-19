import { Component, OnInit } from '@angular/core';

import { UserProfileService, UserProfile } from '../user-profile.service';
import { WorkingService } from '../working.service';

@Component({
    selector: 'main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

    loading = false;

    links : { link : string, icon : string, label : string}[] = [];

    constructor(
	private profile : UserProfileService,
	private working : WorkingService,
    ) {

    }

    ngOnInit(): void {
	
	this.working.onchange().subscribe(
	    w => {
		this.loading = w;
	    }
	);

	this.profile.onload().subscribe((profile : UserProfile) => {

	    let links = [
		{ label: "Home", icon: "home", link: "/home" },
	    ];

	    if (profile.has_feature("company"))
		links.push(
		    { label: "Company", icon : "business", link: "/company" }
		);

	    links.push(
		{ label: "Status", icon : "search", link: "/status" }
	    );

	    if (profile.has_feature("books"))
		links.push(
		    { label: "Books", icon: "menu_book", link: "/books" }
		);

	    links.push(
		{ label: "Filing", icon: "assured_workload", link: "/filing" }
	    );

	    this.links = links;

	});

    }

}
