import { Student } from "../models/student";
import { StudentFireBaseDao } from "../dao/StudentFireBaseDao";
import { StudentServices } from "../services/studentAddRemoveServices";
import { DocumentPicker } from "@ionic-native/document-picker";
import { Platform } from "ionic-angular";
import { File } from "@ionic-native/file";

export class StudentFireBaseService{
    private studentFireBaseDao:StudentFireBaseDao=new StudentFireBaseDao();
      
    addStudentToFireBase(studentObject:Student)
    {
        
        this.studentFireBaseDao.addStudent(studentObject);
    }

    removeStudent(studentObject:Student)
    {
        this.studentFireBaseDao.removeStudent(studentObject);
    }

    getStudentList():Promise<any>
    {
        return new Promise(function(resolve, reject) {
            var studentFireBaseDao:StudentFireBaseDao=new StudentFireBaseDao();
            var studentDetailsArray:Array<Student>=[];
            studentFireBaseDao.getStudentList().then(data=>{
                studentDetailsArray=data;
                resolve(studentDetailsArray);
                
            }).catch(err=>{
                console.log("erer:"+err);
                resolve(studentDetailsArray);
            });              
        });
    }

    importStudentFile(file:File ,plt:Platform,docPicker:DocumentPicker,StudentDetailsArray:Array<Student>):Promise<any>
    {
        return new Promise(function(resolve, reject)
        {
            this.studentFireBaseDao.importStudentFile(file,plt,docPicker,StudentDetailsArray).then(data=>{
                resolve(data);
            }).catch(err=>{
                reject(err);
            });
        });
            
    }

    updateKnownList(studentObject:Student)
    {
        this.studentFireBaseDao.updateKnownList(studentObject);
    }
    updateUnKnownList(studentObject:Student)
    {
        this.studentFireBaseDao.updateUnKnownList(studentObject);
    }

}