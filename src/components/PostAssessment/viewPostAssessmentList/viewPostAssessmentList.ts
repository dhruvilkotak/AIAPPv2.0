import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Student } from "../../../models/student";
import { PostTestWordData } from "../../../models/PostTestWordData";
import { PostTestAssessmentService } from "../../../services/postTestAssessmentService";
import { KnownUnknownWordData } from "../../../models/knownUnknownWordData";
import { Storage } from "@ionic/storage";
import { File } from "@ionic-native/file";
import { PostTestWordDataRecordList } from "../../../models/postTestWordDataRecordList";
import { PostAssessmentFlashCard } from "../postAssessmentFlashCard/postAssessmentFlashCard";


@Component({
    selector: 'page-ViewPostAssessmentList',
    templateUrl: 'ViewPostAssessmentList.html'
  })
export class ViewPostAssessmentList{

    studentObject:Student=new Student();
    subTestCompleted:number=0;
    testIndex:number=0;
    postTestWordDataArray:Array<PostTestWordData>=[];
    totalWordLength:number=0;
    private wordDataArray: Array<KnownUnknownWordData> = [];
    error="";
    numbers:Array<number>=[];
    postTestWordDataRecordListObject:PostTestWordDataRecordList=new PostTestWordDataRecordList();

    constructor(public navCtrl: NavController,
        private navParams:NavParams,
        private storage:Storage,
        private file:File) {
            this.constructorMethod(); 
    }

    public ionViewWillEnter() {
         this.constructorMethod();
    } 

    constructorMethod(){

        this.storage.set('postTestWordDataArray',null );
        this.storage.set('subTestIndex',null); 
     
        this.storage.get('studentObject').then((val) => {
            var fileData:any = JSON.parse(val);
            this.studentObject = fileData.studentObject;
            this.storage.get('testIndex').then((val) => {
                var fileData:any = JSON.parse(val);
                this.testIndex = fileData.testIndex;

                if(this.studentObject.postTestWordDataRecordListArray !=null && this.testIndex< this.studentObject.postTestWordDataRecordListArray.length)
                    this.subTestCompleted=this.studentObject.postTestWordDataRecordListArray[this.testIndex].subTestCompleted;
                
                this.numbers = Array.from(Array(3).keys());
               // this.numbers = new Array(3).map((x,i)=>i); // [0,1,2,3,4]
             //   
                if( this.subTestCompleted ==0)
                {
                    this.storage.get('KnownUnknownWordDataList').then((val) => {
                        var fileData:any = JSON.parse(val);
                        this.wordDataArray = fileData.KnownUnknownWordDataList;
                        var postTestAssessmentService:PostTestAssessmentService = new PostTestAssessmentService();
                        this.postTestWordDataArray= postTestAssessmentService.getPostTestWordDataArrayFromWordData(this.wordDataArray);
                        console.log("worddata:"+ (this.postTestWordDataArray[0].wordData.wordText) )
                    });
                }
                else if(this.subTestCompleted >0){      
                    this.postTestWordDataRecordListObject = this.studentObject.postTestWordDataRecordListArray[this.testIndex];
                    this.postTestWordDataArray=this.postTestWordDataRecordListObject.postTestWordDataArray;
                }
               
        });
    });   
    }
    startAssessmentTest(index:number){

        console.log("index:"+index);
        if(index>this.subTestCompleted)
            this.error = " first complete "+this.subTestCompleted+" test."
        else if(index<this.subTestCompleted){
            
            this.error=" Test "+(index+1)+" is already done";
        }
        else{
            this.error="";
            this.storage.set('postTestWordDataArray',JSON.stringify({ postTestWordDataArray: this.postTestWordDataArray }) );
            this.storage.set('subTestIndex',JSON.stringify({ subTestIndex: index }) ); 
            console.log("flash card len nav ctrl:"+this.navCtrl.last()+"  len:"+this.navCtrl.length());
            var navCtrlLen:number=this.navCtrl.length();
            if(navCtrlLen>=6)
            {
                this.navCtrl.push(PostAssessmentFlashCard).then(()=>{
                    const startIndex = this.navCtrl.getActive().index - 2;
                    this.navCtrl.remove(startIndex, 1);        
                  });
            }
            else
                this.navCtrl.push(PostAssessmentFlashCard);
           
        }
        
    }


}