import { Student } from "../models/student";
import * as firebase from 'firebase';

export class PreAssessmentFireBaseDao{
    
    addAssessmentToStudent(studentObject:Student , testIndex:number){
        
        let databaseRef = firebase.database().ref('StudentDataList/'+studentObject.studentUID+'/assessmentDataArrayObject/'+testIndex+'/');
        databaseRef.update(studentObject.assessmentDataArrayObject[testIndex]);

        // var query=databaseRef.orderByChild('studentId').equalTo(""+studentObject.studentId);
        // query.on('value',function(snapshot){
        //     console.log("childern:",snapshot.toJSON);
        //     if(snapshot.hasChildren())
        //     {
                
        //     }
        //     else{
                
        //     }
        //     query.off();
        //     return;
        // });
    }
}