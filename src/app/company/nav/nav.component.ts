import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'navigator',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
    imports: [MatButton, RouterLinkActive, RouterLink, MatIcon]
})
export class NavComponent {

}
