import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
import { WordData } from '../../../models/wordData';
import { WordServices } from '../../../services/wordServices';
import { Student } from '../../../models/student';
import { ArrayService } from '../../../services/arrayService';
import { NavController, NavParams, ViewController, RangeKnob } from 'ionic-angular';
import { KnownUnknownWordData } from '../../../models/knownUnknownWordData';
import { PostTestWordData } from '../../../models/PostTestWordData';
import { PostTestWordDataRecordList } from '../../../models/postTestWordDataRecordList';
import { PostTestAssessmentService } from '../../../services/postTestAssessmentService';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-postAssessmentFlashCard',
  templateUrl: 'postAssessmentFlashCard.html'
})


export class PostAssessmentFlashCard{
   
  private wordDataObject:PostTestWordData=new PostTestWordData();
   private wordDataObj: WordData = new WordData();
   

   private wordDataArray: Array<PostTestWordData> = [];
   private TestTitle:String="";
   private currentCardNumber:number=0;
   private totalCardNumber:number=0;
   private studentObject:Student=new Student();
  private testIndex:number=0;
  private arrayServiceObj:ArrayService = new ArrayService();
  private subTestIndex:number=0;
  postTestWordDataRecordListObject:PostTestWordDataRecordList=new PostTestWordDataRecordList();
  private totalKnownCounter:number=0;

  ionViewDidLoad()
  {
    console.log("onviewdidload");  
  }

  constructor(private file:File,
    public navCtrl: NavController,
    private navParams:NavParams,
    private viewCtrl:ViewController,
    private storage:Storage) {

      this.wordDataObj.wordText="";
      this.wordDataObject.wordData=this.wordDataObj;
        this.storage.get('studentObject').then((val) => {
          var fileData:any = JSON.parse(val);
          this.studentObject = fileData.studentObject;
          this.storage.get('testIndex').then((val) => {
              var fileData:any = JSON.parse(val);
              this.testIndex = fileData.testIndex;
              
              storage.get('postTestWordDataArray').then((val) => {
                var fileData:any = JSON.parse(val);
                this.wordDataArray = fileData.postTestWordDataArray;
                console.log("val:"+val);
                storage.get('subTestIndex').then((val) => {
                  var fileData:any = JSON.parse(val);
                  this.subTestIndex = fileData.subTestIndex;

                  console.log("sub test index:"+this.subTestIndex);
                  if(this.studentObject.postTestWordDataRecordListArray==null)
                    this.studentObject.postTestWordDataRecordListArray=[];

                  //this.testIndex = this.studentObject.postTestWordDataRecordListArray.length; 
                  this.TestTitle= "Post Test Assessment "+this.testIndex;
                  if(this.testIndex < this.studentObject.postTestWordDataRecordListArray.length)        
                    this.postTestWordDataRecordListObject=this.studentObject.postTestWordDataRecordListArray[this.testIndex];
                
                  this.wordDataArray=this.arrayServiceObj.shuffle(this.wordDataArray);
                  this.totalCardNumber=this.wordDataArray.length;
                  if(this.totalCardNumber > 0)
                  {  
                      this.currentCardNumber=1;
                      this.wordDataObject=this.wordDataArray[this.currentCardNumber-1];  
                  }
                  else{
                          //this.goBackToView();
                          this.navCtrl.pop();
                   }                  
                });        
              });        
          });
      });
  }

  greenCircleClick()
  {
    this.totalKnownCounter++;
    if(this.wordDataObject.isKnown==null)
      this.wordDataObject.isKnown=[];
    this.wordDataObject.isKnown.push(true)
    if(this.wordDataObject.totalKnownWord == null)
      this.wordDataObject.totalKnownWord=0;
    this.wordDataObject.totalKnownWord++;
    
    if(this.currentCardNumber<this.wordDataArray.length)
    {
     
      this.wordDataObject=this.wordDataArray[this.currentCardNumber];
      this.currentCardNumber++;
    }
    else{
      console.log("else:green");
      this.goBackToView();
    }
  }
  redCircleClick(){
    if(this.wordDataObject.isKnown==null)
      this.wordDataObject.isKnown=[];
    
    this.wordDataObject.isKnown.push(false)
    
    if(this.currentCardNumber<this.wordDataArray.length)
    {
      this.wordDataObject=this.wordDataArray[this.currentCardNumber];
      this.currentCardNumber++;
    }
    else{
      console.log("else:green");
      this.goBackToView();
    }
  }
  goBackToView()
  {
      if(this.studentObject.postTestWordDataRecordListArray==null)
        this.studentObject.postTestWordDataRecordListArray=[];
    
      this.postTestWordDataRecordListObject.postTestWordDataArray=this.wordDataArray;
      if(this.postTestWordDataRecordListObject.knownCounterArray==null)
      {
        this.postTestWordDataRecordListObject.knownCounterArray=[];
      }
      else{
        this.postTestWordDataRecordListObject.knownCounterArray[this.subTestIndex]=this.totalKnownCounter;
      }
      if(this.postTestWordDataRecordListObject.subTestCompleted==null)
        this.postTestWordDataRecordListObject.subTestCompleted=0;
      this.postTestWordDataRecordListObject.subTestCompleted++;
      if(this.subTestIndex>0)
      {
        if(this.postTestWordDataRecordListObject.consistancyPercentageArray==null)
        {
          this.postTestWordDataRecordListObject.consistancyPercentageArray=[];
        }
        this.postTestWordDataRecordListObject.consistancyPercentageArray[this.subTestIndex] = 
            this.postTestWordDataRecordListObject.knownCounterArray[this.subTestIndex]  - 
            this.postTestWordDataRecordListObject.knownCounterArray[this.subTestIndex-1];
      }
    
    var postTestAssessmentService:PostTestAssessmentService = new PostTestAssessmentService();
    if(this.testIndex < this.studentObject.postTestWordDataRecordListArray.length)
      this.studentObject.postTestWordDataRecordListArray[this.testIndex] = this.postTestWordDataRecordListObject;
    else
      this.studentObject.postTestWordDataRecordListArray.push(this.postTestWordDataRecordListObject);
    postTestAssessmentService.addPostTestWordDataRecordListObject(this.studentObject,this.testIndex);
   
    if(Student!=null)
    {
      console.log("studentName:"+this.studentObject.firstName+" "+this.studentObject.lastName+" ass len:"+this.studentObject.assessmentDataArrayObject.length);
      this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
    } 
     this.navCtrl.pop();
  }

}