import { Component } from "@angular/core";
import { Student } from "../../../models/student";
import { NavController, NavParams } from "ionic-angular";
import { PostTestWordDataRecordList } from "../../../models/postTestWordDataRecordList";
import { Storage } from "@ionic/storage";

@Component({
    selector: 'page-viewSubPostTestAssessmentRecord',
    templateUrl: 'viewSubPostTestAssessmentRecord.html'
  })

export class ViewSubPostTestAssessmentRecord{

    private error:string="";
    private studentObject:Student=new Student();
    private postTestWordDataRecordListObject:PostTestWordDataRecordList= new PostTestWordDataRecordList();
    
    private numbers:Array<number> =[];
    testIndex=-1;
    constructor(public navCtrl: NavController,
      private storage:Storage,
      private navParams:NavParams) {
        
        this.storage.get('studentObject').then((val) => {
        var fileData:any = JSON.parse(val);
        this.studentObject = fileData.studentObject;
        this.storage.get('testIndex').then((val) => {
            var fileData:any = JSON.parse(val);
            this.testIndex = fileData.testIndex;
            
            if(this.studentObject.postTestWordDataRecordListArray!=null && this.testIndex < this.studentObject.postTestWordDataRecordListArray.length)
            {
                this.postTestWordDataRecordListObject= this.studentObject.postTestWordDataRecordListArray[this.testIndex];
                this.numbers = Array.from(Array(this.postTestWordDataRecordListObject.subTestCompleted).keys());
            }
              
        });
        
      });
    }

}