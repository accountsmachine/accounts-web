import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLinkActive, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'navigator',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
    imports: [MatButton, RouterLinkActive, RouterLink, MatIcon]
})
export class NavComponent {
    private route = inject(ActivatedRoute);

}

