import { Component} from '@angular/core';
import { NavController,AlertController  } from 'ionic-angular';
import { Student } from '../../models/student';
import { File } from '@ionic-native/file';
import { StudentdashBoard } from '../studentDashBoard/studentDashBoard';
import { StudentServices } from '../../services/studentAddRemoveServices';
import { Storage} from '@ionic/storage';
import { Platform } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DocumentPicker } from '@ionic-native/document-picker';
import { StudentFireBaseService } from '../../firebaseServices/studentFireBaseService';

@Component({
    selector: 'page-viewStudent',
    templateUrl: 'viewStudent.html'
  })
  
export class ViewStudent{

    private studentDetailsArray:Array<Student>=[];
    private allData : Array<Student>=[];
    private  studentServicesObject : StudentServices = new StudentServices();
    private studentFirebaseService:StudentFireBaseService=new StudentFireBaseService();
    private searchTerm: string = '';
    private error:string='';

    constructor(private navCtrl: NavController ,
      private file:File, 
      private alertCtrl:AlertController,
      private storage : Storage ,
      public plt: Platform,
      private socialSharing:SocialSharing,
      private docPicker: DocumentPicker) {
      storage.set('studentObject', null);
        console.log("studnet : null"+storage.get('studentObject') == null);
        this.studentFirebaseService.getStudentList().then(data=>{
          this.studentDetailsArray=data;
          this.allData=data;
        });
    };

    filterItems(){
 
        this.studentDetailsArray = this.allData.filter((student) => {
            return student.firstName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 || 
            student.lastName.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 || 
            student.studentId.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
          });

    }

    ionViewDidLoad() {
      console.log("studentObject"+this.storage.get('studentObject') == null );
      this.storage.set('studentObject',null);
    }
    public ionViewWillEnter() {
      console.log("studentObject  ion views"+this.storage.get('studentObject') == null );
      this.storage.set('studentObject',null);
      this.studentFirebaseService.getStudentList().then(data=>{
        console.log("ion");
        this.studentDetailsArray=data;
        this.allData=data;
      });
    this.storage.clear();
    }
    removeStudent(studentObj:Student)
    {
        this.presentConfirm(studentObj);
    }
 
    viewStudentData(studentObj:Student)
    {
        this.storage.set('studentObject',JSON.stringify({ studentObject: studentObj }) );
        this.navCtrl.push(StudentdashBoard);
       console.log("id:"+studentObj.studentId);
    }

    presentConfirm(studentObj:Student) {
        let alert = this.alertCtrl.create({
          title: 'Remove Student',
          message: 'Do you want to remove Student '+studentObj.studentId +'?',
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
                var studentFireBaseService:StudentFireBaseService=new StudentFireBaseService();
                studentFireBaseService.removeStudent(studentObj);
                this.studentServicesObject.removeStudentFromArray(this.allData,studentObj);
                this.filterItems();   
                console.log('yes clicked');
              }
            }
          ]
        });
        alert.present();
      }
 
      exportStudentFile()
      {
        this.studentServicesObject.exportStudentFile(this.file,this.plt,this.socialSharing);
      }

      importStudentFile()
      {
        //this.studenrFirebaseService.
        this.studentFirebaseService.importStudentFile(this.file,this.plt,this.docPicker,this.allData).then(dataArray=>{
          console.log("msg:"+dataArray.length);
          this.filterItems();   
        }).catch(err=>{
            console.log("error:"+err);
        });
      }
}