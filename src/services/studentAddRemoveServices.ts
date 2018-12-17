import { File } from '@ionic-native/file';
import { WordData } from '../models/wordData';
import { Student } from '../models/student';
import { Method } from '../models/methodIntervetion';
import { Platform } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { DocumentPicker } from '@ionic-native/document-picker';
import { findReadVarNames } from '@angular/compiler/src/output/output_ast';
import { StudentFireBaseDao } from '../dao/StudentFireBaseDao';

export class StudentServices {
   
    getStudentList(file:File):Promise<any>
    {
        
        return new Promise(function(resolve, reject) {
            var fileData:any;
            var studentDetailsArray: Array<Student> = [];
            var error="";
            file.checkFile(file.dataDirectory, 'studentDetails').then(_ =>{
                console.log("file does  exist");
              
                file.readAsText(file.dataDirectory,'studentDetails').then(data=>{
                  console.log("read succ");
                  if(data!=null)
                  {
                      try{
                        fileData=JSON.parse(data);
                        studentDetailsArray=fileData.studentDetailsArray;
                        resolve(studentDetailsArray);
                        
                      }catch(e){
                        reject(studentDetailsArray);    
                      }
                }
                  else{
                      reject(studentDetailsArray);
                  }
                  }).catch(err=>{
                    console.log("read unsecc student array:"+studentDetailsArray.length);
                    reject(studentDetailsArray)
                
                  });
        
                }).catch(err=>{
                    console.log("file not exist student array:"+studentDetailsArray.length);
                    reject(studentDetailsArray)
                });
                
        });
    }

    checkStudentExist(studentDetailsArray: Array<Student> ,studentObject:Student )
      {
        var exist : boolean = false;
        studentDetailsArray.forEach(studentObj=>{
          console.log("stude:"+studentObj.studentId+ " s: "+studentObject.studentId);
          if(studentObj.studentId == studentObject.studentId)
            exist=true;
        });
        return  exist;
      }
    
    addStudenttoFile(file:File,studentObj:Student ,studentServiceObject:StudentServices):Promise<any>
    {
        return new Promise(function(resolve,reject ) {
            var fileData:any;
            var studentDetailsArray: Array<Student> =[];
            var error:string ;
            studentObj.methodArray.push(new Method("Incremental Rehearsal",0));
            studentObj.methodArray.push(new Method("Direct Instruction",1));
            studentObj.methodArray.push(new Method("Traditional Drill & Practice",2));
            
            studentServiceObject.getStudentList(file).then(studentDetailsArray=>{
                console.log("student lencheck:"+studentDetailsArray.length);
                     
                if(studentDetailsArray.length>0)
                {
                    var exist= studentServiceObject.checkStudentExist(studentDetailsArray,studentObj)
                      console.log("student exist: "+exist);
                      if(exist){
                      
                          error="student already exist with id : "+studentObj.studentId;
                         resolve(error)
                      }
                      else{
                        
                        studentDetailsArray.push(studentObj);
                        console.log("Number of student added size:"+studentDetailsArray.length)
                        
                        file.writeFile(file.dataDirectory,'studentDetails',JSON.stringify({ studentDetailsArray: studentDetailsArray }),{replace: true}).then(_=>{
                            console.log("write succ");
                            error=" student added with id:"+studentObj.studentId;
                            resolve(error)
                              }).catch(err=>{
                                console.log("write unsucc");
                                reject("write unsucc");
                              });
                      }
                     
                }
                else{
                    console.log("length not");
                    file.createFile(file.dataDirectory,'studentDetails',true).then( fileEntry=>{
                        console.log("file create");
                     
                        studentDetailsArray.push(studentObj);  
                        
                        file.writeFile(file.dataDirectory,'studentDetails',JSON.stringify({ studentDetailsArray: studentDetailsArray }),{replace: true}).then(_=>{
                              console.log("file write succ");
                              error=" student added with id:"+studentObj.studentId;
                              console.log("size:"+studentDetailsArray.length);
                              resolve(error)
                          }).catch(err=>{
                            console.log("file does not write");
                            reject("file does not write");
                          });
                    });
        
                }
                
            }).catch(err=>{
                console.log("student get not workign "+studentDetailsArray.length);
                file.createFile(file.dataDirectory,'studentDetails',true).then( fileEntry=>{
                    console.log("file create");
                    studentDetailsArray.push(studentObj);  
                    file.writeFile(file.dataDirectory,'studentDetails',JSON.stringify({ studentDetailsArray: studentDetailsArray }),{replace: true}).then(_=>{
                          console.log("file write succ");
                          error=" student added with id:"+studentObj.studentId;
                          console.log("size:"+studentDetailsArray.length);
                          resolve(error)
                      }).catch(err=>{
                        console.log("file does not write");
                        reject("file does not write");
                      });
                });
                   
            });
        });
               
    }


