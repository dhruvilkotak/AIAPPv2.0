import { Component} from '@angular/core';
import { NavController,AlertController  } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DocumentPicker } from '@ionic-native/document-picker';
import { UserFireBaseService } from '../../../firebaseServices/userFireBaseService';


@Component({
    selector: 'page-addEmailList',
    templateUrl: 'addEmailList.html'
  })
  
export class AddEmailList{

  private newEmailId:string='';
    private userEmailList:Array<string>=[];
    private allData : Array<string>=[];
    private searchTerm: string = '';
    private error:string='';
    private userFireBaseService:UserFireBaseService=new UserFireBaseService();

    constructor(private navCtrl: NavController ,
      private file:File, 
      private alertCtrl:AlertController,
      public plt: Platform,
      private socialSharing:SocialSharing,
      private docPicker: DocumentPicker) {
        
        this.userFireBaseService.getEmailIdList().then(data=>{
          console.log("ion will enter");
          this.userEmailList=data;
          this.allData=data;
        });

    };

    filterItems(){
 
        this.userEmailList = this.allData.filter((emailId) => {
            return emailId.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 ;
          });

    }
    addNewEmail(){
    
      try {
        this.userFireBaseService.addNewEmail(this.newEmailId).then(data=>{
          this.allData.push(this.newEmailId);
          this.filterItems();
          this.newEmailId='';
          this.error='';
         
        }).catch(err=>{
          this.error=err;
        });
      }
      catch(e) {
        this.error=""+e;
        console.log(e);
      }
    }

    removeEmailId(emailId:string)
    {
        this.presentConfirm(emailId);
    }

    presentConfirm(emailId:string) {
        let alert = this.alertCtrl.create({
          title: 'Remove Email',
          message: 'Do you want to remove Email '+emailId +'?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'yes',
              handler: () => {
                var userFireBaseService:UserFireBaseService=new UserFireBaseService();
                userFireBaseService.removeEmailId(emailId);
                this.userFireBaseService.removeEmailIdFromArray(this.allData,emailId);
                this.filterItems();   
                console.log('yes clicked');
              }
            }
          ]
        });
        alert.present();
      }
 
}