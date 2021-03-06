import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { Student } from '../../../models/student';
import { AssessmentTestData } from '../../../models/AssessmentTestData';
import { WordData } from '../../../models/wordData';
import { FlashCard } from '../../flashCardTest/flashCard';
import { ViewAssessmentWordObjects } from '../../../models/viewAssessmentWordObjects';
import { StudentServices } from '../../../services/studentAddRemoveServices';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { ViewAssessmentFireBaseService } from '../../../firebaseServices/viewAssessmentFireBaseService';
import { StudentFireBaseService } from '../../../firebaseServices/studentFireBaseService';

@Component({
    selector: 'page-viewAssessment',
    templateUrl: 'viewAssessment.html'
  })
export class ViewAssessmentTest
{
    private isenabled:boolean = true;
    private knownsTime:number=0;
    private totalKnowns:number=0;
    private totalUnKnowns:number=0;
    studentObject:Student=new Student();
    intArray:Array<number>=[];
    private error:String="";
    assessmentTestObjectArray:Array<AssessmentTestData>=[];
    assessmentTestDataObject:AssessmentTestData;
    assessmentWordDataArray:Array<ViewAssessmentWordObjects>=[];
    studentServiceObject:StudentServices=new StudentServices();
    private viewAssessmentFireBaseService:ViewAssessmentFireBaseService = new ViewAssessmentFireBaseService();
    private studentFireBaseService:StudentFireBaseService = new StudentFireBaseService();
      

    constructor(private modalCtrl: ModalController,
        public navCtrl: NavController,
        private navParams:NavParams,
        private file:File,
        private alertCtrl:AlertController,
        private storage:Storage) {
        this.storage.get('studentObject').then((val) => {
            var fileData:any = JSON.parse(val);
            this.studentObject = fileData.studentObject;
            console.log("student view1:"+this.studentObject.studentUID);
            console.log("converted:"+this.studentObject.convertToAssessmentWord);
            if(this.studentObject.convertToAssessmentWord==false)
            {
               console.log("converted:");
               this.convertAssessmentTestObjectToword(this.studentObject);
               this.studentObject.convertToAssessmentWord=true;
               this.studentObject.assessmentWordDataArray=this.assessmentWordDataArray;
               this.viewAssessmentFireBaseService.updateAssessmentWordDataArray(this.studentObject);
                 this.goBackToView(this.studentObject);
            }   
            else{
               this.assessmentTestObjectArray = this.studentObject.assessmentDataArrayObject;
                this.assessmentWordDataArray=this.studentObject.assessmentWordDataArray;
                console.log("converted:"+this.studentObject.convertToAssessmentWord+" size:"+this.assessmentTestObjectArray.length+"  len:"+this.assessmentWordDataArray.length);
                 
            }
            this.knownsTime = Math.floor((this.assessmentTestObjectArray.length) /2)  +1
            var j:number=1;
            this.intArray=[];
            while(j<=this.assessmentTestObjectArray.length)
            {
                this.intArray.push(j++);
            }
            console.log("length:"+this.assessmentTestObjectArray.length+" "+this.intArray);

              this.showKnownUnKnownWords();

            if(this.assessmentWordDataArray.length==0)
            {
                this.studentObject.PreInterventionAssessmentResults=true;
                this.goBackToView(this.studentObject);
               
                this.error="No data Available";
                console.log(this.error);
            }
            this.chekEnableDisable();
        });      
   }

