import { Student } from "../models/student";
import { PreAssessmentFireBaseDao } from "../dao/PreAssessmentFireBaseDao";

export class PreAssessmentFireBaseService{
    addAssessmentToStudent(studentObject:Student , testIndex:number){
        var preAssessmentFireBaseDao:PreAssessmentFireBaseDao = new PreAssessmentFireBaseDao();
        preAssessmentFireBaseDao.addAssessmentToStudent(studentObject,testIndex);
    }
}