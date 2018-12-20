import * as firebase from 'firebase';
import { Injectable } from "@angular/core";
import { WordData } from '../models/wordData';
import { Platform } from 'ionic-angular';
import { DocumentPicker } from '@ionic-native/document-picker';
import { File } from '@ionic-native/file';
import { WordDataFireBaseDao } from '../dao/WordDataFireBaseDao';
@Injectable()
export class WordDataFireBaseService{
    

    getWordList():Promise<any>
    {
        return new Promise(function(resolve, reject) {
              
            var wordDataArray: Array<WordData> = [];
            
        });
    }
    addWordData(wordDataObj:WordData)
    {
        var wordDataFireBaseDao:WordDataFireBaseDao = new WordDataFireBaseDao();
        wordDataFireBaseDao.addWordData(wordDataObj);    
    }
    
    importWordDataFile(file:File ,plt:Platform,docPicker:DocumentPicker,WordDataList:Array<WordData>):Promise<any>
    {
        return new Promise(function(resolve, reject)
        {
            // var wordDataFireBaseDao:WordDataFireBaseDao = new WordDataFireBaseDao();
            // WordDataFireBaseDao.importStudentFile(file,plt,docPicker,WordDataList).then(data=>{
            //     resolve(data);
            // }).catch(err=>{
            //     reject(err);
            // });
        });
            
    }

    removeWordData(wordDataObject:WordData)
    {
        var wordDataFireBaseDao:WordDataFireBaseDao = new WordDataFireBaseDao();
        wordDataFireBaseDao.removeWordData(wordDataObject);
    }
    
}