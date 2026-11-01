import { Component, OnInit } from '@angular/core';
import { MatTabNav, MatTabLink, MatTabNavPanel } from '@angular/material/tabs';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'tabs',
    templateUrl: './tabs.component.html',
    styleUrls: ['./tabs.component.scss'],
    imports: [MatTabNav, MatTabLink, RouterLinkActive, RouterLink, MatIcon, MatTabNavPanel]
})
export class TabsComponent implements OnInit {

    links : { link : string, icon : string, label : string}[] = [];

    ngOnInit(): void {
	
	const links = [
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

