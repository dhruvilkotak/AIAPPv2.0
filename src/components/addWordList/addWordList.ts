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
        try{
            this.wordData = new WordData();
            console.log("word:"+this.wordText+"  cat:"+this.wordCategory);
            this.wordData.wordText=this.wordText;
            this.wordData.wordCategory= this.wordCategory;
            if(!this.fromModal)
            {
                this.fireBaseWordServiceObject.addWordData(this.wordData);
                this.wordText="";
                this.wordCategory="";
            }
            else{
                this.dismiss(this.wordData);
            }
        }catch(e){
            this.error=e;
        }
        
    }

    dismiss(wordData:WordData) {
        this.viewCtrl.dismiss(this.wordData);
    }
     
}