   convertAssessmentTestObjectToword(studentObject:Student)
   {
        this.assessmentTestObjectArray = this.studentObject.assessmentDataArrayObject;
        console.log("assessize:"+this.assessmentTestObjectArray.length+"  s:"+this.assessmentTestObjectArray[0].testStatus);
        for(let assessmentTestDataObject of this.assessmentTestObjectArray)
        {
            if(assessmentTestDataObject.knownWordList!=null)
            {
                for(let wordDataObj of assessmentTestDataObject.knownWordList)
                {
                    let viewAssessmentWordObject:ViewAssessmentWordObjects= this.getAssessmentObject(wordDataObj);
                    if(viewAssessmentWordObject==null)
                    {
                        viewAssessmentWordObject=new ViewAssessmentWordObjects();
                        viewAssessmentWordObject.totalTest=studentObject.assessmentDataArrayObject.length;
                    }
                    viewAssessmentWordObject.wordData=wordDataObj;
                    viewAssessmentWordObject.testArrayKnown.push(true);
                    viewAssessmentWordObject.stringKnownArray.push("Known");
                    viewAssessmentWordObject.totalKnownTime=viewAssessmentWordObject.totalKnownTime+1;
                    this.updateAssessmentObjectToArray(viewAssessmentWordObject);
                }  
            }
            if(assessmentTestDataObject.unknownWordList != null)
            {
                for(let wordDataObj of assessmentTestDataObject.unknownWordList)
                {
                    let viewAssessmentWordObject:ViewAssessmentWordObjects= this.getAssessmentObject(wordDataObj);
                    if(viewAssessmentWordObject==null)
                    {
                        viewAssessmentWordObject=new ViewAssessmentWordObjects();
                        viewAssessmentWordObject.totalTest=studentObject.assessmentDataArrayObject.length;
                    }
                    viewAssessmentWordObject.wordData=wordDataObj;
                    viewAssessmentWordObject.testArrayKnown.push(false);
                    viewAssessmentWordObject.stringKnownArray.push("Unknown");
                    this.updateAssessmentObjectToArray(viewAssessmentWordObject);
                }
            }

        }
        

   }
    getAssessmentObject( wordData:WordData)
    {
        for(let obj of this.assessmentWordDataArray)
        {

            if(obj.wordData.wordId == wordData.wordId)
            {
                console.log("same : "+obj.wordData.wordText+" s:"+wordData.wordText);
                return obj;
            } 
        }
        return null;
    }

    updateAssessmentObjectToArray(viewAssessmentWordObject:ViewAssessmentWordObjects)
    {
        var i:number=0;
        if(this.assessmentWordDataArray==null)
            this.assessmentWordDataArray=[];
        for(let obj of this.assessmentWordDataArray)
        {
            if(obj.assessmentWordObjectId==viewAssessmentWordObject.assessmentWordObjectId)
            {
                this.assessmentWordDataArray[i]=viewAssessmentWordObject;
                return;
            }
            i++;
        }
        this.assessmentWordDataArray.push(viewAssessmentWordObject);
    }

    addToKnownList(wordDataObj:WordData)
    {
        this.knownConfirm(wordDataObj);
       
    }
    addToUnKnownList(wordDataObj:WordData)
    {
        this.unKnownConfirm(wordDataObj);
     
         
    }
    removeWordFromStudentAssessment(wordDataObj:WordData,wordType:String)
    {
        var i:number=0
        for(let obj of this.studentObject.assessmentWordDataArray)
        {
            if(obj.wordData.wordId == wordDataObj.wordId)
            {
                if(this.studentObject.assessmentWordDataArray[i].wordAdded)
                    return;
                this.studentObject.assessmentWordDataArray[i].wordType=wordType;
                this.studentObject.assessmentWordDataArray[i].wordAdded=true;
                
                this.viewAssessmentFireBaseService.updateassessmentWordDataArrayObject(this.studentObject,i);
                //this.studentObject.assessmentWordDataArray.splice(i, 1);
                this.assessmentWordDataArray=this.studentObject.assessmentWordDataArray;
                return;
            }
             i++;
        }
    }

