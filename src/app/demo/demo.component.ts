import { Component } from "@angular/core";
import { DndDropEvent, DropEffect } from "ngx-drag-drop";

interface NestableListItem {
    kind : string;
    content : string;
    disable? : boolean;
    handle? : boolean;
    customDragImage? : boolean;
    children? : NestableListItem[];
    accepts? : string[];
    offers : string;
    title? : string;
}

@Component( {
    selector: "demo",
    templateUrl: "./demo.component.html",
    styleUrls: [ "./demo.component.scss" ]
} )
export class DemoComponent {

    menuList : NestableListItem[] = [
	{ kind: "report", content: "report",
	  children: [], accepts: ["component"], offers: "report" },
	{ kind: "frs-102", content: "FRS-102", title: "<title>",
	  children: [], accepts: ["report"], offers: "accounts" },
	{ kind: "micro-entity", content: "micro-entity",
	  accepts: [], offers: "accounts" },
	{ kind: "title-page", content: "title page",
	  offers: "component" },
	{ kind: "company-info", content: "company info",
	  offers: "component" },
	{ kind: "financial-position", content: "balance sheet",
	  offers: "component" },
	{ kind: "simple-notes", content: "simple notes",
	  offers: "component" },
    ];
    
    nestableList:NestableListItem[] = [
    ];

    contains(l : NestableListItem[], k : string) : boolean {
	for (var elt of l) {
	    if (elt.kind == k) {
		return true;
	    }
	    if (elt.children) {
		if (this.contains(elt.children, k)) return true;
	    }
	}
	return false;
    }

    is_disabled(item : any) : boolean {
	if (item.kind == "frs-102") {
	    if (this.contains(this.nestableList, "frs-102"))
		return true;
	    if (this.contains(this.nestableList, "micro-entity"))
		return true;
	}
	if (item.kind == "micro-entity") {
	    if (this.contains(this.nestableList, "frs-102"))
		return true;
	    if (this.contains(this.nestableList, "micro-entity"))
		return true;
	}
	if (item.kind == "report") {
	    if (this.contains(this.nestableList, "report"))
		return true;
	}
	return false;
    }

    private currentDraggableEvent?:DragEvent;
    private currentDragEffectMsg?:string;

    constructor() {
    }

    onDragStart( event:DragEvent ) {
	this.currentDragEffectMsg = "";
	this.currentDraggableEvent = event;
    }

    onDragged( item:any, list:any[], effect:DropEffect ) {
	if( effect === "move" ) {
	    const index = list.indexOf( item );
	    list.splice( index, 1 );
	}
    }

    onDragEnd( event:DragEvent ) {
	this.currentDraggableEvent = event;
    }

    onDrop( event:DndDropEvent, list?:any[] ) {
	if (list &&
	    (event.dropEffect === "copy" || event.dropEffect === "move")) {

	    let index = event.index;

	    if (typeof index === "undefined") {
		index = list.length;
	    }

	    list.splice( index, 0, event.data );
	}
    }

}

