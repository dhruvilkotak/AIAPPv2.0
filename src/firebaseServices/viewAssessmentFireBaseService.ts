import { Student } from "../models/student";
import { ViewAssessmentFireBaseDao } from "../dao/ViewAssessmentFireBaseDao";

export class ViewAssessmentFireBaseService{
    private viewAssessmentFireBaseDao:ViewAssessmentFireBaseDao = new ViewAssessmentFireBaseDao();
    updateAssessmentWordDataArray(studentObject:Student)
    {
        this.viewAssessmentFireBaseDao.updateAssessmentWordDataArray(studentObject);
    }

    updateassessmentWordDataArrayObject(studentObject:Student,index:number)
    {
        this.viewAssessmentFireBaseDao.updateassessmentWordDataArrayObject(studentObject,index);
    }
}