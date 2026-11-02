import { Component } from '@angular/core';
import { BalanceComponent } from '../balance/balance.component';
import { ShopComponent } from '../shop/shop.component';

@Component({
    selector: 'commerce',
    templateUrl: './commerce.component.html',
    styleUrls: ['./commerce.component.scss'],
    imports: [BalanceComponent, ShopComponent]
})
export class CommerceComponent {

}
