import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Student } from "../../../models/student";
import { FlashCardIntervetion } from '../flashCardTest/flashCardIntervention';
import { IncrementalRehersalService } from '../../../services/IncrementalRehersalService';
import { WordData } from '../../../models/wordData';
import { MethodSession } from '../../../models/methodIntervetionSession';
import { PreSessionFlashCard } from '../flashCardTest/preSessionFlashCardTest/preSessionFlashCard';
import { StudentServices } from '../../../services/studentAddRemoveServices';
import { File } from '@ionic-native/file';
import { MyMap } from '../../../models/myMap';
import { MyMApServices } from '../../../services/MyMapServices';
import { Storage } from '@ionic/storage';
import { SessionSummary } from '../flashCardTest/sessionSummary/sessionSummary';
import { SessionList } from '../sessionsList/sessionList';
import { DIFlashCardSessionTest } from '../flashCardTest/DIMethodSessionTest/DIFlashCardSessionTest';
import { TraditionalDrillPracticeService } from '../../../services/TraditionalDrillPracticeService';
import { PreSessionResult } from '../flashCardTest/preeSessionResult/preSessionResult';
import { LineChart } from '../../charts/lineCharts/lineCharts';


@Component({
    selector: 'page-preSessionData',
    templateUrl: 'preSessionData.html'
  })
export class PreSessionView{
    private studentObject:Student=new Student();
    private methodIndex:number=0;
    private methodName:string="";
    private totalSessions:number;
    private sessionCounter : number=0;
    private error:string="";
    private incrementalRehersalServiceObject:IncrementalRehersalService=new IncrementalRehersalService();
    private traditionalDrillPracticeService:TraditionalDrillPracticeService= new TraditionalDrillPracticeService();
    //session details
    private wordDataList:Array<WordData>=[];
    private knownWordDataList:Array<WordData>=[];
    private unKnownWordDataList:Array<WordData>=[];
    private ratio1:number=0;
    private ratio2:number=0;
    private myMapServiceObject:MyMApServices= new MyMApServices();
    private methodSessionObject:MethodSession =new MethodSession() ;
    private previousUnknownArray:Array<WordData>=[];
    private studentServiceObject:StudentServices=new StudentServices();


    constructor(private file:File,
        public navCtrl: NavController,
        private navParams:NavParams,
        private storage:Storage) {

        storage.get('studentObject').then((val) => {
            var fileData:any = JSON.parse(val);
            this.studentObject = fileData.studentObject;
            this.storage.get('methodIndex').then((val) => {
                var fileData:any = JSON.parse(val);
                this.methodIndex = fileData.methodIndex;
                console.log("methodIndex:"+this.methodIndex);
                
                this.totalSessions=this.studentObject.methodArray[this.methodIndex].sessionsArray.length; 
                console.log("total sesions:"+this.totalSessions);
                
                this.methodName =  this.studentObject.methodArray[this.methodIndex].methodName ;
                console.log("Method Name:"+this.methodName);
                this.ratio1=this.studentObject.methodArray[this.methodIndex].ratio1;
                this.ratio2=this.studentObject.methodArray[this.methodIndex].ratio2;

            //     if(this.totalSessions==0)
            //     {
            //         var j:number=0;
            //         while(j<this.ratio2)
            //         {
            //                 this.previousUnknownArray.push(this.studentObject.unKnownArrayList[j]);
            //             j++;
            //         }  
            //    }
            //    else{
            //         this.previousUnknownArray=this.studentObject.methodArray[this.methodIndex].sessionsArray[this.totalSessions-1].unknownWordList;
            //    }
               console.log("previous:"+this.previousUnknownArray.length);
            });
        });
    }

    public ionViewWillEnter() {
        console.log("ionviewwill");
        this.storage.get('studentObject').then((val) => {
            var fileData:any = JSON.parse(val);
            this.studentObject = fileData.studentObject;
            this.storage.get('methodIndex').then((val) => {
                var fileData:any = JSON.parse(val);
                this.methodIndex = fileData.methodIndex;
                console.log("ioview method index:"+this.methodIndex);
            this.totalSessions=this.studentObject.methodArray[this.methodIndex].sessionsArray.length; 
            this.previousUnknownArray=[];
            if(this.totalSessions==0)
                {
                    var j:number=0;
                    while(j<this.ratio2)
                    {
                            this.previousUnknownArray.push(this.studentObject.unKnownArrayList[j]);
                        j++;
                    }  
               }
               else{
                    this.previousUnknownArray=this.studentObject.methodArray[this.methodIndex].sessionsArray[this.totalSessions-1].unknownWordList;
               }
            console.log("total sesions:"+this.totalSessions);
            console.log("previous:"+this.previousUnknownArray.length);
            });
              
        });
   
    }



