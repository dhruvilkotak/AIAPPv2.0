import { Student } from "../models/student";
import * as firebase from 'firebase';

export class ViewAssessmentFireBaseDao{
    updateAssessmentWordDataArray(studentObject:Student)
    {
        console.log("studnet id:"+studentObject.studentUID);
        
        console.log(" lol : "+studentObject.assessmentWordDataArray==null );
        let databaseRef = firebase.database().ref('StudentDataList/'+studentObject.studentUID+'/assessmentWordDataArray/');
        databaseRef.update(studentObject.assessmentWordDataArray);
        let databaseRef1 = firebase.database().ref('StudentDataList/'+studentObject.studentUID+'/');
        console.log("con1:"+studentObject.convertToAssessmentWord);
        databaseRef1.update({convertToAssessmentWord:studentObject.convertToAssessmentWord});

    }
    updateassessmentWordDataArrayObject(studentObject:Student,index:number)
    {
        console.log("studnet id:"+studentObject.studentUID);
        let databaseRef = firebase.database().ref('StudentDataList/'+studentObject.studentUID+'/assessmentWordDataArray/'+index+'/');
        databaseRef.update(studentObject.assessmentWordDataArray[index]);
    }
}