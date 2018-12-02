import { Component } from '@angular/core';
import { WordData } from '../../models/wordData';
import { UUID } from 'angular2-uuid';
import { File } from '@ionic-native/file';
import { WordServices } from '../../services/wordServices';
import { NavParams, ViewController } from 'ionic-angular';
import { FireBaseWordService } from '../../firebaseServices/firebaseWordService';
@Component({
  selector: 'page-addWordList',
  templateUrl: 'addWordList.html'
})


export class AddWordList{
    
    wordText:String;
    wordCategory:String;
    error:String;
    wordServiceObject:WordServices=new WordServices();
    fireBaseWordServiceObject:FireBaseWordService = new FireBaseWordService();
    fromModal:boolean=false;
    private wordData:WordData;
    constructor(private file:File,
        private params:NavParams,
        private viewCtrl:ViewController) {
         this.fromModal=params.get('fromModal');
    }
    addNewWord(){
        this.wordData = new WordData();
        console.log("word:"+this.wordText+"  cat:"+this.wordCategory);
        this.wordData.wordText=this.wordText;
        this.wordData.wordCategory= this.wordCategory;
        
        if(!this.fromModal)
        {

           this.wordServiceObject.addWordtoFile(this.file,this.wordData,this.wordServiceObject).then(data=>{
           
            this.fireBaseWordServiceObject.addWordData(this.wordData);
           
                this.error=data;
                this.wordText="";
                this.wordCategory="";
              }).catch();
        }
        else{
            this.dismiss(this.wordData);
        }
        
    }

    dismiss(wordData:WordData) {
        this.viewCtrl.dismiss(this.wordData);
    }
     
}