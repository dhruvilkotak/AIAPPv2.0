import { Component} from '@angular/core';
import { NavController,Platform, AlertController  } from 'ionic-angular';
import { WordData } from '../../models/wordData';
import { File } from '@ionic-native/file';
import { WordServices } from '../../services/wordServices';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DocumentPicker } from '@ionic-native/document-picker';

@Component({
    selector: 'page-viewWordList',
    templateUrl: 'viewWordList.html'
})
export class ViewWordList{
    wordDataList:Array<WordData> = [];
    allData:Array<WordData> = [];
    private searchTerm: string = '';
    wordServiceObject:WordServices=new WordServices();
    error:String='';
    constructor(private navCtrl: NavController ,
      private file:File , 
      private alertCtrl: AlertController,
      public plt: Platform,
      private socialSharing:SocialSharing,
      private docPicker: DocumentPicker) {

        this.wordServiceObject.getWordList(file).then(data=>{
            this.wordDataList=data;
            this.allData=data;
            console.log("size:"+this.wordDataList.length+" id:"+this.wordDataList[0].wordId)
        } ).catch(err=>console.log("erer:"+err));
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
                this.wordServiceObject.removeWordFromArray(this.allData,wordDataObj);
                this.wordServiceObject.removeWordFromArray(this.wordDataList,wordDataObj);
                this.wordServiceObject.removeWordFromFile(this.file,this.allData).then(removeData=>{
                 this.error=removeData;
                    
                }).catch(err=>console.log("e:"+err));
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
       
       
        this.wordServiceObject.importWordFile(this.file,this.plt,this.docPicker,this.wordServiceObject,this.allData).then(dataArray=>{
          console.log("msg:"+dataArray.length);
          this.allData=dataArray;
          this.filterItems();
         
            
        }).catch(err=>{

            console.log("error:"+err);
        });
      }

      removeAllWords(){
        
        this.wordServiceObject.removeAllWords(this.file,this.wordServiceObject).then(data=>{
          this.allData=[];
          this.filterItems();
        });
      }
}