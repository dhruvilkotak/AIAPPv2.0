import { Component } from '@angular/core';
import { File } from '@ionic-native/file';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Student } from '../../../../models/student';
import { WordData } from '../../../../models/wordData';
import { methodInterventionWordData } from '../../../../models/methodInterventionWordData';
import { MethodSession } from '../../../../models/methodIntervetionSession';
import { StudentServices } from '../../../../services/studentAddRemoveServices';
import { SessionSummary } from '../sessionSummary/sessionSummary';
import { DirectInstructionServices } from '../../../../services/DirectInstructionSevice';
import { WordServices } from '../../../../services/wordServices';
@Component({
  selector: 'page-DIFlashCardSessionTest',
  templateUrl: 'DIFlashCardSessionTest.html'
})


export class DIFlashCardSessionTest{
  private studentObject:Student=new Student();
  private methodIndex:number;

   private wordDataObject:WordData=new WordData();
   private wordDataArray: Array<WordData> = [];
   private sessionCounter:number;
   private TestTitle:String;
   private currentCardNumber:number=0;
   private totalCardNumber:number=0;
  private testIndex:number=0;
  private testFlag:number=0; // testType="assessment" :0 ; "IncrementRehrsal" :1
  //private studentObject:Student;
  private methodInetrventionWordDataArray:Array<methodInterventionWordData>;
  private methodInterventionWordDataObj:methodInterventionWordData;
  private methodSessionObject:MethodSession;
  private studentServiceObject:StudentServices=new StudentServices();
  private DIServiceObject:DirectInstructionServices = new DirectInstructionServices();
  private ratio1:number=0;
  private ratio2:number=0;
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
    private storage:Storage ) {
      
      storage.get('studentObject').then((val) => {
        var fileData:any = JSON.parse(val);
        this.studentObject = fileData.studentObject;
        
        storage.get('methodIndex').then((val) => {
          var fileData:any = JSON.parse(val);
          this.methodIndex = fileData.methodIndex;
          
          storage.get('methodSessionObject').then((val) => {
            var fileData:any = JSON.parse(val);
            this.methodSessionObject = fileData.methodSessionObject;
            
              this.startDate=new Date();
              this.ratio1=this.studentObject.methodArray[this.methodIndex].ratio1;
              this.ratio2=this.studentObject.methodArray[this.methodIndex].ratio2;
              this.methodInetrventionWordDataArray = this.DIServiceObject.makeSessionList(this.studentObject.knwonArrayList,this.studentObject.unKnownArrayList,this.ratio1,this.ratio2);
              
              this.sessionCounter=this.methodSessionObject.sessionIndex;
              //this.methodInetrventionWordDataArray=this.methodSessionObject.sessionWordDataList;
              this.TestTitle="Session "+this.sessionCounter;
              this.methodSessionObject.totalOppurtunitiesToRespond=((this.ratio1-1)*(this.ratio1+2)*this.ratio2)/2;
              console.log("test:"+this.sessionCounter);
              console.log("retention:"+this.methodSessionObject.retentionWordList.values);
              console.log("control:"+this.methodSessionObject.controlItems.values);
              this.totalCardNumber=this.methodSessionObject.totalOppurtunitiesToRespond;
              if(this.totalCardNumber>0)
              {
            this.currentCardNumber=1;
                this.methodInterventionWordDataObj=this.methodInetrventionWordDataArray[0];
                this.wordDataObject=this.methodInterventionWordDataObj.wordData;  
              }
              else{
                this.navCtrl.pop();
              //  console.log("size:"+this.wordDataArray.length+" id:"+this.wordDataArray[0].wordId);
            //   this.updateAllObjects();
              }        
              
          });
        });
      });
      
      
  }
  greenCircleClick(){
   // this.methodInterventionWordDataObj= this.getMethodSessionWordDataObject(this.wordDataObject);
    
    if(this.methodInterventionWordDataObj!=null)
    {
      this.methodInterventionWordDataObj.knownTime++;
      this.methodInterventionWordDataObj.totalAskedTime++;
    }
    
    this.updateMethodSessionWordDataObject(this.methodInterventionWordDataObj,true);
    if(this.currentCardNumber+1<=this.totalCardNumber)
    {
      this.methodInterventionWordDataObj=this.methodInetrventionWordDataArray[0];
      this.wordDataObject=this.methodInterventionWordDataObj.wordData;
      this.currentCardNumber++;
    }
    else{
      console.log("else:green");
      this.updateAllObjects();
      //    this.goBackToView();
    }
  }
  redCircleClick(){
    //this.methodInterventionWordDataObj= this.getMethodSessionWordDataObject(this.wordDataObject);


    if(this.methodInterventionWordDataObj!=null)
    {
      this.methodInterventionWordDataObj.totalAskedTime++;
    }
    this.updateMethodSessionWordDataObject(this.methodInterventionWordDataObj,false);
    if(this.currentCardNumber+1<=this.totalCardNumber)
    {
      this.methodInterventionWordDataObj=this.methodInetrventionWordDataArray[0];
      this.wordDataObject=this.methodInterventionWordDataObj.wordData;
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
      console.log("final length:"+this.studentObject.unKnownArrayList.length+"  session:"+this.methodSessionObject.unknownWordList.length);
        this.wordServiceObj.removeArrayFromArray(this.studentObject.unKnownArrayList, this.methodSessionObject.unknownWordList);
        console.log("final length:"+this.studentObject.unKnownArrayList.length+"  session:"+this.methodSessionObject.unknownWordList.length);
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
   
      this.studentServiceObject.updateStudentToFile(this.file,this.studentObject,this.studentServiceObject).then(()=>{
        this.goBackToView();
        console.log("sessionLength:"+this.studentObject.methodArray[this.methodIndex].sessionsArray.length)
        
      });
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
  updateMethodSessionWordDataObject( methodInterventionWordDataObj:methodInterventionWordData, KnownThisTime:boolean)
  {
    this.DIServiceObject.printmethodInetrventionWordDataArray(this.methodInetrventionWordDataArray);
    
    if(methodInterventionWordDataObj.isKnownWord)
    {
        this.DIServiceObject.removeObjectFromArray(this.methodInetrventionWordDataArray,0);
        this.methodInetrventionWordDataArray.push(methodInterventionWordDataObj);
    }
    else{
        if(KnownThisTime)
        {//known 
            console.log("known word");
            if(!methodInterventionWordDataObj.drillmode)
            {
                console.log("unKnown item:yes  drill:not mode adding last:");
                this.DIServiceObject.removeObjectFromArray(this.methodInetrventionWordDataArray,0);
                this.methodInetrventionWordDataArray.push(methodInterventionWordDataObj);
            }
            else{
                //put it after ratio2 steps
                methodInterventionWordDataObj.drillmodeKnownCounter++;
                this.DIServiceObject.removeObjectFromArray(this.methodInetrventionWordDataArray,0);
                if(methodInterventionWordDataObj.drillmodeKnownCounter < this.ratio2-1 )
                {
                    console.log("unKnown item:yes   drill mode:yes adding 3rd index: drill mode known time counter:"+methodInterventionWordDataObj.drillmodeKnownCounter);
                    this.DIServiceObject.addObjectToArray(this.methodInetrventionWordDataArray,methodInterventionWordDataObj,this.ratio2-1);

                }
                else{
                    console.log("unKnown item:yes   drill mode:yes adding last index:");
                    methodInterventionWordDataObj.drillmode=false;
                    methodInterventionWordDataObj.drillmodeKnownCounter=0;
                    this.methodInetrventionWordDataArray.push(methodInterventionWordDataObj);
                }

            }
        }
        else
        { // this time unknown
            if(!methodInterventionWordDataObj.drillmode)
            {
                methodInterventionWordDataObj.drillmode=true;
            }    
            console.log("unKnown item:yes   drill mode making:yes adding 3rd index:");
            methodInterventionWordDataObj.drillmodeKnownCounter=0;
            this.DIServiceObject.removeObjectFromArray(this.methodInetrventionWordDataArray,0);
            this.DIServiceObject.addObjectToArray(this.methodInetrventionWordDataArray,methodInterventionWordDataObj,this.ratio2-1);

        }
    }
  }

  

}