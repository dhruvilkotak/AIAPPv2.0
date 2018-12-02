import { Component, Injectable } from '@angular/core';
import { NavController,Platform  } from 'ionic-angular';
import { HomePage } from '../../components/home/home';
import { File } from '@ionic-native/file';
import { User } from '../../models/user';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

@Injectable()
export class Login {
  public user: User = new User();
  public user2: User = new User();
  private username: string;
  private password: string;
  private error: string;
  private fileData:any;
  
  constructor(private navCtrl: NavController,private file:File,private platform: Platform) {

  };

  login() {
    console.log(
      "UserName:" + this.username
    );
    console.log(
      "Password:" + this.password
    );
    
    if (this.username === "admin" && this.password === "admin") {
      this.user.userName = this.username;
      this.user.password = this.password;
      // if (this.platform.is('cordova')) {
        console.log("platform : "+this.platform.is('cordova') + " data:"+JSON.stringify({ userName: this.user.userName, password: this.user.password }));
         
           
        this.file.checkFile(this.file.dataDirectory, 'userData').then(_ =>{
          
          this.file.createFile(this.file.dataDirectory,'userData',true).then( fileEntry=>{
            
            this.file.writeExistingFile(this.file.dataDirectory,'userData',JSON.stringify({ userData: this.user })).then(_=>{
      
              this.file.readAsText(this.file.dataDirectory,'userData').then(data=>{
                this.fileData=JSON.parse(data);
                this.user2=this.fileData.userData;
                //this.fileData.parse(data)
                this.navCtrl.setRoot(HomePage,{
                  data: this.user2
                });
                 
              }).catch(err => console.log('data doesn\'t read.'));      

            }).catch(err => console.log('File doesn\'t write.'));
          
          }).catch(err => console.log('File doesn\'t create'));
        
        }).catch(err => console.log('File doesn\'t exist'));
        
       
      
    
    } else {
      this.error = "Can not Log In !!";
    }
  }
 
}
