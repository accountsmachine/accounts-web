
import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot }
    from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
    private router = inject(Router);
    private auth = inject(AuthService);


    canActivate(
	_route : ActivatedRouteSnapshot,
	_state: RouterStateSnapshot,
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

