import { Component, Injectable } from '@angular/core';
import { NavController,Platform  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Login } from '../login';

@Component({
  selector: 'page-signout',
  templateUrl: 'signout.html'
})

@Injectable()
export class Signout {
  
  constructor(private navCtrl: NavController,
    private file:File,
    private platform: Platform,
    private storage:Storage) {

      storage.set('userDetails',null );
      storage.clear();

      navCtrl.setRoot(Login);


  };
 
}
