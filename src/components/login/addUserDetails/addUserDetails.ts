import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { File } from "@ionic-native/file";
import * as firebase from 'firebase';
import { User } from "../../../models/user";
import { UserFireBaseService } from "../../../firebaseServices/userFireBaseService";
import { HomePage } from "../../home/home";
import { Firebase } from "@ionic-native/firebase";
import { Storage } from "@ionic/storage";

@Component({
    selector: 'page-addUserDetails',
    templateUrl: 'addUserDetails.html'
  })

export class AddUserDetails{

  private firstname:string="";
  private lastname:string="";
  private emailId:string="";
  private password:string="";
  private reTypePassword:string="";
  private error:string="";
  private emailVerfied:boolean= false; 
  private userFireBaseService:UserFireBaseService=new UserFireBaseService();
  private securityQuestion:string="";
  private answer:string="";
  private emailSent:string="";
  private showForm:boolean=true;

  

    constructor(public navCtrl: NavController,
        private file:File,
        private navParams:NavParams,
        private storage : Storage) {
          
      }

      
    
    // verifyEmail(){

    //   console.log("verify email");
    //     this.userObj = firebase.auth().currentUser;
    //     console.log("us obj:"+(this.userObj==null));
    //     if(this.userObj!=null)
    //        {
    //           this.emailSent = this.userObj.email;
    //           this.emailVerfied=this.userObj.emailVerified;

    //           console.log("email verified::"+this.emailVerfied);
    //           if(this.emailVerfied)
    //           {
    //               this.navCtrl.setRoot(HomePage,{
    //                 //
    //               });
    //           }
    //        }
    // }
    addUserDetails(){

      if(this.password != this.reTypePassword)
      {
        this.error = "Password is not matching.";
        console.log("password not matching");
      }
      else{
        console.log("password matching");
        this.error="";
        var userDetails:User = new User();
        userDetails.firstname=this.firstname;
        userDetails.lastname = this.lastname;
        userDetails.emailId = this.emailId;
        userDetails.password = this.password;
        userDetails.userRole = "faculty";
        userDetails.securityQuestion=this.securityQuestion;
        userDetails.answer=this.answer;
        var myStorage=this.storage;
        var myNavCtrl = this.navCtrl;
        
        this.userFireBaseService.registerUserDetails(userDetails,this.navCtrl).then(data=>{

          this.firstname="";
          this.lastname="";
          this.emailId="";
          this.password="";
          this.reTypePassword="";
          this.securityQuestion="";
          this.answer="";
          console.log("auth state changed user: null ");
         this.showForm=false;
//  ]        this.verifyEmail();


         // setTimeout(function(){  

            var refreshIntervalId=setInterval(function(){ 
              
                firebase.auth().currentUser.reload();
                console.log("verify email"+firebase.auth().currentUser.emailVerified);
                
                firebase.auth().onAuthStateChanged(function(user){

                     console.log("auth state changed ");
                      
                    if(!user)
                    {
                      console.log("auth state changed user: null ");
                    }
                    else{
                      console.log("auth state changed user: not null ");
                      var userObj = firebase.auth().currentUser;
                       console.log("firebase auth: "+(userObj ==null));
                      
                      if(userObj!=null)
                      {
                        var emailSent = userObj.email;
                        var emailVerfied=userObj.emailVerified;
                        console.log("email verified: "+emailVerfied+"  email:"+emailSent);
                        if(emailVerfied)
                        {
                          userDetails.verifyEmail = true;
                          console.log("email verified: true");
                          
                       //   var userFireBaseService:UserFireBaseService = new UserFireBaseService();
                      //    userFireBaseService.updateUserDetails(userDetails);  
                          myStorage.set('userDetails',JSON.stringify({ userDetails: userDetails }) );
                       
                          myNavCtrl.setRoot(HomePage).then(_=>{

                            clearInterval(refreshIntervalId);

                          });
                        }
                      }
                    }
                  });
                            
              }, 3000);
            
        //    myNavCtrl.setRoot(AddUserDetails,{});

      //andr   }, 20000);
          
        console.log("stop interval");

        }).catch(err=>{
          this.error="error:"+err;
        });
        
      

      }
    }



}