import { Component} from '@angular/core';
import { NavController,Platform, AlertController, ModalController, NavParams  } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { WordData } from '../../../models/wordData';
import { Student } from '../../../models/student';
import { Storage } from '@ionic/storage';
import { AddWordList } from '../../addWordList/addWordList';
import { WordServices } from '../../../services/wordServices';
import { StudentServices } from '../../../services/studentAddRemoveServices';

@Component({
    selector: 'page-viewStudentAllWords',
    templateUrl: 'viewStudentAllWords.html'
})
export class ViewStudentAllWords{
    newLearnedWords:Array<WordData> = [];
    unKnownWords:Array<WordData> = [];
    knwonWords:Array<WordData> = [];
    allData_newLearnedWords:Array<WordData> = [];
    allData_unKnownWords:Array<WordData> = [];
    allData_knwonWords:Array<WordData> = [];
    private studentObject:Student=new Student();
    private searchTerm: string = '';
    error:String='';
    constructor(public navCtrl: NavController,
        private storage:Storage,
        public modalCtrl: ModalController,
        private file:File) {
        this.storage.get('studentObject').then((val) => {
          var fileData:any = JSON.parse(val);
          this.studentObject = fileData.studentObject;
          
          this.newLearnedWords=this.studentObject.knownUnknownArrayList;
          this.allData_newLearnedWords=this.studentObject.knownUnknownArrayList;

          this.unKnownWords=this.studentObject.unKnownArrayList;
          this.allData_unKnownWords=this.studentObject.unKnownArrayList;

          this.knwonWords=this.studentObject.knwonArrayList;
          this.allData_knwonWords=this.studentObject.knwonArrayList;
            this.error="";
        });
    }  

    filterItems(){
 
        this.newLearnedWords = this.allData_newLearnedWords.filter((wordObject) => {
            return wordObject.wordText.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 || 
            wordObject.wordCategory.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
          });
          
        this.unKnownWords = this.allData_unKnownWords.filter((wordObject) => {
            return wordObject.wordText.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 || 
            wordObject.wordCategory.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
          });
          
        this.knwonWords = this.allData_knwonWords.filter((wordObject) => {
            return wordObject.wordText.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 || 
            wordObject.wordCategory.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
          });

    }

    addUnknownWordToStudent(){
        let profileModal = this.modalCtrl.create(AddWordList, { fromModal: true });
       profileModal.onDidDismiss(wordData => {
         console.log("text:"+wordData.wordText);
         this.addWordToStudentToFile(wordData,this.studentObject);
       });
       profileModal.present();
    }

    addWordToStudentToFile(wordDataObj:WordData, studentObject:Student){
        var allData:Array<WordData>=[];
        var wordServiceObj:WordServices=new WordServices();
        allData=allData.concat(studentObject.unKnownArrayList).concat(studentObject.knownUnknownArrayList).concat(studentObject.knwonArrayList);
        for(let methodObj of studentObject.methodArray)
        {
            if(methodObj.sessionsArray.length>0)
            {
                allData.concat(methodObj.sessionsArray[methodObj.sessionsArray.length-1].unknownWordList);
            }
        }
        if(!wordServiceObj.checkWordExist(allData,wordDataObj)){
            studentObject.unKnownArrayList.push(wordDataObj);
           // this.allData_unKnownWords.push(wordDataObj);
            this.filterItems();
            this.goBackToView();
            this.error="";
        }
        else{
            this.error= wordDataObj.wordText +" is already existed.";
        }
    }

    goBackToView()
    {
        var studentServiceObject:StudentServices=new StudentServices();
      this.storage.set('studentObject',JSON.stringify({ studentObject: this.studentObject }) );
      studentServiceObject.updateStudentToFile(this.file,this.studentObject,studentServiceObject);
      
     //  this.navCtrl.getPrevious().data.studentObject =this.studentObject;  
    }
   
}
