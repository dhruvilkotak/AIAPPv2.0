import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
import { WordData } from '../../models/wordData';
import { Student } from '../../models/student';
import { WordServices } from '../../services/wordServices';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { StudentServices } from '../../services/studentAddRemoveServices';
import { Storage } from '@ionic/storage';
import { ArrayService } from '../../services/arrayService';
import { PreAssessmentFireBaseService } from '../../firebaseServices/PreAssessmentFireBaseService';
@Component({
  selector: 'page-flashCard',
  templateUrl: 'flashCard.html'
})


export class FlashCard{
   private wordDataObject:WordData=new WordData();
   private wordDataArray: Array<WordData> = [];
   private TestTitle:String="";
   private currentCardNumber:number=0;
   private totalCardNumber:number=0;
   private wordServiceObject:WordServices=new WordServices();
   private studentObject:Student=new Student();
   private studentServiceObject:StudentServices=new StudentServices();
  private testIndex:number=0;
  private arrayServiceObj:ArrayService = new ArrayService();

  ionViewDidLoad()
  {
    console.log("onviewdidload");  
  }

  constructor(private file:File,
    public navCtrl: NavController,
    private navParams:NavParams,
    private viewCtrl:ViewController,
    private storage:Storage) {

    
    this.storage.get('studentObject').then((val) => {
      var fileData:any = JSON.parse(val);
      this.studentObject = fileData.studentObject; 
      this.storage.get('testIndex').then((val) => {
        var fileData:any = JSON.parse(val);
        this.testIndex = fileData.testIndex; 
        this.TestTitle= "Assessment Test "+this.testIndex;
   
        console.log("test:"+this.TestTitle);
        this.wordServiceObject.getWordList(file).then(data=>{
        
         this.wordDataArray=this.arrayServiceObj.shuffle(data);
          this.totalCardNumber=this.wordDataArray.length;
          this.studentObject.assessmentDataArrayObject[this.testIndex].totalWordList=this.wordDataArray.length;
          console.log("len: "+this.totalCardNumber+"  d:"+this.wordDataArray.length);
           
          if(this.totalCardNumber > 0)
          {
            this.studentObject.assessmentDataArrayObject[this.testIndex].unknownWordList=[];
            this.studentObject.assessmentDataArrayObject[this.testIndex].knownWordList=[];
            this.currentCardNumber=1;
            this.wordDataObject=this.wordDataArray[this.currentCardNumber-1];  
          }
          else{
            console.log("len: 0");

            this.goBackToView(this.studentObject);
            this.navCtrl.pop();
  
          }
        }).catch(err=>console.log("erer:"+err));

      });
    });
      
    
  }
  greenCircleClick(){
    this.studentObject.assessmentDataArrayObject[this.testIndex].knownWordList.push(this.wordDataObject);
    if(this.currentCardNumber+1<=this.wordDataArray.length)
    {
      this.wordDataObject=this.wordDataArray[this.currentCardNumber];
      this.currentCardNumber++;
    }
    else{
      console.log("else:green");
      this.studentObject.assessmentDataArrayObject[this.testIndex].testStatus=true;
      if(this.testIndex>0)
      {
        var known2Len = 0;
        var known1Len= 0;
        if(this.studentObject.assessmentDataArrayObject[this.testIndex].knownWordList!=null)
        known2Len= this.studentObject.assessmentDataArrayObject[this.testIndex].knownWordList.length;
        
        if(this.studentObject.assessmentDataArrayObject[this.testIndex-1].knownWordList!=null)
        known1Len = this.studentObject.assessmentDataArrayObject[this.testIndex-1].knownWordList.length;
        
        this.studentObject.assessmentDataArrayObject[this.testIndex].consistancyPercentage= 
                    known2Len - known1Len;
      }
      this.goBackToView(this.studentObject);
    }
  }
  redCircleClick(){
   this.studentObject.assessmentDataArrayObject[this.testIndex].unknownWordList.push(this.wordDataObject)
    if(this.currentCardNumber+1<=this.wordDataArray.length)
    {
      this.wordDataObject=this.wordDataArray[this.currentCardNumber];
      this.currentCardNumber++;
    }
    else{
      console.log("else:red");
      this.studentObject.assessmentDataArrayObject[this.testIndex].testStatus=true;
      if(this.testIndex>0)
      {
        var known2Len = 0;
        var known1Len= 0;
        if(this.studentObject.assessmentDataArrayObject[this.testIndex].knownWordList!=null)
        known2Len= this.studentObject.assessmentDataArrayObject[this.testIndex].knownWordList.length;
        
        if(this.studentObject.assessmentDataArrayObject[this.testIndex-1].knownWordList!=null)
        known1Len = this.studentObject.assessmentDataArrayObject[this.testIndex-1].knownWordList.length;
        
        this.studentObject.assessmentDataArrayObject[this.testIndex].consistancyPercentage= 
                    known2Len - known1Len;
      }
      this.goBackToView(this.studentObject);
    }
  }
  goBackToView(studentObject:Student)
  {
    if(Student!=null)
    {
      console.log("studentName:"+this.studentObject.firstName+" "+this.studentObject.lastName+" ass len:"+this.studentObject.assessmentDataArrayObject.length);
   //   this.studentServiceObject.updateStudentToFile(this.file,this.studentObject,this.studentServiceObject);
      this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
      var preAssessmentFireBaseService:PreAssessmentFireBaseService= new PreAssessmentFireBaseService();
      preAssessmentFireBaseService.addAssessmentToStudent(studentObject,this.testIndex);
    } 
     this.navCtrl.pop();
  }

}