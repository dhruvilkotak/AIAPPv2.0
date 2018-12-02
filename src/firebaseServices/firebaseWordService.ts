import * as firebase from 'firebase';
import { Injectable } from "@angular/core";
import { WordData } from '../models/wordData';
@Injectable()
export class FireBaseWordService{
    

    getWordList(){
        
    }
    addWordData(wordDataObj:WordData)
    {

        let databaseRef = firebase.database().ref('WordDataList/DataSet1/');
        var query=databaseRef.orderByChild('wordText').equalTo(""+wordDataObj.wordText);
        query.on('value',function(snapshot){
            console.log("childern:",snapshot.toJSON);
            if(snapshot.hasChildren())
            {

                snapshot.forEach(function(childSnapshot) {

                    var key = childSnapshot.key;
                   var childData = childSnapshot.val();
                 
                     //this will be the actual email value found
                      console.log("text:"+childData.wordText);
               });
            }
            else{
                let newInfo = databaseRef.push();
                wordDataObj.wordId=newInfo.key;
                newInfo.set(wordDataObj);
            }
        });    
    }

}