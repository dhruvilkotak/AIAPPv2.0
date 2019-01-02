import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { WordData } from '../../../models/wordData';
import { Student } from '../../../models/student';
import { methodInterventionWordData } from '../../../models/methodInterventionWordData';
import { MethodSession } from '../../../models/methodIntervetionSession';
import { StudentServices } from '../../../services/studentAddRemoveServices';
import { SessionSummary } from './sessionSummary/sessionSummary';
import { Storage } from '@ionic/storage';
import { WordServices } from '../../../services/wordServices';
import { StudentFireBaseService } from '../../../firebaseServices/studentFireBaseService';

@Component({
  selector: 'page-flashCardIntervention',
  templateUrl: 'flashCardIntervention.html'
})


export class FlashCardIntervetion{
  private studentObject:Student=new Student();
  private methodIndex:number;
  private studentFireBaseService:StudentFireBaseService = new StudentFireBaseService();
   private wordDataObject:WordData=new WordData();
   private wordDataArray: Array<WordData> = [];
   private sessionCounter:number;
   private TestTitle:String;
   private currentCardNumber:number=0;
   private totalCardNumber:number=0;
  private testIndex:number=0;
  private testFlag:number=0; // testType="assessment" :0 ; "IncrementRehrsal" :1
  //private studentObject:Student;
   methodInetrventionWordDataArray:Array<methodInterventionWordData>;
  private methodInterventionWordDataObj:methodInterventionWordData;
  private methodSessionObject:MethodSession;
  private studentServiceObject:StudentServices=new StudentServices();
  private startDate:Date;
  private endDate:Date;
  private wordServiceObj:WordServices=new WordServices();
  ionViewDidLoad()
  {
    console.log("onviewdidload");  
  }

  constructor(private file:File,
    private navCtrl: NavController,
    private navParams:NavParams,
    private viewCtrl:ViewController,
    private storage:Storage) {

     
      
      storage.get('studentObject').then((val) => {
        var fileData:any = JSON.parse(val);
        this.studentObject = fileData.studentObject;
        
        storage.get('methodIndex').then((val) => {
          var fileData:any = JSON.parse(val);
          this.methodIndex = fileData.methodIndex;
          
          storage.get('methodSessionObject').then((val) => {
            var fileData:any = JSON.parse(val);
            this.methodSessionObject = fileData.methodSessionObject;
            
            storage.get('wordDataList').then((val) => {
              var fileData:any = JSON.parse(val);
              this.wordDataArray = fileData.wordDataList;
              this.startDate=new Date();
            
              this.sessionCounter=this.methodSessionObject.sessionIndex;
              this.methodInetrventionWordDataArray=this.methodSessionObject.sessionWordDataList;
              this.TestTitle="Session "+this.sessionCounter;
              this.methodSessionObject.totalOppurtunitiesToRespond=this.wordDataArray.length;
              console.log("test:"+this.sessionCounter);
              console.log("flashretention:"+this.methodSessionObject.retentionWordList.values);
              console.log("flashcontrol:"+this.methodSessionObject.controlItems.values);
              
              this.totalCardNumber=this.wordDataArray.length;
              if(this.wordDataArray.length>0)
              {

            //   console.log("size:"+this.wordDataArray.length+" id:"+this.wordDataArray[0].wordId);
                this.currentCardNumber=1;
                this.wordDataObject=this.wordDataArray[this.currentCardNumber-1];  
              }
              else{
                this.navCtrl.pop();
              //  console.log("size:"+this.wordDataArray.length+" id:"+this.wordDataArray[0].wordId);
            //   this.updateAllObjects();
              }        
              
            });

          });
        });
      });
      
      
  }
  greenCircleClick(){
    this.methodInterventionWordDataObj= this.getMethodSessionWordDataObject(this.wordDataObject);
    if(this.methodInterventionWordDataObj!=null)
    {
      this.methodInterventionWordDataObj.knownTime++;
      this.methodInterventionWordDataObj.totalAskedTime++;
    }
    this.updateMethodSessionWordDataObject(this.methodInterventionWordDataObj);
    if(this.currentCardNumber+1<=this.wordDataArray.length)
    {
      this.wordDataObject=this.wordDataArray[this.currentCardNumber];
      this.currentCardNumber++;
    }
    else{
      console.log("else:green");
      this.updateAllObjects();
      //    this.goBackToView();
    }
  }
  redCircleClick(){
    this.methodInterventionWordDataObj= this.getMethodSessionWordDataObject(this.wordDataObject);
    if(this.methodInterventionWordDataObj!=null)
    {
      this.methodInterventionWordDataObj.totalAskedTime++;
    }
    this.updateMethodSessionWordDataObject(this.methodInterventionWordDataObj);
    if(this.currentCardNumber+1<=this.wordDataArray.length)
    {
      this.wordDataObject=this.wordDataArray[this.currentCardNumber];
      this.currentCardNumber++;
    }
    else{
      console.log("else:red");
         this.updateAllObjects();
    //     this.goBackToView();
    }
  }