    startNextSession()
    {
       console.log("knownlll:"+this.studentObject.knwonArrayList.length);
       if( this.studentObject.knwonArrayList.length>= this.ratio1 )
        {
            this.methodSessionObject= new MethodSession();
            this.knownWordDataList=this.studentObject.knwonArrayList;
            this.sessionCounter=this.totalSessions;
            //set method session attribute
            this.methodSessionObject.sessionIndex=this.totalSessions;
            
            var j:number=0;
            if(this.methodSessionObject.knownWordList  == null)
            {
                this.methodSessionObject.knownWordList=[];
            }
            while(j<this.ratio1)
            {
                this.methodSessionObject.knownWordList.push(this.knownWordDataList[j++]);
            }
            this.methodSessionObject.knownWordList=this.incrementalRehersalServiceObject.shuffle(this.methodSessionObject.knownWordList);
            
            
            j=0;
          
            if(this.methodSessionObject.unknownWordList  == null)
            {
                this.methodSessionObject.unknownWordList=[];
            }
          
            while(j<this.ratio2)
            {
                if(this.methodSessionObject.sessionIndex==0)
                    this.methodSessionObject.unknownWordList.push(this.studentObject.unKnownArrayList[j]);
                j++;
            }
            //this.previousUnknownArray=this.methodSessionObject.unknownWordList;
            //this.methodSessionObject.unknownWordList=this.unKnownWordDataList;
            //this.studentObject.methodArray[this.methodIndex].sessionsArray.push(this.methodSessionObject);
            console.log("sessionCOunter:"+this.sessionCounter+" methodIndex:"+this.methodIndex+" unknown list");
            var uk1Map:MyMap;
            var uk2Map:MyMap;
            
            var comparedKnownList:Array<WordData>=[];
            
            if(this.sessionCounter==0)
            {
                if(this.methodIndex==0)
                {
                    this.wordDataList =this.incrementalRehersalServiceObject.startSessionTest(this.methodSessionObject,this.ratio1,this.ratio2);
                }
                else if(this.methodIndex==2)
                {
                    this.wordDataList= this.traditionalDrillPracticeService.getWorDataList(this.methodSessionObject,this.ratio2);
                }
               console.log("unknown wordlist:"+this.methodSessionObject.unknownWordList.length+" sessionunknown"+this.methodSessionObject.sessionUnknownList.length);
               var i:number=0
               for(let uk2MapObj of this.methodSessionObject.unknownWordList)
                {
                    if(i>3)
                        break;
                   // console.log("111:"+uk2MapObj+"  val:"+this.methodSessionObject.controlItems.getValue(uk2MapObj));
                    this.myMapServiceObject.setObject( this.methodSessionObject.retentionWordList,uk2MapObj,false);
                    this.myMapServiceObject.setObject(this.methodSessionObject.controlItems,uk2MapObj,false);
                    i++;
                }   
                console.log("retention size:"+this.myMapServiceObject.size(this.methodSessionObject.retentionWordList));
                console.log("control size:"+this.myMapServiceObject.size(this.methodSessionObject.controlItems));
                console.log("retention:"+this.methodSessionObject.retentionWordList.values);
                console.log("control:"+this.methodSessionObject.controlItems.values);
                if(this.methodSessionObject.unknownWordList.length >= this.ratio2)
                {
                    this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
                    this.storage.set('methodIndex',JSON.stringify({ methodIndex: this.methodIndex }) );
                    this.storage.set('methodSessionObject',JSON.stringify({ methodSessionObject: this.methodSessionObject }) );
                    this.storage.set('sessionCounter',JSON.stringify({ sessionCounter: this.sessionCounter }) );
                    this.navCtrl.push(PreSessionResult).then(()=>{
                                    this.goBackToView();
                    });   
                }
                else
                {
                    this.error="can not start sessio sry.";
                }
                // nav ctrl to flash card
                     
            }
           
            else if(this.sessionCounter>=1)
            {
                    uk1Map=this.setuk1MapValues(this.studentObject.methodArray[this.methodIndex].sessionsArray[this.sessionCounter-1].controlItems,this.previousUnknownArray);
                  //  uk1Map=<MyMap>this.studentObject.methodArray[this.methodIndex].sessionsArray[this.sessionCounter-1].controlItems;  // taking previous control items
                    //  if(uk1Map==null)
                    //      uk1Map=this.studentObject.methodArray[this.methodIndex].sessionsArray[this.sessionCounter-1].retentionWordList;  // taking previous control items
                   
                   console.log("uk1Mapsize:"+(uk1Map==null)+"  s:"+(uk1Map.values));
                    this.myMapServiceObject.printMyMap(uk1Map);
                    var n:number=this.studentObject.methodArray[this.methodIndex].ratio2;
                    console.log("n:"+n+" size:"+this.methodSessionObject.retentionWordList.keys.length);
                    if(this.methodSessionObject.retentionWordList.keys.length>0)
                        this.myMapServiceObject.clearMyMap(this.methodSessionObject.retentionWordList);
                    if(this.methodSessionObject.controlItems.keys.length>0)
                        this.myMapServiceObject.clearMyMap(this.methodSessionObject.controlItems);
                    if(uk1Map !=null && uk1Map.keys.length > 0)
                    {
                        //copying previous control items to rention items....
            
                        for(let uk2MapObj of uk1Map.keys)
                        { 
                            if(n<=0)
                                break;
                            console.log("copying to ret:"+this.myMapServiceObject.getValue(uk1Map, uk2MapObj));
                            this.myMapServiceObject.setObject(this.methodSessionObject.retentionWordList, uk2MapObj,this.myMapServiceObject.getValue(uk1Map, uk2MapObj));    
                            n--;
                        }
                            
                    }
                    console.log("n:"+n+" size:"+this.methodSessionObject.retentionWordList.keys.length);
                 
                    if(uk1Map!=null)
                        this.doAssessmentTest(this.studentObject,this.methodIndex,this.sessionCounter);
                   
                    //this.incrementalRehersalServiceObject.printList(this.unKnownWordDataList);
                }
        }
        else{
          this.error="can not start session.";
        }
        
    }

