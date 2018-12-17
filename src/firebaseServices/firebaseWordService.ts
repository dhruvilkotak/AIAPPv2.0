import * as firebase from 'firebase';
import { Injectable } from "@angular/core";
import { WordData } from '../models/wordData';
import { Platform } from 'ionic-angular';
import { DocumentPicker } from '@ionic-native/document-picker';
import { Student } from '../models/student';
import { StudentFireBaseDao } from '../dao/StudentFireBaseDao';
import { File } from '@ionic-native/file';
@Injectable()
export class FireBaseWordService{
    

    getWordList():Promise<any>
    {
        return new Promise(function(resolve, reject) {
              
            var wordDataArray: Array<WordData> = [];
            
        });
    }
    addWordData(wordDataObj:WordData)
    {

        var category:String=wordDataObj.wordCategory;
        let databaseRef = firebase.database().ref('WordDataList/'+category+'/');
        var query=databaseRef.orderByChild('wordText').equalTo(""+wordDataObj.wordText);
        query.on('value',function(snapshot){
            console.log("childern:",snapshot.toJSON);
            if(snapshot.hasChildren())
            {

                snapshot.forEach(function(childSnapshot) {

                    var key = childSnapshot.key;
                   var childData = childSnapshot.val();
                 
                     //this will be the actual email value found
                      console.log("word text:"+childData.wordText);
               });
            }
            else{
                let newInfo = databaseRef.push();
                wordDataObj.wordId=newInfo.key;
                newInfo.set(wordDataObj);
            }
            return;
        });    
    }

    importStudentFile(file:File ,plt:Platform,docPicker:DocumentPicker,StudentDetailsArray:Array<Student>):Promise<any>
      {
        return new Promise(function(resolve, reject)
        {
            var studentFireBaseDao:StudentFireBaseDao = new StudentFireBaseDao();
            studentFireBaseDao.importStudentFile(file,plt,docPicker,StudentDetailsArray).then(_=>{
                resolve("done");
            }).catch(err=>{
                reject("error"+err);
            });
        });
    }
}