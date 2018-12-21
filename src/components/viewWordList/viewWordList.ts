import { Component} from '@angular/core';
import { NavController,Platform, AlertController  } from 'ionic-angular';
import { WordData } from '../../models/wordData';
import { File } from '@ionic-native/file';
import { WordServices } from '../../services/wordServices';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DocumentPicker } from '@ionic-native/document-picker';
import { WordDataFireBaseService } from '../../firebaseServices/WordDataFireBaseService';

@Component({
    selector: 'page-viewWordList',
    templateUrl: 'viewWordList.html'
})
export class ViewWordList{
    wordDataList:Array<WordData> = [];
    allData:Array<WordData> = [];
    private searchTerm: string = '';
    wordServiceObject:WordServices=new WordServices();
    wordDataFireBaseService:WordDataFireBaseService = new WordDataFireBaseService();
    error:String='';
    constructor(private navCtrl: NavController ,
      private file:File , 
      private alertCtrl: AlertController,
      public plt: Platform,
      private socialSharing:SocialSharing,
      private docPicker: DocumentPicker) {

        this.wordDataFireBaseService.getWordList().then(data=>{
      
          this.wordDataList=data;
          this.allData=data;
          console.log("size:"+this.wordDataList.length+" id:"+this.wordDataList[0].wordId)
      
        }).catch(err=>{

        });
        // this.wordServiceObject.getWordList(file).then(data=>{
        //     this.wordDataList=data;
        //     this.allData=data;
        //     console.log("size:"+this.wordDataList.length+" id:"+this.wordDataList[0].wordId)
        // } ).catch(err=>console.log("erer:"+err));
    };

    filterItems(){
 
        this.wordDataList = this.allData.filter((wordObject) => {
            return wordObject.wordText.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 || 
            wordObject.wordCategory.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
          });

    }

    removeWord(wordObj:WordData)
    {
        this.presentConfirm(wordObj);
    }
 
    viewWordData(wordObject:WordData)
    {
       
       console.log("id:"+wordObject.wordId);
    }

    presentConfirm(wordDataObj:WordData) {
        let alert = this.alertCtrl.create({
          title: 'Remove Student',
          message: 'Do you want to remove word '+wordDataObj.wordText +'?',
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
                this.wordDataFireBaseService.removeWordData(wordDataObj);
                this.wordServiceObject.removeWordFromArray(this.allData,wordDataObj);
                this.filterItems();
                //this.wordDataFireBaseService.r
                console.log('yes clicked');
              }
            }
          ]
        });
        alert.present();
      }

      exportWordsFile(){
        this.wordServiceObject.exportWordFile(this.file,this.plt,this.socialSharing,this.wordServiceObject);
      }
 
      importWordsFile(){
       
       var wordDataFireBaseService:WordDataFireBaseService = new WordDataFireBaseService();
       wordDataFireBaseService.importWordDataFile(this.file,this.plt,this.docPicker,this.allData);
        this.filterItems();
      }

      removeAllWords(){
        
        this.wordServiceObject.removeAllWords(this.file,this.wordServiceObject).then(data=>{
          this.allData=[];
          this.filterItems();
        });
      }
}