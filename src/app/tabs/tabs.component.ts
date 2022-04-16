import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

    links : { link : string, icon : string, label : string}[] = [];

    constructor(
    ) {
    }

    ngOnInit(): void {
	
	let links = [
	    { label: "Home", icon: "home", link: "/home" },
	];
	
	links.push(
	    { label: "Company", icon : "business", link: "/company" }
	);

	links.push(
	    { label: "Status", icon : "search", link: "/status" }
	);

	links.push(
	    { label: "Books", icon: "menu_book", link: "/books" }
	);

	links.push(
	    { label: "Filing", icon: "assured_workload", link: "/filing" }
	);

	links.push(
	    { label: "My account", icon: "account_circle", link: "/profile" }
	);

	this.links = links;

    }

}

