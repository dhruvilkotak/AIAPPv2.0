import { File } from '@ionic-native/file';
import { WordData } from './wordData';
import { AssessmentTestData } from './AssessmentTestData';
import { Method } from './methodIntervetion';
import { ViewAssessmentWordObjects } from './viewAssessmentWordObjects';
export class Student {
    firstName: string;
    lastName: string;
    studentId:string;
    dataset:string;
    totalAssessment:number=3;
    assessmentDataArrayObject:Array<AssessmentTestData>=[new AssessmentTestData(0),new AssessmentTestData(1),new AssessmentTestData(2)];
    methodArray:Array<Method> = [];//store 3 methods
    knwonArrayList:Array<WordData>=[];// known array 
    unKnownArrayList:Array<WordData>=[];// unknown 
    knownUnknownArrayList:Array<WordData>=[];// unknown becomes known
    assessmentWordDataArray:Array<ViewAssessmentWordObjects>=[];//begining assessment objects
    convertToAssessmentWord:boolean=false;
    PreInterventionAssessmentResults:boolean=false;
    
 }