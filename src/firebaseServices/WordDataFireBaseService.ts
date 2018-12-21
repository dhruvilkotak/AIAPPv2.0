import * as firebase from 'firebase';
import { Injectable } from "@angular/core";
import { WordData } from '../models/wordData';
import { Platform } from 'ionic-angular';
import { DocumentPicker } from '@ionic-native/document-picker';
import { File } from '@ionic-native/file';
import { WordDataFireBaseDao } from '../dao/WordDataFireBaseDao';
@Injectable()
export class WordDataFireBaseService{
    

    writeFireBaseWordToFile(file:File):Promise<any>
    {
        return new Promise(function(resolve, reject) {
              
            var wordDataFireBaseDao:WordDataFireBaseDao = new WordDataFireBaseDao();
            wordDataFireBaseDao.writeFireBaseWordToFile(file).then(data=>{
                resolve(data);
            }).catch(err=>{
                resolve(err);
            });
        });
    }
    getWordList():Promise<any>
    {
        return new Promise(function(resolve, reject) {
              
            var wordDataFireBaseDao:WordDataFireBaseDao = new WordDataFireBaseDao();
            wordDataFireBaseDao.getWordList().then(data=>{
                resolve(data);
            }).catch(err=>{
                resolve(err);
            })
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
            var wordDataFireBaseDao:WordDataFireBaseDao = new WordDataFireBaseDao();
            wordDataFireBaseDao.importWordDataFile(file,plt,docPicker,WordDataList).then(data=>{
                resolve(data);
            }).catch(err=>{
                reject(err);
            });
        });
            
    }

    removeWordData(wordDataObject:WordData)
    {
        var wordDataFireBaseDao:WordDataFireBaseDao = new WordDataFireBaseDao();
        wordDataFireBaseDao.removeWordData(wordDataObject);
    }
    
}