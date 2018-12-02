import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { Student } from '../../../models/student';
import { MethodSession } from '../../../models/methodIntervetionSession';
import { SessionSummary } from '../flashCardTest/sessionSummary/sessionSummary';
import { PreSessionAssessmentView } from '../preSessionAssessment/preSessionAssessmentView/preSessionAssessmentView';
@Component({
    selector: 'page-sessionList',
    templateUrl: 'sessionList.html'
  })
export class SessionList{

  private studentObject:Student=new Student();
  private methodIndex:number=0;
  private methodName:string="";
  private sessionArray:Array<MethodSession>=[];

  constructor(private file:File,
    public navCtrl: NavController,
    private navParams:NavParams,
    private storage:Storage) {

    storage.get('studentObject').then((val) => {
        var fileData:any = JSON.parse(val);
        this.studentObject = fileData.studentObject;
        this.storage.get('methodIndex').then((val) => {
            var fileData:any = JSON.parse(val);
            this.methodIndex = fileData.methodIndex;
            console.log("methodIndex:"+this.methodIndex);
            this.sessionArray= this.studentObject.methodArray[this.methodIndex].sessionsArray;            
            this.methodName =  this.studentObject.methodArray[this.methodIndex].methodName ;
            console.log("Method Name:"+this.methodName);
            
        });
    });
  }

  sessionSummary(methodSessionObject:MethodSession){
    this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
    this.storage.set('methodIndex',JSON.stringify({ methodIndex: this.methodIndex }) );
    this.storage.set('methodSessionObject',JSON.stringify({ methodSessionObject: methodSessionObject }) );
    this.storage.set('sessionCounter',JSON.stringify({ sessionCounter: this.sessionArray.indexOf(methodSessionObject)}) );
    
    this.navCtrl.push(SessionSummary);
  }

  preSessionAssessment(methodSessionObject:MethodSession){
    this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
    this.storage.set('methodIndex',JSON.stringify({ methodIndex: this.methodIndex }) );
    this.storage.set('methodSessionObject',JSON.stringify({ methodSessionObject: methodSessionObject }) );
    this.storage.set('sessionCounter',JSON.stringify({ sessionCounter: this.sessionArray.indexOf(methodSessionObject)}) );
    
    this.navCtrl.push(PreSessionAssessmentView);
  }
}