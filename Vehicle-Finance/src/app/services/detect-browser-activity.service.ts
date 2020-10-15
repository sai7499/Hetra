import { Injectable,HostListener } from '@angular/core';
import { Router,NavigationStart,CanActivate,ActivatedRouteSnapshot,RouterStateSnapshot} from '@angular/router';
import { UtilityService } from './utility.service';
import { SharedService } from '@shared/shared-service/shared-service'

@Injectable({
  providedIn: 'root'
})
export class DetectBrowserActivityService implements CanActivate {

  constructor( private router: Router,private utilityService: UtilityService,private sharedService: SharedService) { }

async canActivate(next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Promise<boolean> {
    
    return new Promise((resolve,reject)=> {
      let broswerActivity = true;
    
      this.sharedService.popStateActivity$.subscribe((value)=> {
        broswerActivity = value;
      })
      
    
      resolve(broswerActivity)
  
      
    })
  
  }

 

}
