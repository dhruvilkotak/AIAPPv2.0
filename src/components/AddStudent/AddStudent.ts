import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Student } from '../../models/student';
import { File } from '@ionic-native/file';
import { StudentServices } from '../../services/studentAddRemoveServices';
import { StudentdashBoard } from '../studentDashBoard/studentDashBoard';
import { ViewStudent } from '../viewStudent/viewStudent';
import { Storage} from '@ionic/storage';
import { HomePage } from '../home/home';
import { StudentFireBaseService } from '../../services/studentFireBaseService';

@Component({
  selector: 'page-addStudent',
  templateUrl: 'addStudent.html'
})

export class AddStudent {

  private studentDetailsArray: Array<Student> = [];
  private firstname:string;
  private lastname:string;
  private studentid:string;
  private fileData:any;
  private error: string;
  private studentDetails:Student;
  private  studentFireBaseServicesObject : StudentFireBaseService = new StudentFireBaseService();
  
  constructor(public navCtrl: NavController,
    private file:File,
    private navParams:NavParams,
    private storage : Storage) {
     
  }
  addNewStudent()
  {
    try {
      this.studentDetails= new Student();
      this.studentDetails.firstName=this.firstname;
      this.studentDetails.lastName=this.lastname;
      this.studentDetails.studentId=this.studentid;
      this.studentFireBaseServicesObject.addStudentToFireBase(this.studentDetails);
      this.firstname="";
      this.lastname="";
      this.studentid="";
      this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentDetails }) );
    
      this.navCtrl.setRoot(HomePage).then(()=>{
        this.navCtrl.push(StudentdashBoard);
      }).catch(err=>{
        this.error=err;
      });
     
    }
    catch(e) {
      this.error=""+e;
      console.log(e);
    }
   
  }

}
