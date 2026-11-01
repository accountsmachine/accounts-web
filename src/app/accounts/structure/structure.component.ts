import { Component } from '@angular/core';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
import { NavComponent } from '../nav/nav.component';

@Component({
    selector: 'accounts-structure',
    templateUrl: './structure.component.html',
    styleUrls: ['./structure.component.scss'],
    imports: [MatDrawerContainer, MatDrawer, NavComponent, MatDrawerContent]
})
export class StructureComponent {

    revert() {
    }

}

