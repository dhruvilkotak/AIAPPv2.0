import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Student } from '../../../models/student';
import { AssessmentTestData } from '../../../models/AssessmentTestData';
import { WordData } from '../../../models/wordData';
import { FlashCard } from '../../flashCardTest/flashCard';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { StudentServices } from '../../../services/studentAddRemoveServices';

@Component({
    selector: 'page-assessmentTest',
    templateUrl: 'assessmentTest.html'
  })
export class AssessmentTest
{
    studentObject:Student=new Student();
    assessmentTestObjectArray:Array<AssessmentTestData>=[];
    assessmentTestDataObject:AssessmentTestData;
  
    numberOfTest:number =0;
    ConsistancyPercentage:Array<number>=[0,0,0];
    private error:string="";
    studentServiceObject:StudentServices= new StudentServices();
    constructor(private modalCtrl: ModalController,
        public navCtrl: NavController,
        private navParams:NavParams,
        private storage:Storage,
        private file:File) {
        this.storage.get('studentObject').then((val) => {
            var fileData:any = JSON.parse(val);
            this.studentObject = fileData.studentObject;
            this.assessmentTestObjectArray=this.studentObject.assessmentDataArrayObject;
            console.log("asse:"+this.assessmentTestObjectArray.length);
            this.numberOfTest=this.assessmentTestObjectArray.length;
          });
   }

   public ionViewWillEnter() {
        this.storage.get('studentObject').then((val) => {
            var fileData:any = JSON.parse(val);
            this.studentObject = fileData.studentObject;
            this.assessmentTestObjectArray=this.studentObject.assessmentDataArrayObject;
            this.numberOfTest=this.assessmentTestObjectArray.length;
            console.log("student updateing");
            this.goBackToView(this.studentObject);
        });
    } 

    startAssessmentTest(index:number){
        if(this.assessmentTestObjectArray[index].testStatus)
        {
            this.error=" Test "+(index+1)+" is already done";
        }
        else{
            this.error="";
            console.log("studentName:"+this.studentObject.firstName+" "+this.studentObject.lastName);
            this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
            this.storage.set('testIndex',JSON.stringify({ testIndex: index }) );    
            this.navCtrl.push(FlashCard);
        }
        
    }
    
    goBackToView(studentObject:Student)
    {
        if(Student!=null)
        {
            console.log("assessment:");
           // this.studentServiceObject.updateStudentToFile(this.file,this.studentObject,this.studentServiceObject);
            console.log("studentName:"+this.studentObject.firstName+" "+this.studentObject.lastName);
            this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
        }
        
    }
}