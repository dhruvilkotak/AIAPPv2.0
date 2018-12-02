import { Component} from '@angular/core';
import { NavController,Platform, AlertController  } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Dataset } from '../../../models/Dataset';

@Component({
    selector: 'page-viewDataSetList',
    templateUrl: 'viewDataSetList.html'
})
export class ViewDataSetList{
    dataSetList:Array<Dataset> = [];
    private searchTerm: string = '';
    error:String='';
    constructor(private navCtrl: NavController ,private file:File , private alertCtrl: AlertController) {

        // this.wordServiceObject.getWordList(file).then(data=>{
        //     this.wordDataList=data;
        //     this.allData=data;
        //     console.log("size:"+this.wordDataList.length+" id:"+this.wordDataList[0].wordId)
        // } ).catch(err=>console.log("erer:"+err));
    };

    // filterItems(){
 
    //     this.wordDataList = this.allData.filter((wordObject) => {
    //         return wordObject.wordText.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 || 
    //         wordObject.wordCategory.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
    //       });

    // }

    // removeWord(wordObj:WordData)
    // {
    //     this.presentConfirm(wordObj);
    // }
 
    // viewWordData(wordObject:WordData)
    // {
       
    //    console.log("id:"+wordObject.wordId);
    // }

    // presentConfirm(wordDataObj:WordData) {
    //     let alert = this.alertCtrl.create({
    //       title: 'Remove Student',
    //       message: 'Do you want to remove word '+wordDataObj.wordText +'?',
    //       buttons: [
    //         {
    //           text: 'Cancel',
    //           role: 'cancel',
    //           handler: () => {

    //             console.log('Cancel clicked');
    //           }
    //         },
    //         {
    //           text: 'yes',
    //           handler: () => {
    //             this.wordServiceObject.removeWordFromArray(this.allData,wordDataObj);
    //             this.wordServiceObject.removeWordFromArray(this.wordDataList,wordDataObj);
    //             this.wordServiceObject.removeWordFromFile(this.file,this.allData).then(removeData=>{
    //              this.error=removeData;
                    
    //             }).catch(err=>console.log("e:"+err));
    //             console.log('yes clicked');
    //           }
    //         }
    //       ]
    //     });
    //     alert.present();
    //   }
 
}