    doAssessmentTest(studentObject:Student , methodIndex:number, sessionCounter:number){
        //test uk1 set its boolean
        console.log("retention:"+this.methodSessionObject.retentionWordList.values);
        console.log("control:"+this.methodSessionObject.controlItems.values);
    
      //  this.goBackToView();
        console.log("starting your unknown assessment test :  press 1 for known and 2 for unknown");
        this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
        this.storage.set('methodIndex',JSON.stringify({ methodIndex: this.methodIndex }) );
        this.storage.set('sessionCounter',JSON.stringify({ sessionCounter: this.sessionCounter }) );
        this.storage.set('methodSessionObject',JSON.stringify({ methodSessionObject: this.methodSessionObject }) );
        
        this.navCtrl.push(PreSessionFlashCard).then(()=>{
            this.goBackToView();
        });
    }

    goBackToView()
    {
        if(this.studentObject!=null)
        {
            this.studentServiceObject.updateStudentToFile(this.file,this.studentObject,this.studentServiceObject);
            this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
        }        
    }

    sessionSummaries()
    {
        this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
        this.storage.set('methodIndex',JSON.stringify({ methodIndex: this.methodIndex }) );
        this.navCtrl.push(SessionList);
    }
    viewGraphData()
    {
        this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
        this.storage.set('methodIndex',JSON.stringify({ methodIndex: this.methodIndex }) );
        this.navCtrl.push(LineChart);
    }
    
    setuk1MapValues(controlItem:MyMap, previousUnknownArray:Array<WordData>){
        var returnMap:MyMap = new MyMap();
        console.log("control11:")
        this.myMapServiceObject.printMyMap(controlItem);
        
            for(let wordObj of previousUnknownArray)
            {
                if(this.myMapServiceObject.has(controlItem,wordObj))
                {
                    this.myMapServiceObject.setObject(returnMap, wordObj,this.myMapServiceObject.getValue(controlItem, wordObj));    
                    
                }
                else{
                    this.myMapServiceObject.setObject(returnMap, wordObj,false);   
                }
            }
        return returnMap;
    }
}