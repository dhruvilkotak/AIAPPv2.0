import {Component } from "@angular/core"
import { File } from "@ionic-native/File";
import { WordData } from "../models/wordData";
import { Platform } from "ionic-angular";
import { SocialSharing } from "@ionic-native/social-sharing";
import { DocumentPicker } from "@ionic-native/document-picker";

export class WordServices{
  
    wordDetailsFilename:String ='wordDetails';
    file:File=new File();
    getWordList(file:File):Promise<any>
    {
        
        return new Promise(function(resolve, reject) {
            var fileData:any;
            var wordDetailsArray: Array<WordData> = [];
            var error="";
            file.checkFile(file.dataDirectory, 'WordDetails').then(_ =>{
                console.log("file does  exist");
              
                file.readAsText(file.dataDirectory,'WordDetails').then(data=>{
                  console.log("read succ");
                  fileData=JSON.parse(data);
                  wordDetailsArray=fileData.wordDetailsArray;
                  resolve(wordDetailsArray);
                  }).catch(err=>{
                    console.log("read unsecc WordData array:"+wordDetailsArray.length);
                    reject(wordDetailsArray)
                
                  });
        
                }).catch(err=>{
                    console.log("file not exist WordData array:"+wordDetailsArray.length);
                    reject(wordDetailsArray)
                });
                
        });
    }

    checkWordExist(wordDetailsArray: Array<WordData> ,wordObject:WordData)
      {
         for(let wordObj of wordDetailsArray)
         {
            if(wordObj.wordText === wordObject.wordText)
            {
                console.log("true");
                return true;
            }
         }
        return  false;
      }

    addWordtoFile(file:File,wordDataObj:WordData,wordServiceObject:WordServices):Promise<any>
    {
        return new Promise(function(resolve,reject ) {
            var fileData:any;
            var wordDetailsArray: Array<WordData> =[];
            var error:string ;
            wordServiceObject.getWordList(file).then(wordDetailsArray=>{
                console.log("WordData lencheck:"+wordDetailsArray.length);
                     
                if(wordDetailsArray.length>0)
                {
                    var exist= wordServiceObject.checkWordExist(wordDetailsArray,wordDataObj)
                      console.log("WordData exist: "+exist);
                      if(exist){
                      
                          error="WordData already exist with : "+wordDataObj.wordText;
                         resolve(error)
                      }
                      else{
                        
                        
                        wordDetailsArray.push(wordDataObj);
                        console.log("Number of WordData added size:"+wordDetailsArray.length)
                        
                        file.writeFile(file.dataDirectory,'WordDetails',JSON.stringify({ wordDetailsArray: wordDetailsArray }),{replace: true}).then(_=>{
                            console.log("write succ");
                            error=" WordData added:"+wordDataObj.wordText;
                            resolve(error)
                              }).catch(err=>{
                                console.log("write unsucc");
                                reject("write unsucc");
                              });
                      }
                     
                }
                else{
                    console.log("length not");
                    file.createFile(file.dataDirectory,'WordDetails',true).then( fileEntry=>{
                        console.log("file create");
                     
                        wordDetailsArray.push(wordDataObj);  
                        
                        file.writeFile(file.dataDirectory,'WordDetails',JSON.stringify({ wordDetailsArray: wordDetailsArray }),{replace: true}).then(_=>{
                              console.log("file write succ");
                              error=" WordData added :"+wordDataObj.wordText;
                              console.log("size:"+wordDetailsArray.length);
                              resolve(error)
                          }).catch(err=>{
                            console.log("file does not write");
                            reject("file does not write");
                          });
                    });
        
                }
                
            }).catch(err=>{
                console.log("WordData get not workign "+wordDetailsArray.length);
                file.createFile(file.dataDirectory,'WordDetails',true).then( fileEntry=>{
                    console.log("file create");
                    wordDetailsArray.push(wordDataObj);  
                    file.writeFile(file.dataDirectory,'WordDetails',JSON.stringify({ wordDetailsArray: wordDetailsArray }),{replace: true}).then(_=>{
                          console.log("file write succ");
                          error=" WordData added:"+wordDataObj.wordText;
                          console.log("size:"+wordDetailsArray.length);
                          resolve(error)
                      }).catch(err=>{
                        console.log("file does not write");
                        reject("file does not write");
                      });
                });
                   
            });
        });
               
    }


    removeWordFromFile(file:File,wordDetailsArray: Array<WordData>):Promise<any>
    {

        return new Promise(function(resolve,reject ) {
            file.writeFile(file.dataDirectory,'WordDetails',JSON.stringify({ wordDetailsArray: wordDetailsArray }),{replace: true}).then(_=>{
                console.log("file write succ");
                console.log("size:"+wordDetailsArray.length);
                resolve("size:"+wordDetailsArray.length);
            }).catch(err=>{
              console.log("file does not write");
              reject("file does not write");
            });
        });
               
    }

    removeWordFromArray(wordDetailsArray: Array<WordData> , wordObj:WordData )
    {
        var remove:boolean=false;
        const index: number = wordDetailsArray.indexOf(wordObj);
        if (index !== -1) {
            console.log("index:"+index);
            wordDetailsArray.splice(index, 1);
            remove=true;
            return remove;
        } 
        for(let obj of wordDetailsArray )
        {
            if(obj.wordId==wordObj.wordId)
            {
                const index: number = wordDetailsArray.indexOf(obj);
                if (index !== -1) {
                    console.log("index:"+index);
                    wordDetailsArray.splice(index, 1);
                    remove=true;
                    return remove;
                } 
            }
        }
        return remove;
    }

