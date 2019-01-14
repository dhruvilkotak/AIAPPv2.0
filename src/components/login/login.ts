import { Component, Injectable } from '@angular/core';
import { NavController,Platform  } from 'ionic-angular';
import { HomePage } from '../../components/home/home';
import { File } from '@ionic-native/file';
import { User } from '../../models/user';
import { AddUserDetails } from './addUserDetails/addUserDetails';
import { UserFireBaseService } from '../../firebaseServices/userFireBaseService';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

@Injectable()
export class Login {
  public user: User = new User();
  public user2: User = new User();
  private emailID: string;
  private password: string;
  private error: string;
  private fileData:any;
  
  constructor(private navCtrl: NavController,
    private file:File,
    private platform: Platform,
    private storage:Storage) {

  };

  login() {
    console.log(
      "UserName:" + this.emailID
    );
    console.log(
      "Password:" + this.password
    );
    

    var userFireBaseService:UserFireBaseService = new UserFireBaseService();
    userFireBaseService.loginUser(this.emailID,this.password).then(userDetails=>{

      this.storage.set('userDetails',JSON.stringify({ userDetails: userDetails }) );
                       
      this.navCtrl.setRoot(HomePage).then(_=>{

        
      });

    }).catch(err=>{
      this.error=err;
    });

    // if (this.emailID === "admin" && this.password === "admin") {
    //   // if (this.platform.is('cordova')) {
    //     console.log("platform : "+this.platform.is('cordova') + " data:"+JSON.stringify({ userName: this.username, password: this.password }));
         
           
    //     this.file.checkFile(this.file.dataDirectory, 'userData').then(_ =>{
          
    //       this.file.createFile(this.file.dataDirectory,'userData',true).then( fileEntry=>{
            
    //         this.file.writeExistingFile(this.file.dataDirectory,'userData',JSON.stringify({ userData: this.user })).then(_=>{
      
    //           this.file.readAsText(this.file.dataDirectory,'userData').then(data=>{
    //             this.fileData=JSON.parse(data);
    //             this.user2=this.fileData.userData;
    //             //this.fileData.parse(data)
    //             this.navCtrl.setRoot(HomePage,{
    //               data: this.user2
    //             });
                 
    //           }).catch(err => console.log('data doesn\'t read.'));      

    //         }).catch(err => console.log('File doesn\'t write.'));
          
    //       }).catch(err => console.log('File doesn\'t create'));
        
    //     }).catch(err => console.log('File doesn\'t exist'));
        
       
      
    
  }

  signUp(){
    this.navCtrl.push(AddUserDetails);
  }

  forgetPassword()
  {

  } 
}
