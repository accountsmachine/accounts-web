
import { Injectable }  from '@angular/core';
import { AuthService } from './profile/auth.service';
 
@Injectable()
export class AppInitService {
 
    constructor(private auth : AuthService) {
    }
    
    Init() {

        return new Promise<void>((resolve, reject) => {

//            console.log("AppInitService.init() called");

//	    this.auth.refresh_token().subscribe().add(resolve);

//            setTimeout(() => {
//                console.log('AppInitService Finished');
//                resolve();
//            }, 100);
 
        });

    }

}