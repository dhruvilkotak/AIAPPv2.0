import { Student } from "../models/student";
import * as firebase from 'firebase';
import { Injectable } from "@angular/core";
import { Method } from "../models/methodIntervetion";
import { Platform } from "ionic-angular";
import { SocialSharing } from "@ionic-native/social-sharing";
import { StudentServices } from "../services/studentAddRemoveServices";
import { DocumentPicker } from "@ionic-native/document-picker";
import { File } from "@ionic-native/file";
import { Storage } from "@ionic/storage";
import { WordData } from "../models/wordData";
import { KnownUnknownWordData } from "../models/knownUnknownWordData";
@Injectable()
export class StudentFireBaseDao{
    
    getStudentList():Promise<any>
    {
        return new Promise(function(resolve, reject) {
              
            var studentDetailsArray: Array<Student> = [];
            let databaseRef = firebase.database().ref('StudentDataList/');
            databaseRef.on('value',function(snapshot){
                if(snapshot.hasChildren())
                {
                    snapshot.forEach(function(childSnapshot) {
                        var key = childSnapshot.key;
                        var studentData:Student = childSnapshot.val();
                        console.log(" student text:"+childSnapshot);
                        studentDetailsArray.push(studentData);
                   });
                   resolve(studentDetailsArray);
                   databaseRef.off();
                }
                else{
                 resolve(studentDetailsArray);
                    databaseRef.off();
                }    
                databaseRef.off();
                return;
            });
        });
    }

    addStudent(studentObject:Student):Promise<any>
    {
        return new Promise(function(resolve,reject){
            let databaseRef = firebase.database().ref('StudentDataList/');
            var query=databaseRef.orderByChild('studentId').equalTo(""+studentObject.studentId);
            query.on('value',function(snapshot){
                console.log("childern:",snapshot.toJSON);
                if(snapshot.hasChildren())
                {
                    
                }
                else{
                    let databaseRef = firebase.database().ref('StudentDataList/');
                    let newInfo = databaseRef.push();
                    studentObject.studentUID=newInfo.key;
                    newInfo.set(studentObject);
                    
                    console.log("student:"+studentObject.firstName);
                    resolve(studentObject);
                    
                }
                query.off();
                
                return;
            });
        });
        
    }

    removeStudent(studentObject:Student)
    {
        console.log("student firebase removed:"+studentObject.firstName);
        let databaseRef = firebase.database().ref('StudentDataList/'+studentObject.studentUID+'/');
        databaseRef.remove();
        databaseRef.off();
        return;
    }

    addExistStudent(studentObject:Student,studentDetailsArray:Array<Student>)
    {
        let databaseRef = firebase.database().ref('StudentDataList/');

            var query=databaseRef.orderByChild('studentId').equalTo(""+studentObject.studentId);
            query.on('value',function(snapshot){
                console.log("childern:",snapshot.toJSON);
                if(snapshot.hasChildren())
                {
                }
                else{
                    let newInfo = databaseRef.push();
                    studentObject.studentUID=newInfo.key;
                    newInfo.set(studentObject);
                    studentDetailsArray.push(studentObject);
                }
                query.off();
                return;
            }); 
    }

    exportStudentToFireBase(studentFileArrayList:Array<Student>,studentDetailsArray:Array<Student>)
    {
        for(let studentObj of studentFileArrayList)
        {
            this.addExistStudent(studentObj,studentDetailsArray);
        }  
    }
      importStudentFile(file:File ,plt:Platform,docPicker:DocumentPicker,StudentDetailsArray:Array<Student>):Promise<any>
      {
        return new Promise(function(resolve, reject)
        {
            var fileData:any;
            var error="";
            if (plt.is('ios'))
            {
                docPicker.getFile('all').then(uri => 
                {

                    let path=uri.substr(0,uri.lastIndexOf('/')+1);
                    let filename=uri.substring(uri.lastIndexOf('/')+1);
                    console.log("url:"+uri);
                    console.log("path:"+path);
                    console.log("filename:"+filename);

                    file.readAsText(path,filename).then(data1=>
                    {
                        console.log("data:"+data1);
    
                        if(data1!=null)
                        {
                            try{
                              fileData=JSON.parse(data1);
                              var studentFileArray:Array<Student>=[]
                              console.log("filedata:"+fileData);

                              studentFileArray=fileData.studentDetailsArray;
                              console.log("fileArray:"+studentFileArray+"  len:"+studentFileArray.length);
                              var studentFireBaseDao:StudentFireBaseDao = new StudentFireBaseDao();
                              studentFireBaseDao.exportStudentToFireBase(studentFileArray,StudentDetailsArray);
                             resolve(StudentDetailsArray);    
                            }catch(e){
                              reject(StudentDetailsArray);    
                            }
                      }
                        else{
                            reject(StudentDetailsArray);
                        }
                      
                    }).catch(err=>{
                        reject([]);
                    });
            
                }).catch(e => {
                    console.log(e);
                    reject([]);
                });
            }
        });
      }

      
      updateKnownList(studentObject:Student)
      {
        let databaseRef = firebase.database().ref('StudentDataList/'+studentObject.studentUID+'/knwonArrayList/');
        databaseRef.update(studentObject.knwonArrayList);
      }
      updateUnKnownList(studentObject:Student)
      {
        console.log("student unknown:"+studentObject.studentUID);
        let databaseRef = firebase.database().ref('StudentDataList/'+studentObject.studentUID+'/unKnownArrayList/');
        databaseRef.update(studentObject.unKnownArrayList);
      }

      updateKnownUnknwonList(studentObject:Student)
      {
        let databaseRef = firebase.database().ref('StudentDataList/'+studentObject.studentUID+'/knownUnknownArrayList/');
        databaseRef.update(studentObject.knownUnknownArrayList);
      }
      updateNewKnownUnknwonList(studentObject:Student){
        let databaseRef = firebase.database().ref('StudentDataList/'+studentObject.studentUID+'/newKnownUnknownArrayList/');
        databaseRef.update(studentObject.newKnownUnknownArrayList);
     
    }

    addSessionToMethod(studentObject:Student,methodIndex:number)
    {
        var lastIndex=studentObject.methodArray[methodIndex].sessionsArray.length-1;
        let databaseRef = firebase.database().ref('StudentDataList/'+studentObject.studentUID+'/methodArray/'+methodIndex+'/sessionsArray/'+lastIndex+'/');
        databaseRef.update(studentObject.methodArray[methodIndex].sessionsArray[lastIndex]);
    }

    removeWordsFromUnKnownArray(studentObject:Student , subWordArray:Array<WordData>){
        for(let wordObj of subWordArray)
        {
            const databaseRef = firebase.database().ref('StudentDataList/'+studentObject.studentUID+'/unKnownArrayList/');
            databaseRef.orderByChild('wordId').equalTo(""+wordObj.wordId)
                .once('value').then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot) {
                    //remove each child
                    databaseRef.child(childSnapshot.key).remove();
                });
            });
        }

    }

    maintainUnKnownKnownArray(studentObject:Student )
    {
        var unKnownArray:Array<WordData> = studentObject.unKnownArrayList;
        if(unKnownArray!=null)
        {
            const databaseRef = firebase.database().ref('StudentDataList/'+studentObject.studentUID+'/unKnownArrayList/');
            databaseRef.set(studentObject.unKnownArrayList);
        }

        var knownUnKnownArray:Array<KnownUnknownWordData> = studentObject.newKnownUnknownArrayList;
        if(knownUnKnownArray!=null)
        {
           this.updateNewKnownUnknwonList(studentObject);
        }
        
    }

    
  


}