import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
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
import { DIFlashCardSessionTest } from '../DIMethodSessionTest/DIFlashCardSessionTest';
import { TraditionalDrillPracticeService } from '../../../../services/TraditionalDrillPracticeService';
import { AddWordList } from '../../../addWordList/addWordList';
import { ViewPreSessionUnKnownWord } from './viewPreSessionUnknownWord/viewPreSessionUnKnownWord';
import { KnownUnknownWordData } from '../../../../models/knownUnknownWordData';

@Component({
    selector: 'page-preSessionResult',
    templateUrl: 'preSessionResult.html'
  })
export class PreSessionResult{
    private error:string="";
    private studentObject:Student=new Student();
    private sessionCounter:number;
    private methodIndex:number;
    private preSessionWordDataArray:Array<PreSessionResultTest>=[];
    private test1Map:MyMap;
    private test2Map:MyMap;
    private incrementalRehrsalService:IncrementalRehersalService= new IncrementalRehersalService();
    private wordServiceObj:WordServices =new WordServices();
    private tempUnknownList:Array<WordData>=[];
    private testWordDataList:Array<WordData>=[];
    private incrementalRehersalServiceObject:IncrementalRehersalService=new IncrementalRehersalService();
    private methodSessionObject:MethodSession=new MethodSession();
    private studentServiceObject:StudentServices=new StudentServices();
    private remainUnknownWordArray:Array<WordData>=[];
    private dimethodStart:boolean=false;
    private ratio1:number=0;
    private ratio2:number=0;
    private traditionalDrillPracticeService:TraditionalDrillPracticeService= new TraditionalDrillPracticeService();
    
    
    constructor(private file:File ,
        public navCtrl: NavController,
        private navParams:NavParams,
        private storage:Storage,
        public modalCtrl: ModalController) {

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
                      var i=0;
                  
                      if(this.sessionCounter>=1)
                      {
                        console.log("retention:"+this.methodSessionObject.retentionWordList.values);
                        console.log("control:"+this.methodSessionObject.controlItems.values);
                        this.test1Map=this.methodSessionObject.retentionWordList;
                        this.test2Map=this.methodSessionObject.controlItems;
                        this.updatePreSessionResultTest();
                        console.log("xccx:"+this.methodSessionObject.unknownWordList.length+"  pretest:"+this.preSessionWordDataArray.length);
                       this.methodSessionObject.unknownWordList=[];
                        i=0;
                        for(let presetObj of this.preSessionWordDataArray)
                        {
                            if(i<this.ratio2)
                            {

                                if(!presetObj.isKnownWord)
                                 {
                                     console.log("push:"+presetObj.wordData.wordText);
                                    this.methodSessionObject.unknownWordList.push(presetObj.wordData);
                                    i++;
                                 }   
                                else{
                                    if(this.studentObject.knownUnknownArrayList==null)
                                        this.studentObject.knownUnknownArrayList=[];
                                    if(this.studentObject.newKnownUnknownArrayList==null)
                                        this.studentObject.newKnownUnknownArrayList=[];
                                   // this.wordServiceObj.removeWordFromArray(this.studentObject.knownUnknownArrayList,presetObj.wordData);
                                    this.wordServiceObj.removeKnownUnKnownWordFromArray(this.studentObject.newKnownUnknownArrayList,presetObj.wordData);
                                    var knownUnknownWordDataObject : KnownUnknownWordData= new KnownUnknownWordData();
                                    knownUnknownWordDataObject.wordData=presetObj.wordData;
                                    knownUnknownWordDataObject.methodIndex=this.methodIndex;
                                    knownUnknownWordDataObject.wordId=presetObj.wordData.wordId;
                                    knownUnknownWordDataObject.methodName=this.studentObject.methodArray[this.methodIndex].methodName;
                                    knownUnknownWordDataObject.postAssessmentCounter=0;
                                    this.studentObject.newKnownUnknownArrayList.push(knownUnknownWordDataObject);
                                    
                                    // this.studentObject.knownUnknownArrayList.push(presetObj.wordData);
                                  }
                               
                            }
                            else
                                break;
                        }
                        console.log("uklien:"+this.studentObject.unKnownArrayList.length);
                        var j=0;
                        while(i<this.ratio2)
                        {
                            this.methodSessionObject.unknownWordList.push(this.studentObject.unKnownArrayList[j++]);
                            i++;
                            
                        }

                      }
                      i=0;
                      // if(this.methodSessionObject.controlItems.keys.length< this.studentObject.methodArray[this.methodIndex].ratio2){
                            
                        // }
                        this.remainUnknownWordArray=[];
                        for(let wordObj of this.methodSessionObject.unknownWordList)
                        {
                            if(i>=this.ratio2)
                                break;
                            this.remainUnknownWordArray.push(this.methodSessionObject.unknownWordList[i]);
                            i++;
                        }
                        
                     //   this.methodSessionObject.sessionUnknownList=this.remainUnknownWordArray;
                        console.log("remin:"+this.remainUnknownWordArray.length+"  metho:"+this.methodSessionObject.unknownWordList.length);
                        this.goBackToView();
                        if(this.methodIndex==0)
                        {
                            this.testWordDataList =this.incrementalRehersalServiceObject.startSessionTest(this.methodSessionObject,this.ratio1,this.ratio2);

                        }
                        else if(this.methodIndex==1)
                        {
                            this.dimethodStart=true;
                        }
                        else if(this.methodIndex==2)
                        {
                            this.testWordDataList= this.traditionalDrillPracticeService.getWorDataList(this.methodSessionObject,this.ratio2);
                        }
                    });
                });
            });
        });

       
     }

    public ionViewWillEnter() {
        this.storage.get('studentObject').then((val) => {
            var fileData:any = JSON.parse(val);
            this.studentObject = fileData.studentObject;
         
            this.storage.get('methodSessionObject').then((val) => {
                var fileData:any = JSON.parse(val);
                this.methodSessionObject = fileData.methodSessionObject;

                this.goBackToView();
            });
            

        });
        
    }
    
    updatePreSessionResultTest(){
        this.preSessionWordDataArray=this.incrementalRehrsalService.compareAssessment(this.test1Map,this.test2Map,this.preSessionWordDataArray);
      
     }
    startSession()
    {
        this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
        this.storage.set('methodIndex',JSON.stringify({ methodIndex: this.methodIndex }) );
        this.storage.set('methodSessionObject',JSON.stringify({ methodSessionObject: this.methodSessionObject }) );
        this.storage.set('sessionCounter',JSON.stringify({ sessionCounter: this.sessionCounter }) );
        if(this.methodIndex==0 || this.methodIndex==2)
        {
            this.storage.set('wordDataList',JSON.stringify({ wordDataList: this.testWordDataList }) );
            this.navCtrl.push(FlashCardIntervetion);
        }
        else if(this.methodIndex==1)
        {
            this.navCtrl.push(DIFlashCardSessionTest);
        }

    }

    goBackToView()
    {
      console.log("retention:"+this.methodSessionObject.retentionWordList.values);
      console.log("control:"+this.methodSessionObject.controlItems.values);
      if(this.methodSessionObject!=null)
      {
        this.storage.set('methodSessionObject',JSON.stringify({ methodSessionObject: this.methodSessionObject }) );
      }
      if(this.studentObject!=null)
      {
        this.studentServiceObject.updateStudentToFile(this.file,this.studentObject,this.studentServiceObject);
        this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
      } 
    }


    showModalWord(wordDataObj: WordData)
    {
        console.log("show modal:"+wordDataObj.wordText);
        let profileModal = this.modalCtrl.create(ViewPreSessionUnKnownWord,{
            wordDataObject: wordDataObj 
        },{
            cssClass: 'update-profile-modal'
        });
       
        profileModal.present();
    }
}