import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Student } from '../../models/student';
import { FlashCard } from '../flashCardTest/flashCard';
import { AssessmentTest } from '../Assessment/BeginAssessmentTest/assessmentTest';
import { Method } from '../../models/methodIntervetion';
import { PreSessionView } from '../methodSessions/viewPreSessionData/preSessionData';
import { ViewAssessmentTest } from '../Assessment/viewAssessment/viewAssessment';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { StudentServices } from '../../services/studentAddRemoveServices';
import { ViewStudentAllWords } from './ViewStudentAllWords/viewStudentAllWords';

@Component({
  selector: 'page-StudentdashBoaord',
  templateUrl: 'studentDashBoard.html'
})
export class StudentdashBoard {

    private studentObject: Student = new Student();
    private beginAssessmentDone:boolean ;
    private methodObjectArray:Array<Method>=[];
    private PreInterventionAssessmentResults:boolean;
    private knownWordLength:number=0;
    private newLearnedWordLength:number=0;
    private unKnownWordLength:number=0;
    studentServiceObject:StudentServices=new StudentServices();
    private ratio1=0;
    private ratio2=0;
    private error="";

    constructor(public navCtrl: NavController,
      private navParams:NavParams, 
      private storage:Storage,
      private file:File) {
      this.storage.get('studentObject').then((val) => {
        var fileData:any = JSON.parse(val);
        this.studentObject = fileData.studentObject;
        //this.studentObject=  JSON.parse(val).studentObj;
        
        if(this.studentObject.knwonArrayList!=null)
        this.knownWordLength=this.studentObject.knwonArrayList.length;
        
        if(this.studentObject.unKnownArrayList!=null)
        this.unKnownWordLength=this.studentObject.unKnownArrayList.length;
        
        if(this.studentObject.knownUnknownArrayList!=null)
        this.newLearnedWordLength=this.studentObject.knownUnknownArrayList.length;
        
        for(let assessmentTestobj of this.studentObject.assessmentDataArrayObject){
          if(!assessmentTestobj.testStatus)
            this.beginAssessmentDone=assessmentTestobj.testStatus;
        }
        this.methodObjectArray=this.studentObject.methodArray;
        //this.beginAssessmentDone=this.studentObject.beginningAssessment[0] ;
        console.log("studDash:"+this.studentObject.studentId+" test:"+this.beginAssessmentDone); 
      });
      
    }

  public ionViewWillEnter() {
    this.storage.get('studentObject').then((val) => {
      var fileData:any = JSON.parse(val);
      console.log("come back:");
      this.studentObject = fileData.studentObject;
    
      if(this.studentObject.knwonArrayList!=null)
        this.knownWordLength=this.studentObject.knwonArrayList.length;
        
        if(this.studentObject.unKnownArrayList!=null)
        this.unKnownWordLength=this.studentObject.unKnownArrayList.length;
        
        if(this.studentObject.knownUnknownArrayList!=null)
        this.newLearnedWordLength=this.studentObject.knownUnknownArrayList.length;
    
        this.beginAssessmentDone=true;
        for(let assessmentTestobj of this.studentObject.assessmentDataArrayObject){
          console.log("status:"+assessmentTestobj.testStatus);
          if(!assessmentTestobj.testStatus)
            this.beginAssessmentDone=assessmentTestobj.testStatus;
        }
        this.methodObjectArray=this.studentObject.methodArray;
       // this.goBackToView();
        //this.beginAssessmentDone=this.studentObject.beginningAssessment[0] ;
        console.log("studDash:"+this.studentObject.studentId+" test:"+this.beginAssessmentDone);
  
    });
    
}

  beginAssessment()
  {
    this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
    this.navCtrl.push(AssessmentTest);
  }

  viewAssessment(){
    console.log("student dashvboasd:"+this.studentObject.studentUID);
    this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
    this.navCtrl.push(ViewAssessmentTest);
  }

  startInterventionTest(methodIndex:number)
  {
    this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
    this.storage.set('methodIndex',JSON.stringify({ methodIndex: methodIndex }) );
    this.navCtrl.push(PreSessionView);
   
     console.log("id:"+methodIndex);
  }

  // goBackToView()
  // {
  //   this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
  // //  this.studentServiceObject.updateStudentToFile(this.file,this.studentObject,this.studentServiceObject);
    
  //  //  this.navCtrl.getPrevious().data.studentObject =this.studentObject;  
  // }

  viewStudentWords()
  {
      this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
      this.navCtrl.push(ViewStudentAllWords);
  }
}