    removeStudentFromFile(file:File,studentDetailsArray: Array<Student>):Promise<any>
    {

        return new Promise(function(resolve,reject ) {
            
                      
            file.writeFile(file.dataDirectory,'studentDetails',JSON.stringify({ studentDetailsArray: studentDetailsArray }),{replace: true}).then(_=>{
                console.log("file write succ");
                console.log("size:"+studentDetailsArray.length);
                resolve("student removed:"+studentDetailsArray.length);
            }).catch(err=>{
              console.log("file does not write");
              reject("file does not write");
            });
        });
               
    }

    removeStudentFromArray(studentDetailsArray: Array<Student> , studentObj:Student )
    {
        var remove:boolean=false;
        const index: number = studentDetailsArray.indexOf(studentObj);
        if (index !== -1) {
            studentDetailsArray.splice(index, 1);
            console.log("index:"+index+"  length:+"+studentDetailsArray.length);
            remove=true;
        } 
        return remove;
    }


    updateStudentToFile(file:File,studentObj:Student ,studentServiceObject:StudentServices):Promise<any>
    {
        return new Promise(function(resolve,reject ) {
            var fileData:any;
            var studentDetailsArray: Array<Student> =[];
            var error:string ;
            studentServiceObject.getStudentList(file).then(studentDetailsArray=>{
                console.log("student lencheck:"+studentDetailsArray.length);
                     
                if(studentDetailsArray.length>0)
                {
                    studentServiceObject.updateStudentToArrayExist(studentDetailsArray,studentObj);
                    file.writeFile(file.dataDirectory,'studentDetails',JSON.stringify({ studentDetailsArray: studentDetailsArray }),{replace: true}).then(_=>{
                            console.log("write succ");
                            error=" student added with id:"+studentObj.studentId;
                            resolve(error)
                        }).catch(err=>{
                                console.log("write unsucc");
                                reject("write unsucc");
                        });
                     
                }
                else{
                    console.log("length not");
              
                }
                
            }).catch(err=>{
                console.log("student get not workign "+studentDetailsArray.length);
              
            });
        });
               
    }

    updateStudentToArrayExist(studentDetailsArray: Array<Student> ,studentObject:Student  )
    {
        studentDetailsArray.forEach(function(student, i) { if (student.studentId == studentObject.studentId) studentDetailsArray[i] = studentObject; });   
    }


    exportStudentFile(file:File ,plt:Platform,socialSharing:SocialSharing)
    {
     //new Blob(["Lorem ipsum sit"], {type: "text/plain"});   
        let dir = file.tempDirectory;
        let fileName = "studentDetails.txt"; // please set your fileName;
        let blob = ""; // please set your data;
    console.log("temp:"+file.tempDirectory+"  cloud"+file.syncedDataDirectory+" data:"+file.dataDirectory+" doc"+file.documentsDirectory);
        file.checkFile(file.dataDirectory, 'studentDetails').then(_ =>{
            console.log("file does  exist");
          
            file.readAsText(file.dataDirectory,'studentDetails').then(data=>{
              console.log("read succ"+data);
              if(data!=null)
              {
                  
                if (plt.is('ios')) {
                    // This will only print when on iOS
                    file.writeFile(file.tempDirectory,'studentDetails.txt',data+"",{replace: true}).then(value=>{
                        console.log("file write succ"+value.nativeURL);
                        socialSharing.share(null,null,null,value.nativeURL);
                    }).catch(err=>{
                      console.log("file does not write");
                      //reject("file does not write");
                    });    console.log('I am an iOS device!');
                  }
                
              }
        });
    });

        
      }


      importStudentFile(file:File ,plt:Platform,docPicker:DocumentPicker,studentServicesObject:StudentServices,StudentDetailsArray:Array<Student>):Promise<any>
      {
        return new Promise(function(resolve, reject)
        {
            var fileData:any;
            var studentDetailsArray: Array<Student> = [];
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

                              studentServicesObject.getStudentList(file).then(data=>{
                                studentDetailsArray=data;
                                console.log("studentDetArray:"+studentDetailsArray+" len:"+studentDetailsArray.length);
                                for(let studentFileObj of studentFileArray ){
                                    console.log("exist"+exist);
                                    var exist= this.checkStudentExist(studentDetailsArray,studentFileObj);
                                    if(!exist)
                                    {
                                        studentDetailsArray.push(studentFileObj);
                                        console.log("pushing");
                                    }
                                }

                                file.writeFile(file.dataDirectory,'studentDetails',JSON.stringify({ studentDetailsArray: studentDetailsArray }),{replace: true}).then(_=>{
                                    console.log("write succ");
                                    resolve(studentDetailsArray);    
                                   }).catch(err=>{
                                        console.log("write unsucc");
                                        resolve(studentDetailsArray);
                                      });
                            
                            }).catch(err=>{
                                file.writeFile(file.dataDirectory,'studentDetails',JSON.stringify({ studentDetailsArray: studentFileArray }),{replace: true}).then(_=>{
                                    console.log("write succ");
                                    resolve(studentFileArray);    
                                   }).catch(err=>{
                                        console.log("write unsucc");
                                        resolve(studentFileArray);
                                      });
                            });

                              
                            }catch(e){
                              reject(studentDetailsArray);    
                            }
                      }
                        else{
                            reject(studentDetailsArray);
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
 }