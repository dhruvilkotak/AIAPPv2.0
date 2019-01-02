import { Student } from "../models/student";
import { PostTestWordDataRecordList } from "../models/postTestWordDataRecordList";

import * as firebase from 'firebase';
import { PostTestWordData } from "../models/PostTestWordData";
import { KnownUnknownWordData } from "../models/knownUnknownWordData";

export class PostTestAssessmentDao{
    addPostTestWordDataRecordListObject(studentObject:Student,
        testIndex:number)
    {
        let databaseRef = firebase.database().ref('StudentDataList/'+studentObject.studentUID+'/postTestWordDataRecordListArray/'+testIndex+'/');
        databaseRef.update(studentObject.postTestWordDataRecordListArray[testIndex]);

    }

    incrementPostAssessmentCounter(studentObject:Student,wordDataObject:PostTestWordData){
        let databaseRef = firebase.database().ref('StudentDataList/'+studentObject.studentUID+'/newKnownUnknownArrayList/');
        var query=databaseRef.orderByChild('wordId').equalTo(""+wordDataObject.wordData.wordId)
            .once('value').then(snapshot=>{
                console.log("child1:"+snapshot.val() + " child1 key:"+snapshot.key);
                snapshot.forEach(function(data) {
                    console.log(data.key);
                    var obj:KnownUnknownWordData = data.val();
                    
                    obj.postAssessmentCounter++;
                    console.log("data:"+data.val() + " data key:"+data.key+"  word:"+obj.wordData.wordId+" c:"+obj.postAssessmentCounter);
                    var postTestAssessmentDao:PostTestAssessmentDao = new PostTestAssessmentDao();
                    postTestAssessmentDao.updatePostAssessmentCounter(studentObject,data.key,obj);
                });
                return;
            });
    }
    updatePostAssessmentCounter(studentObject:Student,key:string,knownUnknownWordDataObject:KnownUnknownWordData)
    {
        let databaseRef = firebase.database().ref('StudentDataList/'+studentObject.studentUID+'/newKnownUnknownArrayList/'+key+'/');
        databaseRef.update(knownUnknownWordDataObject);

    }
}