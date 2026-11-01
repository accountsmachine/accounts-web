import { Component } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [MatCard, MatCardHeader, MatCardTitle, MatIcon, MatCardSubtitle, MatCardContent, MatButton]
})
export class HomeComponent {

}

