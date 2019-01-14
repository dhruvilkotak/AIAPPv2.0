import { Component } from "@angular/core";

@Component({
    selector: 'page-securityCheckUp',
    templateUrl: 'securityCheckUp.html'
  })

export class SecurityCheckUp{

    private emailID: string="";
    private emailVerified:boolean=false;
    private securityQuestion:string="";
    private answer:string="";
}