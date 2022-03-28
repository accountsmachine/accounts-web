import { Injectable } from '@angular/core';

import { StripeService, StripePaymentElementComponent
       } from 'ngx-stripe';
import { StripeElementsOptions, PaymentIntent
       } from '@stripe/stripe-js';

import { CheckoutService } from './checkout.service';

@Injectable({
  providedIn: 'root'
})
export class StripePaymentService {

  constructor() { }

}