    saveToKnownUnknown()
    {
        var anyChanges:boolean =false;
        console.log("student view2:"+this.studentObject.studentUID);
        for(let obj of this.studentObject.assessmentWordDataArray)
        {
            if(!obj.wordAdded)
            {
                anyChanges=true;
                //loginc
                if(obj.totalKnownTime>=this.knownsTime)
                {
                    
                    obj.wordType="Known";
                    obj.wordAdded=true;
                    if(this.studentObject.knwonArrayList==null)
                        this.studentObject.knwonArrayList=[];
                    this.studentObject.knwonArrayList.push(obj.wordData);
                }
                else
                {
                    obj.wordType="UnKnown";
                    obj.wordAdded=true;
                    if(this.studentObject.unKnownArrayList==null)
                        this.studentObject.unKnownArrayList=[];
                    this.studentObject.unKnownArrayList.push(obj.wordData);
                }
                obj.wordAdded=true;
            }   
        }
        this.assessmentWordDataArray=this.studentObject.assessmentWordDataArray;
        //this.assessmentWordDataArray=[];
        if(anyChanges)
        {
            
            this.viewAssessmentFireBaseService.updateAssessmentWordDataArray(this.studentObject);
            if(this.studentObject.knwonArrayList!=null)
            this.studentFireBaseService.updateKnownList(this.studentObject);
            if(this.studentObject.unKnownArrayList!=null)
            this.studentFireBaseService.updateUnKnownList(this.studentObject);
            this.goBackToView(this.studentObject);
        }    
    }

    chekEnableDisable()
    {
        var counter:number=0;
        for(let assessmentwordObject of this.assessmentWordDataArray)
        {
            if(assessmentwordObject.wordAdded)
            {
                counter++;
            }
        }
        if(counter == this.assessmentWordDataArray.length)
        {
            this.isenabled=false;
        }
 
    }
    goBackToView(studentObject:Student)
    {
        this.showKnownUnKnownWords();
        this.chekEnableDisable();
        if(Student!=null)
        {
            console.log("studentName:"+this.studentObject.firstName+" "+this.studentObject.lastName);
           // this.studentServiceObject.updateStudentToFile(this.file,this.studentObject,this.studentServiceObject);
            this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
        }
    }

    knownConfirm(wordDataObj:WordData) {
        let alert = this.alertCtrl.create({
          title: 'Known Word',
          message: 'Do you want to set as Known word '+wordDataObj.wordText +'?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {

                console.log('Cancel clicked');
              }
            },
            {
              text: 'yes',
              handler: () => {
                if(this.studentObject.knwonArrayList==null)
                    this.studentObject.knwonArrayList=[];
                this.studentObject.knwonArrayList.push(wordDataObj);
                this.removeWordFromStudentAssessment(wordDataObj,"Known");
                this.studentFireBaseService.updateKnownList(this.studentObject);
                this.goBackToView(this.studentObject);        
              }
            }
          ]
        });
        alert.present();
      }


      unKnownConfirm(wordDataObj:WordData) {
        let alert = this.alertCtrl.create({
          title: 'unKnown word',
          message: 'Do you want to set as unKnown word'+wordDataObj.wordText +'?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {

                console.log('Cancel clicked');
              }
            },
            {
              text: 'yes',
              handler: () => {
                if(this.studentObject.unKnownArrayList == null)
                    this.studentObject.unKnownArrayList=[];      
                this.studentObject.unKnownArrayList.push(wordDataObj);
                this.removeWordFromStudentAssessment(wordDataObj,"UnKnown");
                this.studentFireBaseService.updateUnKnownList(this.studentObject);
                this.goBackToView(this.studentObject);     
              }
            }
          ]
        });
        alert.present();
      }

      showKnownUnKnownWords(){
          this.totalKnowns=0;
          this.totalUnKnowns=0;
          console.log("size::"+this.assessmentWordDataArray.length);
            for(let assessmentwordObject of this.assessmentWordDataArray)
            {
                console.log("word obj::"+assessmentwordObject.wordAdded);
                if(assessmentwordObject.wordAdded != null && assessmentwordObject.wordAdded)
                {
                    if(assessmentwordObject.wordType == "Known" )
                        this.totalKnowns++;
                    else
                        this.totalUnKnowns++;
                }
                else{
                    if(assessmentwordObject.totalKnownTime>= this.knownsTime)
                        this.totalKnowns++;
                    else
                        this.totalUnKnowns++;
                }
            }
      }
}