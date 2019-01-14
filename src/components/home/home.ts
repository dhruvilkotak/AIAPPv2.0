import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AddStudent } from '../AddStudent/AddStudent';
import { User } from '../../models/user';
import { ViewStudent } from '../viewStudent/viewStudent';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private userDetails:User=new User();

  constructor(public navCtrl: NavController,
    private navParams:NavParams,
    private storage:Storage) {

    this.storage.get('userDetails').then((val) => {
      var fileData:any = JSON.parse(val);
      this.userDetails = fileData.userDetails;
    });
   
  }
  

  goAddStudentPage()
  {
    console.log('Add student');
    this.navCtrl.push(AddStudent);
  }
  goExistingStudentPage()
  {
    console.log('View student');
    this.navCtrl.push(ViewStudent);
  }
}
