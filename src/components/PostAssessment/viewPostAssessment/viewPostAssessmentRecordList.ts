import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { Student } from "../../../models/student";
import { Storage } from "@ionic/storage";
import { PostTestWordDataRecordList } from "../../../models/postTestWordDataRecordList";
import { ViewSubPostTestAssessmentRecord } from "../viewSubPostTestAssessmentRecord/viewSubPostTestAssessmentRecord";


@Component({
    selector: 'page-viewPostAssessmentRecordList',
    templateUrl: 'viewPostAssessmentRecordList.html'
  })
export class ViewPostAssessmentRecordList{

    private studentObject:Student = new Student();
    private postTestWordDataRecordListArray:Array<PostTestWordDataRecordList>=[]
    constructor(public navCtrl: NavController,
        private navParams:NavParams,
        private storage:Storage) {
        this.storage.get('studentObject').then((val) => {
            var fileData:any = JSON.parse(val);
            this.studentObject = fileData.studentObject;
            if(this.studentObject.postTestWordDataRecordListArray!=null)
                this.postTestWordDataRecordListArray= this.studentObject.postTestWordDataRecordListArray;

        });
         
    }
    viewPostTestAssessment(index:number)
    {
        this.storage.set('testIndex',JSON.stringify({ testIndex: index }) );   
        this.navCtrl.push(ViewSubPostTestAssessmentRecord);
    }

}