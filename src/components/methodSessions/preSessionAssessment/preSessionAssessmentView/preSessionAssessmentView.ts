import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Student } from "../../../../models/student";
import { FlashCardIntervetion } from '../../flashCardTest/flashCardIntervention';
import { IncrementalRehersalService } from '../../../../services/IncrementalRehersalService';
import { WordData } from '../../../../models/wordData';
import { MethodSession } from '../../../../models/methodIntervetionSession';
import { PreSessionResultTest } from '../../../../models/PreSessionAssessmentResultTest';
import { WordServices } from '../../../../services/wordServices';
import { StudentServices } from '../../../../services/studentAddRemoveServices';
import { File } from '@ionic-native/file';
import { MyMap } from '../../../../models/myMap';
import { Storage } from '@ionic/storage';
import { TraditionalDrillPracticeService } from '../../../../services/TraditionalDrillPracticeService';

@Component({
    selector: 'page-PreSessionAssessmentView',
    templateUrl: 'PreSessionAssessmentView.html'
  })
export class PreSessionAssessmentView{

    private error:string="";
    private studentObject:Student=new Student();
    private sessionCounter:number;
    private methodIndex:number;
    private preSessionWordDataArray:Array<PreSessionResultTest>=[];
    private test1Map:MyMap;
    private test2Map:MyMap;
    private incrementalRehrsalService:IncrementalRehersalService= new IncrementalRehersalService();
    private methodSessionObject:MethodSession;
    private remainUnknownWordArray:Array<WordData>=[];
    private ratio1:number=0;
    private ratio2:number=0;
    
    
    constructor(private file:File ,
        public navCtrl: NavController,
        private storage:Storage) {

            storage.get('studentObject').then((val) => {
                var fileData:any = JSON.parse(val);
                this.studentObject = fileData.studentObject;
              
                storage.get('methodIndex').then((val) => {
                  var fileData:any = JSON.parse(val);
                  this.methodIndex = fileData.methodIndex;
                  this.ratio1=this.studentObject.methodArray[this.methodIndex].ratio1;
                  this.ratio2=this.studentObject.methodArray[this.methodIndex].ratio2;

                  storage.get('methodSessionObject').then((val) => {
                    var fileData:any = JSON.parse(val);
                    this.methodSessionObject = fileData.methodSessionObject;
                    
                    storage.get('sessionCounter').then((val) => {
                      var fileData:any = JSON.parse(val);
                      this.sessionCounter = fileData.sessionCounter;
        
                      if(this.sessionCounter>0)
                      {
                        console.log("retention:"+this.methodSessionObject.retentionWordList.values);
                        console.log("control:"+this.methodSessionObject.controlItems.values);
                        this.test1Map=this.methodSessionObject.retentionWordList;
                        this.test2Map=this.methodSessionObject.controlItems;
                        this.updatePreSessionResultTest();
                        
                      }

                        var i:number=0;
                      // if(this.methodSessionObject.controlItems.keys.length< this.studentObject.methodArray[this.methodIndex].ratio2){
                            
                        // }
                        this.remainUnknownWordArray=this.methodSessionObject.unknownWordList;
                    });
                });
            });
        });

       
     }
    
    updatePreSessionResultTest(){
        this.preSessionWordDataArray=this.incrementalRehrsalService.compareAssessment(this.test1Map,this.test2Map,this.preSessionWordDataArray);
        
    }
}