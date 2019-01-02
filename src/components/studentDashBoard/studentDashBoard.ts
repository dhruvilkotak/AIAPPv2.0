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
import { WordServices } from '../../services/wordServices';
import * as firebase from 'firebase';
import { KnownUnknownWordData } from '../../models/knownUnknownWordData';
import { StudentFireBaseService } from '../../firebaseServices/studentFireBaseService';
import { PostAssessmentDashBoard } from '../PostAssessment/postAssessmentDashBoard/postAssessmentDashBoard';

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
    studentFireBaseService:StudentFireBaseService=new StudentFireBaseService();
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
        
        console.log("studDash:"+(this.studentObject.newKnownUnknownArrayList==null)); 
       

        if(this.studentObject.newKnownUnknownArrayList==null)
          this.studentObject.newKnownUnknownArrayList=[];
      
        
        if(this.studentObject.knownUnknownArrayList!=null && this.studentObject.knownUnknownArrayList.length>0)
        {
          for(let obj of this.studentObject.knownUnknownArrayList)
          {
            var knownUnknownWordDataObject : KnownUnknownWordData= new KnownUnknownWordData();
            knownUnknownWordDataObject.wordData=obj;
            knownUnknownWordDataObject.methodIndex=-1;
            knownUnknownWordDataObject.methodName="Not Available";
            knownUnknownWordDataObject.wordId=obj.wordId;
            knownUnknownWordDataObject.postAssessmentCounter=0;
            this.studentObject.newKnownUnknownArrayList.push(knownUnknownWordDataObject);
          }
          this.studentObject.knownUnknownArrayList=null;
          //this.studentFireBaseService.updateKnownUnknwonList(this.studentObject);
          this.studentFireBaseService.updateNewKnownUnknwonList(this.studentObject);
          
        }
          this.newLearnedWordLength=this.studentObject.newKnownUnknownArrayList.length;
        
        for(let assessmentTestobj of this.studentObject.assessmentDataArrayObject){
          if(!assessmentTestobj.testStatus)
            this.beginAssessmentDone=assessmentTestobj.testStatus;
        }
        this.methodObjectArray=this.studentObject.methodArray;
        //this.beginAssessmentDone=this.studentObject.beginningAssessment[0] ;
        console.log("studDash:"+this.studentObject.studentId+" test:"+this.beginAssessmentDone); 
       
        // console.log("known:"+this.knownWordLength+" test:"+JSON.stringify({ wordDetailsArray: this.studentObject.unKnownArrayList })); 
        // const databaseRef = firebase.database().ref('StudentDataList/'+this.studentObject.studentUID+'/unKnownArrayList/');
        // databaseRef.once('value').then(function(snapshot) {
        //         snapshot.forEach(function(childSnapshot) {
        //           console.log("snapshot:"+snapshot.key+"  val:"+snapshot.val);
        //           console.log("childspot:"+childSnapshot.key+"  val:"+childSnapshot.val);
        //         //remove each child
        //        // databaseRef.child(childSnapshot.key).remove();
        //     });
        // });

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
        
        if(this.studentObject.newKnownUnknownArrayList==null)
          this.studentObject.newKnownUnknownArrayList=[];
      

        if(this.studentObject.knownUnknownArrayList!=null && this.studentObject.knownUnknownArrayList.length>0)
        {
          for(let obj of this.studentObject.knownUnknownArrayList)
          {
            var knownUnknownWordDataObject : KnownUnknownWordData= new KnownUnknownWordData();
            knownUnknownWordDataObject.wordData=obj;
            knownUnknownWordDataObject.methodIndex=-1;
            knownUnknownWordDataObject.methodName="Not Available";
            knownUnknownWordDataObject.postAssessmentCounter=0;
            knownUnknownWordDataObject.wordId=obj.wordId;
            this.studentObject.newKnownUnknownArrayList.push(knownUnknownWordDataObject);
          }
          this.studentObject.knownUnknownArrayList=null;
        //  this.studentFireBaseService.updateKnownUnknwonList(this.studentObject);
          this.studentFireBaseService.updateNewKnownUnknwonList(this.studentObject);
      
        }
        
        this.newLearnedWordLength=this.studentObject.newKnownUnknownArrayList.length;
       

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

  doPostAssessment(){
    this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
    this.navCtrl.push(PostAssessmentDashBoard);
  }

  viewStudentWords()
  {
      this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
      this.navCtrl.push(ViewStudentAllWords);
  }
}
