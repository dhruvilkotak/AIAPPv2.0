import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { WordData } from '../../../../models/wordData';
import { Student } from '../../../../models/student';
import { methodInterventionWordData } from '../../../../models/methodInterventionWordData';
import { MethodSession } from '../../../../models/methodIntervetionSession';
import { StudentServices } from '../../../../services/studentAddRemoveServices';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'page-sessionSummary',
  templateUrl: 'sessionSummary.html'
})


export class SessionSummary{
      private studentObject:Student=new Student();
      private methodIndex:number;
      private methodName:string="";
      private totalWordsResponded:number;
      private error:String="";
      private sessionDate:String="";
      private sessionCounter:number;
      private TestTitle:String="";
      private sessionWordList:Array<methodInterventionWordData>=[];
      private completionTime="";

    
      //private studentObject:Student;
      methodInetrventionWordDataArray:Array<methodInterventionWordData>;
      private studentServiceObject:StudentServices=new StudentServices();
    
    
    
  constructor(private file:File,
    public navCtrl: NavController,
    private navParams:NavParams,
    private viewCtrl:ViewController,
    private storage:Storage) {

    storage.get('studentObject').then((val) => {
      var fileData:any = JSON.parse(val);
      this.studentObject = fileData.studentObject;

      storage.get('methodIndex').then((val) => {
        var fileData:any = JSON.parse(val);
        this.methodIndex = fileData.methodIndex;
        this.methodName=this.studentObject.methodArray[this.methodIndex].methodName;
        console.log("methodIndex:"+this.methodIndex);
        storage.get('sessionCounter').then((val) => {
          var fileData:any = JSON.parse(val);
          this.sessionCounter = fileData.sessionCounter;
          console.log("sessionCounter:"+this.sessionCounter)
          
          console.log("flashretention:"+this.studentObject.methodArray[this.methodIndex].sessionsArray[this.sessionCounter].retentionWordList.values);
          console.log("flashcontrol:"+this.studentObject.methodArray[this.methodIndex].sessionsArray[this.sessionCounter].controlItems.values);
          this.sessionDate=this.studentObject.methodArray[this.methodIndex].sessionsArray[this.sessionCounter].sessionDate;
          this.totalWordsResponded=this.studentObject.methodArray[this.methodIndex].sessionsArray[this.sessionCounter].totalOppurtunitiesToRespond;
          this.TestTitle="Session "+this.sessionCounter;
          this.sessionWordList=this.studentObject.methodArray[this.methodIndex].sessionsArray[this.sessionCounter].sessionWordDataList;
          console.log("flashcard detaails:"+this.studentObject.methodArray[this.methodIndex].sessionsArray[this.sessionCounter].sessionWordDataList.length);
          this.completionTime= this.studentObject.methodArray[this.methodIndex].sessionsArray[this.sessionCounter].sessionCompletedTime+"";
        });

      });

    });
  }
 
  continue()
  {
    this.updateAllObjects();
    
  }

  updateAllObjects()
  {
    if(this.studentObject.methodArray[this.methodIndex].sessionsArray[this.sessionCounter]!=null)
        this.storage.set('methodSessionObject',JSON.stringify({ methodSessionObject: this.studentObject.methodArray[this.methodIndex].sessionsArray[this.sessionCounter] }) );
    
    if(this.studentObject!=null)
    {

      this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
      this.studentServiceObject.updateStudentToFile(this.file,this.studentObject,this.studentServiceObject).then(()=>{
        this.goBackToView();
      });
      
    }
  
    
  }
  goBackToView()
  {
    this.navCtrl.pop();
  }

 
}