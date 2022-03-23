
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot }
    from '@angular/router';
import { AuthService } from './profile/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

    constructor(
	private router : Router,
        private auth : AuthService,
    ) {
	
    }

    canActivate(
	route : ActivatedRouteSnapshot,
	state: RouterStateSnapshot,
    ) : boolean {

        if (this.auth.authenticated()) {
	console.log("auth guard permits");
	    return true;
	} else {
//	    console.log("NOT AUTHED, bounce");
//	    this.router.navigate(
//		[ "/front" ],
//		{ queryParams: { returnUrl: state.url } }
//	    );
	    console.log("auth guard denies");
//	    return false;
	    return true;
	}

    }

}

