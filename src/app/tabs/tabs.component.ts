import { Component, OnInit } from '@angular/core';
import { UserProfileService, UserProfile } from '../user-profile.service';

@Component({
    selector: 'tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

    links : { link : string, icon : string, label : string}[] = [];

    constructor(
	private profile : UserProfileService,
    ) {
    }

    ngOnInit(): void {

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
