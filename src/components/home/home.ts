import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AddStudent } from '../AddStudent/AddStudent';
import { User } from '../../models/user';
import { ViewStudent } from '../viewStudent/viewStudent';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  userData: User;
  constructor(public navCtrl: NavController,private navParams:NavParams) {
   
    this.userData=new User();
    this.userData.userName="admin";  
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
