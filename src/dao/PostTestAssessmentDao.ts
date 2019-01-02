import { Student } from "../models/student";
import { PostTestWordDataRecordList } from "../models/postTestWordDataRecordList";

import * as firebase from 'firebase';

export class PostTestAssessmentDao{
    addPostTestWordDataRecordListObject(studentObject:Student,
        testIndex:number)
    {
        let databaseRef = firebase.database().ref('StudentDataList/'+studentObject.studentUID+'/postTestWordDataRecordListArray/'+testIndex+'/');
        databaseRef.update(studentObject.postTestWordDataRecordListArray[testIndex]);

    }
}