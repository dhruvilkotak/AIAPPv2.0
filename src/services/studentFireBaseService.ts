import { Student } from "../models/student";
import { StudentFireBaseDao } from "../dao/StudentFireBaseDao";
import { StudentServices } from "./studentAddRemoveServices";
import { DocumentPicker } from "@ionic-native/document-picker";
import { Platform } from "ionic-angular";
import { File } from "@ionic-native/file";

export class StudentFireBaseService{

    addStudentToFireBase(studentObject:Student)
    {
        
        var studentFireBaseDao:StudentFireBaseDao=new StudentFireBaseDao();
        studentFireBaseDao.addStudent(studentObject);
    }

    removeStudent(studentObject:Student)
    {
        var studentFireBaseDao:StudentFireBaseDao=new StudentFireBaseDao();
        studentFireBaseDao.removeStudent(studentObject);
    }

    getStudentList():Promise<any>
    {
        return new Promise(function(resolve, reject) {
            var studentDetailsArray:Array<Student>=[];
            var studentFireBaseDao:StudentFireBaseDao=new StudentFireBaseDao();
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
            var studentFireBaseDao:StudentFireBaseDao = new StudentFireBaseDao();
            studentFireBaseDao.importStudentFile(file,plt,docPicker,StudentDetailsArray).then(data=>{
                resolve(data);
            }).catch(err=>{
                reject(err);
            });
        });
            
    }

}