  updateAllObjects()
  {
    this.endDate=new Date(); 
    var diff=this.endDate.getTime() - this.startDate.getTime();
    var hour=Math.floor(diff/(60*60*1000));
    diff=diff- hour*(60*60*1000);
    var minute=Math.floor(diff/(60*1000));
    diff=diff- minute*(60*1000);
    var seconds=Math.floor(diff/(1000));
    this.methodSessionObject.sessionCompletedTime= hour+" : "+minute+" : "+seconds;
    for(let obj of this.methodInetrventionWordDataArray)
    {
      console.log("arr:"+obj.wordData.wordText+" correct:"+obj.knownTime+" total asked time:"+obj.totalAskedTime+" isknown:"+obj.isKnownWord);
    }
    this.methodSessionObject.sessionWordDataList=this.methodInetrventionWordDataArray;
    console.log("session counter:"+this.sessionCounter+" length:"+this.studentObject.methodArray[this.methodIndex].sessionsArray.length);
    
  
    if(this.sessionCounter == this.studentObject.methodArray[this.methodIndex].sessionsArray.length )
    {
        //remove unknown if exist from student if possible
        console.log("final length:"+this.studentObject.unKnownArrayList.length+"  session:"+this.methodSessionObject.unknownWordList.length);
        this.wordServiceObj.removeArrayFromArray(this.studentObject.unKnownArrayList, this.methodSessionObject.unknownWordList);
        var studentFireBaseService:StudentFireBaseService = new StudentFireBaseService();
        studentFireBaseService.maintainUnKnownKnownArray(this.studentObject);
        //studentFireBaseService.removeWordsFromUnKnownArray(this.studentObject,this.methodSessionObject.unknownWordList);
        //this.studentFireBaseService.updateUnKnownList(this.studentObject);
        console.log("final length:"+this.studentObject.unKnownArrayList.length+"  session:"+this.methodSessionObject.unknownWordList.length);
        if(this.studentObject.methodArray[this.methodIndex].sessionsArray == null)
          this.studentObject.methodArray[this.methodIndex].sessionsArray = [];
        this.studentObject.methodArray[this.methodIndex].sessionsArray.push(this.methodSessionObject);
    }
      
    
    console.log("retention:"+this.methodSessionObject.retentionWordList.values);
    console.log("control:"+this.methodSessionObject.controlItems.values);
    if(this.methodSessionObject!=null)
    {
      this.storage.set('methodSessionObject',JSON.stringify({ methodSessionObject: this.methodSessionObject }) );
   
    }
      //this.navCtrl.getPrevious().data.methodSessionObject =this.methodSessionObject;
    if(this.studentObject!=null)
    {
      console.log("studentName:"+this.studentObject.firstName+" "+this.studentObject.lastName);
      this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
      //add  method array _ session array
       
       this.studentFireBaseService.addSessionToMethod(this.studentObject,this.methodIndex);
       this.goBackToView();
      // this.studentServiceObject.updateStudentToFile(this.file,this.studentObject,this.studentServiceObject).then(()=>{
      //   this.goBackToView();
      //   console.log("sessionLength:"+this.studentObject.methodArray[this.methodIndex].sessionsArray.length)
        
      // });
    }
    
  }
  goBackToView()
  {
    this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
    this.storage.set('methodIndex',JSON.stringify({ methodIndex: this.methodIndex }) );
    this.storage.set('methodSessionObject',JSON.stringify({ methodSessionObject: this.methodSessionObject }) );
    this.storage.set('sessionCounter',JSON.stringify({ sessionCounter: this.sessionCounter }) );
    
    this.navCtrl.push(SessionSummary).then(()=>{
      const startIndex = this.navCtrl.getActive().index - 2;
      this.navCtrl.remove(startIndex, 2);
    });
    //this.navCtrl.pop();
  }

  getMethodSessionWordDataObject(wordDataObject:WordData)
  {
    for(let obj of this.methodInetrventionWordDataArray)
    {
      if(obj.wordData.wordId == wordDataObject.wordId)
      {
        return obj;
      }
    }
    return null;
  }
  updateMethodSessionWordDataObject( methodInterventionWordDataObj:methodInterventionWordData)
  {
    for(let obj of this.methodInetrventionWordDataArray)
    {
      if(obj.wordData.wordId == methodInterventionWordDataObj.wordData.wordId)
      {
        this.methodInetrventionWordDataArray[this.methodInetrventionWordDataArray.indexOf(obj)] = methodInterventionWordDataObj ;
      }
    }
    return null;
  }

  

}