    removeArrayFromArray(wordArray: Array<WordData> , subWordArray:Array<WordData> )
    {
        for(let subWordObj of subWordArray)
        {
            for(let obj of wordArray )
            {
                if(obj.wordId==subWordObj.wordId)
                {
                    const index: number = wordArray.indexOf(obj);
                    if (index !== -1) {
                        console.log("index:"+index);
                        wordArray.splice(index, 1);
                        console.log("removing "+obj.wordText+" "+subWordObj.wordText);
                    } 
                }
            }
        }
    }

    exportWordFile(file:File ,plt:Platform,socialSharing:SocialSharing,wordServiceObject:WordServices)
    {

        var fileData:any;
        var wordDetailsArray: Array<WordData> = [];
    
        let dir = file.tempDirectory;
        let fileName = "WordDetails.csv"; // please set your fileName;
        let blob = ""; // please set your data;
        wordServiceObject.getWordList(file).then(data=>{
            var wordDataList:Array<WordData> =data;
            let allDataArray=[];
            let wordObjArray=["word Id", "Word Text", "Word Category"];
            var line=wordObjArray.join(",");
            //allDataArray.push("data:text/csv;charset=utf-8,"+line)
            allDataArray.push(line)
            for(let wordObj of wordDataList)
            {
                let wordObjArray=[wordObj.wordId,wordObj.wordText,wordObj.wordCategory];
                line=wordObjArray.join(',');
                allDataArray.push(line);
            }
            var csvContent=allDataArray.join('\r');
            
            if (plt.is('ios')) {
                // This will only print when on iOS
                file.writeFile(file.tempDirectory,'WordDetails.csv',csvContent+"",{replace: true}).then(value=>{
                    console.log("file write succ"+value.nativeURL);
                    socialSharing.share(null,null,null,value.nativeURL);
                }).catch(err=>{
                console.log("file does not write");
                //reject("file does not write");
                });    console.log('I am an iOS device!');
            }

        } ).catch(err=>console.log("erer:"+err));
    }

     importWordFile(file:File ,plt:Platform,docPicker:DocumentPicker,wordServiceObject:WordServices,wordDetailsArray:Array<WordData>):Promise<any>
    {
        return new Promise(function(resolve, reject)
         {
            
            if (plt.is('ios'))
             {

               docPicker.getFile('all').then(uri => 
                {

                    let path=uri.substr(0,uri.lastIndexOf('/')+1);
                    let filename=uri.substring(uri.lastIndexOf('/')+1);
                    console.log("url:"+uri);
                    console.log("path:"+path);
                    console.log("filename:"+filename);

                   
                    file.readAsText(path,filename).then(result=>
                    {
                        console.log("result:"+result);
                        var allLines= result.split('\r');
                        console.log("res:"+result.split('\r').length+"  resl:"+result.split('\r'));
                        console.log("alllines:"+allLines.length+"  0:"+allLines[0])

                        //allLines.splice(0, 1);
                        var c1:number=1;
                        while(c1<allLines.length)
                        {
                            //var lineObj=allLines[c1];
                            var wordArray= allLines[c1].split(",");
                            console.log("wordArray:"+wordArray);
                      
                            if(wordArray.length>1)
                            {
                                var wordObj:WordData = new WordData();
                                console.log("uuid1:"+wordObj.wordId)
                                if(wordArray[0] != null && wordArray[0].replace(/\s/g, "").toLowerCase.length>3)
                                {
                                    console.log("wordArray[0]:("+wordArray[0]+")")
                                    wordObj.wordId=wordArray[0];   
                                }
                                console.log("uuid2:"+wordObj.wordId)
                                wordObj.wordText=wordArray[1];
                                wordObj.wordCategory=wordArray[2];
                                console.log("wordData:"+wordObj.wordId+" "+wordObj.wordText+"  "+wordObj.wordCategory);
                                var exist= wordServiceObject.checkWordExist(wordDetailsArray,wordObj)
                                console.log("WordData exist: "+exist);
                                if(exist){
                                
                                    var error="WordData already exist with : "+wordObj.wordText;
                                   console.log(""+error);
                                }
                                else{
                                    wordDetailsArray.push(wordObj);
                                }

                            }

                            c1++;
                        }
                        file.writeFile(file.dataDirectory,'WordDetails',JSON.stringify({ wordDetailsArray: wordDetailsArray }),{replace: true}).then(_=>{
                            console.log("write succ"+wordDetailsArray.length);
                            resolve(wordDetailsArray);
                            console.log("result:"+result);
                             }).catch(err=>{
                                console.log("write unsucc");
                                reject("write prob:");
                              });    

                      
                    }).catch(err=>{
                        reject("file read prb:"+err);
                    });

                }).catch(e => {
                    console.log(e);
                    reject("file uri prob:"+e);
                });
            }
           
        });
    }

    removeAllWords(file:File ,wordServiceObject:WordServices){
        return new Promise(function(resolve, reject)
         {
            file.removeFile(file.dataDirectory,'WordDetails').then(data=>{
               resolve("removed");
            }).catch(err=>{
                reject(err);
            });
         });
        
    }
}