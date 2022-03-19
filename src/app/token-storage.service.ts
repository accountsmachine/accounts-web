
import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
const USER_KEY = 'auth-user';

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {

    constructor() { }

    clear(): void {
	window.sessionStorage.clear();
    }

    public set token(token: string | null) {
	if (token)
	    window.sessionStorage.setItem(TOKEN_KEY, token);
	else
	    window.sessionStorage.removeItem(TOKEN_KEY);
    }

    public get token() : string | null {
	return window.sessionStorage.getItem(TOKEN_KEY);
    }

    public set refresh_token(token: string | null) {
	if (token)
	    window.sessionStorage.setItem(REFRESHTOKEN_KEY, token);
	else
	    window.sessionStorage.removeItem(REFRESHTOKEN_KEY);
    }

    public get refresh_token() : string | null {
	return window.sessionStorage.getItem(REFRESHTOKEN_KEY);
	
    }

    public set user(user : string | null) {
	if (user)
	    window.sessionStorage.setItem(USER_KEY, user);
	else
	    window.sessionStorage.removeItem(USER_KEY);
    }

    public get user() : string | null {
	return window.sessionStorage.getItem(USER_KEY);
    }

}

